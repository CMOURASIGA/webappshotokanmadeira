import { BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function History() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">História do Shotokan</h2>
        <p className="text-neutral-500 text-lg">A origem da escola de Mestre Gichin Funakoshi</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-8 md:p-12">
        <div className="space-y-8 text-neutral-700 leading-relaxed text-lg">
          
          <section>
            <h3 className="text-2xl font-bold font-jp text-karate-black mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-karate-red rounded-sm inline-block"></span>
              O Mestre Gichin Funakoshi
            </h3>
            <p className="mb-4">
              O estilo Shotokan foi fundado pelo Mestre <strong>Gichin Funakoshi</strong> (1868–1957), 
              amplamente considerado o "Pai do Karate Moderno". Nascido em Okinawa, berço da arte marcial, 
              ele treinou sob a tutela de dois lendários mestres locais: Yasutsune Azato e Yasutsune Itosu.
            </p>
            <p>
              Funakoshi unificou as técnicas rudes de Okinawa (Tode/Okinawa-te) e as transformou 
              em um sistema educacional, focando não apenas na autodefesa, mas principalmente no 
              desenvolvimento espiritual e moral (o conceito de "Do", o Caminho).
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold font-jp text-karate-black mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#C8A24A] rounded-sm inline-block"></span>
              O Significado de "Shotokan"
            </h3>
            <p className="mb-4">
              A palavra <strong>Shotokan</strong> (松濤館) é composta por três caracteres:
            </p>
            <ul className="space-y-3 bg-neutral-50 p-6 rounded-xl border border-neutral-100 my-4">
              <li className="flex gap-3">
                <span className="font-bold text-karate-red min-w-[60px]">Sho (松)</span>
                <span>Significa "pinheiro".</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-karate-red min-w-[60px]">To (濤)</span>
                <span>Significa "onda" ou "vento".</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-karate-red min-w-[60px]">Kan (館)</span>
                <span>Significa "casa", "edifício" ou "salão".</span>
              </li>
            </ul>
            <p>
              <strong>"Shoto"</strong> era o pseudônimo literário que Funakoshi usava para assinar seus poemas. 
              Referia-se ao som do vento soprando através das copas dos pinheiros. Portanto, 
              <em>Shotokan</em> significa "A Casa de Shoto", que foi o nome dado pelos seus alunos 
              ao primeiro Dojo oficial construído em Tóquio, em 1936.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold font-jp text-karate-black mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#111111] rounded-sm inline-block"></span>
              A Expansão e o Legado
            </h3>
            <p className="mb-4">
              Em 1922, Funakoshi foi convidado para demonstrar o Karate no Japão continental. 
              Sua demonstração foi um sucesso estrondoso, e ele decidiu permanecer em Tóquio 
              para ensinar. 
            </p>
            <p>
              O estilo se caracterizou por bases fortes e alongadas (como Zenkutsu Dachi) e 
              movimentos amplos e potentes, ideais para o fortalecimento físico dos iniciantes. 
              Mais tarde, a <strong>JKA (Japan Karate Association)</strong> foi fundada por seus 
              discípulos (com Funakoshi como instrutor chefe honorário) para espalhar o Shotokan 
              pelo mundo, estabelecendo-o como o estilo de Karate mais praticado globalmente.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
