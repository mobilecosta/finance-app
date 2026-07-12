import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

export default function IndexRoute() {
  const { session, isLoading } = useAuth();
  const { s, c } = useBootstrapStyles();

  if (isLoading) {
    return (
      <View style={[s.flex1, s.justifyContentCenter, s.alignItemsCenter, { backgroundColor: c.BODY_BG }]}>
        <ActivityIndicator size="large" color={c.PRIMARY} />
      </View>
    );
  }

  return <Redirect href={session ? "/(tabs)" : "/auth/login"} />;
}
