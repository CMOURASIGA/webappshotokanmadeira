export type StorePaymentStatus =
  | "AGUARDANDO_PAGAMENTO"
  | "AGUARDANDO_CONFERENCIA"
  | "PAGAMENTO_CONFIRMADO"
  | "PAGAMENTO_REJEITADO";

export type StoreOrderStatus =
  | "RECEBIDO"
  | "EM_SEPARACAO"
  | "PRONTO_RETIRADA"
  | "ENTREGUE"
  | "CANCELADO";

export interface StoreOrderItem {
  id?: string;
  pedidoId: string;
  produtoId: string;
  produtoNome: string;
  categoria?: string;
  quantidade: number;
  tamanho?: string;
  cor?: string;
  variacao?: string;
  personalizacao?: string;
  valorUnitario: number;
  subtotal: number;
}

export interface StoreOrder {
  id: string; // e.g. "MS2026-0001"
  codigo: string; // e.g. "MS2026-0001"
  nomeCliente: string;
  telefone: string;
  email: string;
  valorTotal: number;
  statusPedido: StoreOrderStatus;
  statusPagamento: StorePaymentStatus;
  dataCriacao: string; // ISO string
  dataPagamento?: string;
  dataRetirada?: string;
  observacoes?: string;
  atualizadoEm: string;
  itens?: StoreOrderItem[];
}

export interface CreateStoreOrderPayload {
  nomeCliente: string;
  telefone: string;
  email: string;
  observacoes?: string;
  itens: Array<{
    produtoId: string;
    produtoNome: string;
    categoria?: string;
    quantidade: number;
    tamanho?: string;
    cor?: string;
    variacao?: string;
    personalizacao?: string;
    valorUnitario: number;
    subtotal: number;
  }>;
}
