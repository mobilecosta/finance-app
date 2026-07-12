import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/screen-container';
import { useAuth } from '../../lib/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!authLoading && session) {
      router.replace('/(tabs)');
    }
  }, [session, authLoading]);

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert('Campos Obrigatórios', 'Por favor, informe seu e-mail e senha.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Senha Curta', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: Platform.OS === 'web' ? window.location.origin : undefined,
          }
        });
        
        if (error) throw error;
        
        if (data.user && data.session) {
            // Login automático após cadastro se configurado no Supabase
            router.replace('/(tabs)');
        } else {
            Alert.alert('Sucesso!', 'Cadastro realizado. Verifique seu e-mail para confirmar a conta antes de entrar.');
            setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // O useEffect acima cuidará do redirecionamento
      }
    } catch (error: any) {
      let message = 'Ocorreu um erro inesperado.';
      
      if (error.message.includes('Invalid login credentials')) {
        message = 'E-mail ou senha incorretos.';
      } else if (error.message.includes('User already registered')) {
        message = 'Este e-mail já está cadastrado.';
      } else {
        message = error.message;
      }
      
      Alert.alert('Falha na Autenticação', message);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 justify-center">
          <View className="items-center mb-10">
            <Text className="text-5xl mb-2">💰</Text>
            <Text className="text-3xl font-bold text-primary">Finance App</Text>
            <Text className="text-muted text-base mt-2">Sua gestão financeira simplificada</Text>
          </View>

          <View className="bg-surface p-6 rounded-3xl border border-border shadow-sm">
            <Text className="text-xl font-bold text-foreground mb-6">
              {isSignUp ? 'Criar nova conta' : 'Entrar no aplicativo'}
            </Text>

            <View className="gap-4">
              <View>
                <Text className="text-sm text-muted mb-2 ml-1">E-mail</Text>
                <TextInput
                  className="bg-background border border-border p-4 rounded-xl text-foreground"
                  placeholder="seu@email.com"
                  placeholderTextColor="#687076"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text className="text-sm text-muted mb-2 ml-1">Senha</Text>
                <TextInput
                  className="bg-background border border-border p-4 rounded-xl text-foreground"
                  placeholder="••••••"
                  placeholderTextColor="#687076"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity 
                className={`bg-primary p-4 rounded-xl items-center mt-2 ${loading ? 'opacity-70' : ''}`}
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text className="text-background font-bold text-lg">
                    {isSignUp ? 'Finalizar Cadastro' : 'Acessar Conta'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                className="mt-4 items-center"
                onPress={() => setIsSignUp(!isSignUp)}
              >
                <Text className="text-primary font-medium">
                  {isSignUp ? 'Já possui uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se agora'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text className="text-center text-muted text-xs mt-8">
            Protegido por Supabase Auth
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
