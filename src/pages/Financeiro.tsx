import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, DollarSign, TrendingUp, TrendingDown, Plus, Filter } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const chartData = [
  { month: "Jul", faturamento: 125000 },
  { month: "Ago", faturamento: 135000 },
  { month: "Set", faturamento: 142000 },
  { month: "Out", faturamento: 138000 },
  { month: "Nov", faturamento: 155000 },
  { month: "Dez", faturamento: 168000 },
];

const mockTransactions = [
  {
    id: 1,
    date: "2024-01-05 14:30",
    type: "Entrada",
    description: "Venda - Pedido #1234",
    amount: "R$ 2.850,00",
    recipient: "João Silva",
    status: "Pago",
    responsible: "Carlos Vendas"
  },
  {
    id: 2,
    date: "2024-01-05 09:15",
    type: "Saída",
    description: "Fornecedor - Estoque",
    amount: "R$ 1.200,00",
    recipient: "Fornecedor ABC",
    status: "A Pagar",
    responsible: "Ana Compras"
  },
  {
    id: 3,
    date: "2024-01-04 16:45",
    type: "Entrada",
    description: "Venda - Pedido #1233",
    amount: "R$ 850,00",
    recipient: "Maria Santos",
    status: "Pago",
    responsible: "Pedro Vendas"
  },
  {
    id: 4,
    date: "2024-01-04 11:20",
    type: "Saída",
    description: "Aluguel - Janeiro",
    amount: "R$ 3.500,00",
    recipient: "Imobiliária XYZ",
    status: "Atraso",
    responsible: "Financeiro"
  },
];

const Financeiro = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [periodFilter, setPeriodFilter] = useState("6meses");
  const [newTransaction, setNewTransaction] = useState({
    type: "",
    description: "",
    amount: "",
    recipient: "",
    status: "",
    responsible: ""
  });

  const totalEntradas = 185400;
  const totalSaidas = 127300;
  const balanco = totalEntradas - totalSaidas;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago": return "bg-green-100 text-green-800";
      case "A Pagar": return "bg-yellow-100 text-yellow-800";
      case "Atraso": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "Entrada" ? "text-green-600" : "text-red-600";
  };

  const handleAddTransaction = () => {
    console.log("Nova transação:", newTransaction);
    setIsAddDialogOpen(false);
    setNewTransaction({ type: "", description: "", amount: "", recipient: "", status: "", responsible: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600">Controle suas finanças e transações</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#5932EA] hover:bg-[#4A28C7]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Transação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select onValueChange={(value) => setNewTransaction({...newTransaction, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Saída">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  placeholder="Ex: Venda - Pedido #1235"
                />
              </div>
              <div>
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  placeholder="Ex: 1500.00"
                />
              </div>
              <div>
                <Label htmlFor="recipient">Para Quem</Label>
                <Input
                  id="recipient"
                  value={newTransaction.recipient}
                  onChange={(e) => setNewTransaction({...newTransaction, recipient: e.target.value})}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => setNewTransaction({...newTransaction, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="A Pagar">A Pagar</SelectItem>
                    <SelectItem value="Atraso">Em Atraso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  value={newTransaction.responsible}
                  onChange={(e) => setNewTransaction({...newTransaction, responsible: e.target.value})}
                  placeholder="Ex: Carlos Vendas"
                />
              </div>
              <Button onClick={handleAddTransaction} className="w-full">
                Adicionar Transação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalEntradas.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalSaidas.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">+5% desde o mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balanço</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balanco >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {balanco.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Resultado do período</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Faturamento */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Faturamento dos Últimos 6 Meses</CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3meses">3 Meses</SelectItem>
                  <SelectItem value="6meses">6 Meses</SelectItem>
                  <SelectItem value="12meses">12 Meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="linha" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="linha">Gráfico de Linha</TabsTrigger>
              <TabsTrigger value="barra">Gráfico de Barras</TabsTrigger>
            </TabsList>
            <TabsContent value="linha" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Faturamento']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="faturamento" 
                    stroke="#5932EA" 
                    strokeWidth={2}
                    dot={{ fill: '#5932EA' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="barra" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Faturamento']}
                  />
                  <Bar dataKey="faturamento" fill="#5932EA" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Para Quem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.date}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`font-medium ${getTypeColor(transaction.type)}`}>
                    {transaction.amount}
                  </TableCell>
                  <TableCell>{transaction.recipient}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {transaction.responsible}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Financeiro;