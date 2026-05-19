import { useSession } from "@/contexts/auth.context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemedText }   from "@/components/ThemedText";
import { ThemedInput }  from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { IconSymbol }   from "@/components/ui/IconSymbol";

export default function SignIn() {
  const { signIn } = useSession();
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (email !== "admin@stewy.com" || password !== "password") {
      setError("Invalid credentials. Try admin@stewy.com / password");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate async sign-in
    await new Promise((r) => setTimeout(r, 600));
    signIn();
    router.replace("/(app)/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0D1117]"
    >
      <StatusBar style="light" />

      {/* Decorative blobs */}
      <View className="absolute top-0 right-0 w-72 h-72 bg-accent-500 rounded-full opacity-10 -mr-20 -mt-20" />
      <View className="absolute bottom-0 left-0 w-80 h-80 bg-accent-700 rounded-full opacity-10 -ml-28 -mb-28" />

      <View className="flex-1 justify-center px-8 z-10">
        {/* Wordmark */}
        <View className="mb-12">
          <View className="flex-row items-center gap-3 mb-3">
            {/* Soccer ball icon placeholder */}
            <View className="w-10 h-10 bg-accent-500 rounded-full items-center justify-center">
              <IconSymbol name="soccerball" size={22} color="#fff" />
            </View>
            <ThemedText type="display" className="text-white">
              Stewy
            </ThemedText>
          </View>
          <ThemedText type="body" className="text-[#6B8060]">
            Welcome back. Let's get planning.
          </ThemedText>
        </View>

        {/* Form */}
        <View className="gap-4">
          <ThemedInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(v) => { setEmail(v); setError(""); }}
            keyboardType="email-address"
            autoCapitalize="none"
            leadingIcon={<IconSymbol name="envelope" size={18} color="#6B8060" />}
          />

          <ThemedInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(v) => { setPassword(v); setError(""); }}
            secureTextEntry
            leadingIcon={<IconSymbol name="lock" size={18} color="#6B8060" />}
            error={error || undefined}
          />

          <View className="pt-2">
            <ThemedButton
              label="Sign In"
              variant="primary"
              size="lg"
              loading={loading}
              onPress={handleSignIn}
              className="w-full"
            />
          </View>

          <View className="flex-row justify-center mt-4">
            <ThemedText type="body" className="text-[#6B8060]">
              Don't have an account?{" "}
            </ThemedText>
            <TouchableOpacity>
              <ThemedText type="bodySemiBold" accent>
                Sign up
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}