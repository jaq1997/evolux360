import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Auth = () => {
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

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      {/* Coluna da Esquerda: Logo e Formulário */}
      <div className="bg-white flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <div 
            className="flex items-center space-x-2 mb-10 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-lg flex items-center justify-center">
              {/* LOGO CORRIGIDO AQUI */}
              <img src="/logo.svg" alt="Logo Evolux360" className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Evolux360</span>
          </div>
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">LOGIN</h1>
            <p className="text-gray-500 mt-2">Insira seu e-mail e sua senha</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-gray-600">Digite seu e-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Digite sua senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <Button type="submit" className="w-full bg-[#5932EA] hover:bg-[#4A28C7] h-12 text-base" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
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