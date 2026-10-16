import React, { useState, useEffect, useMemo } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Package, 
  Truck, 
  Ban, 
  Eye, 
  Lock, 
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  X,
  Calendar,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { madeiraStoreService } from "../services/madeiraStoreService";
import { StoreOrder, StoreOrderStatus, StorePaymentStatus } from "../types/storeOrder";
import { useAppData } from "../contexts/AppDataContext";

export function StoreDashboard() {
  const navigate = useNavigate();
  const { config } = useAppData();

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("madeira_admin_auth") === "true";
  });
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");

  // Data State
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await madeiraStoreService.getOrders(enteredPin || "1926");
      setOrders(data);
    } catch (err) {
      console.error("[StoreDashboard] Erro ao carregar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadOrders();
    }
  }, [isAdminAuthenticated]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    const isValid = await madeiraStoreService.verifyAdminPin(enteredPin);
    if (isValid) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem("madeira_admin_auth", "true");
    } else {
      setPinError("PIN incorreto. Tente novamente.");
    }
  };

  const handleUpdateStatus = async (
    orderId: string, 
    statusPedido?: StoreOrderStatus, 
    statusPagamento?: StorePaymentStatus
  ) => {
    setActionLoading(true);
    try {
      const updated = await madeiraStoreService.updateOrderStatus(orderId, {
        statusPedido,
        statusPagamento
      }, enteredPin || "1926");

      setOrders(prev => prev.map(o => o.id === orderId || o.codigo === orderId ? updated : o));
      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.codigo === orderId)) {
        setSelectedOrder(updated);
      }
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar status do pedido.");
    } finally {
      setActionLoading(false);
    }
  };

  // KPI Metrics calculation (SPEC 09 item 12)
  const metrics = useMemo(() => {
    let novos = 0;
    let aguardandoPagamento = 0;
    let aguardandoConferencia = 0;
    let confirmados = 0;
    let emSeparacao = 0;
    let prontosRetirada = 0;
    let entregues = 0;
    let valorVendido = 0;

    orders.forEach(o => {
      if (o.statusPedido === "RECEBIDO") novos++;
      if (o.statusPagamento === "AGUARDANDO_PAGAMENTO") aguardandoPagamento++;
      if (o.statusPagamento === "AGUARDANDO_CONFERENCIA") aguardandoConferencia++;
      if (o.statusPagamento === "PAGAMENTO_CONFIRMADO") {
        confirmados++;
        valorVendido += (o.valorTotal || 0);
      }
      if (o.statusPedido === "EM_SEPARACAO") emSeparacao++;
      if (o.statusPedido === "PRONTO_RETIRADA") prontosRetirada++;
      if (o.statusPedido === "ENTREGUE") entregues++;
    });

    return {
      novos,
      aguardandoPagamento,
      aguardandoConferencia,
      confirmados,
      emSeparacao,
      prontosRetirada,
      entregues,
      valorVendido
    };
  }, [orders]);

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = searchTerm.trim() === "" ||
        o.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.telefone.includes(searchTerm) ||
        o.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPayment = paymentFilter === "ALL" || o.statusPagamento === paymentFilter;
      const matchStatus = orderStatusFilter === "ALL" || o.statusPedido === orderStatusFilter;

      return matchSearch && matchPayment && matchStatus;
    });
  }, [orders, searchTerm, paymentFilter, orderStatusFilter]);

  // PIN Login Form
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-neutral-200/80 shadow-xl space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-karate-gold" />
          </div>

          <div>
            <h1 className="text-xl font-bold font-jp text-neutral-900">Dashboard MadeiraStore</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Área restrita à administração da Madeira Karate. Digite o PIN de acesso:
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              maxLength={8}
              autoFocus
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="Digite o PIN (ex: 1926)"
              className="w-full text-center text-lg tracking-widest font-mono p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-neutral-50"
            />

            {pinError && (
              <p className="text-xs text-red-600 font-medium">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Acessar Painel
            </button>
          </form>

          <div className="pt-2 border-t border-neutral-100 flex justify-center">
            <Link to="/madeirastore" className="text-xs text-neutral-500 hover:text-karate-red flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para a MadeiraStore</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full px-2 sm:px-4 animate-in fade-in duration-300">
      {/* Header do Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-karate-red bg-karate-red/10 px-2.5 py-0.5 rounded-full font-mono">
              Painel Administrativo
            </span>
            <span className="text-xs text-neutral-400">• Exclusivo MadeiraStore</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-jp mt-1">
            Gestão de Pedidos da MadeiraStore
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadOrders}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-karate-red" : ""}`} />
            <span>Atualizar</span>
          </button>

          <Link
            to="/dashboard_campeonato"
            className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all shadow-xs"
            title="Ir para o painel de campeonatos"
          >
            Painel Campeonatos
          </Link>

          <Link
            to="/madeirastore"
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
          >
            Ver Loja
          </Link>
        </div>
      </div>

      {/* KPI Cards (SPEC 09 item 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
        {/* Novos */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
            Novos
          </span>
          <span className="text-xl sm:text-2xl font-black text-blue-600 font-mono mt-1 block">
            {metrics.novos}
          </span>
        </div>

        {/* Aguardando Pagamento */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
            Aguard. Pgto
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono mt-1 block">
            {metrics.aguardandoPagamento}
          </span>
        </div>

        {/* Aguardando Conferência */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
            Aguard. Conf.
          </span>
          <span className="text-xl sm:text-2xl font-black text-purple-600 font-mono mt-1 block">
            {metrics.aguardandoConferencia}
          </span>
        </div>

        {/* Pagamentos Confirmados */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
            Confirmados
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono mt-1 block">
            {metrics.confirmados}
          </span>
        </div>

        {/* Em Separação */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
            Separação
          </span>
          <span className="text-xl sm:text-2xl font-black text-indigo-600 font-mono mt-1 block">
            {metrics.emSeparacao}
          </span>
        </div>

        {/* Prontos para Retirada */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
            P/ Retirada
          </span>
          <span className="text-xl sm:text-2xl font-black text-teal-600 font-mono mt-1 block">
            {metrics.prontosRetirada}
          </span>
        </div>

        {/* Entregues */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
            Entregues
          </span>
          <span className="text-xl sm:text-2xl font-black text-neutral-800 font-mono mt-1 block">
            {metrics.entregues}
          </span>
        </div>

        {/* Total Vendido */}
        <div className="bg-neutral-900 text-white p-3 sm:p-4 rounded-2xl border border-neutral-800 shadow-xs">
          <span className="text-[10px] font-bold text-karate-gold uppercase tracking-wider block font-mono">
            Total Vendido
          </span>
          <span className="text-sm sm:text-base font-black text-white font-mono mt-1 block truncate">
            R$ {metrics.valorVendido.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      {/* Filtros de Pesquisa */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Busca Textual */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por código, cliente ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-neutral-50"
            />
          </div>

          {/* Filtro Status Pagamento */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-neutral-50"
            >
              <option value="ALL">Todos os Pagamentos</option>
              <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
              <option value="AGUARDANDO_CONFERENCIA">Aguardando Conferência</option>
              <option value="PAGAMENTO_CONFIRMADO">Pagamento Confirmado</option>
              <option value="PAGAMENTO_REJEITADO">Pagamento Rejeitado</option>
            </select>
          </div>

          {/* Filtro Status Pedido */}
          <div>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-neutral-50"
            >
              <option value="ALL">Todos os Status de Pedido</option>
              <option value="RECEBIDO">Recebido</option>
              <option value="EM_SEPARACAO">Em Separação</option>
              <option value="PRONTO_RETIRADA">Pronto para Retirada</option>
              <option value="ENTREGUE">Entregue</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Cliente / Contato</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4">Status Pedido</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    Nenhum pedido encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      {ord.codigo}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">{ord.nomeCliente}</div>
                      <div className="text-[11px] text-neutral-500">{ord.telefone} • {ord.email}</div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600 whitespace-nowrap">
                      {ord.dataCriacao ? new Date(ord.dataCriacao).toLocaleDateString("pt-BR") : "—"}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-karate-red whitespace-nowrap">
                      R$ {ord.valorTotal.toFixed(2).replace(".", ",")}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        ord.statusPagamento === "PAGAMENTO_CONFIRMADO"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : ord.statusPagamento === "AGUARDANDO_CONFERENCIA"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : ord.statusPagamento === "PAGAMENTO_REJEITADO"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {ord.statusPagamento}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        ord.statusPedido === "ENTREGUE"
                          ? "bg-neutral-100 text-neutral-800 border-neutral-300"
                          : ord.statusPedido === "PRONTO_RETIRADA"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : ord.statusPedido === "EM_SEPARACAO"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : ord.statusPedido === "CANCELADO"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {ord.statusPedido}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detalhes</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Gaveta de Detalhe do Pedido com Ações Administrativas */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-karate-gold uppercase tracking-wider block font-mono">
                  Gerenciar Pedido
                </span>
                <h2 className="text-xl font-black font-mono mt-0.5">{selectedOrder.codigo}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo Modal */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Dados do Comprador */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono block">
                  Dados do Cliente
                </span>
                <p className="font-bold text-sm text-neutral-900">{selectedOrder.nomeCliente}</p>
                <div className="text-xs text-neutral-600 space-y-1">
                  <p>Telefone: <strong>{selectedOrder.telefone}</strong></p>
                  <p>E-mail: <strong>{selectedOrder.email}</strong></p>
                  {selectedOrder.observacoes && (
                    <p className="pt-1 text-neutral-700 italic border-t border-neutral-200">
                      Obs: "{selectedOrder.observacoes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Status Atual */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Pagamento</span>
                  <span className="text-xs font-bold text-neutral-800 block mt-0.5">
                    {selectedOrder.statusPagamento}
                  </span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Pedido</span>
                  <span className="text-xs font-bold text-neutral-800 block mt-0.5">
                    {selectedOrder.statusPedido}
                  </span>
                </div>
              </div>

              {/* Lista Completa de Itens (SPEC 09 item 12) */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono block">
                  Itens do Pedido ({selectedOrder.itens?.length || 0})
                </span>

                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                  {selectedOrder.itens && selectedOrder.itens.length > 0 ? (
                    selectedOrder.itens.map((item, idx) => (
                      <div key={idx} className="p-3 sm:p-4 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-neutral-900">
                          <span>{item.produtoNome}</span>
                          <span className="font-mono text-karate-red">
                            R$ {item.subtotal.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 flex flex-wrap gap-2">
                          <span>{item.quantidade}x R$ {item.valorUnitario.toFixed(2).replace(".", ",")}</span>
                          {item.tamanho && <span className="bg-neutral-100 px-1.5 py-0.2 rounded font-mono">Tam: {item.tamanho}</span>}
                          {item.cor && <span className="bg-neutral-100 px-1.5 py-0.2 rounded font-mono">Cor: {item.cor}</span>}
                          {item.variacao && <span className="bg-neutral-100 px-1.5 py-0.2 rounded font-mono">Opção: {item.variacao}</span>}
                          {item.personalizacao && <span className="bg-neutral-100 px-1.5 py-0.2 rounded font-mono">Personalização: {item.personalizacao}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-neutral-400">
                      Nenhum item detalhado localizado.
                    </div>
                  )}
                </div>

                <div className="p-3 bg-neutral-900 text-white rounded-xl flex items-center justify-between font-mono font-bold text-sm">
                  <span>Valor Total:</span>
                  <span className="text-karate-gold">R$ {selectedOrder.valorTotal.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              {/* AÇÕES ADMINISTRATIVAS (SPEC 09 item 12) */}
              <div className="space-y-3 pt-2 border-t border-neutral-200">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-mono block">
                  Ações Administrativas
                </span>

                {/* Pagamento */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, undefined, "PAGAMENTO_CONFIRMADO")}
                    disabled={actionLoading || selectedOrder.statusPagamento === "PAGAMENTO_CONFIRMADO"}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Pagamento</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, undefined, "PAGAMENTO_REJEITADO")}
                    disabled={actionLoading || selectedOrder.statusPagamento === "PAGAMENTO_REJEITADO"}
                    className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rejeitar Pagamento</span>
                  </button>
                </div>

                {/* Status do Pedido */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "EM_SEPARACAO")}
                    disabled={actionLoading || selectedOrder.statusPedido === "EM_SEPARACAO"}
                    className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>Em Separação</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "PRONTO_RETIRADA")}
                    disabled={actionLoading || selectedOrder.statusPedido === "PRONTO_RETIRADA"}
                    className="py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Pronto Retirada</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "ENTREGUE")}
                    disabled={actionLoading || selectedOrder.statusPedido === "ENTREGUE"}
                    className="py-2 px-3 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Marcar Entregue</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "CANCELADO")}
                    disabled={actionLoading || selectedOrder.statusPedido === "CANCELADO"}
                    className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Cancelar Pedido</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <span className="text-[10px] text-neutral-400">
                Atualizado em {new Date(selectedOrder.atualizadoEm || selectedOrder.dataCriacao).toLocaleString("pt-BR")}
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
