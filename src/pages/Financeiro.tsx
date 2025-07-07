import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowUp, ArrowDown, Plus, Search, Filter, Edit, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const cashflowData = [
    { month: "Jan", Entradas: 31793, Saídas: 15186 },
    { month: "Fev", Entradas: 34403, Saídas: 25186 },
    { month: "Mar", Entradas: 29074, Saídas: 27542 },
    { month: "Abr", Entradas: 25249, Saídas: 22972 },
    { month: "Mai", Entradas: 26360, Saídas: 10766 },
    { month: "Jun", Entradas: 48205, Saídas: 26226 },
];

const initialTransactions = [
    { id: 1, date: "2025-07-05", type: "Entrada", origin: "Vendas E-commerce", paymentMethod: "Pix", value: 1234.56, status: "Completo", notes: "Referente ao pedido #456" },
    { id: 2, date: "2025-07-05", type: "Saída", origin: "Administrativo - Imposto", paymentMethod: "Boleto", value: 234.56, status: "Pendente", notes: "DARF mensal" },
    { id: 3, date: "2025-07-03", type: "Saída", origin: "Marketing - Ads", paymentMethod: "Cartão de Crédito", value: 345.67, status: "Em Atraso", notes: "Campanha de julho" },
    { id: 4, date: "2025-07-02", type: "Entrada", origin: "Vendas E-commerce", paymentMethod: "Cartão de Crédito", value: 850.00, status: "Completo", notes: "Referente ao pedido #455" },
    { id: 5, date: "2025-07-01", type: "Entrada", origin: "Vendas E-commerce", paymentMethod: "Cartão de Débito", value: 150.00, status: "Completo", notes: "Referente ao pedido #454" },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case "Completo": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{status}</Badge>;
        case "Pendente": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-orange-200">{status}</Badge>;
        case "Em Atraso": return <Badge variant="destructive">{status}</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
};

const Financeiro = () => {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // Estados dos filtros
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    // NOVO: Estado para o filtro de forma de pagamento
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");

    const handleActionSuccess = (message) => {
        setSuccessMessage(message);
        setIsSuccessModalOpen(true);
    };
    const handleEditClick = (transaction) => {
        setSelectedTransaction(transaction);
        setIsEditModalOpen(true);
    };
    const handleUpdateTransaction = () => {
        setIsEditModalOpen(false);
        handleActionSuccess(`Transação #${selectedTransaction.id} atualizada com sucesso!`);
    };
    const handleDeleteClick = (transaction) => {
        setSelectedTransaction(transaction);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
        setIsDeleteModalOpen(false);
        handleActionSuccess(`Transação #${selectedTransaction.id} foi removida.`);
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const typeMatch = typeFilter === 'all' || t.type === typeFilter;
            const statusMatch = statusFilter === 'all' || t.status === statusFilter;
            // NOVO: Lógica para o filtro de forma de pagamento
            const paymentMethodMatch = paymentMethodFilter === 'all' || t.paymentMethod === paymentMethodFilter;
            return typeMatch && statusMatch && paymentMethodMatch;
        });
    }, [transactions, typeFilter, statusFilter, paymentMethodFilter]);

    const handleAddTransaction = (e) => {
        e.preventDefault();
        setIsAddModalOpen(false);
        handleActionSuccess("Nova transação adicionada com sucesso!");
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total de Entradas</CardTitle><ArrowUp className="h-5 w-5 text-green-500" /></CardHeader><CardContent><p className="text-3xl font-bold text-green-600">R$ 45.231,89</p></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total de Saídas</CardTitle><ArrowDown className="h-5 w-5 text-red-500" /></CardHeader><CardContent><p className="text-3xl font-bold text-red-600">R$ 23.148,00</p></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Valor em caixa</CardTitle><DollarSign className="h-5 w-5 text-blue-500" /></CardHeader><CardContent><p className="text-3xl font-bold text-blue-600">R$ 22.086,89</p></CardContent></Card>
                </div>
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Fluxo de caixa</CardTitle></CardHeader>
                    <CardContent className="pl-2 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%"><BarChart data={cashflowData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tickFormatter={(value) => `R$${value / 1000}k`} tick={{ fontSize: 12 }} /><Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} cursor={{ fill: '#f3f4f6' }} /><Legend /><Bar dataKey="Entradas" fill="#22C55E" radius={[4, 4, 0, 0]} /><Bar dataKey="Saídas" fill="#EF4444" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <CardTitle>Transações Recentes</CardTitle>
                        <div className="flex w-full sm:w-auto items-center gap-2 flex-wrap">
                            <div className="relative w-full sm:w-auto"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar..." className="pl-8 w-full sm:w-[200px]" /></div>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtros</Button></DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="p-2 space-y-4">
                                        <div className="space-y-2"><Label className="text-sm font-normal">Tipo</Label><Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os Tipos</SelectItem><SelectItem value="Entrada">Entrada</SelectItem><SelectItem value="Saída">Saída</SelectItem></SelectContent></Select></div>
                                        <div className="space-y-2"><Label className="text-sm font-normal">Status</Label><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os Status</SelectItem><SelectItem value="Completo">Completo</SelectItem><SelectItem value="Pendente">Pendente</SelectItem><SelectItem value="Em Atraso">Em Atraso</SelectItem></SelectContent></Select></div>
                                        {/* NOVO: Filtro de Forma de Pagamento */}
                                        <div className="space-y-2"><Label className="text-sm font-normal">Forma de Pagamento</Label><Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas</SelectItem><SelectItem value="Pix">Pix</SelectItem><SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem><SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem><SelectItem value="Boleto">Boleto</SelectItem></SelectContent></Select></div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}><DialogTrigger asChild><Button className="bg-[#5932EA] hover:bg-[#4A28C7]"><Plus className="mr-2 h-4 w-4" /> Nova Transação</Button></DialogTrigger><DialogContent className="sm:max-w-md">{/* ... (conteúdo do modal de adicionar) ... */}</DialogContent></Dialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Tipo</TableHead><TableHead>Origem</TableHead><TableHead>Forma de Pagamento</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredTransactions.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                                    <TableCell className={`font-medium ${t.type === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>{t.type}</TableCell>
                                    <TableCell>{t.origin}</TableCell>
                                    <TableCell>{t.paymentMethod}</TableCell>
                                    <TableCell className="font-medium">{`R$ ${t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</TableCell>
                                    <TableCell>{getStatusBadge(t.status)}</TableCell>
                                    <TableCell className="text-right"><div className="flex items-center justify-end space-x-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(t)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDeleteClick(t)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Editar Transação</DialogTitle></DialogHeader>{selectedTransaction && (<div className="py-4 space-y-4"><div><Label>Tipo de transação</Label><RadioGroup defaultValue={selectedTransaction.type} className="grid grid-cols-2 gap-4 mt-2"><div><RadioGroupItem value="Entrada" id="r1-edit" className="peer sr-only" /><Label htmlFor="r1-edit" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">Entrada</Label></div><div><RadioGroupItem value="Saída" id="r2-edit" className="peer sr-only" /><Label htmlFor="r2-edit" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">Saída</Label></div></RadioGroup></div><div><Label>Origem da transação</Label><Input defaultValue={selectedTransaction.origin} /></div><div><Label>Valor da transação</Label><Input type="number" defaultValue={selectedTransaction.value} /></div><div><Label>Status da transação</Label><Select defaultValue={selectedTransaction.status}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Completo">Completo</SelectItem><SelectItem value="Pendente">Pendente</SelectItem><SelectItem value="Em Atraso">Em Atraso</SelectItem></SelectContent></Select></div><div><Label>Informações adicionais (opcional)</Label><Textarea defaultValue={selectedTransaction.notes} /></div></div>)}<DialogFooter><Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button><Button onClick={handleUpdateTransaction} className="bg-[#5932EA]">Salvar Alterações</Button></DialogFooter></DialogContent></Dialog>
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>{/* ... (código inalterado) ... */}</Dialog>
            <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>{/* ... (código inalterado) ... */}</Dialog>
        </div>
    );
};

export default Financeiro;