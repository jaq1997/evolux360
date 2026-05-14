import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ForgotPasswordForm } from "@/components/Auth/ForgotPasswordForm"; 

const Auth = () => {
  const [view, setView] = useState<'login' | 'register' | 'forgot_password'>('login');
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("E-mail ou senha inválidos.");
    } else {
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      toast.error(`Erro ao cadastrar: ${error.message}`);
    } else {
      toast.success("Cadastro realizado! Verifique seu e-mail ou tente logar.");
      setView('login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      <div className="bg-white flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <div 
            className="flex items-center space-x-2 mb-10 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-lg flex items-center justify-center">
              <img src="/logo.svg" alt="Logo Evolux360" className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Evolux360</span>
          </div>

          {view === 'login' && (
            <>
              <div className="text-left mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">LOGIN</h1>
                <p className="text-gray-500 mt-2">Insira seu e-mail e sua senha</p>
              </div>
              <form onSubmit={handleLogin}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Digite seu e-mail</Label>
                    <Input id="login-email" type="email" placeholder="exemplo@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12"/>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Digite sua senha</Label>
                      <button type="button" onClick={() => setView('forgot_password')} className="text-sm font-medium text-[#5932EA] hover:underline focus:outline-none">
                        Esqueceu a senha?
                      </button>
                    </div>
                    <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12"/>
                  </div>
                  <Button type="submit" className="w-full bg-[#5932EA] hover:bg-[#4A28C7] h-12 text-base" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Ou para testes rápidos</span></div>
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-dashed border-[#5932EA] text-[#5932EA] hover:bg-purple-50 h-12"
                    onClick={() => {
                      localStorage.setItem('demo_mode', 'true');
                      toast.success("Entrando em modo de demonstração!");
                      navigate("/dashboard");
                    }}
                  >
                    Entrar em Modo Demo (Sem Login)
                  </Button>

                  <p className="text-center text-sm text-gray-600 mt-4">
                    Não tem uma conta?{" "}
                    <button type="button" onClick={() => setView('register')} className="text-[#5932EA] font-semibold hover:underline">
                      Cadastre-se
                    </button>
                  </p>
                </div>
              </form>
            </>
          )}

          {view === 'register' && (
            <>
              <div className="text-left mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">CADASTRO</h1>
                <p className="text-gray-500 mt-2">Crie sua conta de teste agora</p>
              </div>
              <form onSubmit={handleSignUp}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">E-mail</Label>
                    <Input id="reg-email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Senha (mín. 6 caracteres)</Label>
                    <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-12"/>
                  </div>
                  <Button type="submit" className="w-full bg-[#5932EA] hover:bg-[#4A28C7] h-12 text-base" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    Já tem uma conta?{" "}
                    <button type="button" onClick={() => setView('login')} className="text-[#5932EA] font-semibold hover:underline">
                      Fazer Login
                    </button>
                  </p>
                </div>
              </form>
            </>
          )}

          {view === 'forgot_password' && (
            <>
              <ForgotPasswordForm />
              <div className="mt-4 text-center">
                <button onClick={() => setView('login')} className="text-sm font-medium text-[#5932EA] hover:underline focus:outline-none">
                  Voltar para o login
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Coluna da Direita: Imagem, Gradiente e Texto */}
      <div
        className="hidden md:flex relative flex-col justify-end items-center p-12 bg-cover bg-center text-white"
        style={{ backgroundImage: 'url(/imagem-login.svg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80"></div>
        <div className="relative text-center z-10 mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight shadow-lg">
            Simplifique a gestão.
            <br />
            Acelere seus resultados.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Auth;