import { useEffect, useState, useCallback } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedBadge } from "@/components/ThemedBadge";
import { BaseWidget } from "@/components/dashboard/BaseWidget";
import { StatCard } from "@/components/dashboard/StatCard";
import { GameCard } from "@/components/dashboard/GameCard";
import { AssignmentCard } from "@/components/dashboard/AssignmentCard";
import { ReviewCard } from "@/components/dashboard/ReviewCard";
import { useTranslation } from "react-i18next";
import { useSession } from "@/contexts/auth.context";
import { usePlatform } from "@/hooks/usePlatform";
import { useDesignTokens } from "@/hooks/useDesignTokens";
import { adminService } from "@/services/admin.service";
import { gameService } from "@/services/game.service";
import { volunteerService } from "@/services/volunteer.service";
import { participationService } from "@/services/participation.service";
import { api } from "@/services/api";
import { useRouter } from "expo-router";
import type {
  UserDto,
  VolunteerProfileResponse,
  VolunteerGameEntry,
  GameDto,
} from "@/types/api";

interface ProfileEntry {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  kbvbId: string;
  club: { id: string; clubName: string } | null;
  profileStatus: string;
}

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { isAdmin, user, profile: contextProfile } = useSession();
  const { isMobile } = usePlatform();
  const { colors } = useDesignTokens();
  const router = useRouter();

  const [profile, setProfile] = useState<VolunteerProfileResponse | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [pendingUsers, setPendingUsers] = useState<UserDto[]>([]);
  const [pendingProfiles, setPendingProfiles] = useState<ProfileEntry[]>([]);
  const [activeVolunteers, setActiveVolunteers] = useState<ProfileEntry[]>([]);

  const [upcomingGames, setUpcomingGames] = useState<GameDto[]>([]);
  const [clubGames, setClubGames] = useState<GameDto[]>([]);
  const [myGames, setMyGames] = useState<GameDto[]>([]);
  const [invitations, setInvitations] = useState<VolunteerGameEntry[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<
    VolunteerProfileResponse[]
  >([]);
  const [hsPendingRequests, setHsPendingRequests] = useState<
    VolunteerGameEntry[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      setProfileLoading(false);
      setLoading(true);
      Promise.all([
        adminService.getPendingUsers(),
        api.get<{ pending: ProfileEntry[]; approved: ProfileEntry[] }>(
          "/volunteers/profiles",
        ),
        gameService.getGames(),
      ])
        .then(([users, profiles, gamesData]) => {
          setPendingUsers(users);
          setPendingProfiles(profiles.pending);
          setActiveVolunteers(profiles.approved);
          setUpcomingGames(gamesData.items ?? []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (contextProfile) {
      setProfile(contextProfile);
      setProfileLoading(false);
      setLoading(true);
      const role = contextProfile.role;
      const isHs = role === "HOOFD_STEWARD";
      const isSteward = role === "STEWARD" || role === "DEVISIE_CHEF";

      const promises: Promise<unknown>[] = [];

      if (isHs) {
        promises.push(
          gameService.getMyClubGames().then((d) => setClubGames(d.items ?? [])),
          volunteerService.getPendingProfilesByClub().then(setPendingApprovals),
          participationService
            .getPendingRequestsForClub()
            .then(setHsPendingRequests),
        );
      }

      if (isSteward || isHs) {
        promises.push(
          gameService.getUpcomingGames().then(setMyGames),
          participationService.getMyInvitations().then(setInvitations),
        );
      }

      promises.push(
        gameService.getGames().then((d) => setUpcomingGames(d.items ?? [])),
      );

      Promise.all(promises)
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setProfileLoading(false);
      setLoading(false);
    }
  }, [isAdmin, contextProfile]);

  const handleActivateUser = useCallback(async (userId: string) => {
    try {
      await adminService.activateUser(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {}
  }, []);

  const handleApproveProfile = useCallback(async (volunteerId: string) => {
    try {
      await adminService.approveProfile(volunteerId);
      setPendingProfiles((prev) => prev.filter((p) => p.id !== volunteerId));
    } catch {}
  }, []);

  const handleRejectProfile = useCallback(async (volunteerId: string) => {
    try {
      await adminService.rejectProfile(volunteerId);
      setPendingProfiles((prev) => prev.filter((p) => p.id !== volunteerId));
    } catch {}
  }, []);

  const role = profile?.role;
  const isHoofdSteward = role === "HOOFD_STEWARD";
  const isStewardOrDc = role === "STEWARD" || role === "DEVISIE_CHEF";

  if (loading || profileLoading) {
    return (
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ThemedView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.accent} />
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (isMobile) {
    return (
      <MobileDashboard
        isAdmin={isAdmin}
        isHoofdSteward={isHoofdSteward}
        isStewardOrDc={isStewardOrDc}
        user={user}
        pendingUsers={pendingUsers}
        pendingProfiles={pendingProfiles}
        activeVolunteers={activeVolunteers}
        upcomingGames={upcomingGames}
        clubGames={clubGames}
        myGames={myGames}
        invitations={invitations}
        pendingApprovals={pendingApprovals}
        hsPendingRequests={hsPendingRequests}
        onActivateUser={handleActivateUser}
        onApproveProfile={handleApproveProfile}
        onRejectProfile={handleRejectProfile}
        colors={colors}
        t={t}
        router={router}
      />
    );
  }

  return (
    <DesktopDashboard
      isAdmin={isAdmin}
      isHoofdSteward={isHoofdSteward}
      isStewardOrDc={isStewardOrDc}
      user={user}
      pendingUsers={pendingUsers}
      pendingProfiles={pendingProfiles}
      activeVolunteers={activeVolunteers}
      upcomingGames={upcomingGames}
      clubGames={clubGames}
      myGames={myGames}
      invitations={invitations}
      pendingApprovals={pendingApprovals}
      hsPendingRequests={hsPendingRequests}
      onActivateUser={handleActivateUser}
      onApproveProfile={handleApproveProfile}
      onRejectProfile={handleRejectProfile}
      colors={colors}
      t={t}
      router={router}
    />
  );
}

interface DashboardProps {
  isAdmin: boolean;
  isHoofdSteward: boolean;
  isStewardOrDc: boolean;
  user: { firstName?: string; lastName?: string } | null;
  pendingUsers: UserDto[];
  pendingProfiles: ProfileEntry[];
  activeVolunteers: ProfileEntry[];
  upcomingGames: GameDto[];
  clubGames: GameDto[];
  myGames: GameDto[];
  invitations: VolunteerGameEntry[];
  pendingApprovals: VolunteerProfileResponse[];
  hsPendingRequests: VolunteerGameEntry[];
  onActivateUser: (id: string) => void;
  onApproveProfile: (id: string) => void;
  onRejectProfile: (id: string) => void;
  colors: Record<string, string>;
  t: (key: string) => string;
  router: ReturnType<typeof useRouter>;
}

function DesktopDashboard({
  isAdmin,
  isHoofdSteward,
  isStewardOrDc,
  user,
  pendingUsers,
  pendingProfiles,
  activeVolunteers,
  upcomingGames,
  clubGames,
  myGames,
  invitations,
  pendingApprovals,
  hsPendingRequests,
  onActivateUser,
  onApproveProfile,
  onRejectProfile,
  colors,
  t,
  router,
}: DashboardProps) {
  return (
    <ScrollView className="flex-1 p-8" showsVerticalScrollIndicator={false}>
      <ThemedView className="max-w-4xl mx-auto w-full gap-8">
        <WelcomeSection
          name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
          isAdmin={isAdmin}
          t={t}
          colors={colors}
        />

        {isAdmin && (
          <StatCardsSection
            pendingUsers={pendingUsers}
            pendingProfiles={pendingProfiles}
            onReviewUsers={() => router.push("/(app)/(tabs)/volonteers")}
            onVerifyChanges={() => router.push("/(app)/(tabs)/volonteers")}
            t={t}
            colors={colors}
          />
        )}

        {isAdmin && pendingUsers.length > 0 && (
          <Section
            title={t("admin.pendingActivations")}
            count={pendingUsers.length}
          >
            {pendingUsers.slice(0, 5).map((user) => (
              <ThemedCard key={user.id} className="p-4 mb-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-4">
                    <ThemedText type="bodySemiBold">
                      {user.firstName} {user.lastName}
                    </ThemedText>
                    <ThemedText type="bodySmall" variant="muted">
                      {user.email}
                    </ThemedText>
                  </View>
                  <ThemedButton
                    label={t("admin.activate")}
                    variant="primary"
                    size="sm"
                    onPress={() => onActivateUser(user.id)}
                  />
                </View>
              </ThemedCard>
            ))}
          </Section>
        )}

        {isHoofdSteward && (
          <Section
            title={t("dashboard.widget.pendingApprovals")}
            count={pendingApprovals.length}
          >
            {pendingApprovals.slice(0, 5).map((p) => (
              <ReviewCard
                key={p.id}
                initials={`${p.firstName[0]}${p.lastName[0]}`}
                name={`${p.firstName} ${p.lastName}`}
                timeAgo=""
                subtitle={p.role}
                actionLabel={t("dashboard.reviewCard.review")}
                onAction={() => router.push(`/(app)/(tabs)/volonteers`)}
              />
            ))}
          </Section>
        )}

        {isAdmin && pendingProfiles.length > 0 && (
          <Section
            title={t("admin.pendingProfiles")}
            count={pendingProfiles.length}
          >
            {pendingProfiles.slice(0, 5).map((p) => (
              <ThemedCard key={p.id} className="p-4 mb-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-4">
                    <ThemedText type="bodySemiBold">
                      {p.firstName} {p.lastName}
                    </ThemedText>
                    <ThemedText type="bodySmall" variant="muted">
                      {p.role}
                    </ThemedText>
                  </View>
                  <View className="flex-row gap-2">
                    <ThemedButton
                      label={t("admin.approve")}
                      variant="primary"
                      size="sm"
                      onPress={() => onApproveProfile(p.id)}
                    />
                    <ThemedButton
                      label={t("admin.reject")}
                      variant="outline"
                      size="sm"
                      onPress={() => onRejectProfile(p.id)}
                    />
                  </View>
                </View>
              </ThemedCard>
            ))}
          </Section>
        )}

        {(isHoofdSteward || isStewardOrDc) && (
          <GamesSection
            upcomingGames={isHoofdSteward ? clubGames : upcomingGames}
            title={t("dashboard.widget.upcomingGames")}
            t={t}
            router={router}
          />
        )}

        {(isHoofdSteward || isStewardOrDc) && myGames.length > 0 && (
          <Section title={t("dashboard.widget.myGames")} count={myGames.length}>
            {myGames.slice(0, 5).map((g) => (
              <AssignmentCard
                key={g.id}
                role={g.game}
                game={g.homeTeam?.clubName ?? ""}
                date={new Date(g.appointment).toLocaleDateString()}
                time={new Date(g.appointment).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                actionLabel={t("dashboard.assignmentCard.viewDetails")}
                onAction={() => router.push(`/game/${g.id}`)}
              />
            ))}
          </Section>
        )}

        {(isHoofdSteward || isStewardOrDc) && invitations.length > 0 && (
          <Section
            title={t("dashboard.widget.invitations")}
            count={invitations.length}
          >
            {invitations.slice(0, 5).map((inv) => (
              <ThemedCard key={inv.volunteerId} className="p-4 mb-2">
                <View className="flex-row justify-between items-center">
                  <ThemedText type="bodySemiBold">
                    {inv.volunteerName}
                  </ThemedText>
                  <ThemedBadge variant="info" label={inv.status} dot />
                </View>
              </ThemedCard>
            ))}
          </Section>
        )}

        {isAdmin && (
          <GamesSection
            upcomingGames={upcomingGames}
            title={t("dashboard.widget.upcomingGames")}
            t={t}
            router={router}
          />
        )}
      </ThemedView>
    </ScrollView>
  );
}

function MobileDashboard({
  isAdmin,
  isHoofdSteward,
  isStewardOrDc,
  user,
  pendingUsers,
  pendingProfiles,
  activeVolunteers,
  upcomingGames,
  clubGames,
  myGames,
  invitations,
  pendingApprovals,
  hsPendingRequests,
  onActivateUser,
  onApproveProfile,
  onRejectProfile,
  colors,
  t,
  router,
}: DashboardProps) {
  return (
    <ScrollView
      className="flex-1 px-6 pt-4"
      showsVerticalScrollIndicator={false}
    >
      <ThemedView className="gap-6 pb-8">
        <WelcomeSection
          name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
          isAdmin={isAdmin}
          t={t}
          colors={colors}
        />

        {isAdmin && (
          <>
            <BaseWidget
              title={t("admin.pendingActivations")}
              count={pendingUsers.length}
              emptyState={t("admin.noPendingActivations")}
            >
              {pendingUsers.slice(0, 5).map((u) => (
                <ThemedCard key={u.id} className="p-4 mb-2">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1 mr-4">
                      <ThemedText type="bodySemiBold">
                        {u.firstName} {u.lastName}
                      </ThemedText>
                      <ThemedText type="bodySmall" variant="muted">
                        {u.email}
                      </ThemedText>
                    </View>
                    <ThemedButton
                      label={t("admin.activate")}
                      variant="primary"
                      size="sm"
                      onPress={() => onActivateUser(u.id)}
                    />
                  </View>
                </ThemedCard>
              ))}
            </BaseWidget>

            <BaseWidget
              title={t("admin.pendingProfiles")}
              count={pendingProfiles.length}
              emptyState={t("admin.noPendingProfiles")}
            >
              {pendingProfiles.slice(0, 5).map((p) => (
                <ThemedCard key={p.id} className="p-4 mb-2">
                  <ThemedText type="bodySemiBold">
                    {p.firstName} {p.lastName}
                  </ThemedText>
                  <ThemedText type="bodySmall" variant="muted">
                    {p.role}
                  </ThemedText>
                  <View className="flex-row gap-2 mt-3">
                    <ThemedButton
                      label={t("admin.approve")}
                      variant="primary"
                      size="sm"
                      onPress={() => onApproveProfile(p.id)}
                    />
                    <ThemedButton
                      label={t("admin.reject")}
                      variant="outline"
                      size="sm"
                      onPress={() => onRejectProfile(p.id)}
                    />
                  </View>
                </ThemedCard>
              ))}
            </BaseWidget>

            <BaseWidget
              title={t("admin.activeVolunteers")}
              count={activeVolunteers.length}
              emptyState={t("admin.noActiveVolunteers")}
            >
              {activeVolunteers.slice(0, 10).map((p) => (
                <ThemedCard key={p.id} className="p-4 mb-2">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <ThemedText type="bodySemiBold">
                        {p.firstName} {p.lastName}
                      </ThemedText>
                      <ThemedText type="bodySmall" variant="muted">
                        {p.role}
                      </ThemedText>
                      {p.club && (
                        <ThemedText type="bodySmall" variant="muted">
                          {p.club.clubName}
                        </ThemedText>
                      )}
                    </View>
                    <ThemedBadge
                      variant="success"
                      label={t("admin.approved")}
                      dot
                    />
                  </View>
                </ThemedCard>
              ))}
            </BaseWidget>
          </>
        )}

        {isHoofdSteward && (
          <>
            <GamesSection
              upcomingGames={clubGames}
              title={t("dashboard.widget.upcomingGames")}
              t={t}
              router={router}
            />

            <BaseWidget
              title={t("dashboard.widget.myGames")}
              count={myGames.length}
              emptyState={t("dashboard.empty.myGames")}
            >
              {myGames.slice(0, 5).map((g) => (
                <AssignmentCard
                  key={g.id}
                  role={g.game}
                  game={g.homeTeam?.clubName ?? ""}
                  date={new Date(g.appointment).toLocaleDateString()}
                  time={new Date(g.appointment).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  actionLabel={t("dashboard.assignmentCard.viewDetails")}
                  onAction={() => router.push(`/game/${g.id}`)}
                />
              ))}
            </BaseWidget>

            <BaseWidget
              title={t("dashboard.widget.pendingApprovals")}
              count={pendingApprovals.length}
              emptyState={t("dashboard.empty.pendingProfiles")}
            >
              {pendingApprovals.slice(0, 5).map((p) => (
                <ReviewCard
                  key={p.id}
                  initials={`${p.firstName[0]}${p.lastName[0]}`}
                  name={`${p.firstName} ${p.lastName}`}
                  timeAgo=""
                  subtitle={p.role}
                  actionLabel={t("dashboard.reviewCard.review")}
                  onAction={() => router.push("/(app)/(tabs)/games")}
                />
              ))}
            </BaseWidget>
          </>
        )}

        {isStewardOrDc && (
          <>
            <GamesSection
              upcomingGames={upcomingGames}
              title={t("dashboard.widget.upcomingGames")}
              t={t}
              router={router}
            />

            <BaseWidget
              title={t("dashboard.widget.myGames")}
              count={myGames.length}
              emptyState={t("dashboard.empty.myGames")}
            >
              {myGames.slice(0, 5).map((g) => (
                <AssignmentCard
                  key={g.id}
                  role={g.game}
                  game={g.homeTeam?.clubName ?? ""}
                  date={new Date(g.appointment).toLocaleDateString()}
                  time={new Date(g.appointment).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  actionLabel={t("dashboard.assignmentCard.viewDetails")}
                  onAction={() => router.push(`/game/${g.id}`)}
                />
              ))}
            </BaseWidget>

            <BaseWidget
              title={t("dashboard.widget.invitations")}
              count={invitations.length}
              emptyState={t("dashboard.empty.invitations")}
            >
              {invitations.slice(0, 5).map((inv) => (
                <ThemedCard key={inv.volunteerId} className="p-4 mb-2">
                  <View className="flex-row justify-between items-center">
                    <ThemedText type="bodySemiBold">
                      {inv.volunteerName}
                    </ThemedText>
                    <ThemedBadge variant="info" label={inv.status} dot />
                  </View>
                </ThemedCard>
              ))}
            </BaseWidget>
          </>
        )}

        {!isAdmin && !isHoofdSteward && !isStewardOrDc && (
          <ThemedCard className="p-6">
            <ThemedText type="body" variant="muted" className="text-center">
              {t("dashboard.title")}
            </ThemedText>
          </ThemedCard>
        )}
      </ThemedView>
    </ScrollView>
  );
}

function WelcomeSection({
  name,
  isAdmin,
  t,
  colors,
}: {
  name: string;
  isAdmin: boolean;
  t: (key: string) => string;
  colors: Record<string, string>;
}) {
  return (
    <ThemedCard>
      <ThemedText type="h1" className="mb-2">
        {t("dashboard.welcome")}, {name || t("welcome")}
      </ThemedText>
      <View className="flex-row items-center gap-2">
        <View
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: colors.accent }}
        />
        <ThemedText type="bodySemiBold" style={{ color: colors.accent }}>
          {isAdmin ? t("dashboard.headAdmin") : t("dashboard.clubAdmin")}
        </ThemedText>
      </View>
    </ThemedCard>
  );
}

function StatCardsSection({
  pendingUsers,
  pendingProfiles,
  onReviewUsers,
  onVerifyChanges,
  t,
  colors,
}: {
  pendingUsers: UserDto[];
  pendingProfiles: ProfileEntry[];
  onReviewUsers: () => void;
  onVerifyChanges: () => void;
  t: (key: string) => string;
  colors: Record<string, string>;
}) {
  return (
    <View className="flex-row gap-6">
      <StatCard
        icon="👤"
        count={pendingUsers.length}
        title={t("dashboard.stat.pendingUsers.title")}
        description={t("dashboard.stat.pendingUsers.description")}
        actionLabel={t("dashboard.stat.pendingUsers.action")}
        onAction={onReviewUsers}
      />
      <StatCard
        icon="📋"
        count={pendingProfiles.length}
        title={t("dashboard.stat.pendingProfiles.title")}
        description={t("dashboard.stat.pendingProfiles.description")}
        actionLabel={t("dashboard.stat.pendingProfiles.action")}
        onAction={onVerifyChanges}
      />
    </View>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <ThemedView>
      <View className="flex-row items-center gap-2 mb-4">
        <ThemedText type="h2">{title}</ThemedText>
        {count > 0 && (
          <View className="bg-accent-500 rounded-full px-2.5 py-0.5 min-w-[24px]">
            <ThemedText
              type="caption"
              style={{ color: "#FFFFFF", textAlign: "center" }}
            >
              {count}
            </ThemedText>
          </View>
        )}
      </View>
      {children}
    </ThemedView>
  );
}

function GamesSection({
  upcomingGames,
  title,
  t,
  router,
}: {
  upcomingGames: GameDto[];
  title: string;
  t: (key: string) => string;
  router: ReturnType<typeof useRouter>;
}) {
  if (upcomingGames.length === 0) return null;

  return (
    <Section title={title} count={upcomingGames.length}>
      {upcomingGames.slice(0, 5).map((g) => (
        <View key={g.id} className="mb-2">
          <GameCard
            homeTeam={g.homeTeam?.clubName ?? "Home"}
            awayTeam={g.awayTeam?.clubName ?? "Away"}
            date={new Date(g.appointment).toLocaleDateString()}
            time={new Date(g.appointment).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            venue={g.location ?? ""}
            status={
              g.status === "CLOSED"
                ? "confirmed"
                : g.status === "OPEN"
                  ? "pending"
                  : "staffNeeded"
            }
            onPress={() => router.push(`/game/${g.id}`)}
          />
        </View>
      ))}
    </Section>
  );
}
