import { BButton, BCard } from "@/components/bootstrap";
import { ScreenContainer } from "@/components/screen-container";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";
import { loginWithCredentials, registerWithCredentials, type AuthUser } from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

type Mode = "login" | "register";

export default function LoginScreen() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
  const { s, c } = useBootstrapStyles();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!authLoading && session) {
      router.replace("/(tabs)");
    }
  }, [session, authLoading, router]);

  const title = useMemo(() => (mode === "login" ? "Entrar" : "Criar conta"), [mode]);

  const persistSession = async (sessionToken: string, user: AuthUser) => {
    await Auth.setSessionToken(sessionToken);
    await Auth.setUserInfo({
      id: user.id,
      openId: user.openId,
      name: user.name,
      email: user.email,
      loginMethod: user.loginMethod,
      lastSignedIn: new Date(user.lastSignedIn),
    });
  };

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Campos obrigatórios", "Informe usuário e senha.");
      return;
    }

    if (mode === "register" && !name.trim()) {
      Alert.alert("Campos obrigatórios", "Informe também o nome para criar a conta.");
      return;
    }

    setLoading(true);
    try {
      const normalizedUsername = username.trim().toLowerCase();
      const result =
        mode === "login"
          ? await loginWithCredentials({ username: normalizedUsername, password })
          : await registerWithCredentials({
              username: normalizedUsername,
              password,
              name: name.trim(),
            });

      await persistSession(result.sessionToken, result.user);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("[Login] Failed to complete credential auth:", error);
      Alert.alert(
        mode === "login" ? "Falha no login" : "Falha no cadastro",
        error instanceof Error ? error.message : "Não foi possível concluir a autenticação.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <View style={[s.flex1, s.px4, s.justifyContentCenter]}>
        <View style={[s.alignItemsCenter, s.mb5]}>
          <Text style={{ fontSize: 48 }}>💰</Text>
          <Text style={[s.h3, { color: c.PRIMARY }]}>Finance App</Text>
          <Text style={[s.text, s.textMuted, s.mt2, { textAlign: "center" }]}>
            Entre com seu usuário e senha para acessar suas finanças.
          </Text>
        </View>

        <BCard style={{ borderRadius: 16 }}>
          <Text style={[s.h5, { color: c.BODY_COLOR }, s.mb3]}>{title}</Text>
          <Text style={[s.text, s.textMuted, s.mb4]}>
            Use sua conta local para acessar o app em qualquer dispositivo.
          </Text>

          <View
              style={[
                s.mb4,
                {
                  flexDirection: "row",
                  gap: 8,
                  backgroundColor: c.financeSurface,
                  padding: 4,
                  borderRadius: 12,
                },
              ]}
          >
            <Pressable
              onPress={() => setMode("login")}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: mode === "login" ? c.PRIMARY : "transparent",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  color: mode === "login" ? "#ffffff" : c.BODY_COLOR,
                }}
              >
                Entrar
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode("register")}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: mode === "register" ? c.PRIMARY : "transparent",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  color: mode === "register" ? "#ffffff" : c.BODY_COLOR,
                }}
              >
                Criar conta
              </Text>
            </Pressable>
          </View>

          {mode === "register" && (
            <>
              <Text style={[s.text, s.textMuted, s.mb2]}>Nome</Text>
              <TextInput
                style={[
                  {
                    borderWidth: 1,
                    borderColor: c.BORDER,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    color: c.BODY_COLOR,
                    backgroundColor: c.BODY_BG,
                    marginBottom: 16,
                  },
                ]}
                placeholder="Seu nome"
                placeholderTextColor={c.MUTED}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </>
          )}

          <Text style={[s.text, s.textMuted, s.mb2]}>Usuário</Text>
          <TextInput
            style={[
              {
                borderWidth: 1,
                borderColor: c.BORDER,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                color: c.BODY_COLOR,
                backgroundColor: c.BODY_BG,
                marginBottom: 16,
              },
            ]}
            placeholder="ex: marcos"
            placeholderTextColor={c.MUTED}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
          />

          <Text style={[s.text, s.textMuted, s.mb2]}>Senha</Text>
          <TextInput
            style={[
              {
                borderWidth: 1,
                borderColor: c.BORDER,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                color: c.BODY_COLOR,
                backgroundColor: c.BODY_BG,
                marginBottom: 20,
              },
            ]}
            placeholder="Sua senha"
            placeholderTextColor={c.MUTED}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
          />

          <BButton variant="primary" block loading={loading} onPress={handleSubmit} title={title} />
        </BCard>
      </View>
    </ScreenContainer>
  );
}
