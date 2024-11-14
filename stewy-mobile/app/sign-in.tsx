import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/contexts/auth.context";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function SignIn() {
    const { signIn } = useSession();
    const router = useRouter();
    
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText
          onPress={() => {
            signIn();
            // Navigate after signing in. You may want to tweak this to ensure sign-in is
            // successful before navigating.
            router.push("/(app)/(tabs)");
          }}>
          Sign In
        </ThemedText>
      </ThemedView>
    );
  }