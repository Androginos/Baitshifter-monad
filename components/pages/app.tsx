"use client";
import { useState, useEffect } from "react";
import { WalletActions } from "@/components/Home/WalletActions";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { useWriteContract } from "wagmi";
import { monadTestnet } from "viem/chains";
import abi from "@/contracts/BaitshiftersABI.json";
import { sdk } from '@farcaster/frame-sdk';
import AddFrameButton from "@/components/AddFrameButton";

// Doğru ve yanlış önermeler (id ile)
type Statement = { id: number; text: string };
const TRUE_STATEMENTS: Statement[] = [
  { id: 1, text: "Monad is Ethereum-compatible." },
  { id: 2, text: "Monad supports EIP-1559." },
  { id: 3, text: "TPS is 10,000." },
  { id: 4, text: "Finality is 1 second." },
  { id: 5, text: "Monad uses Proof-of-Stake." },
  { id: 6, text: "MonadBFT is based on HotStuff." },
  { id: 7, text: "MetaMask works with Monad." },
  { id: 8, text: "Typed transactions are supported." },
  { id: 9, text: "Gas auction decides order." },
  { id: 10, text: "Transactions are ordered." },
  { id: 11, text: "Contract limit is 128 KB." },
  { id: 12, text: "Parallel execution exists." },
  { id: 13, text: "Consensus and execution are pipelined." },
  { id: 14, text: "MonadDb is SSD-optimized." },
  { id: 15, text: "EVM Cancun opcodes are supported." },
  { id: 16, text: "Staking delegation is allowed." },
  { id: 17, text: "Base fee is 50 gwei on testnet." },
  { id: 18, text: "Uses RLP encoding." },
  { id: 19, text: "Addresses are ECDSA-based." },
  { id: 20, text: "Ethereum RPC works." },
  { id: 21, text: "Blocks contain transaction hashes." },
  { id: 22, text: "Leaders maintain mempools." },
  { id: 23, text: "Consensus is 2-phase BFT." },
  { id: 24, text: "Gas fee = gas limit × price (testnet)." },
  { id: 25, text: "Monad supports Ethereum tools like Foundry and Hardhat." },
  { id: 26, text: "Monad aims for <1s finality at scale." },
  { id: 27, text: "Monad testnet rewards are not guaranteed." },
  { id: 28, text: "Monad prioritizes dev UX (e.g. familiar RPC & tooling)." },
  { id: 29, text: "Mempools forward transactions to next 3 leaders." },
  { id: 30, text: "MonadDB is optimized for SSD, not HDD." },
  { id: 31, text: "Blocks contain tx hashes, not full tx bodies." },
  { id: 32, text: "Monad validators require 32 GB RAM." },
  { id: 33, text: "Monad community hosts weekly dev calls." },
  { id: 34, text: "Parallelism doesn't break EVM compatibility." },
  { id: 35, text: "Monad uses pipelined consensus and pipelined execution." },
  { id: 36, text: "Monad is bytecode-equivalent to Ethereum." },
  { id: 37, text: "Monad nodes use ECDSA, not BLS signatures." },
];
const FALSE_STATEMENTS: Statement[] = [
  { id: 101, text: "Monad uses Proof-of-Work." },
  { id: 102, text: "EIP-4844 is supported." },
  { id: 103, text: "Execution comes before consensus." },
  { id: 104, text: "Transactions are unordered." },
  { id: 105, text: "MetaMask is unsupported." },
  { id: 106, text: "Finality is 15 minutes." },
  { id: 107, text: "Gas usage defines fee on testnet." },
  { id: 108, text: "Only serial execution works." },
  { id: 109, text: "Contract size limit is 24 KB." },
  { id: 110, text: "Uses Ethereum's Gasper." },
  { id: 111, text: "Random transaction commit." },
  { id: 112, text: "Delegation is blocked." },
  { id: 113, text: "Only legacy txs work." },
  { id: 114, text: "Special wallet is needed." },
  { id: 115, text: "Uses hard drives." },
  { id: 116, text: "No mempools in Monad." },
  { id: 117, text: "Ethereum RPC is incompatible." },
  { id: 118, text: "Execution = consensus." },
  { id: 119, text: "4 GB RAM is enough." },
  { id: 120, text: "Manual double execution needed." },
  { id: 121, text: "No smart contract support." },
  { id: 122, text: "No parallel execution." },
  { id: 123, text: "Blocks every 12 sec." },
  { id: 124, text: "Balance isn't checked." },
  { id: 125, text: "Monad airdrop is confirmed (❌ as of now)." },
  { id: 126, text: "Monad uses ZK-proofs for finality." },
  { id: 127, text: "Validators need 8 GB RAM." },
  { id: 128, text: "Monad is built on Cosmos SDK." },
  { id: 129, text: "Monad testnet uses EIP-4844 blobs." },
  { id: 130, text: "Monad is a Layer-2 rollup." },
  { id: 131, text: "Monad executes before consensus." },
  { id: 132, text: "Monad uses MEV auctions for ordering." },
  { id: 133, text: "Monad supports Solana smart contracts." },
  { id: 134, text: "You can run a node on Raspberry Pi." },
  { id: 135, text: "Monad is forked from Avalanche." },
  { id: 136, text: "Monad gas fees are always zero." },
  { id: 137, text: "Monad blocks are DAG-based." },
  { id: 138, text: "Monad only supports Phantom wallet." },
  { id: 139, text: "Monad breaks Ethereum bytecode." },
  { id: 140, text: "Monad finality depends on execution success." },
];

// Renk paleti (mat ve kaliteli)
const COLOR_PALETTE: string[] = [
  "#A0055D", // ana renk
  "#836EF9", // ana renk
  "#200052", // ana renk
  "#F7B267", // mat turuncu
  "#F4845F", // mat mercan
  "#3C3C3C", // koyu mat gri
  "#B2B1B9", // açık mat gri
];

// Eğlenceli default nicknameler
const DEFAULT_NICKNAMES = [
  "MonadMaster",
  "BaitHunter",
  "CryptoNinja",
  "BlockchainBoss",
  "Web3Warrior",
  "SmartContractSamurai",
  "DeFiDragon",
  "NFTNinja",
  "CryptoCrusader",
  "BlockchainBandit",
  "Web3Wizard",
  "DeFiDaredevil",
  "SmartContractSorcerer",
  "NFTKnight",
  "CryptoChampion",
  "BlockchainBaron",
  "Web3Wanderer",
  "DeFiDynamo",
  "SmartContractSage",
  "NFTNomad"
];

function getRandomNickname(): string {
  return DEFAULT_NICKNAMES[Math.floor(Math.random() * DEFAULT_NICKNAMES.length)];
}

function shuffle<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomStatements(prevIds: number[] = []): { all: Statement[]; trueId: number } {
  // Önce kullanılmayanlardan seç, çok sık tekrar olmasın
  const availableTrue = TRUE_STATEMENTS.filter(s => !prevIds.includes(s.id));
  const availableFalse = FALSE_STATEMENTS.filter(s => !prevIds.includes(s.id));
  const trueStatement = availableTrue.length > 0
    ? availableTrue[Math.floor(Math.random() * availableTrue.length)]
    : TRUE_STATEMENTS[Math.floor(Math.random() * TRUE_STATEMENTS.length)];
  const falseStatements = shuffle(availableFalse).slice(0, 3);
  const all = shuffle([trueStatement, ...falseStatements]);
  return { all, trueId: trueStatement.id };
}

type FlashType = 'success' | 'fail' | null;

// Level'a göre süre ayarlanacak (saniye cinsinden)
const getLevelTime = (level: number) => {
  return Math.max(0.5, 2 - (level - 1) * 0.2);
};

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [flash, setFlash] = useState<FlashType>(null); // 'success' | 'fail' | null
  const [prevIds, setPrevIds] = useState<number[]>([]); // Son çıkan önerme id'leri
  const [statements, setStatements] = useState<{ all: Statement[]; trueId: number }>(() => getRandomStatements([]));
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { context, actions } = useMiniAppContext();
  const isFrame = !!context;
  // Warpcast username'i veya Testoor
  const username = context?.user?.username || "Testoor";
  // Kullanıcı profil resmi (Warpcast pfpUrl)
  const userPfp = context?.user?.pfpUrl || null;
  // Level state
  const [level, setLevel] = useState<number>(1);
  // Boss görseli ve label'ı level'a göre
  const bossImage =
    level <= 2 ? "/images/boss/L1boss.png"
    : level <= 4 ? "/images/boss/L3boss.png"
    : level <= 6 ? "/images/boss/L5boss.png"
    : "/images/boss/L7boss.png";
  const bossLabel = `Level ${level}`;
  // Boss canı level'a göre
  const bossMaxHealthByLevel = [0, 50, 50, 70, 70, 90, 90, 110]; // 1-2:50, 3-4:70, 5-6:90, 7:110
  const bossMaxHealth = bossMaxHealthByLevel[level] || 50;
  const [bossHealth, setBossHealth] = useState<number>(bossMaxHealth);
  // Doğru cevap sayısı (level ilerlemesi için)
  const [correctCount, setCorrectCount] = useState<number>(0);
  // Oyun sonu state
  const [gameWon, setGameWon] = useState<boolean>(false);
  // Oyun state'leri
  const [score, setScore] = useState<number>(0);
  const [brain, setBrain] = useState<number>(100);
  // Karakter görseli level'a göre
  const characterImage = `/images/level${level}.png`;
  const characterMaxHealth = 100;
  const characterHealth = 100; // Şimdilik sabit

  // Her level için gereken doğru cevap sayısı: 5 + (level-1)*2
  const requiredCorrect = 5 + (level - 1) * 2;

  // Level'a göre süre ayarlanacak (saniye cinsinden)
  const [levelTime, setLevelTime] = useState<number>(getLevelTime(level));
  const [showQuestionMarks, setShowQuestionMarks] = useState<boolean>(false);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const { data: txHash, isPending: isTxPending, writeContract } = useWriteContract();
  const [txSent, setTxSent] = useState(false);

  // Arka plan boyutlarını belirle
  const getBackgroundSize = () => {
    if (isFrame) {
      return { width: '1200px', minHeight: '100vh' }; // Warpcast frame için minHeight
    }
    return { width: '600px', height: '1000px' }; // Vercel'de orta boy sabit yükseklik
  };

  const backgroundSize = getBackgroundSize();

  // Arka plan komponenti
  const BackgroundImage = () => (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center z-0">
      <div className="relative" style={{ 
        width: backgroundSize.width, 
        ...(isFrame ? { minHeight: '100vh' } : { height: backgroundSize.height })
      }}>
        <img
          src="/images/baitshifter-main.png"
          alt="Baitshifter Main Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
        />
      </div>
    </div>
  );

  // Oyun başladığında zamanı başlat
  useEffect(() => {
    if (gameStarted) {
      setStartTime(Date.now());
      setEndTime(null);
    }
  }, [gameStarted]);

  // Brain biterse oyun sonu
  useEffect(() => {
    if (brain <= 0 && gameStarted && !gameOver && !gameWon) {
      setGameOver(true);
      setEndTime(Date.now());
    }
  }, [brain, gameStarted, gameOver, gameWon]);

  // Oyun kazanılırsa zamanı kaydet
  useEffect(() => {
    if (gameWon && !endTime) {
      setEndTime(Date.now());
    }
  }, [gameWon, endTime]);

  useEffect(() => {
    if (isFirstQuestion) {
      setShowQuestionMarks(false);
      return;
    }
    setLevelTime(getLevelTime(level));
    setShowQuestionMarks(false);
    const timer = setTimeout(() => {
      setShowQuestionMarks(true);
    }, levelTime * 1000);
    return () => clearTimeout(timer);
  }, [level, statements, isFirstQuestion]);

  function handleBoxClick(id: number) {
    if (flash || gameWon) return;
    setSelectedId(id);
    setIsFirstQuestion(false); // Artık ilk soru değil
    if (id === statements.trueId) {
      setFlash('success');
      setScore((prev: number) => prev + 10);
      setBossHealth((prev: number) => prev - Math.floor(bossMaxHealth / requiredCorrect));
      setCorrectCount((prev: number) => prev + 1);
      setTimeout(() => {
        // Boss öldü mü veya yeterli doğru cevap verildi mi?
        if (bossHealth - Math.floor(bossMaxHealth / requiredCorrect) <= 0 || correctCount + 1 >= requiredCorrect) {
          if (level === 7) {
            setScore((prev: number) => prev + 50); // Ekstra puan
            setGameWon(true);
            return;
          } else {
            setLevel((prev: number) => prev + 1);
            setBossHealth(bossMaxHealthByLevel[level + 1] || 50);
            setCorrectCount(0);
          }
        }
        setFlash(null);
        setSelectedId(null);
        setPrevIds(prev => [id, ...prev].slice(0, 8));
        setStatements(getRandomStatements([id, ...prevIds].slice(0, 8)));
      }, 800);
    } else {
      setFlash('fail');
      setBrain((prev: number) => Math.max(0, prev - 10));
      setTimeout(() => {
        setFlash(null);
        setSelectedId(null);
        setPrevIds(prev => [id, ...prev].slice(0, 8));
        setStatements(getRandomStatements([id, ...prevIds].slice(0, 8)));
      }, 800);
    }
  }

  function getElapsedTime() {
    if (!startTime) return '0:00';
    const end = endTime || Date.now();
    const totalSec = Math.floor((end - startTime) / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  function handlePlayAgain() {
    setGameStarted(true);
    setLevel(1);
    setScore(0);
    setBrain(100);
    setBossHealth(bossMaxHealthByLevel[1]);
    setGameWon(false);
    setGameOver(false);
    setCorrectCount(0);
    setPrevIds([]);
    setStatements(getRandomStatements([]));
    setIsFirstQuestion(true);
    setStartTime(Date.now());
    setEndTime(null);
  }

  async function handleCastMyScore() {
    if (!actions) return;
    const text = `I reached ${score} points and Level ${level} in the Baitshifters game! 🚀\n#monad #baitshifters`;
    await actions.composeCast({
      text,
      embeds: [],
    });
  }

  function handleSendScoreToContract() {
    if (!context?.user) return;
    writeContract({
      address: "0x0fbb981599fb6b1018bae5488838101f4f5fd3c5",
      abi,
      functionName: "submitScore",
      args: [
        context.user.displayName || "",
        context.user.username || "",
        Number(context.user.fid),
        score,
      ],
      chainId: monadTestnet.id,
    });
    setTxSent(true);
  }

  if (gameStarted && (gameOver || gameWon)) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center" style={{ backgroundColor: "#200052" }}>
        {/* Sol üstte modern, küçük, opak ok butonu */}
        <button
          className="absolute top-4 left-4 flex items-center justify-center w-9 h-9 rounded-full shadow-md z-20"
          style={{ background: "rgba(160,5,93,0.7)" }}
          onClick={() => setGameStarted(false)}
          aria-label="Return"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16L7 10L13 4" stroke="#FBFAF9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {/* Overlay içerik */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 rounded-2xl shadow-2xl" style={{ background: 'rgba(20, 0, 40, 0.98)', minWidth: 320, maxWidth: 340 }}>
          {/* Profil resmi */}
          <div className="flex flex-col items-center mb-2">
            <div className="rounded-full border-4 border-[#836EF9] bg-white flex items-center justify-center" style={{ width: 104, height: 104, overflow: 'hidden' }}>
              {userPfp ? (
                <img src={userPfp} alt="Profile" className="w-24 h-24 object-cover" />
              ) : (
                <img src={characterImage} alt="Profile" className="w-24 h-24 object-contain" />
              )}
            </div>
            <div className="mt-2 text-lg font-bold text-[#FBFAF9] tracking-wide">{username}</div>
          </div>
          {/* Game Over veya You Won! */}
          <div className="flex flex-col items-center mb-2">
            <div className="text-2xl font-extrabold text-[#FBFAF9] mb-1 drop-shadow-lg">
              {gameWon ? 'You Won!' : 'Game Over!'}
            </div>
          </div>
          {/* Skor, level, süre */}
          <div className="text-base font-mono text-[#FBFAF9] mb-2 text-center">
            <div>Score: <span className="font-bold">{score}</span></div>
            <div>Level Reached: <span className="font-bold">{level}</span></div>
            <div>Total Time: <span className="font-bold">{getElapsedTime()}</span></div>
          </div>
          {/* Ulaşılan level görseli */}
          <div className="flex flex-col items-center my-2">
            <img src={characterImage} alt="Level Character" className="w-20 h-20 object-contain" />
          </div>
          {/* Butonlar */}
          <div className="flex flex-row gap-3 mt-4 mb-2 w-full justify-center">
            <button className="flex-1 py-2 px-4 rounded-lg font-bold text-base" style={{ background: '#836EF9', color: '#FBFAF9' }} onClick={handlePlayAgain}>
              Play Again
            </button>
            <button className="flex-1 py-2 px-4 rounded-lg font-bold text-base" style={{ background: '#200052', color: '#FBFAF9', border: '2px solid #836EF9' }} onClick={handleCastMyScore}>
              Cast my score
            </button>
          </div>
          <button className="w-full py-2 px-4 rounded-lg font-bold text-base mt-2" style={{ background: '#A0055D', color: '#FBFAF9' }} onClick={handleSendScoreToContract} disabled={isTxPending || txSent}>
            {isTxPending ? 'Confirming...' : txSent ? 'Score Sent!' : 'Let Monad know your score!'}
          </button>
          {txHash && (
            <button className="w-full py-2 px-4 rounded-lg font-bold text-base mt-2" style={{ background: '#836EF9', color: '#FBFAF9' }} onClick={() => window.open(`https://testnet.monadexplorer.com/tx/${txHash}`, '_blank')}>
              View Transaction
            </button>
          )}
        </div>
      </div>
    );
  }

  if (gameStarted) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-start" style={{ backgroundColor: "#200052" }}>
        {/* Sağ üstte puan ve brain göstergeleri */}
        <div className="fixed top-4 right-4 flex flex-col items-end z-30">
          {/* Puan */}
          <div className="flex items-center mb-2 bg-[#2a1746]/80 rounded-full px-3 py-1 shadow-lg">
            <span className="text-lg font-bold text-[#FBFAF9] mr-2">{score}</span>
            <img src="/images/point.png" alt="Point" className="w-6 h-6" />
          </div>
          {/* Brain */}
          <div className="flex items-center bg-[#2a1746]/80 rounded-full px-3 py-1 shadow-lg">
            <span className="text-lg font-bold text-[#FBFAF9] mr-2">{brain}</span>
            <img src="/images/brain-health.png" alt="Brain" className="w-6 h-6" />
          </div>
        </div>
        {/* Sol üstte modern, küçük, opak ok butonu */}
        <button
          className="absolute top-4 left-4 flex items-center justify-center w-9 h-9 rounded-full shadow-md z-20"
          style={{ background: "rgba(160,5,93,0.7)" }}
          onClick={() => setGameStarted(false)}
          aria-label="Return"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16L7 10L13 4" stroke="#FBFAF9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {/* Boss görseli daha büyük, yuvarlak çerçeve daha büyük ve daha opak, border ile */}
        <div className="w-full flex flex-col items-center mt-4 mb-8">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              background: "rgba(255,255,255,0.95)",
              width: 120,
              height: 120,
              border: "4px solid #A0055D"
            }}
          >
            <img
              src={bossImage}
              alt="Boss"
              className="w-28 h-28 object-contain rounded-full"
              style={{ maxWidth: "112px", maxHeight: "112px" }}
            />
          </div>
          {/* Level etiketi */}
          <div className="mt-2 text-sm font-bold text-[#FBFAF9] tracking-wide">{bossLabel}</div>
          {/* Yaşam barı (gradient) */}
          <div className="w-48 h-4 bg-gray-300 rounded-full mt-2 overflow-hidden border border-gray-400">
            <div
              className="h-full transition-all"
              style={{
                width: `${(bossHealth / bossMaxHealth) * 100}%`,
                background: "linear-gradient(90deg, #A0055D 0%, #836EF9 100%)"
              }}
            />
          </div>
        </div>
        {/* Flash efekti */}
        {flash && selectedId !== null && (
          <span
            className={`absolute inset-0 rounded-xl pointer-events-none animate-pulse border-4 ${flash === 'success' ? 'border-green-400' : 'border-red-400'}`}
            style={{ zIndex: 10 }}
          />
        )}
        {/* 4 kutucuk */}
        <div className="w-full grid grid-cols-2 gap-2 max-w-md mx-auto my-[26px]">
          {statements.all.map((s: Statement, i: number) => {
            const isSelected = selectedId === s.id;
            return (
              <button
                key={s.id}
                className={`w-full h-24 p-3 rounded-xl text-xs font-medium text-[#FBFAF9] transition-all duration-200 select-none outline-none border-2 border-transparent
                  ${isSelected ? 'z-20' : ''}
                  ${isSelected && !flash ? 'scale-105' : ''}
                  ${!isSelected && flash ? 'opacity-70' : ''}
                `}
                style={{
                  background: COLOR_PALETTE[i % COLOR_PALETTE.length],
                  boxShadow: '0 8px 32px 0 rgba(131,110,249,0.25), 0 4px 24px 0 rgba(32,0,82,0.18)',
                  position: 'relative',
                  maxWidth: '200px',
                  minWidth: '120px',
                }}
                onClick={() => handleBoxClick(s.id)}
                onTouchStart={() => handleBoxClick(s.id)}
                tabIndex={0}
              >
                {isSelected && flash && (
                  <span
                    className={`absolute inset-0 rounded-xl pointer-events-none animate-pulse border-4 ${flash === 'success' ? 'border-green-400' : 'border-red-400'}`}
                    style={{ zIndex: 10 }}
                  />
                )}
                {showQuestionMarks && !isFirstQuestion ? '???' : s.text}
              </button>
            );
          })}
        </div>
        {/* Karakter görseli ve yaşam barı (en alt) */}
        <div className="w-full flex flex-col items-center justify-end absolute left-0 right-0 bottom-4">
          {/* Karakter yaşam barı */}
          <div className="w-48 h-4 bg-gray-300 rounded-full mb-2 overflow-hidden border border-gray-400">
            <div
              className="h-full transition-all"
              style={{
                width: `${brain}%`,
                background: "linear-gradient(90deg, #836EF9 0%, #200052 100%)"
              }}
            />
          </div>
          {/* Kullanıcı adı */}
          <div className="mb-2 text-sm font-bold text-[#FBFAF9] tracking-wide">{username}</div>
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              background: "rgba(255,255,255,0.95)",
              width: 120,
              height: 120,
              border: "4px solid #836EF9"
            }}
          >
            <img
              src={characterImage}
              alt="Character"
              className="w-28 h-28 object-contain rounded-full"
              style={{ maxWidth: "112px", maxHeight: "112px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Ana ekran kodu
  return (
    <div className="relative min-h-screen w-full flex items-start justify-center" style={{ backgroundColor: "#200052" }}>
      <BackgroundImage />
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center justify-start rounded-xl border-4" style={{ borderColor: "#200052" }}>
        {/* Start Game butonu - margin ayarı için mt-10 ve mb-8 ile oynayabilirsin */}
        <button className="w-full text-2xl font-bold py-3 px-4 rounded-lg transition-colors mb-8 mt-40" style={{ background: 'rgba(160,5,93,0.85)', color: '#FBFAF9' }} onClick={() => setGameStarted(true)}>
          START GAME
        </button>
        {/* WalletActions içeriği, opak beyaz arka plan - marginTop ile ince ayar yapabilirsin */}
        <div style={{ background: 'rgba(131,110,249,0.70)', borderRadius: '16px', width: '100%', marginTop: 28, padding: 7 }}>
          <div className="w-full" style={{ color: '#111', fontWeight: 'bold' }}>
            <WalletActions />
          </div>
        </div>
      </div>
      {/* Sağ alt Add Frame butonu */}
      <AddFrameButton />
    </div>
  );
}
