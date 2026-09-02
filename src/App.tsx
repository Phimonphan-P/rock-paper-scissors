import { useState, useCallback } from 'react';
import { Hammer, ScrollText, Scissors, RotateCcw, User, Cpu, Sparkles, Trophy, Frown, Minus, Hash, Handshake } from 'lucide-react';

type Choice = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw' | null;

interface ChoiceConfig {
  value: Choice;
  label: string;
  icon: typeof Hammer;
  beats: Choice;
  gradient: string;
  glow: string;
  ring: string;
  text: string;
  solidBg: string;
}

const CHOICES: ChoiceConfig[] = [
  {
    value: 'rock',
    label: 'ค้อน',
    icon: Hammer,
    beats: 'scissors',
    gradient: 'from-rose-500 to-orange-500',
    glow: 'shadow-rose-500/50',
    ring: 'ring-rose-400',
    text: 'text-rose-300',
    solidBg: 'bg-rose-500',
  },
  {
    value: 'paper',
    label: 'กระดาษ',
    icon: ScrollText,
    beats: 'rock',
    gradient: 'from-sky-500 to-cyan-500',
    glow: 'shadow-sky-500/50',
    ring: 'ring-sky-400',
    text: 'text-sky-300',
    solidBg: 'bg-sky-500',
  },
  {
    value: 'scissors',
    label: 'กรรไกร',
    icon: Scissors,
    beats: 'paper',
    gradient: 'from-amber-500 to-yellow-500',
    glow: 'shadow-amber-500/50',
    ring: 'ring-amber-400',
    text: 'text-amber-300',
    solidBg: 'bg-amber-500',
  },
];

function getResult(player: Choice, computer: Choice): Result {
  if (player === computer) return 'draw';
  const playerChoice = CHOICES.find((c) => c.value === player)!;
  return playerChoice.beats === computer ? 'win' : 'lose';
}

const RESULT_TEXT: Record<Exclude<Result, null>, string> = {
  win: 'คุณชนะ!',
  lose: 'คุณแพ้!',
  draw: 'เสมอ!',
};

const RESULT_ICON: Record<Exclude<Result, null>, typeof Trophy> = {
  win: Trophy,
  lose: Frown,
  draw: Minus,
};

function getReasonText(player: Choice, computer: Choice, result: Exclude<Result, null>): string {
  if (result === 'draw') {
    const label = CHOICES.find((c) => c.value === player)!.label;
    return `ทั้งคู่เลือก ${label} เหมือนกัน`;
  }
  const winner = result === 'win' ? player : computer;
  const loser = result === 'win' ? computer : player;
  const winnerCfg = CHOICES.find((c) => c.value === winner)!;
  const loserCfg = CHOICES.find((c) => c.value === loser)!;
  return `${winnerCfg.label} ชนะ ${loserCfg.label}`;
}

export default function App() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [draws, setDraws] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(
    (choice: Choice) => {
      if (isPlaying) return;
      setIsPlaying(true);

      const computer = CHOICES[Math.floor(Math.random() * CHOICES.length)].value;
      const roundResult = getResult(choice, computer);

      setPlayerChoice(choice);
      setComputerChoice(computer);
      setResult(roundResult);
      setRounds((r) => r + 1);

      if (roundResult === 'win') setPlayerScore((s) => s + 1);
      else if (roundResult === 'lose') setComputerScore((s) => s + 1);
      else setDraws((d) => d + 1);

      setIsPlaying(false);
    },
    [isPlaying]
  );

  const reset = useCallback(() => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setPlayerScore(0);
    setComputerScore(0);
    setDraws(0);
    setRounds(0);
  }, []);

  const getChoiceConfig = (choice: Choice | null) => {
    if (!choice) return null;
    return CHOICES.find((c) => c.value === choice)!;
  };

  const playerCfg = getChoiceConfig(playerChoice);
  const computerCfg = getChoiceConfig(computerChoice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white flex flex-col items-center px-4 py-6 sm:py-10 overflow-x-hidden">
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg flex flex-col items-center">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider uppercase">
              Rock · Paper · Scissors
            </span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-sky-400 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
            เป่ายิ้งฉุบ
          </h1>
        </header>

        {/* Score Board */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3 mb-5 sm:mb-6">
          {/* Player score */}
          <div className="relative bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 border border-emerald-500/30 rounded-2xl p-3 sm:p-4 text-center overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 blur-xl" />
            <div className="relative">
              <div className="flex items-center justify-center gap-1.5 text-emerald-300/80 text-xs mb-1">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium">คุณ</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 drop-shadow">
                {playerScore}
              </div>
              <div className="text-[10px] sm:text-xs text-emerald-400/50 font-medium mt-0.5">ชนะ</div>
            </div>
          </div>

          {/* Computer score */}
          <div className="relative bg-gradient-to-br from-rose-600/20 to-rose-800/10 border border-rose-500/30 rounded-2xl p-3 sm:p-4 text-center overflow-hidden">
            <div className="absolute inset-0 bg-rose-500/5 blur-xl" />
            <div className="relative">
              <div className="flex items-center justify-center gap-1.5 text-rose-300/80 text-xs mb-1">
                <Cpu className="w-3.5 h-3.5" />
                <span className="font-medium">คอมฯ</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 drop-shadow">
                {computerScore}
              </div>
              <div className="text-[10px] sm:text-xs text-rose-400/50 font-medium mt-0.5">ชนะ</div>
            </div>
          </div>

          {/* Draws */}
          <div className="relative bg-gradient-to-br from-amber-600/20 to-amber-800/10 border border-amber-500/30 rounded-2xl p-3 sm:p-4 text-center overflow-hidden">
            <div className="absolute inset-0 bg-amber-500/5 blur-xl" />
            <div className="relative">
              <div className="flex items-center justify-center gap-1.5 text-amber-300/80 text-xs mb-1">
                <Handshake className="w-3.5 h-3.5" />
                <span className="font-medium">เสมอ</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 drop-shadow">
                {draws}
              </div>
              <div className="text-[10px] sm:text-xs text-amber-400/50 font-medium mt-0.5">รอบ</div>
            </div>
          </div>

          {/* Total rounds */}
          <div className="relative bg-gradient-to-br from-sky-600/20 to-sky-800/10 border border-sky-500/30 rounded-2xl p-3 sm:p-4 text-center overflow-hidden">
            <div className="absolute inset-0 bg-sky-500/5 blur-xl" />
            <div className="relative">
              <div className="flex items-center justify-center gap-1.5 text-sky-300/80 text-xs mb-1">
                <Hash className="w-3.5 h-3.5" />
                <span className="font-medium">รอบที่เล่น</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-400 drop-shadow">
                {rounds}
              </div>
              <div className="text-[10px] sm:text-xs text-sky-400/50 font-medium mt-0.5">ทั้งหมด</div>
            </div>
          </div>
        </div>

        {/* Battle Area */}
        <div className="w-full mb-5 sm:mb-6">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-start">
              {/* Player side */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <User className="w-4 h-4 text-emerald-400" />
                  <p className="text-emerald-300 text-xs sm:text-sm font-bold">คุณ</p>
                </div>
                <div
                  className={`mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                    playerCfg
                      ? `bg-gradient-to-br ${playerCfg.gradient} shadow-xl ${playerCfg.glow} scale-105`
                      : 'bg-white/5 border-2 border-dashed border-white/15'
                  }`}
                >
                  {playerCfg ? (
                    <playerCfg.icon className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow" strokeWidth={2.5} />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10" />
                  )}
                </div>
                {playerCfg ? (
                  <p className={`mt-3 text-base sm:text-lg font-bold ${playerCfg.text}`}>{playerCfg.label}</p>
                ) : (
                  <p className="mt-3 text-sm text-slate-600">รอเลือก...</p>
                )}
              </div>

              {/* VS divider */}
              <div className="flex flex-col items-center justify-center pt-10 sm:pt-14 px-1">
                <div className="text-slate-600 text-2xl sm:text-3xl font-black italic">VS</div>
              </div>

              {/* Computer side */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <Cpu className="w-4 h-4 text-rose-400" />
                  <p className="text-rose-300 text-xs sm:text-sm font-bold">คอมพิวเตอร์</p>
                </div>
                <div
                  className={`mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                    computerCfg
                      ? `bg-gradient-to-br ${computerCfg.gradient} shadow-xl ${computerCfg.glow} scale-105`
                      : 'bg-white/5 border-2 border-dashed border-white/15'
                  }`}
                >
                  {computerCfg ? (
                    <computerCfg.icon className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow" strokeWidth={2.5} />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10" />
                  )}
                </div>
                {computerCfg ? (
                  <p className={`mt-3 text-base sm:text-lg font-bold ${computerCfg.text}`}>{computerCfg.label}</p>
                ) : (
                  <p className="mt-3 text-sm text-slate-600">รอเลือก...</p>
                )}
              </div>
            </div>

            {/* Result Banner */}
            <div className="mt-6 sm:mt-7">
              {result ? (
                <div
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                    result === 'win'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-emerald-700/10 border-emerald-500/50'
                      : result === 'lose'
                        ? 'bg-gradient-to-r from-rose-600/30 to-rose-700/10 border-rose-500/50'
                        : 'bg-gradient-to-r from-amber-600/30 to-amber-700/10 border-amber-500/50'
                  }`}
                >
                  <div className="flex flex-col items-center py-4 sm:py-5 px-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const ResultIcon = RESULT_ICON[result];
                        return (
                          <ResultIcon
                            className={`w-7 h-7 sm:w-9 sm:h-9 ${
                              result === 'win'
                                ? 'text-emerald-400'
                                : result === 'lose'
                                  ? 'text-rose-400'
                                  : 'text-amber-400'
                            }`}
                            strokeWidth={2.5}
                          />
                        );
                      })()}
                      <p
                        className={`text-2xl sm:text-3xl font-black tracking-tight ${
                          result === 'win'
                            ? 'text-emerald-400'
                            : result === 'lose'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                        }`}
                      >
                        {RESULT_TEXT[result]}
                      </p>
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">
                      {getReasonText(playerChoice!, computerChoice!, result)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4 sm:py-5 rounded-2xl border border-white/10 bg-white/5 text-center">
                  <p className="text-base sm:text-lg font-semibold text-slate-400">
                    เลือกตัวเลือกของคุณเพื่อเริ่มเล่น
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Choice Buttons - big and colorful */}
        <div className="w-full mb-5 sm:mb-6">
          <p className="text-center text-slate-400 text-sm mb-3 sm:mb-4 font-medium">
            เลือกตัวเลือกของคุณ
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {CHOICES.map(({ value, label, icon: Icon, gradient, glow, ring }) => {
              const isActive = playerChoice === value;
              return (
                <button
                  key={value}
                  onClick={() => play(value)}
                  disabled={isPlaying}
                  className={`group relative flex flex-col items-center justify-center gap-2 sm:gap-3 py-5 sm:py-7 rounded-3xl transition-all duration-200 active:scale-95 disabled:opacity-60 overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-br ${gradient} shadow-xl ${glow} ring-2 ${ring} scale-105`
                      : 'bg-slate-800/60 border-2 border-white/10 hover:border-white/30 hover:bg-slate-700/60 hover:scale-105'
                  }`}
                >
                  <Icon
                    className={`w-10 h-10 sm:w-14 sm:h-14 transition-all duration-200 ${
                      isActive ? 'text-white drop-shadow-lg' : 'text-slate-300 group-hover:text-white'
                    }`}
                    strokeWidth={2.5}
                  />
                  <span
                    className={`text-base sm:text-lg font-bold ${
                      isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-800 border border-white/10 text-slate-200 text-sm font-semibold hover:from-slate-600 hover:to-slate-700 hover:text-white transition-all duration-200 active:scale-95 shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          เริ่มเกมใหม่ / รีเซ็ตคะแนน
        </button>

        {/* How to Play */}
        <div className="w-full mt-6 sm:mt-8">
          <div className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5">
            <h2 className="text-slate-200 text-sm font-bold mb-3 text-center">วิธีเล่น</h2>
            <ul className="space-y-2.5 text-slate-400 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>เลือก ค้อน กระดาษ หรือกรรไกร โดยกดปุ่มด้านบน</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>คอมพิวเตอร์จะสุ่มเลือกตัวเลือกของมัน</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span>ค้อน ชนะ กรรไกร · กรรไกร ชนะ กระดาษ · กระดาษ ชนะ ค้อน</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <span>เล่นได้เรื่อยๆ โดยเลือกตัวเลือกใหม่ หรือกดรีเซ็ตเพื่อเริ่มใหม่</span>
              </li>
            </ul>
          </div>
        </div>

        <footer className="mt-6 text-slate-600 text-xs">เป่ายิ้งฉุบ · Rock Paper Scissors</footer>
      </div>
    </div>
  );
}
