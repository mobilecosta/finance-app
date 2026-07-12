import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/contexts/AuthContext";
import { BButton, BCard } from "@/components/bootstrap";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";
import { startOAuthLogin } from "@/constants/oauth";

export default function LoginScreen() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
  const { s, c } = useBootstrapStyles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && session) {
      router.replace("/(tabs)");
    }
  }, [session, authLoading, router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await startOAuthLogin();
    } catch (error) {
      console.error("[Login] Failed to start OAuth flow:", error);
      Alert.alert("Falha no login", "Não foi possível abrir a autenticação agora.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={[s.flex1, s.justifyContentCenter, s.alignItemsCenter, { backgroundColor: c.BODY_BG }]}>
        <ActivityIndicator size="large" color={c.PRIMARY} />
      </View>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <View style={[s.flex1, s.px4, s.justifyContentCenter]}>
        <View style={[s.alignItemsCenter, s.mb5]}>
          <Text style={{ fontSize: 48 }}>💰</Text>
          <Text style={[s.h3, { color: c.PRIMARY }]}>Finance App</Text>
          <Text style={[s.text, s.textMuted, s.mt2, { textAlign: "center" }]}>
            Entre com sua conta para acessar a home e os lançamentos.
          </Text>
        </View>

        <BCard style={{ borderRadius: 16 }}>
          <Text style={[s.h5, { color: c.BODY_COLOR }, s.mb3]}>Acessar conta</Text>
          <Text style={[s.text, s.textMuted, s.mb4]}>
            Usamos o fluxo oficial de autenticação do app para liberar sua sessão.
          </Text>

          <BButton
            variant="primary"
            block
            loading={loading}
            onPress={handleLogin}
            title="Entrar"
          />
        </BCard>
      </View>
    </ScreenContainer>
  );
}
