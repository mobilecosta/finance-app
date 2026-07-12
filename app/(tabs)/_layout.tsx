import { Tabs, Redirect } from "expo-router";
import { useAuth } from "@/lib/contexts/AuthContext";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

const tabs = [
  { name: "index", title: "Início", icon: "house.fill" },
  { name: "movements", title: "Movimentos", icon: "list.bullet" },
  { name: "natures", title: "Categorias", icon: "tag.fill" },
  { name: "accounts", title: "Contas", icon: "creditcard.fill" },
  { name: "reports", title: "Relatórios", icon: "doc.text.fill" },
] as const;

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  const { s, c } = useBootstrapStyles();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 8 : Math.max(insets.bottom, 8);

  return (
    <View
      style={{
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: c.BORDER_COLOR,
        backgroundColor: c.BODY_BG,
        paddingTop: 6,
        paddingBottom: bottomPadding,
        height: 56 + bottomPadding,
      }}
    >
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const color = isFocused ? c.PRIMARY : c.SECONDARY;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <IconSymbol size={24} name={tab.icon} color={color} />
            <Text style={{ fontSize: 11, color, marginTop: 2 }}>{tab.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { session, isLoading } = useAuth();

  if (!isLoading && !session) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar state={props.state} navigation={props.navigation} />}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
          }}
        />
      ))}
    </Tabs>
  );
}
