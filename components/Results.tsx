import React, { useState, useEffect } from 'react';
import { Item, Scenario } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsProps {
  scenario: Scenario;
  personalRanking: string[];
  teamRanking: string[];
  onRestart: () => void;
}

// Helper for theme styling in Results
const getThemeStyles = (theme: string) => {
  if (theme === 'cyan') {
    return {
      synergyBg: 'bg-cyan-50',
      synergyBorder: 'border-cyan-100',
      synergyIcon: 'text-cyan-700',
      synergyTitle: 'text-cyan-900',
      synergyText: 'text-cyan-800',
      inputBorder: 'border-cyan-200 focus:border-cyan-500 focus:ring-cyan-200',
      calcButton: 'bg-cyan-700 hover:bg-cyan-800',
      revealButton: 'border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
      expertBg: 'bg-cyan-50/50',
      expertLabel: 'text-cyan-800',
      restartButton: 'bg-cyan-800 hover:bg-cyan-900 shadow-cyan-900/20',
    };
  }
  // Default to slate
  return {
    synergyBg: 'bg-slate-50',
    synergyBorder: 'border-slate-100',
    synergyIcon: 'text-slate-700',
    synergyTitle: 'text-slate-900',
    synergyText: 'text-slate-700',
    inputBorder: 'border-slate-200 focus:border-slate-500 focus:ring-slate-200',
    calcButton: 'bg-slate-700 hover:bg-slate-800',
    revealButton: 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
    expertBg: 'bg-slate-50/50',
    expertLabel: 'text-slate-800',
    restartButton: 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20',
  };
};

// Circular Progress Component (Lighthouse style)
const ScoreGauge: React.FC<{ score: number; label: string; delay?: number }> = ({ score, label, delay = 0 }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Adjusted sizes for better spacing
  const radius = 45; 
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    // Delay start
    const timer = setTimeout(() => {
      setMounted(true);
      
      let startTimestamp: number | null = null;
      const duration = 1500;
      
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Ease out quart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        setDisplayScore(Math.floor(easeProgress * score));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setDisplayScore(score);
        }
      };
      
      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timer);
  }, [score, delay]);

  const targetScore = mounted ? score : 0;
  const strokeDashoffset = circumference - (targetScore / 100) * circumference;

  let colorClass = 'text-red-500';
  let bgClass = 'bg-red-50';
  let trackClass = 'text-red-100';
  if (score >= 80) {
    colorClass = 'text-emerald-500';
    bgClass = 'bg-emerald-50';
    trackClass = 'text-emerald-100';
  } else if (score >= 60) {
    colorClass = 'text-orange-500';
    bgClass = 'bg-orange-50';
    trackClass = 'text-orange-100';
  }

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl ${bgClass} border border-white/50 shadow-sm w-full transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">{label}</span>
      <div className="relative w-32 h-32">
        <svg
          height="100%"
          width="100%"
          className="transform -rotate-90"
        >
          <circle
            stroke="currentColor"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx="50%"
            cy="50%"
            className={trackClass}
          />
          <circle
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s ease-out' }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx="50%"
            cy="50%"
            className={colorClass}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className={`text-4xl font-black ${colorClass} tracking-tighter tabular-nums`}>
            {displayScore}
          </span>
        </div>
      </div>
      <div className={`mt-4 text-sm font-bold ${colorClass} transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {score >= 80 ? '탁월함' : score >= 60 ? '좋음' : ' '}
      </div>
    </div>
  );
};

const Results: React.FC<ResultsProps> = ({ scenario, personalRanking, teamRanking, onRestart }) => {
  const [bestIndividualScoreInput, setBestIndividualScoreInput] = useState<string>('');
  const [showSynergy, setShowSynergy] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const themeStyles = getThemeStyles(scenario.themeColor);

  // Maximum possible difference sum for 15 items is 112
  const MAX_POSSIBLE_DIFF = 112;

  // Helper: Calculate raw difference
  const calculateRawDiff = (ranking: string[]): number => {
    let diff = 0;
    ranking.forEach((itemId, index) => {
      const rank = index + 1;
      const item = scenario.items.find(i => i.id === itemId);
      if (item) {
        diff += Math.abs(rank - item.expertRank);
      }
    });
    return diff;
  };

  // Convert raw difference to 0-100 score
  const getScore = (ranking: string[]): number => {
    const rawDiff = calculateRawDiff(ranking);
    const score = Math.round(100 - (rawDiff / MAX_POSSIBLE_DIFF * 100));
    return Math.max(0, score);
  };

  const personalScore = getScore(personalRanking);
  const teamScore = getScore(teamRanking);

  // Synergy Calculation
  const bestIndividual = parseInt(bestIndividualScoreInput) || personalScore;
  const synergyScore = teamScore - bestIndividual;

  // Prepare data for table
  const tableData = scenario.items.map(item => {
    const personalRank = personalRanking.indexOf(item.id) + 1;
    const teamRank = teamRanking.indexOf(item.id) + 1;
    const diffPersonal = Math.abs(personalRank - item.expertRank);
    const diffTeam = Math.abs(teamRank - item.expertRank);
    
    return {
      item,
      expertRank: item.expertRank,
      personalRank,
      teamRank,
      diffPersonal,
      diffTeam
    };
  }).sort((a, b) => a.expertRank - b.expertRank);

  // Chart Data
  const chartData = [
    { name: '나', score: personalScore },
    { name: '팀', score: teamScore },
    { name: '전문가', score: 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-5 pb-24">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900 tracking-tight">미션 결과 보고서</h2>

      {/* Score Gauges */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <ScoreGauge score={personalScore} label="개인 점수" delay={0} />
        <ScoreGauge score={teamScore} label="팀 점수" delay={200} />
      </div>

      {/* Synergy Calculator Section */}
      <div className={`${themeStyles.synergyBg} rounded-2xl p-6 mb-12 border ${themeStyles.synergyBorder} shadow-sm transition-all duration-700 delay-500 transform animate-fade-in-up`}>
        <h3 className={`${themeStyles.synergyTitle} font-bold text-lg mb-2 flex items-center`}>
           <svg className={`w-6 h-6 mr-2 ${themeStyles.synergyIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           팀 시너지 확인
        </h3>
        <p className={`${themeStyles.synergyText} text-sm mb-5 leading-relaxed`}>
          팀이 가장 똑똑한 개인보다 더 나은 결과를 냈나요? <br/>
          그룹 내 <strong>가장 높은 개인 점수</strong>를 입력하여 확인해보세요.
        </p>
        
        <div className="flex gap-3 mb-4">
          <input 
            type="number" 
            placeholder={`최고 점수 (예: ${personalScore})`}
            value={bestIndividualScoreInput}
            onChange={(e) => setBestIndividualScoreInput(e.target.value)}
            className={`flex-1 p-3 rounded-xl border ${themeStyles.inputBorder} text-gray-900 bg-white shadow-sm transition-colors outline-none`}
            max={100}
          />
          <button 
            onClick={() => setShowSynergy(true)}
            className={`${themeStyles.calcButton} text-white px-6 py-3 rounded-xl font-bold shadow-md active:scale-95 transition-all`}
          >
            계산
          </button>
        </div>

        {showSynergy && (
          <div className="mt-5 p-4 bg-white rounded-xl border border-gray-100 text-center shadow-sm animate-[bounceIn_0.5s_ease-out]">
             <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">시너지 효과</div>
             <div className={`text-4xl font-black mb-2 ${synergyScore > 0 ? 'text-emerald-500' : (synergyScore === 0 ? 'text-gray-400' : 'text-red-500')}`}>
               {synergyScore > 0 ? `+${synergyScore}` : `${synergyScore}`}
             </div>
             <div className="text-sm text-gray-700 font-medium">
               {synergyScore > 0 
                 ? "🚀 대단합니다! 팀워크가 빛을 발했습니다." 
                 : (synergyScore === 0 
                     ? "팀 성과가 에이스 한 명과 동일합니다." 
                     : "📉 팀 토론이 오히려 정답에서 멀어졌습니다.")}
             </div>
          </div>
        )}
      </div>

      {/* Visualization */}
      <div className="h-64 w-full mb-12 opacity-0 animate-[fadeIn_0.5s_ease-out_0.7s_forwards]">
        <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          점수 비교
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis dataKey="name" type="category" width={50} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{fill: 'transparent'}} 
              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
            />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={32} isAnimationActive={true} animationDuration={1500} animationBegin={500}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === '전문가' ? '#e5e7eb' : (entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#f97316' : '#ef4444')} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table (Toggle) */}
      {!showDetails ? (
        <button 
          onClick={() => setShowDetails(true)}
          className={`w-full py-5 bg-white border-2 border-dashed rounded-2xl font-bold transition-all shadow-sm flex items-center justify-center gap-3 mb-16 group ${themeStyles.revealButton} opacity-0 animate-[fadeIn_0.5s_ease-out_1s_forwards]`}
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">📝</span> 
          <span className="text-lg">전문가 정답 및 해설 확인하기</span>
        </button>
      ) : (
        <div className={`rounded-2xl p-5 border ${themeStyles.synergyBorder} ${themeStyles.synergyBg} mb-12 animate-[fadeIn_0.5s_ease-out]`}>
          <div className="flex justify-between items-center mb-6 pb-2">
            <h3 className={`text-xl font-bold ${themeStyles.synergyTitle}`}>전문가 정답 및 해설</h3>
            <button 
                onClick={() => setShowDetails(false)}
                className={`text-sm font-bold px-3 py-1.5 rounded-lg transition ${themeStyles.expertLabel} hover:bg-white/50`}
            >
                접기 ▲
            </button>
          </div>
          
          <div className="space-y-4">
            {tableData.map((row) => (
              <div key={row.item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/80 p-4 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg flex items-center">
                    <span className="bg-gray-800 text-white text-xs w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-sm">
                      {row.expertRank}
                    </span>
                    {row.item.name}
                  </span>
                </div>
                
                <div className="p-4 grid grid-cols-2 gap-4 text-sm border-b border-gray-100">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <span className="text-gray-400 block text-[10px] font-bold uppercase mb-1">내 순위</span>
                    <div className="flex items-center justify-center">
                      <span className="font-mono font-bold text-xl text-gray-800">{row.personalRank}</span>
                      <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded ${row.diffPersonal === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                        {row.diffPersonal === 0 ? '정답' : `-${row.diffPersonal}`}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <span className="text-gray-400 block text-[10px] font-bold uppercase mb-1">팀 순위</span>
                    <div className="flex items-center justify-center">
                      <span className="font-mono font-bold text-xl text-gray-800">{row.teamRank}</span>
                      <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded ${row.diffTeam === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                        {row.diffTeam === 0 ? '정답' : `-${row.diffTeam}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 ${themeStyles.expertBg}`}>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className={`font-bold ${themeStyles.expertLabel} mr-1`}>{scenario.expertEntity} 의견:</span> 
                    {row.item.rationale}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
             <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 font-medium text-sm underline transition-colors"
            >
                분석 내용 접기
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button 
          onClick={onRestart}
          className={`px-10 py-4 rounded-full shadow-lg font-bold text-lg text-white transition transform hover:-translate-y-1 active:translate-y-0 ${themeStyles.restartButton}`}
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Results;