import { Shield, ArrowLeft, Book, ScrollText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function DojoKun() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dojokun" | "nijukun" | "reigi">("dojokun");

  const dojoKun = [
    { jp: "一、人格完成に努むること", romaji: "Hitotsu! Jinkaku kansei ni tsutomuru koto.", pt: "Esforçar-se para a formação do caráter." },
    { jp: "一、誠の道を守ること", romaji: "Hitotsu! Makoto no michi o mamoru koto.", pt: "Fidelidade para com o verdadeiro caminho da razão." },
    { jp: "一、努力の精神を養うこと", romaji: "Hitotsu! Doryoku no seishin o yashinau koto.", pt: "Criar o intuito de esforço." },
    { jp: "一、礼儀を重んずること", romaji: "Hitotsu! Reigi o omonzuru koto.", pt: "Respeito acima de tudo." },
    { jp: "一、血気の勇を戒むること", romaji: "Hitotsu! Kekki no yu o imashimuru koto.", pt: "Conter o espírito de agressão." }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">Princípios e Rituais</h2>
        <p className="text-neutral-500 text-lg">A filosofia que guia o Karate-Do JKA</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center bg-white p-2 rounded-2xl shadow-sm border border-neutral-100">
        <button
          onClick={() => setActiveTab("dojokun")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === "dojokun" 
              ? "bg-karate-red text-white shadow-md" 
              : "text-neutral-500 hover:bg-neutral-50 hover:text-karate-black"
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Dojo Kun</span>
        </button>
        <button
          onClick={() => setActiveTab("nijukun")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === "nijukun" 
              ? "bg-karate-red text-white shadow-md" 
              : "text-neutral-500 hover:bg-neutral-50 hover:text-karate-black"
          }`}
        >
          <ScrollText className="w-5 h-5" />
          <span>Niju Kun</span>
        </button>
        <button
          onClick={() => setActiveTab("reigi")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === "reigi" 
              ? "bg-karate-red text-white shadow-md" 
              : "text-neutral-500 hover:bg-neutral-50 hover:text-karate-black"
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Reigi (Etiqueta)</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-8 md:p-12 min-h-[500px]">
        {activeTab === "dojokun" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-karate-red rounded-full flex items-center justify-center text-white shadow-lg shadow-karate-red/20">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            
            <p className="text-neutral-700 leading-relaxed text-lg mb-12 text-center max-w-2xl mx-auto">
              O Dojo Kun é o conjunto de regras e princípios que norteiam a prática do Karate-Do. 
              Criado pelo Mestre Gichin Funakoshi, ele não é apenas recitado ao final de cada treino, 
              mas deve ser vivido e aplicado no dia a dia do praticante.
            </p>

            <div className="space-y-8">
              {dojoKun.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left bg-neutral-50 p-6 rounded-xl border border-neutral-100 transition-all hover:shadow-md hover:border-karate-red/30">
                  <div className="text-4xl font-serif text-karate-red font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-2xl font-bold font-jp text-karate-black">{item.jp}</p>
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{item.romaji}</p>
                    <p className="text-lg text-neutral-700 italic border-t border-neutral-200 pt-2 mt-2">"{item.pt}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nijukun" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-jp">Niju Kun</h2>
              <p className="text-neutral-500 text-lg">Os 20 Preceitos de Gichin Funakoshi (Seleção)</p>
            </div>
            <div className="space-y-6">
              {[
                { jp: "空手道は礼に始まり礼に終る事を忘るな", romaji: "Karatedo wa rei ni hajimari, rei ni owaru koto o wasuruna.", pt: "O Karate começa e termina com respeito." },
                { jp: "空手に先手なし", romaji: "Karate ni sente nashi.", pt: "No Karate não existe atitude ofensiva." },
                { jp: "空手は義の補け", romaji: "Karate wa gi no tasuke.", pt: "O Karate é um assistente da justiça." },
                { jp: "先づ自己を知れ而して他を知れ", romaji: "Mazu jiko o shire, shikoshite ta o shire.", pt: "Conheça primeiro a si mesmo e depois aos outros." },
                { jp: "技術より心術", romaji: "Gijutsu yori shinjutsu.", pt: "O espírito (mente) é mais importante que a técnica." }
              ].map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left bg-neutral-50 p-6 rounded-xl border border-neutral-100 transition-all hover:shadow-md hover:border-karate-red/30">
                  <div className="text-2xl font-serif text-karate-red font-bold min-w-[32px]">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xl font-bold font-jp text-karate-black">{item.jp}</p>
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{item.romaji}</p>
                    <p className="text-lg text-neutral-700 italic border-t border-neutral-200 pt-2 mt-2">"{item.pt}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reigi" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-jp">Reigi (Etiqueta)</h2>
              <p className="text-neutral-500 text-lg">Rituais e o comportamento dentro do Dojo</p>
            </div>
            
            <div className="space-y-8">
              <section>
                <h3 className="text-2xl font-bold font-jp mb-4 text-karate-black border-b border-neutral-100 pb-2">Seiza & Mokuso</h3>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  <strong>Seiza (Sentar-se corretamente):</strong> É a postura formal japonesa. Ajoelhe-se primeiro com a perna esquerda e depois com a direita. Sente-se sobre os calcanhares, mantendo as costas eretas, ombros relaxados e os punhos levemente repousados sobre as coxas.
                </p>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  <strong>Mokuso (Meditação):</strong> Realizado no início e no fim do treino. Ao comando de "Mokuso", feche os olhos, respire profundamente pelo abdômen e esvazie a mente das distrações do dia a dia. É o momento de transição entre o mundo lá fora e o Dojo.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-bold font-jp mb-4 text-karate-black border-b border-neutral-100 pb-2">Os Cumprimentos (Rei)</h3>
                <ul className="space-y-4">
                  <li className="flex gap-4 items-start">
                    <span className="font-bold text-karate-red w-32 shrink-0">Shomen ni Rei:</span>
                    <span className="text-neutral-700">Cumprimento à frente do Dojo (honrando os mestres do passado e a tradição).</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="font-bold text-karate-red w-32 shrink-0">Sensei ni Rei:</span>
                    <span className="text-neutral-700">Cumprimento ao mestre que está conduzindo a aula.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="font-bold text-karate-red w-32 shrink-0">Otagai ni Rei:</span>
                    <span className="text-neutral-700">Cumprimento mútuo entre os praticantes, demonstrando respeito mútuo (Osu).</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-bold font-jp mb-4 text-karate-black border-b border-neutral-100 pb-2">Como amarrar a faixa (Obi)</h3>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  Amarrar a faixa corretamente é o primeiro passo de disciplina antes de entrar no tatame. O nó deve ficar firme e as duas pontas (representando o equilíbrio entre corpo e mente) devem ter o mesmo tamanho.
                </p>
                <div className="aspect-video w-full md:w-3/4 mx-auto rounded-2xl overflow-hidden shadow-sm border border-neutral-100 bg-karate-black">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/DE1YlRfdOSg" 
                    title="Como amarrar a faixa de Karate"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold font-jp mb-4 text-karate-black border-b border-neutral-100 pb-2">O significado de "Osu"</h3>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  A palavra "Osu" (pronuncia-se "Oss") é formada por dois kanjis: <strong>Oshi</strong> (pressionar) e <strong>Shinobu</strong> (suportar/paciência). Ela representa a perseverança, a determinação em superar seus próprios limites e o respeito pelos colegas. Pode ser usada como cumprimento, resposta afirmativa ou demonstração de força de vontade durante o treino.
                </p>
              </section>
              
              <section className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 mt-8">
                <h3 className="text-xl font-bold font-jp mb-2 text-karate-black">Regras de Ouro</h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-700 text-sm">
                  <li>Sempre cumprimente ao entrar e sair do tatame (Dojo).</li>
                  <li>Mantenha seu Dogi (kimono) limpo e as unhas curtas.</li>
                  <li>Não converse durante as explicações do Sensei.</li>
                  <li>Nunca use os conhecimentos do Karate de forma leviana fora do Dojo.</li>
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
