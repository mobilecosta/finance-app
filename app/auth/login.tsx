import { BButton, BCard } from "@/components/bootstrap";
import { ScreenContainer } from "@/components/screen-container";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";
import { supabase } from "@/lib/supabase/client";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!authLoading && session) {
      router.replace("/(tabs)");
    }
  }, [session, authLoading, router]);

  const title = useMemo(() => (mode === "login" ? "Entrar" : "Criar conta"), [mode]);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos obrigatórios", "Informe e-mail e senha.");
      return;
    }

    if (mode === "register" && !name.trim()) {
      Alert.alert("Campos obrigatórios", "Informe seu nome para criar a conta.");
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) {
          throw error;
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          Alert.alert(
            "Conta criada",
            "Sua conta foi criada, mas o Supabase exige confirmação de e-mail antes do acesso.",
          );
          return;
        }
      }

      router.replace("/(tabs)");
    } catch (error) {
      console.error("[Login] Failed to authenticate with Supabase:", error);
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
            Entre com e-mail e senha para acessar suas finanças.
          </Text>
        </View>

        <BCard style={{ borderRadius: 16 }}>
          <Text style={[s.h5, { color: c.BODY_COLOR }, s.mb3]}>{title}</Text>
          <Text style={[s.text, s.textMuted, s.mb4]}>
            Seu login agora usa Supabase Auth, sem backend local.
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
                    borderColor: c.BORDER_COLOR,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    color: c.BODY_COLOR,
                    backgroundColor: c.BODY_BG,
                    marginBottom: 16,
                  },
                ]}
                placeholder="Seu nome"
                placeholderTextColor={c.SECONDARY}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </>
          )}

          <Text style={[s.text, s.textMuted, s.mb2]}>E-mail</Text>
          <TextInput
            style={[
              {
                borderWidth: 1,
                borderColor: c.BORDER_COLOR,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                color: c.BODY_COLOR,
                backgroundColor: c.BODY_BG,
                marginBottom: 16,
              },
            ]}
            placeholder="voce@exemplo.com"
            placeholderTextColor={c.SECONDARY}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
          />

          <Text style={[s.text, s.textMuted, s.mb2]}>Senha</Text>
          <TextInput
            style={[
              {
                borderWidth: 1,
                borderColor: c.BORDER_COLOR,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                color: c.BODY_COLOR,
                backgroundColor: c.BODY_BG,
                marginBottom: 20,
              },
            ]}
            placeholder="Sua senha"
            placeholderTextColor={c.SECONDARY}
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
