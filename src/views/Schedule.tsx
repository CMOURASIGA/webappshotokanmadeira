import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ClassSession = {
  name: string;
  desc?: string;
  bg: string;
};

type ScheduleRow = {
  time: string;
  mon?: ClassSession;
  tue?: ClassSession;
  wed?: ClassSession;
  thu?: ClassSession;
  fri?: ClassSession;
  sat?: ClassSession;
};

const scheduleData: ScheduleRow[] = [
  {
    time: "07:00",
    mon: { name: "Karate", desc: "(Iniciante/Fundamentos)", bg: "bg-white text-black" },
    wed: { name: "Karate", desc: "(Iniciante/Fundamentos)", bg: "bg-white text-black" },
    fri: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
  },
  {
    time: "07:30",
    tue: { name: "Jiu-Jitsu", desc: "(A partir dos 14 anos)", bg: "bg-[#d670d6] text-black" },
    thu: { name: "Jiu-Jitsu", desc: "(A partir dos 14 anos)", bg: "bg-[#d670d6] text-black" },
  },
  {
    time: "08:00",
    mon: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    tue: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    wed: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    thu: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    fri: { name: "MADEIRA TOTAL", desc: "EXPERIENCE", bg: "bg-black text-white" },
  },
  {
    time: "09:00",
    mon: { name: "Karate Kids", desc: "(04 a 09 anos)", bg: "bg-[#ffd54f] text-black" },
    tue: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
    wed: { name: "Karate Kids", desc: "(04 a 09 anos)", bg: "bg-[#ffd54f] text-black" },
    thu: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
    fri: { name: "Karate", desc: "(Feminino)", bg: "bg-[#f054ba] text-white" },
    sat: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
  },
  {
    time: "10:00",
    mon: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
    wed: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
  },
  {
    time: "15:00",
    tue: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    thu: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
  },
  {
    time: "16:00",
    mon: { name: "Karate", desc: "(10 a 14 anos)", bg: "bg-[#5fa2f0] text-black" },
    tue: { name: "Karate", desc: "(10 a 14 anos)", bg: "bg-[#5fa2f0] text-black" },
    wed: { name: "Karate", desc: "(10 a 14 anos)", bg: "bg-[#5fa2f0] text-black" },
    thu: { name: "Karate", desc: "(10 a 14 anos)", bg: "bg-[#5fa2f0] text-black" },
    fri: { name: "Karate", desc: "(10 a 14 anos)", bg: "bg-[#5fa2f0] text-black" },
  },
  {
    time: "17:00",
    mon: { name: "Yoga", desc: "", bg: "bg-[#ff5555] text-black" },
    wed: { name: "Yoga", desc: "", bg: "bg-[#ff5555] text-black" },
    fri: { name: "Yoga", desc: "", bg: "bg-[#ff5555] text-black" },
  },
  {
    time: "17:30",
    tue: { name: "Karate Baby", desc: "(2 a 4 anos)", bg: "bg-[#1c00c7] text-white" },
    thu: { name: "Karate Baby", desc: "(2 a 4 anos)", bg: "bg-[#1c00c7] text-white" },
  },
  {
    time: "18:00",
    mon: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
    wed: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
    fri: { name: "Karate", desc: "(Kata)", bg: "bg-[#00c957] text-black" },
  },
  {
    time: "18:30",
    tue: { name: "Karate Kids", desc: "(04 a 09 anos)", bg: "bg-[#ffd54f] text-black" },
    thu: { name: "Karate Kids", desc: "(04 a 09 anos)", bg: "bg-[#ffd54f] text-black" },
  },
  {
    time: "19:00",
    mon: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    wed: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    fri: { name: "MADEIRA TOTAL", desc: "EXPERIENCE", bg: "bg-black text-white" },
  },
  {
    time: "19:30",
    tue: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    thu: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
  },
  {
    time: "20:00",
    mon: { name: "Aikidô", desc: "", bg: "bg-[#c2c2c2] text-black" },
    wed: { name: "Aikidô", desc: "", bg: "bg-[#c2c2c2] text-black" },
  },
  {
    time: "20:30",
    tue: { name: "Jiu-Jitsu", desc: "(A partir dos 14 anos)", bg: "bg-[#d670d6] text-black" },
    thu: { name: "Jiu-Jitsu", desc: "(A partir dos 14 anos)", bg: "bg-[#d670d6] text-black" },
  },
  {
    time: "21:00",
    mon: { name: "Judô Adulto", desc: "", bg: "bg-[#a652ff] text-white" },
    wed: { name: "Judô Adulto", desc: "", bg: "bg-[#a652ff] text-white" },
  }
];

function ClassCell({ session }: { session?: ClassSession }) {
  if (!session) {
    return <td className="border border-[#333333] bg-[#484848] p-2 min-w-[120px] h-20"></td>;
  }
  return (
    <td className={`border border-[#333333] p-2 text-center text-xs font-bold leading-tight min-w-[120px] h-20 ${session.bg}`}>
      <div className="flex flex-col items-center justify-center h-full">
        <span>{session.name}</span>
        {session.desc && <span className="text-[10px] font-normal mt-1">{session.desc}</span>}
      </div>
    </td>
  );
}

export function Schedule() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-jp flex items-center gap-3">
            <Calendar className="w-8 h-8 text-karate-red" /> Grade de Horários
          </h2>
          <p className="text-neutral-500 mt-2">Confira as turmas e horários disponíveis na Madeira Artes Marciais</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3 w-20 sticky left-0 z-10">HORÁRIO</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3">SEGUNDA</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3">TERÇA</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3">QUARTA</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3">QUINTA</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3">SEXTA</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3">SÁBADO</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((row, idx) => (
                <tr key={idx}>
                  <td className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3 text-center sticky left-0 z-10">{row.time}</td>
                  <ClassCell session={row.mon} />
                  <ClassCell session={row.tue} />
                  <ClassCell session={row.wed} />
                  <ClassCell session={row.thu} />
                  <ClassCell session={row.fri} />
                  <ClassCell session={row.sat} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="https://i.imgur.com/FFeA342.png" alt="Madeira Artes Marciais Logo" className="w-16 h-16 object-contain" />
            <div>
              <p className="font-bold text-lg">Madeira Artes Marciais</p>
              <p className="text-sm text-neutral-600">INFORMAÇÕES: 21 97368-1109</p>
              <p className="text-sm text-neutral-600">@madeiraartesmarciais</p>
            </div>
          </div>
          <div className="text-xs text-neutral-500 italic">
            * PLANOS NA RECEPÇÃO.
          </div>
        </div>
      </div>
    </div>
  );
}
