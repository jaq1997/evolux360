
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, ChevronsRight, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AutomacaoInteligente = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-gray-800">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                         <div className="w-8 h-8 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Automação Inteligente</span>
                    </div>
                     <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para o Início
                    </Button>
                </div>
            </header>

            <main className="container mx-auto py-16 px-4">
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Automatize o trabalho, não as pessoas
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Nossa automação inteligente economiza seu tempo e reduz erros operacionais, permitindo que você foque no que realmente importa: o crescimento do seu negócio.
                    </p>
                    <Button size="lg" className="bg-[#5932EA] text-white hover:bg-[#4A28C7] shadow-lg" onClick={() => navigate('/auth')}>
                        Começar agora <ChevronsRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>

                <div className="bg-gray-50 p-10 rounded-2xl border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Benefícios que transformam sua rotina</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BarChart className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Aumento de Eficiência</h3>
                            <p className="text-gray-600">Otimize fluxos de trabalho e acelere a execução de processos críticos em até 50%.</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Redução de Custos</h3>
                            <p className="text-gray-600">Automatize tarefas repetitivas e diminua a necessidade de intervenção manual, economizando recursos.</p>
                        </div>
                         <div>
                             <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ChevronsRight className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Menos Erros</h3>
                            <p className="text-gray-600">Garanta consistência e precisão em todas as operações, minimizando falhas humanas.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AutomacaoInteligente;
