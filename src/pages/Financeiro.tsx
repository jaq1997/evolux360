// src/pages/Financeiro.tsx
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowUp, ArrowDown, Plus, Search, Filter, Trash2, AlertTriangle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";

const getStatusBadge = (status: string) => {
    switch (status) {
        case "Completo": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{status}</Badge>;
        case "Pendente": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{status}</Badge>;
        case "Em Atraso": return <Badge variant="destructive">{status}</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
};

const Financeiro = () => {
    const { transactions, setTransactions, loading, createTransaction } = useData() as any;
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");

    const [newTrans, setNewTrans] = useState({ type: 'Entrada', origin: '', value: '', status: 'Completo', payment_method: 'Pix', notes: '' });

    const handleAddTransaction = async () => {
        if (!newTrans.origin || !newTrans.value) {
            toast.error("Preencha a origem e o valor.");
            return;
        }
        await createTransaction({
            type: newTrans.type as any,
            origin: newTrans.origin,
            value: Number(newTrans.value),
            status: newTrans.status as any,
            payment_method: newTrans.payment_method,
            date: new Date().toISOString()
        });
        setIsAddModalOpen(false);
        setNewTrans({ type: 'Entrada', origin: '', value: '', status: 'Completo', payment_method: 'Pix', notes: '' });
    };

    const handleDelete = (t: any) => {
        setSelectedTransaction(t);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteTransaction = (id: number) => {
        const isDemoMode = localStorage.getItem('demo_mode') === 'true';
        if (isDemoMode) {
            setTransactions(prev => prev.filter(t => t.id !== id));
            toast.success("Transação excluída!");
            setIsDeleteModalOpen(false);
        }
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const lowerSearch = searchTerm.toLowerCase();
            const matchesSearch = !searchTerm || 
                t.origin?.toLowerCase().includes(lowerSearch) || 
                t.payment_method?.toLowerCase().includes(lowerSearch);
            const matchesType = typeFilter === 'all' || t.type === typeFilter;
            const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
            const matchesPayment = paymentFilter === 'all' || t.payment_method === paymentFilter;
            return matchesSearch && matchesType && matchesStatus && matchesPayment;
        });
    }, [transactions, searchTerm, typeFilter, statusFilter, paymentFilter]);

    const cashflowData = useMemo(() => {
        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return months.map((month, i) => ({
            month,
            Entradas: transactions.filter(t => t.type === 'Entrada' && new Date(t.date).getMonth() === i).reduce((s, t) => s + Number(t.value), 0),
            Saídas: transactions.filter(t => t.type === 'Saída' && new Date(t.date).getMonth() === i).reduce((s, t) => s + Number(t.value), 0),
        }));
    }, [transactions]);

    const totals = useMemo(() => {
        const entradas = transactions.filter(t => t.type === 'Entrada').reduce((s, t) => s + Number(t.value), 0);
        const saidas = transactions.filter(t => t.type === 'Saída').reduce((s, t) => s + Number(t.value), 0);
        return { entradas, saidas, saldo: entradas - saidas };
    }, [transactions]);

    const isFilterActive = useMemo(() => {
        return typeFilter !== 'all' || statusFilter !== 'all' || paymentFilter !== 'all' || searchTerm !== '';
    }, [typeFilter, statusFilter, paymentFilter, searchTerm]);

    if (loading) return <div className="p-8">Carregando finanças...</div>;

    return (
        <div className="space-y-6 main-content-min-height">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Entradas</CardTitle>
                        <ArrowUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">R$ {totals.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Saídas</CardTitle>
                        <ArrowDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">R$ {totals.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-[#5932EA] bg-[#5932EA]/5 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-[#5932EA] uppercase">Saldo em Caixa</CardTitle>
                        <DollarSign className="h-4 w-4 text-[#5932EA]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#5932EA]">R$ {totals.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader><CardTitle className="text-gray-700">Fluxo de Caixa Mensal</CardTitle></CardHeader>
                <CardContent className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cashflowData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(v) => `R$${v/1000}k`} />
                            <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                            <Legend verticalAlign="top" align="right" />
                            <Bar dataKey="Entradas" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={30} />
                            <Bar dataKey="Saídas" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-gray-700 text-lg">Transações</CardTitle>
                            {isFilterActive && <Badge variant="secondary" className="bg-purple-50 text-[#5932EA] border-purple-100">Filtro Ativo</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input placeholder="Buscar transação..." className="pl-8 w-full md:w-[200px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="outline" className="border-[#5932EA] text-[#5932EA] hover:bg-[#5932EA]/5"><Filter className="w-4 h-4 mr-2" /> Filtros</Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label>Tipo</Label>
                                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="Entrada">Entradas</SelectItem><SelectItem value="Saída">Saídas</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Forma de Pagamento</Label>
                                        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="all">Todas</SelectItem><SelectItem value="Pix">Pix</SelectItem><SelectItem value="Boleto">Boleto</SelectItem><SelectItem value="Cartão">Cartão</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                    <Button variant="ghost" className="w-full text-xs text-red-500" onClick={() => { setTypeFilter('all'); setPaymentFilter('all'); setSearchTerm(''); }}>Limpar Filtros</Button>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button className="bg-[#5932EA] hover:bg-[#4A28C7] text-white" onClick={() => setIsAddModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Nova Transação
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead>Data</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Origem</TableHead>
                                <TableHead>Responsável</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell><span className={`text-xs font-bold ${t.type === 'Entrada' ? 'text-green-600' : 'text-red-500'}`}>{t.type}</span></TableCell>
                                    <TableCell className="font-medium">{t.origin}</TableCell>
                                    <TableCell className="text-xs text-gray-400">{(t as any).responsible || 'Admin Demo'}</TableCell>
                                    <TableCell className={`text-right font-bold ${t.type === 'Entrada' ? 'text-green-600' : 'text-red-500'}`}>R$ {t.value.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(t.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600" onClick={() => handleDelete(t)}><Trash2 className="w-4 h-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle className="text-[#5932EA]">Nova Transação</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <RadioGroup value={newTrans.type} onValueChange={v => setNewTrans({...newTrans, type: v})} className="grid grid-cols-2 gap-4">
                            <div className={`border p-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${newTrans.type === 'Entrada' ? 'border-green-500 bg-green-50' : ''}`} onClick={() => setNewTrans({...newTrans, type: 'Entrada'})}>
                                <ArrowUp className="w-4 h-4 text-green-600" /> <span className="font-bold text-green-600">Entrada</span>
                            </div>
                            <div className={`border p-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${newTrans.type === 'Saída' ? 'border-red-500 bg-red-50' : ''}`} onClick={() => setNewTrans({...newTrans, type: 'Saída'})}>
                                <ArrowDown className="w-4 h-4 text-red-600" /> <span className="font-bold text-red-600">Saída</span>
                            </div>
                        </RadioGroup>
                        <div className="space-y-1"><Label>Origem / Descrição</Label><Input value={newTrans.origin} onChange={e => setNewTrans({...newTrans, origin: e.target.value})} placeholder="Ex: Venda #101" /></div>
                        <div className="space-y-1"><Label>Valor (R$)</Label><Input type="number" value={newTrans.value} onChange={e => setNewTrans({...newTrans, value: e.target.value})} placeholder="0.00" /></div>
                    </div>
                    <DialogFooter><Button className="w-full bg-[#5932EA] hover:bg-[#4A28C7]" onClick={handleAddTransaction}>Salvar Transação</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><AlertTriangle /> Excluir</DialogTitle></DialogHeader>
                    <p className="py-4 text-gray-600">Deseja excluir a transação de <strong>R$ {selectedTransaction?.value.toFixed(2)}</strong>?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={() => handleDeleteTransaction(selectedTransaction?.id)}>Sim, Excluir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Financeiro;