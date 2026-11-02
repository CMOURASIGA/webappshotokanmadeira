import React, { useEffect, useState } from "react";
import { CheckCircle2, Lock, Package, QrCode } from "lucide-react";
import { useParams } from "react-router-dom";
import { madeiraStoreService } from "../services/madeiraStoreService";
import { StoreOrder } from "../types/storeOrder";
import { useLanguage } from "../i18n/LanguageContext";

export function StorePickup() {
  const { token = "" } = useParams();
  const { language, locale } = useLanguage();
  const copy = language === "en"
    ? { title:"MadeiraStore Pickup", subtitle:"Order receipt validation.", order:"Order", customer:"Customer", total:"Total", payment:"Payment", status:"Status", delivered:"Order already delivered", admin:"Administrative confirmation", pin:"Responsible person's PIN", confirming:"Confirming...", confirm:"Confirm order delivery", blocked:"Delivery can only be confirmed after payment is confirmed." }
    : language === "ja"
    ? { title:"MadeiraStore 受け取り", subtitle:"注文控えの確認。", order:"注文", customer:"顧客", total:"合計", payment:"支払い", status:"状態", delivered:"受け取り済み", admin:"管理者確認", pin:"担当者 PIN", confirming:"確認中...", confirm:"受け取りを確定", blocked:"支払い確認後にのみ受け取りを確定できます。" }
    : { title:"Retirada MadeiraStore", subtitle:"Validação do comprovante de pedido.", order:"Pedido", customer:"Cliente", total:"Total", payment:"Pagamento", status:"Status", delivered:"Pedido já entregue", admin:"Confirmação administrativa", pin:"PIN do responsável", confirming:"Confirmando...", confirm:"Confirmar entrega do pedido", blocked:"A entrega só pode ser confirmada após o pagamento estar confirmado." };
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
          <h1 className="text-xl font-black">{copy.title}</h1>
          <p className="text-xs text-neutral-500">{copy.subtitle}</p>
        </div>

        {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">{error}</div>}

        {order && (
          <>
            <div className="p-4 rounded-2xl bg-neutral-50 border space-y-1">
              <div className="text-[10px] uppercase text-neutral-500 font-bold">{copy.order}</div>
              <div className="text-2xl font-black font-mono">{order.codigo}</div>
              <div className="text-xs"><b>{copy.customer}:</b> {order.nomeCliente}</div>
              <div className="text-xs"><b>{copy.total}:</b> R$ {order.valorTotal.toFixed(2).replace(".", ",")}</div>
              <div className="text-xs"><b>{copy.payment}:</b> {order.statusPagamento}</div>
              <div className="text-xs"><b>{copy.status}:</b> {order.statusPedido}</div>
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
                <div className="font-bold">{copy.delivered}</div>
                {order.dataRetirada && <div className="text-xs mt-1">{new Date(order.dataRetirada).toLocaleString(locale)}</div>}
              </div>
            ) : (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-2 text-xs font-bold"><Lock className="w-4 h-4"/> {copy.admin}</div>
                <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder={copy.pin} className="w-full p-3 rounded-xl border text-center tracking-widest"/>
                <button onClick={confirmDelivery} disabled={loading || order.statusPagamento !== "PAGAMENTO_CONFIRMADO"} className="w-full py-3 rounded-xl bg-karate-red text-white text-xs font-bold disabled:opacity-40">
                  {loading ? copy.confirming : copy.confirm}
                </button>
                {order.statusPagamento !== "PAGAMENTO_CONFIRMADO" && <p className="text-[11px] text-amber-700 text-center">{copy.blocked}</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
