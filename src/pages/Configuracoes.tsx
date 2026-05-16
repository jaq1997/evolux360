import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Link as LinkIcon, Key, Check, Plus, Trash2, Plug, Edit, UserPlus, AlertTriangle, Loader2, Mail, Lock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Integration {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  status: 'Conectado' | 'Pendente';
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Ativo' | 'Inativo';
}

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState("conta");
  
  // Modais de Integração
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  // Modais de Usuário
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // User State
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Integrações State
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [newIntegrationName, setNewIntegrationName] = useState("");
  
  // Campos de Configuração
  const [configUrl, setConfigUrl] = useState("");
  const [configKey, setConfigKey] = useState("");

  // Usuários State (Visual)
  const [users, setUsers] = useState<UserData[]>([
    { id: '1', name: 'Rafael Amaral', email: 'rafael@evolux360.com', role: 'Administrador', status: 'Ativo' },
    { id: '2', name: 'João Silva', email: 'joao@evolux360.com', role: 'Vendedor', status: 'Ativo' }
  ]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Vendedor");

  useEffect(() => {
    const loadUserData = async () => {
      const demo = localStorage.getItem('demo_mode') === 'true';
      setIsDemoMode(demo);
      if (demo) {
        setUserName("Admin Demo");
        setUserEmail("demo@evolux360.com");
        setIsLoading(false);
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || "");
        setNewEmail(session.user.email || "");
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "");
      }
      setIsLoading(false);
    };
    loadUserData();
  }, []);

  // ── Salvar Nome (real Supabase) ──────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (isDemoMode) {
      toast.success("Perfil atualizado! (modo demo)");
      return;
    }
    if (!userName.trim()) {
      toast.error("O nome não pode ficar vazio.");
      return;
    }
    setIsSavingProfile(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: userName.trim() }
    });
    setIsSavingProfile(false);
    if (error) {
      toast.error(`Erro ao salvar: ${error.message}`);
    } else {
      toast.success("Nome atualizado com sucesso!");
    }
  };

  // ── Alterar Email (real Supabase) ────────────────────────────────────────
  const handleSaveEmail = async () => {
    if (isDemoMode) {
      toast.info("Alteração de email indisponível no modo demo.");
      return;
    }
    if (!newEmail.trim() || !newEmail.includes('@')) {
      toast.error("Digite um email válido.");
      return;
    }
    if (newEmail === userEmail) {
      toast.info("O email digitado é o mesmo que o atual.");
      return;
    }
    setIsSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setIsSavingEmail(false);
    if (error) {
      toast.error(`Erro ao alterar email: ${error.message}`);
    } else {
      toast.success("Link de confirmação enviado para o novo email!", {
        description: "Verifique sua caixa de entrada (e spam) para confirmar a alteração."
      });
    }
  };

  // ── Alterar Senha (real Supabase) ────────────────────────────────────────
  const handleSavePassword = async () => {
    if (isDemoMode) {
      toast.info("Alteração de senha indisponível no modo demo.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setIsSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsSavingPassword(false);
    if (error) {
      toast.error(`Erro ao alterar senha: ${error.message}`);
    } else {
      toast.success("Senha alterada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // Funções de Integração
  const handleAddIntegration = () => {
    if (!newIntegrationName) {
      toast.error("Preencha o nome do aplicativo!");
      return;
    }
    const newIntegration: Integration = {
      id: Math.random().toString(36).substr(2, 9),
      name: newIntegrationName,
      url: "",
      apiKey: "",
      status: 'Pendente'
    };
    setIntegrations([newIntegration, ...integrations]);
    setIsAddModalOpen(false);
    setNewIntegrationName("");
    toast.success(`${newIntegrationName} adicionado. Finalize a configuração!`);
  };

  const handleOpenConfig = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigUrl(integration.url);
    setConfigKey(integration.apiKey);
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      setIntegrations(integrations.map(i => {
        if (i.id === selectedIntegration.id) {
          return { ...i, url: configUrl, apiKey: configKey, status: 'Conectado' };
        }
        return i;
      }));
      setIsConfigModalOpen(false);
      toast.success("Integração configurada e conectada!");
    }
  };

  const handleDeleteClick = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedIntegration) {
      setIntegrations(integrations.filter(i => i.id !== selectedIntegration.id));
    }
    setIsDeleteModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  // Funções de Usuário
  const handleSaveUser = () => {
    if (!newUserName || !newUserEmail) {
      toast.error("Preencha todos os campos do usuário.");
      return;
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, name: newUserName, email: newUserEmail, role: newUserRole } : u));
      toast.success("Usuário atualizado com sucesso!");
    } else {
      setUsers([...users, { id: Math.random().toString(), name: newUserName, email: newUserEmail, role: newUserRole, status: 'Ativo' }]);
      toast.success("Usuário convidado com sucesso!");
    }
    
    setIsUserModalOpen(false);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
    setNewUserRole(user.role);
    setIsUserModalOpen(true);
  };

  const handleRemoveUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success("Usuário removido.");
  };

  const openNewUserModal = () => {
    setEditingUser(null);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Vendedor");
    setIsUserModalOpen(true);
  };

  // Helper para gerar cores baseadas no nome
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 
      'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600',
      'bg-pink-100 text-pink-600', 'bg-teal-100 text-teal-600'
    ];
    return colors[name.length % colors.length];
  };

  return (
    <div className="max-w-4xl space-y-8 main-content-min-height">
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 space-x-8">
          <TabsTrigger value="conta" className="data-[state=active]:border-b-2 data-[state=active]:border-[#5932EA] data-[state=active]:text-[#5932EA] data-[state=active]:shadow-none rounded-none px-0 pb-4 pt-2 text-gray-500 hover:text-gray-900 bg-transparent">Conta</TabsTrigger>
          <TabsTrigger value="integracoes" className="data-[state=active]:border-b-2 data-[state=active]:border-[#5932EA] data-[state=active]:text-[#5932EA] data-[state=active]:shadow-none rounded-none px-0 pb-4 pt-2 text-gray-500 hover:text-gray-900 bg-transparent">Integrações</TabsTrigger>
          <TabsTrigger value="usuarios" className="data-[state=active]:border-b-2 data-[state=active]:border-[#5932EA] data-[state=active]:text-[#5932EA] data-[state=active]:shadow-none rounded-none px-0 pb-4 pt-2 text-gray-500 hover:text-gray-900 bg-transparent">Usuários</TabsTrigger>
        </TabsList>

        {/* ABA CONTA */}
        <TabsContent value="conta" className="pt-8 space-y-8">
          {/* Perfil */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5932EA]/10 flex items-center justify-center">
                <User className="w-5 h-5 text-[#5932EA]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#5932EA] mb-0.5">Perfil</h2>
                <p className="text-sm text-gray-500">Atualize seu nome de exibição.</p>
              </div>
            </div>
            
            {!isLoading && (
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nome</Label>
                  <div className="relative">
                    <Input id="profile-name" value={userName} onChange={(e) => setUserName(e.target.value)} className="pr-10" placeholder="Seu nome completo" />
                    {userName.trim() && <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                  </div>
                </div>
                
                <Button className="bg-[#5932EA] hover:bg-[#4A28C7]" onClick={handleSaveProfile} disabled={isSavingProfile}>
                  {isSavingProfile ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</> : 'Salvar Nome'}
                </Button>
              </div>
            )}
          </div>

          {/* Alterar Email */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#5932EA] mb-0.5">Alterar E-mail</h2>
                <p className="text-sm text-gray-500">Um link de confirmação será enviado para o novo endereço.</p>
              </div>
            </div>

            {!isLoading && (
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <Label>Email atual</Label>
                  <Input value={userEmail} disabled className="bg-gray-50 text-gray-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email">Novo e-mail</Label>
                  <Input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="novo@email.com" />
                </div>
                <Button className="bg-[#5932EA] hover:bg-[#4A28C7]" onClick={handleSaveEmail} disabled={isSavingEmail || newEmail === userEmail}>
                  {isSavingEmail ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</> : 'Alterar E-mail'}
                </Button>
              </div>
            )}
          </div>

          {/* Alterar Senha */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#5932EA] mb-0.5">Alterar Senha</h2>
                <p className="text-sm text-gray-500">Mínimo de 6 caracteres.</p>
              </div>
            </div>
            
            <div className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" minLength={6} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirme a nova senha</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 font-medium">As senhas não coincidem.</p>
                )}
                {confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Senhas conferem.</p>
                )}
              </div>
              <Button 
                className="bg-[#5932EA] hover:bg-[#4A28C7]" 
                onClick={handleSavePassword} 
                disabled={isSavingPassword || newPassword.length < 6 || newPassword !== confirmPassword}
              >
                {isSavingPassword ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Atualizando...</> : 'Alterar Senha'}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ABA INTEGRAÇÕES */}
        <TabsContent value="integracoes" className="pt-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#5932EA] mb-1">Conexões e Aplicativos</h2>
            <p className="text-sm text-gray-500">Conecte o Evolux360 com outras plataformas que você já utiliza na sua empresa.</p>
          </div>

          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-lg font-bold text-gray-700">Aplicativos</h3>
            <Button className="bg-[#5932EA] hover:bg-[#4A28C7] text-white" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Novo App
            </Button>
          </div>

          <div className="space-y-4">
            {integrations.length === 0 ? (
              <div className="bg-white border border-gray-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                  <Plug className="w-8 h-8 text-[#5932EA]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Nenhum aplicativo conectado</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Centralize sua operação conectando os sistemas que você já usa no dia a dia.</p>
                </div>
                <Button className="mt-4 bg-[#5932EA] hover:bg-[#4A28C7] text-white" onClick={() => setIsAddModalOpen(true)}>
                  Conectar App
                </Button>
              </div>
            ) : (
              integrations.map((integration) => (
                <div key={integration.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl ${getAvatarColor(integration.name)}`}>
                        {integration.name.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{integration.name}</h4>
                      {integration.status === 'Conectado' ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">Conectado</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">Pendente</Badge>
                      )}
                    </div>
                    {integration.status === 'Conectado' ? (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Check className="w-3 h-3 text-green-500" /> Ativo
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-orange-600">
                        <AlertTriangle className="w-3 h-3" /> Falta finalizar as configurações de API/Webhook.
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <Button variant="outline" className={`flex-1 md:flex-none ${integration.status === 'Pendente' ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' : 'bg-gray-50'}`} onClick={() => handleOpenConfig(integration)}>
                      Configurar
                    </Button>
                    <Button variant="outline" className="flex-1 md:flex-none text-red-600 hover:bg-red-50" onClick={() => handleDeleteClick(integration)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* ABA USUÁRIOS */}
        <TabsContent value="usuarios" className="pt-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#5932EA] mb-1">Gestão de Usuários</h2>
            <p className="text-sm text-gray-500">Controle quem tem acesso ao sistema e suas permissões.</p>
          </div>

          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-lg font-bold text-gray-700">Membros da Equipe</h3>
            <Button className="bg-[#5932EA] hover:bg-[#4A28C7] text-white" onClick={openNewUserModal}>
              <UserPlus className="w-4 h-4 mr-2" /> Novo Usuário
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Permissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 border-green-200">{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                        <Edit className="w-4 h-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      Nenhum usuário cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL: ADICIONAR INTEGRAÇÃO */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[400px] border-none outline-none">
          <DialogTitle>Adicionar App</DialogTitle>
          <DialogDescription>Qual o nome do sistema ou aplicativo que deseja conectar?</DialogDescription>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label>Nome do Aplicativo (ex: WhatsApp, Nuvemshop)</Label>
              <Input value={newIntegrationName} onChange={e => setNewIntegrationName(e.target.value)} placeholder="Digite o nome..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
            <Button className="bg-[#5932EA] hover:bg-[#4A28C7]" onClick={handleAddIntegration}>Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: CONFIGURAR INTEGRAÇÃO */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-none outline-none">
          <DialogTitle>Configurar {selectedIntegration?.name}</DialogTitle>
          <DialogDescription>Insira os dados técnicos fornecidos pelo {selectedIntegration?.name} para finalizar a conexão.</DialogDescription>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label>URL do Webhook ou API</Label>
              <Input value={configUrl} onChange={e => setConfigUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Chave de Acesso (API Key / Token)</Label>
              <Input type="password" value={configKey} onChange={e => setConfigKey(e.target.value)} placeholder="Cole o token aqui" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>Depois</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveConfig}>Finalizar Conexão</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: USUÁRIO (Criar/Editar) */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="sm:max-w-[450px] border-none outline-none">
          <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Ex: João da Silva" />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="joao@empresa.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Nível de Permissão</Label>
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador (Acesso Total)</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                  <SelectItem value="Vendedor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>Cancelar</Button>
            <Button className="bg-[#5932EA] hover:bg-[#4A28C7]" onClick={handleSaveUser}>Salvar Usuário</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Outros Modais (Remover) simplificados ou mantidos */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px] border-none outline-none">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">!</div>
            <h3 className="font-bold text-lg">Confirmar Desconexão?</h3>
            <p className="text-gray-500 text-sm">A conexão com "{selectedIntegration?.name}" será removida.</p>
            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>Remover</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Configuracoes;
