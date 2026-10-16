import React, { useEffect, useState } from "react";
import { CheckCircle2, Lock, Package, QrCode } from "lucide-react";
import { useParams } from "react-router-dom";
import { madeiraStoreService } from "../services/madeiraStoreService";
import { StoreOrder } from "../types/storeOrder";

export function StorePickup() {
  const { token = "" } = useParams();
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    madeiraStoreService.getPickupOrder(token).then(setOrder).catch(e => setError(e.message));
  }, [token]);

  const confirmDelivery = async () => {
    if (!pin.trim()) return;
    setLoading(true);
    setError("");
    try {
      const updated = await madeiraStoreService.confirmPickup(token, pin, "DASHBOARD_LOJA");
      setOrder(updated);
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8">
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-5 sm:p-7 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white mx-auto flex items-center justify-center"><QrCode className="w-7 h-7"/></div>
          <h1 className="text-xl font-black">Retirada MadeiraStore</h1>
          <p className="text-xs text-neutral-500">Validação do comprovante de pedido.</p>
        </div>

        {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">{error}</div>}

        {order && (
          <>
            <div className="p-4 rounded-2xl bg-neutral-50 border space-y-1">
              <div className="text-[10px] uppercase text-neutral-500 font-bold">Pedido</div>
              <div className="text-2xl font-black font-mono">{order.codigo}</div>
              <div className="text-xs"><b>Cliente:</b> {order.nomeCliente}</div>
              <div className="text-xs"><b>Total:</b> R$ {order.valorTotal.toFixed(2).replace(".", ",")}</div>
              <div className="text-xs"><b>Pagamento:</b> {order.statusPagamento}</div>
              <div className="text-xs"><b>Status:</b> {order.statusPedido}</div>
            </div>

            <div className="space-y-2">
              {order.itens?.map((it, idx) => (
                <div key={idx} className="p-3 rounded-xl border flex items-center justify-between text-xs">
                  <span><Package className="w-4 h-4 inline mr-1"/>{it.quantidade}× {it.produtoNome}</span>
                  <b>R$ {it.subtotal.toFixed(2).replace(".", ",")}</b>
                </div>
              ))}
            </div>

            {order.statusPedido === "ENTREGUE" ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1"/>
                <div className="font-bold">Pedido já entregue</div>
                {order.dataRetirada && <div className="text-xs mt-1">{new Date(order.dataRetirada).toLocaleString("pt-BR")}</div>}
              </div>
            ) : (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-2 text-xs font-bold"><Lock className="w-4 h-4"/> Confirmação administrativa</div>
                <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN do responsável" className="w-full p-3 rounded-xl border text-center tracking-widest"/>
                <button onClick={confirmDelivery} disabled={loading || order.statusPagamento !== "PAGAMENTO_CONFIRMADO"} className="w-full py-3 rounded-xl bg-karate-red text-white text-xs font-bold disabled:opacity-40">
                  {loading ? "Confirmando..." : "Confirmar entrega do pedido"}
                </button>
                {order.statusPagamento !== "PAGAMENTO_CONFIRMADO" && <p className="text-[11px] text-amber-700 text-center">A entrega só pode ser confirmada após o pagamento estar confirmado.</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
