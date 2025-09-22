// src/components/Auth/ForgotPasswordForm.tsx

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Este link aponta para a página da sua aplicação 
      // onde o usuário irá definir a nova senha.
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);
    if (error) {
      toast.error(`Erro: ${error.message}`);
    } else {
      toast.success('Link de recuperação enviado!', {
        description: 'Se houver uma conta com este e-mail, o link foi enviado.',
      });
    }
  };

  return (
    <div>
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Recuperar Senha</h1>
        <p className="text-gray-500 mt-2">Digite seu e-mail para receber o link.</p>
      </div>
      <form onSubmit={handlePasswordReset}>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email-reset">Digite seu e-mail</Label>
            <Input
              id="email-reset"
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>
          <Button type="submit" className="w-full bg-[#5932EA] hover:bg-[#4A28C7] h-12 text-base" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </Button>
        </div>
      </form>
    </div>
  );
}