import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, CheckCircle2, Eye, FolderOpen, ImagePlus, Lock, Package,
  Pencil, Plus, RefreshCw, Save, Search, Settings, ShoppingBag, Tags, Trash2, X
} from "lucide-react";
import { Link } from "react-router-dom";
import { madeiraStoreService } from "../services/madeiraStoreService";
import {
  StoreAdminConfig, StoreCategory, StoreOrder, StoreOrderStatus,
  StorePaymentStatus, StoreProductAdmin
} from "../types/storeOrder";

type Tab = "pedidos" | "produtos" | "categorias" | "config";

const emptyCategory = (): StoreCategory => ({
  id: "", nome: "", descricao: "", ativo: true,
  usaTamanho: false, usaCor: false, usaVariacao: false,
  permitePersonalizacao: false, ordem: 0
});

const emptyProduct = (): StoreProductAdmin => ({
  id: "", nome: "", descricao: "", preco: 0,
  imagem1: "", imagem2: "", imagem3: "",
  imagem1FileId: "", imagem2FileId: "", imagem3FileId: "",
  categoriaId: "", categoria: "", tamanhos: "", cores: "", variacoes: "",
  personalizavel: false, disponivel: true, ativo: true, ordem: 0
});

export function StoreDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => sessionStorage.getItem("madeira_admin_auth") === "true");
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const adminPin = enteredPin || "1926";

  const [tab, setTab] = useState<Tab>("pedidos");
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [products, setProducts] = useState<StoreProductAdmin[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [storeConfig, setStoreConfig] = useState<StoreAdminConfig>({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);

  const [categoryForm, setCategoryForm] = useState<StoreCategory>(emptyCategory());
  const [productForm, setProductForm] = useState<StoreProductAdmin>(emptyProduct());
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [orderData, catalog] = await Promise.all([
        madeiraStoreService.getOrders(adminPin),
        madeiraStoreService.getAdminCatalog(adminPin)
      ]);
      setOrders(orderData);
      setProducts(catalog.products);
      setCategories(catalog.categories);
      setStoreConfig(catalog.config || {});
    } catch (err:any) {
      console.error(err);
      alert(err.message || "Erro ao carregar dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) loadAll();
  }, [isAdminAuthenticated]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    if (await madeiraStoreService.verifyAdminPin(enteredPin)) {
      sessionStorage.setItem("madeira_admin_auth", "true");
      setIsAdminAuthenticated(true);
    } else {
      setPinError("PIN incorreto. Tente novamente.");
    }
  };

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(o =>
      o.codigo.toLowerCase().includes(q) ||
      o.nomeCliente.toLowerCase().includes(q) ||
      o.telefone.includes(q) ||
      o.email.toLowerCase().includes(q)
    );
  }, [orders, searchTerm]);

  const activeCategory = categories.find(c => c.id === productForm.categoriaId);

  const handleSaveCategory = async () => {
    if (!categoryForm.nome.trim()) return alert("Informe o nome da categoria.");
    setActionLoading(true);
    try {
      await madeiraStoreService.saveCategory(categoryForm, adminPin);
      setCategoryForm(emptyCategory());
      setShowCategoryForm(false);
      await loadAll();
    } catch (err:any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!productForm.nome.trim()) return alert("Informe o nome do produto.");
    if (!productForm.categoriaId) return alert("Selecione uma categoria cadastrada.");
    if (!(Number(productForm.preco) > 0)) return alert("Informe um preço válido.");
    setActionLoading(true);
    try {
      const cat = categories.find(c => c.id === productForm.categoriaId);
      await madeiraStoreService.saveProduct({
        ...productForm,
        categoria: cat?.nome || "",
        personalizavel: !!cat?.permitePersonalizacao && productForm.personalizavel,
        tamanhos: cat?.usaTamanho ? productForm.tamanhos : "",
        cores: cat?.usaCor ? productForm.cores : "",
        variacoes: cat?.usaVariacao ? productForm.variacoes : ""
      }, adminPin);
      setProductForm(emptyProduct());
      setShowProductForm(false);
      await loadAll();
    } catch (err:any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadImage = async (file?: File) => {
    if (!file) return;
    if (!storeConfig.driveFolderId) {
      alert("Configure primeiro a pasta do Google Drive na aba Configuração.");
      setTab("config");
      return;
    }
    setImageUploading(true);
    try {
      const uploaded = await madeiraStoreService.uploadProductImage(file, adminPin);
      setProductForm(prev => ({ ...prev, imagem1: uploaded.url, imagem1FileId: uploaded.fileId }));
    } catch (err:any) {
      alert(err.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!storeConfig.driveFolderUrl?.trim()) return alert("Informe o link compartilhado da pasta do Drive.");
    setActionLoading(true);
    try {
      const saved = await madeiraStoreService.saveStoreConfig(storeConfig, adminPin);
      setStoreConfig(saved);
      alert("Pasta de imagens validada e salva.");
    } catch (err:any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, updates: { statusPedido?: StoreOrderStatus; statusPagamento?: StorePaymentStatus }) => {
    setActionLoading(true);
    try {
      const updated = await madeiraStoreService.updateOrderStatus(orderId, updates, adminPin);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      if (selectedOrder?.id === updated.id) setSelectedOrder(updated);
    } catch (err:any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-7 max-w-sm w-full border border-neutral-200 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-karate-gold" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Dashboard MadeiraStore</h1>
            <p className="text-xs text-neutral-500 mt-1">Área administrativa da loja.</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input type="password" maxLength={8} value={enteredPin} onChange={e => setEnteredPin(e.target.value)}
              placeholder="PIN de acesso" className="w-full text-center text-lg tracking-widest p-3 rounded-xl border border-neutral-300" />
            {pinError && <p className="text-xs text-red-600">{pinError}</p>}
            <button className="w-full py-3 bg-neutral-900 text-white text-xs font-bold rounded-xl">Acessar Painel</button>
          </form>
          <Link to="/madeirastore" className="text-xs text-neutral-500 inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto w-full px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-neutral-200 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-karate-red">Painel Administrativo</span>
          <h1 className="text-2xl font-extrabold">MadeiraStore</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={loadAll} className="px-3 py-2 rounded-xl border bg-white text-xs font-bold flex gap-2 items-center">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
          </button>
          <Link to="/madeirastore" className="px-3 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold">Ver Loja</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          ["pedidos", ShoppingBag, "Pedidos"],
          ["produtos", Package, "Produtos"],
          ["categorias", Tags, "Categorias"],
          ["config", Settings, "Configuração"]
        ].map(([key, Icon, label]: any) => (
          <button key={key} onClick={() => setTab(key)} className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 ${tab === key ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-700 border-neutral-200"}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "pedidos" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar pedido, cliente, telefone..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs" />
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr><th className="p-3 text-left">Pedido</th><th className="p-3 text-left">Cliente</th><th className="p-3">Valor</th><th className="p-3">Pagamento</th><th className="p-3">Status</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id} className="border-t">
                    <td className="p-3 font-mono font-bold">{o.codigo}</td>
                    <td className="p-3"><div className="font-bold">{o.nomeCliente}</div><div className="text-neutral-500">{o.telefone}</div></td>
                    <td className="p-3 text-center font-bold">R$ {o.valorTotal.toFixed(2).replace(".", ",")}</td>
                    <td className="p-3 text-center">{o.statusPagamento}</td>
                    <td className="p-3 text-center">{o.statusPedido}</td>
                    <td className="p-3 text-right"><button onClick={() => setSelectedOrder(o)} className="p-2 rounded-lg bg-neutral-900 text-white"><Eye className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-3">
              <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90dvh] overflow-y-auto p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div><div className="text-xs text-neutral-500">Pedido</div><h2 className="text-xl font-black font-mono">{selectedOrder.codigo}</h2></div>
                  <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5" /></button>
                </div>
                <div className="text-xs space-y-1"><p><b>Cliente:</b> {selectedOrder.nomeCliente}</p><p><b>Contato:</b> {selectedOrder.telefone} • {selectedOrder.email}</p></div>
                <div className="space-y-2">
                  {selectedOrder.itens?.map((it, idx) => <div key={idx} className="p-3 rounded-xl bg-neutral-50 border text-xs flex justify-between"><span>{it.quantidade}× {it.produtoNome}</span><b>R$ {it.subtotal.toFixed(2).replace(".", ",")}</b></div>)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select value={selectedOrder.statusPagamento} onChange={e => handleUpdateStatus(selectedOrder.id, { statusPagamento: e.target.value as StorePaymentStatus })} className="p-2.5 rounded-xl border text-xs">
                    <option value="AGUARDANDO_PAGAMENTO">Aguardando pagamento</option><option value="AGUARDANDO_CONFERENCIA">Aguardando conferência</option><option value="PAGAMENTO_CONFIRMADO">Pagamento confirmado</option><option value="PAGAMENTO_REJEITADO">Pagamento rejeitado</option>
                  </select>
                  <select value={selectedOrder.statusPedido} onChange={e => handleUpdateStatus(selectedOrder.id, { statusPedido: e.target.value as StoreOrderStatus })} className="p-2.5 rounded-xl border text-xs">
                    <option value="RECEBIDO">Recebido</option><option value="EM_SEPARACAO">Em separação</option><option value="PRONTO_RETIRADA">Pronto retirada</option><option value="ENTREGUE">Entregue</option><option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
                {selectedOrder.dataRetirada && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs"><CheckCircle2 className="w-4 h-4 inline mr-1" />Entregue em {new Date(selectedOrder.dataRetirada).toLocaleString("pt-BR")} {selectedOrder.entreguePor ? `por ${selectedOrder.entreguePor}` : ""}</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "categorias" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center"><div><h2 className="font-bold">Categorias</h2><p className="text-xs text-neutral-500">As regras definem quais atributos aparecem no cadastro de produto.</p></div><button onClick={() => { setCategoryForm(emptyCategory()); setShowCategoryForm(true); }} className="px-3 py-2 bg-karate-red text-white rounded-xl text-xs font-bold flex gap-1 items-center"><Plus className="w-4 h-4" /> Nova</button></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map(cat => <div key={cat.id} className="bg-white border rounded-2xl p-4 space-y-2">
              <div className="flex justify-between"><div><h3 className="font-bold">{cat.nome}</h3><p className="text-xs text-neutral-500">{cat.descricao}</p></div><div className="flex gap-1"><button onClick={() => {setCategoryForm(cat);setShowCategoryForm(true);}} className="p-2"><Pencil className="w-4 h-4"/></button><button onClick={async()=>{if(confirm("Excluir categoria?")){await madeiraStoreService.deleteCategory(cat.id,adminPin);await loadAll();}}} className="p-2 text-red-600"><Trash2 className="w-4 h-4"/></button></div></div>
              <div className="flex flex-wrap gap-1 text-[10px]">{cat.usaTamanho&&<span className="px-2 py-1 bg-neutral-100 rounded">Tamanho</span>}{cat.usaCor&&<span className="px-2 py-1 bg-neutral-100 rounded">Cor</span>}{cat.usaVariacao&&<span className="px-2 py-1 bg-neutral-100 rounded">Variação</span>}{cat.permitePersonalizacao&&<span className="px-2 py-1 bg-neutral-100 rounded">Personalização</span>}</div>
            </div>)}
          </div>
        </div>
      )}

      {tab === "produtos" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center"><div><h2 className="font-bold">Produtos</h2><p className="text-xs text-neutral-500">Catálogo oficial da aba Produtos_MadeiraStore.</p></div><button onClick={() => {setProductForm(emptyProduct());setShowProductForm(true);}} className="px-3 py-2 bg-karate-red text-white rounded-xl text-xs font-bold flex gap-1 items-center"><Plus className="w-4 h-4"/> Novo</button></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map(p => <div key={p.id} className="bg-white border rounded-2xl overflow-hidden">
              <div className="h-36 bg-neutral-100">{p.imagem1 ? <img src={p.imagem1} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-neutral-400"><Package/></div>}</div>
              <div className="p-4 space-y-2"><div className="flex justify-between gap-2"><div><h3 className="font-bold text-sm">{p.nome}</h3><p className="text-xs text-neutral-500">{p.categoria}</p></div><b className="text-sm">R$ {p.preco.toFixed(2).replace(".",",")}</b></div><div className="flex justify-between"><span className={`text-[10px] px-2 py-1 rounded ${p.ativo&&p.disponivel?"bg-emerald-50 text-emerald-700":"bg-neutral-100"}`}>{p.ativo&&p.disponivel?"Disponível":"Indisponível"}</span><div><button onClick={()=>{setProductForm(p);setShowProductForm(true);}} className="p-2"><Pencil className="w-4 h-4"/></button><button onClick={async()=>{if(confirm("Excluir produto?")){await madeiraStoreService.deleteProduct(p.id,adminPin);await loadAll();}}} className="p-2 text-red-600"><Trash2 className="w-4 h-4"/></button></div></div></div>
            </div>)}
          </div>
        </div>
      )}

      {tab === "config" && (
        <div className="max-w-2xl bg-white border rounded-3xl p-5 space-y-4">
          <div className="flex gap-3"><div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center"><FolderOpen className="w-5 h-5"/></div><div><h2 className="font-bold">Pasta de imagens no Google Drive</h2><p className="text-xs text-neutral-500">Cole o link compartilhado da pasta onde as fotos dos produtos serão armazenadas.</p></div></div>
          <input value={storeConfig.driveFolderUrl || ""} onChange={e=>setStoreConfig({...storeConfig,driveFolderUrl:e.target.value})} placeholder="https://drive.google.com/drive/folders/..." className="w-full p-3 rounded-xl border text-xs"/>
          {storeConfig.driveFolderId && <p className="text-xs text-emerald-700">Pasta vinculada • ID {storeConfig.driveFolderId}</p>}
          <button onClick={handleSaveConfig} disabled={actionLoading} className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold flex gap-2 items-center"><Save className="w-4 h-4"/> Validar e salvar pasta</button>
        </div>
      )}

      {showCategoryForm && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4">
            <div className="flex justify-between"><h2 className="font-bold">Categoria MadeiraStore</h2><button onClick={()=>setShowCategoryForm(false)}><X/></button></div>
            <input value={categoryForm.nome} onChange={e=>setCategoryForm({...categoryForm,nome:e.target.value})} placeholder="Nome da categoria" className="w-full p-2.5 rounded-xl border text-xs"/>
            <textarea value={categoryForm.descricao||""} onChange={e=>setCategoryForm({...categoryForm,descricao:e.target.value})} placeholder="Descrição" className="w-full p-2.5 rounded-xl border text-xs"/>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[["usaTamanho","Usa tamanho"],["usaCor","Usa cor"],["usaVariacao","Usa variação"],["permitePersonalizacao","Permite personalização"],["ativo","Categoria ativa"]].map(([key,label])=><label key={key} className="flex gap-2 items-center p-2 border rounded-xl"><input type="checkbox" checked={Boolean((categoryForm as any)[key])} onChange={e=>setCategoryForm({...categoryForm,[key]:e.target.checked})}/>{label}</label>)}
            </div>
            <button onClick={handleSaveCategory} disabled={actionLoading} className="w-full py-3 bg-karate-red text-white rounded-xl text-xs font-bold">Salvar categoria</button>
          </div>
        </div>
      )}

      {showProductForm && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92dvh] overflow-y-auto p-5 space-y-4">
            <div className="flex justify-between"><h2 className="font-bold">Produto MadeiraStore</h2><button onClick={()=>setShowProductForm(false)}><X/></button></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={productForm.nome} onChange={e=>setProductForm({...productForm,nome:e.target.value})} placeholder="Nome do produto" className="p-2.5 rounded-xl border text-xs"/>
              <input type="number" step="0.01" value={productForm.preco||""} onChange={e=>setProductForm({...productForm,preco:Number(e.target.value)})} placeholder="Preço" className="p-2.5 rounded-xl border text-xs"/>
            </div>
            <textarea value={productForm.descricao||""} onChange={e=>setProductForm({...productForm,descricao:e.target.value})} placeholder="Descrição" className="w-full p-2.5 rounded-xl border text-xs"/>
            <select value={productForm.categoriaId} onChange={e=>setProductForm({...productForm,categoriaId:e.target.value})} className="w-full p-2.5 rounded-xl border text-xs">
              <option value="">Selecione uma categoria</option>{categories.filter(c=>c.ativo).map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            {activeCategory?.usaTamanho && <input value={productForm.tamanhos||""} onChange={e=>setProductForm({...productForm,tamanhos:e.target.value})} placeholder="Tamanhos: P, M, G, GG" className="w-full p-2.5 rounded-xl border text-xs"/>}
            {activeCategory?.usaCor && <input value={productForm.cores||""} onChange={e=>setProductForm({...productForm,cores:e.target.value})} placeholder="Cores separadas por vírgula" className="w-full p-2.5 rounded-xl border text-xs"/>}
            {activeCategory?.usaVariacao && <input value={productForm.variacoes||""} onChange={e=>setProductForm({...productForm,variacoes:e.target.value})} placeholder="Variações separadas por vírgula" className="w-full p-2.5 rounded-xl border text-xs"/>}

            <div className="border rounded-2xl p-3 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold"><ImagePlus className="w-4 h-4"/> Imagem principal</div>
              <input value={productForm.imagem1||""} onChange={e=>setProductForm({...productForm,imagem1:e.target.value,imagem1FileId:""})} placeholder="Cole um link público (Imgur, web, Drive...)" className="w-full p-2.5 rounded-xl border text-xs"/>
              <div className="text-center text-[10px] text-neutral-400">ou</div>
              <label className="w-full py-2.5 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-bold cursor-pointer">
                <ImagePlus className="w-4 h-4"/>{imageUploading?"Enviando foto...":"Tirar foto / escolher imagem"}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e=>handleUploadImage(e.target.files?.[0])}/>
              </label>
              {productForm.imagem1 && <img src={productForm.imagem1} className="w-full h-40 object-contain rounded-xl bg-neutral-50"/>}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex gap-2 items-center p-2 border rounded-xl"><input type="checkbox" checked={productForm.disponivel} onChange={e=>setProductForm({...productForm,disponivel:e.target.checked})}/>Disponível</label>
              <label className="flex gap-2 items-center p-2 border rounded-xl"><input type="checkbox" checked={productForm.ativo} onChange={e=>setProductForm({...productForm,ativo:e.target.checked})}/>Ativo</label>
              {activeCategory?.permitePersonalizacao && <label className="flex gap-2 items-center p-2 border rounded-xl"><input type="checkbox" checked={productForm.personalizavel} onChange={e=>setProductForm({...productForm,personalizavel:e.target.checked})}/>Personalizável</label>}
            </div>
            <button onClick={handleSaveProduct} disabled={actionLoading||imageUploading} className="w-full py-3 bg-karate-red text-white rounded-xl text-xs font-bold">Salvar produto</button>
          </div>
        </div>
      )}
    </div>
  );
}
