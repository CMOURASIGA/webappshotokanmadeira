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
  id: string;
  codigo: string;
  nomeCliente: string;
  telefone: string;
  email: string;
  valorTotal: number;
  statusPedido: StoreOrderStatus;
  statusPagamento: StorePaymentStatus;
  dataCriacao: string;
  dataPagamento?: string;
  dataRetirada?: string;
  observacoes?: string;
  atualizadoEm: string;
  itens?: StoreOrderItem[];
  tokenRetirada?: string;
  dataGeracaoComprovante?: string;
  entreguePor?: string;
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

export interface StoreCategory {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  usaTamanho: boolean;
  usaCor: boolean;
  usaVariacao: boolean;
  permitePersonalizacao: boolean;
  ordem?: number;
}

export interface StoreProductAdmin {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem1?: string;
  imagem2?: string;
  imagem3?: string;
  imagem1FileId?: string;
  imagem2FileId?: string;
  imagem3FileId?: string;
  categoriaId: string;
  categoria?: string;
  tamanhos?: string;
  cores?: string;
  variacoes?: string;
  personalizavel: boolean;
  disponivel: boolean;
  ativo: boolean;
  estoqueControlado?: boolean;
  estoqueAtual?: number;
  estoqueVariacoes?: Record<string, number>;
  ordem?: number;
}

export interface StoreAdminConfig {
  driveFolderUrl?: string;
  driveFolderId?: string;
}
