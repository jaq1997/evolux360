import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function UpdatePasswordForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: password });

    setLoading(false);
    if (error) {
      toast.error(`Erro ao atualizar a senha: ${error.message}`);
    } else {
      toast.success('Senha atualizada com sucesso!');
      navigate('/auth'); // Redireciona para o login após o sucesso
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Definir Nova Senha</h1>
        <p className="text-gray-500 mt-2">Você está logado. Digite sua nova senha abaixo.</p>
      </div>
      <form onSubmit={handlePasswordUpdate} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="new-password">Nova Senha</Label>
          <Input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-12"
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full bg-[#5932EA] hover:bg-[#4A28C7] h-12 text-base" disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar Senha'}
        </Button>
      </form>
    </div>
  );
}