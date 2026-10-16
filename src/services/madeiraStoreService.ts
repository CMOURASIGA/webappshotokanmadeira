import { StoreOrder, StoreOrderItem, CreateStoreOrderPayload, StoreOrderStatus, StorePaymentStatus } from "../types/storeOrder";
import { PixConfig } from "../types/championship";

const DEFAULT_PIX_CONFIG: PixConfig = {
  tipoChave: "EMAIL",
  chave: "madeirakarateshotokan@gmail.com",
  nomeRecebedor: "MADEIRA KARATE",
  cidadeRecebedor: "RIO DE JANEIRO",
  incluirValorNoQrCode: true,
  instrucoesAdicionais: "Pagamento referente a pedido na MadeiraStore."
};

export const madeiraStoreService = {
  /**
   * Obtém as configurações de PIX para a MadeiraStore
   */
  async getPixConfig(): Promise<PixConfig> {
    try {
      const res = await fetch(`/api/settings?ts=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.pixChave) {
          return {
            tipoChave: (data.pixTipo || "EMAIL") as any,
            chave: data.pixChave,
            nomeRecebedor: data.pixNome || "MADEIRA KARATE",
            cidadeRecebedor: data.pixCidade || "RIO DE JANEIRO",
            incluirValorNoQrCode: true,
            instrucoesAdicionais: "Pagamento referente a pedido na MadeiraStore."
          };
        }
      }
    } catch (err) {
      console.warn("[MadeiraStore] Usando configuração de Pix padrão:", err);
    }
    return DEFAULT_PIX_CONFIG;
  },

  /**
   * Cria um pedido oficial no backend e na planilha
   */
  async createOrder(payload: CreateStoreOrderPayload): Promise<StoreOrder> {
    const res = await fetch("/api/store/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let errorMsg = "Não foi possível concluir o pedido.";
      try {
        const errorData = await res.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch {}
      throw new Error(errorMsg);
    }

    const createdOrder: StoreOrder = await res.json();
    return createdOrder;
  },

  /**
   * Consulta pública de pedido por Código + Telefone ou E-mail
   */
  async lookupOrder(codigo: string, telefoneOuEmail: string): Promise<StoreOrder> {
    const res = await fetch("/api/store/orders?action=lookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ codigo, telefoneOuEmail })
    });

    if (!res.ok) {
      let errorMsg = "Pedido não localizado. Verifique o código e o telefone/e-mail informado.";
      try {
        const errorData = await res.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch {}
      throw new Error(errorMsg);
    }

    return await res.json();
  },

  /**
   * Busca um pedido específico por ID ou Código
   */
  async getOrder(id: string): Promise<StoreOrder> {
    const res = await fetch(`/api/store/orders?ts=${Date.now()}`, { headers: { "x-admin-pin": "1926" } });
    if (!res.ok) {
      throw new Error("Pedido não encontrado.");
    }
    const orders: StoreOrder[] = await res.json();
    const order = orders.find(o => o.id === id || o.codigo === id);
    if (!order) throw new Error("Pedido não encontrado.");
    return order;
  },

  /**
   * Lista todos os pedidos da MadeiraStore (para o Dashboard Administrativo)
   */
  async getOrders(adminPin?: string): Promise<StoreOrder[]> {
    const headers: Record<string, string> = {};
    if (adminPin) {
      headers["x-admin-pin"] = adminPin;
    }
    const res = await fetch(`/api/store/orders?ts=${Date.now()}`, { headers });
    if (!res.ok) {
      throw new Error("Erro ao carregar lista de pedidos.");
    }
    return await res.json();
  },

  /**
   * Atualiza status de pedido ou status de pagamento pelo painel administrativo
   */
  async updateOrderStatus(
    orderId: string, 
    updates: {
      statusPedido?: StoreOrderStatus;
      statusPagamento?: StorePaymentStatus;
      observacoes?: string;
    },
    adminPin?: string
  ): Promise<StoreOrder> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (adminPin) {
      headers["x-admin-pin"] = adminPin;
    }

    const res = await fetch(`/api/store/orders?id=${encodeURIComponent(orderId)}&action=status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(updates)
    });

    if (!res.ok) {
      let errorMsg = "Erro ao atualizar status do pedido.";
      try {
        const errorData = await res.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch {}
      throw new Error(errorMsg);
    }

    return await res.json();
  },

  /**
   * Registra que o cliente informou ter realizado o pagamento ou enviado comprovante
   */
  async markPaymentSent(orderId: string): Promise<StoreOrder> {
    const res = await fetch(`/api/store/orders?id=${encodeURIComponent(orderId)}&action=receipt`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("Não foi possível atualizar o status de envio de comprovante.");
    }

    return await res.json();
  },

  /**
   * Valida o PIN de administrador para o /dashboard_loja
   */
  async verifyAdminPin(pin: string): Promise<boolean> {
    try {
      const res = await fetch("/api/store/orders?action=verify-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin.trim()
        },
        body: JSON.stringify({ action: "verify-admin" })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
