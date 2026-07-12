import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/contexts/AuthContext";
import { BButton, BCard, BFormGroup, BAlert } from "@/components/bootstrap";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
  const { s, c } = useBootstrapStyles();

  useEffect(() => {
    if (!authLoading && session) {
      router.replace("/(tabs)");
    }
  }, [session, authLoading]);

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert("Campos Obrigatórios", "Por favor, informe seu e-mail e senha.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Senha Curta", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: Platform.OS === "web" ? window.location.origin : undefined,
          },
        });

        if (error) throw error;

        if (data.user && data.session) {
          router.replace("/(tabs)");
        } else {
          Alert.alert(
            "Sucesso!",
            "Cadastro realizado. Verifique seu e-mail para confirmar a conta antes de entrar."
          );
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      let message = "Ocorreu um erro inesperado.";

      if (error.message.includes("Invalid login credentials")) {
        message = "E-mail ou senha incorretos.";
      } else if (error.message.includes("User already registered")) {
        message = "Este e-mail já está cadastrado.";
      } else {
        message = error.message;
      }

      Alert.alert("Falha na Autenticação", message);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <View style={[s.flex1, s.justifyContentCenter, s.alignItemsCenter, { backgroundColor: c.BODY_BG }]}>
        <ActivityIndicator size="large" color={c.PRIMARY} />
      </View>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[s.flex1]}>
        <ScrollView
          contentContainerStyle={[s.px4, s.justifyContentCenter, { flexGrow: 1 }]}
        >
          <View style={[s.alignItemsCenter, s.mb5]}>
            <Text style={{ fontSize: 48 }}>💰</Text>
            <Text style={[s.h3, { color: c.PRIMARY }]}>Finance App</Text>
            <Text style={[s.text, s.textMuted, s.mt2]}>Sua gestão financeira simplificada</Text>
          </View>

          <BCard style={{ borderRadius: 16 }}>
            <Text style={[s.h5, { color: c.BODY_COLOR }, s.mb3]}>
              {isSignUp ? "Criar nova conta" : "Entrar no aplicativo"}
            </Text>

            <BFormGroup label="E-mail">
              <TextInput
                style={[s.formControl]}
                placeholder="seu@email.com"
                placeholderTextColor={c.SECONDARY}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </BFormGroup>

            <BFormGroup label="Senha">
              <TextInput
                style={[s.formControl]}
                placeholder="••••••"
                placeholderTextColor={c.SECONDARY}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </BFormGroup>

            <BButton
              variant="primary"
              block
              loading={loading}
              onPress={handleAuth}
              style={[s.mt2]}
              title={isSignUp ? "Finalizar Cadastro" : "Acessar Conta"}
            />

            <BButton
              variant="link"
              onPress={() => setIsSignUp(!isSignUp)}
              title={
                isSignUp
                  ? "Já possui uma conta? Entre aqui"
                  : "Não tem uma conta? Cadastre-se agora"
              }
              style={[s.mt3]}
            />
          </BCard>

          <Text style={[s.textCenter, s.textMuted, s.small, s.mt4]}>Protegido por Supabase Auth</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
