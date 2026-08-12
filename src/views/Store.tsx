import { useState } from "react";
import { ArrowLeft, Check, Copy, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppData, Product } from "../contexts/AppDataContext";

export function Store() {
  const navigate = useNavigate();
  const [copiedKey, setCopiedKey] = useState(false);
  
  const { products, config, loading } = useAppData();
  const pixKey = config.pix;

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (loading) {
    return <div className="p-8 text-center text-neutral-500">Carregando loja...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto w-full">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-8 h-8 text-karate-red" />
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Loja</h1>
        </div>
        <p className="text-neutral-600 max-w-2xl">
          Adquira os produtos oficiais da Madeira Karate Shotokan. Mostre o seu orgulho pela nossa equipe.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4">Como Comprar?</h2>
        <ol className="list-decimal list-inside space-y-3 text-neutral-700 mb-6">
          <li>Escolha o produto que deseja adquirir.</li>
          <li>Realize o pagamento via PIX utilizando a chave abaixo, no valor correspondente.</li>
          <li>Envie o comprovante de pagamento junto com o <strong>tamanho desejado</strong> e <strong>modelo da camisa</strong> para o nosso WhatsApp.</li>
          <li>A retirada do produto será combinada diretamente com a equipe.</li>
        </ol>

        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg text-neutral-900">Pagamento via PIX</p>
            <p className="text-sm text-neutral-600">Copie a chave para realizar o pagamento no seu banco.</p>
          </div>
          <button
            onClick={copyPixKey}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold transition-all w-full md:w-auto shrink-0
              ${copiedKey 
                ? 'bg-[#25D366] text-white' 
                : 'bg-karate-red text-white hover:bg-karate-red/90'
              }`}
          >
            {copiedKey ? (
              <>
                <Check className="w-5 h-5" />
                Chave Copiada!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copiar Chave PIX
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} whatsapp={config.whatsapp} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, whatsapp }: { product: Product, whatsapp: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden group flex flex-col">
      <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden">
        <img 
          src={product.images[currentImageIndex] || undefined} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full shadow-sm transition-all ${
                  currentImageIndex === idx ? 'bg-karate-red w-6' : 'bg-white/80 hover:bg-white'
                }`}
                aria-label={`Ver imagem ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-bold text-lg leading-tight text-neutral-900">{product.name}</h3>
          <span className="font-bold text-lg text-karate-red shrink-0">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <p className="text-sm text-neutral-600 flex-1">{product.description}</p>
        
        <a 
          href={`https://wa.me/${whatsapp}?text=Olá!%20Gostaria%20de%20comprar%20a%20${encodeURIComponent(product.name)}.%20Segue%20meu%20comprovante%20PIX.`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full py-3 px-4 bg-neutral-900 hover:bg-black text-white text-center font-bold rounded-xl transition-colors"
        >
          Enviar Comprovante
        </a>
      </div>
    </div>
  );
}
