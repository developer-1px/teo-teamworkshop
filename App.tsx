import React, { useState } from 'react';
import { GameState, Scenario } from './types';
import { SCENARIOS } from './data';
import SortableList from './components/SortableList';
import Results from './components/Results';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    scenarioId: null,
    phase: 'HOME',
    personalRanking: [],
    teamRanking: [],
  });

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const getScenario = (): Scenario | null => {
    return gameState.scenarioId ? SCENARIOS[gameState.scenarioId] : null;
  };

  const startScenario = (id: string) => {
    setGameState({
      scenarioId: id,
      phase: 'INTRO',
      personalRanking: [],
      teamRanking: [],
    });
    window.scrollTo(0, 0);
  };

  const handleScenarioClick = (id: string) => {
    if (id === 'SEA') {
      // Open password modal for Sea scenario
      setShowPasswordModal(true);
      setPasswordInput('');
      setPasswordError(false);
    } else {
      startScenario(id);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '0014') {
      setShowPasswordModal(false);
      startScenario('SEA');
    } else {
      setPasswordError(true);
    }
  };

  const currentScenario = getScenario();

  // Helper for Intro Theme Styles
  const getIntroTheme = (themeColor: string) => {
    if (themeColor === 'cyan') {
      return {
        badge: 'bg-cyan-100 text-cyan-800',
        tipsBorder: 'border-cyan-400',
        tipsBg: 'bg-cyan-50',
        tipsTitle: 'text-cyan-900',
        tipsText: 'text-cyan-800',
        button: 'bg-cyan-700 hover:bg-cyan-600 shadow-cyan-900/20'
      };
    }
    return {
      badge: 'bg-slate-100 text-slate-800',
      tipsBorder: 'border-slate-400',
      tipsBg: 'bg-slate-50',
      tipsTitle: 'text-slate-900',
      tipsText: 'text-slate-800',
      button: 'bg-slate-800 hover:bg-slate-700 shadow-slate-900/20'
    };
  };

  // Render Functions
  const renderHome = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">팀워크 생존 게임</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            NASA와 미국 해안경비대의 공식 시나리오로<br/>여러분의 생존 본능과 협동심을 테스트하세요.
          </p>
        </div>

        <div className="grid gap-5">
          <button 
            onClick={() => handleScenarioClick('MOON')}
            className="bg-slate-800 text-white p-6 rounded-3xl shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:bg-slate-700 transition-all transform hover:-translate-y-1 text-left relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-32 h-32 transform rotate-12 translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
            </div>
            <div className="relative z-10">
              <span className="inline-block px-2 py-1 bg-white/20 rounded text-[10px] font-bold mb-2 backdrop-blur-sm">NASA SCENARIO</span>
              <h2 className="text-2xl font-extrabold mb-2">달 생존 게임</h2>
              <p className="text-slate-300 text-sm font-medium leading-relaxed pr-8">기지에서 200마일 떨어진 곳에 불시착했습니다. 생존 장비의 우선순위를 정하세요.</p>
            </div>
          </button>

          <button 
            onClick={() => handleScenarioClick('SEA')}
            className="bg-cyan-700 text-white p-6 rounded-3xl shadow-xl shadow-cyan-900/10 hover:shadow-2xl hover:bg-cyan-600 transition-all transform hover:-translate-y-1 text-left relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-32 h-32 transform rotate-12 translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
            </div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="inline-block px-2 py-1 bg-white/20 rounded text-[10px] font-bold mb-2 backdrop-blur-sm">COAST GUARD SCENARIO</span>
                <h2 className="text-2xl font-extrabold mb-2">해상 조난 게임</h2>
              </div>
              <div className="bg-black/20 p-2 rounded-full backdrop-blur-sm mt-1">
                 <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
            </div>
            <p className="text-cyan-200 text-sm font-medium leading-relaxed pr-8 relative z-10">대서양 한가운데에서 요트가 침몰합니다. 구조될 때까지 살아남아야 합니다.</p>
          </button>
        </div>
        
        <p className="mt-12 text-gray-300 text-xs text-center font-medium">
          Based on official exercises by NASA and the US Coast Guard.
        </p>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-xs transform transition-all scale-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">비밀번호 필요</h3>
              <p className="text-sm text-gray-500 mt-2 font-medium leading-snug">본 게임 진행을 위해<br/>4자리 비밀번호를 입력해주세요.</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-5">
                <input 
                  type="tel" 
                  maxLength={4}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  className={`w-full text-center text-3xl font-bold tracking-[0.5em] py-4 border-2 rounded-2xl outline-none transition-all placeholder:tracking-normal ${passwordError ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:border-cyan-500 text-gray-800 focus:ring-4 focus:ring-cyan-100'}`}
                  placeholder="●●●●"
                  autoFocus
                />
                {passwordError && <p className="text-red-500 text-xs text-center mt-2 font-bold animate-pulse">비밀번호가 올바르지 않습니다.</p>}
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors text-sm"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 bg-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 hover:bg-cyan-600 transition-all active:scale-95 text-sm"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderIntro = () => {
    if (!currentScenario) return null;
    const themeStyles = getIntroTheme(currentScenario.themeColor);

    return (
      <div className="min-h-screen flex flex-col p-6 max-w-2xl mx-auto pb-10">
        <div className="flex-1">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-5 ${themeStyles.badge}`}>
            MISSION BRIEFING
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">{currentScenario.title}</h1>
          <div className="prose prose-lg text-gray-600 leading-relaxed mb-10 text-sm md:text-base">
            {currentScenario.description}
          </div>
          
          <div className={`${themeStyles.tipsBg} border-l-4 ${themeStyles.tipsBorder} p-5 rounded-r-xl mb-8`}>
            <h3 className={`font-bold ${themeStyles.tipsTitle} mb-3 flex items-center`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              여러분의 임무
            </h3>
            <ul className={`list-disc list-outside ml-4 text-sm ${themeStyles.tipsText} space-y-2`}>
              <li>총 15개의 생존 물품이 주어집니다.</li>
              <li>생존을 위해 가장 중요한 것부터 순위를 매기세요.</li>
              <li><strong>1위 (가장 중요)</strong> &rarr; <strong>15위 (가장 덜 중요)</strong></li>
              <li>개인 판단 후 팀 합의 과정을 거칩니다.</li>
            </ul>
          </div>
        </div>

        <button 
          onClick={() => {
            setGameState(prev => ({ ...prev, phase: 'PERSONAL_RANKING' }));
            window.scrollTo(0, 0);
          }}
          className={`w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg transform transition active:scale-[0.98] ${themeStyles.button}`}
        >
          개인 순위 정하기 시작
        </button>
      </div>
    );
  };

  const handlePersonalComplete = (orderedIds: string[]) => {
    setGameState(prev => ({
      ...prev,
      personalRanking: orderedIds,
      phase: 'TEAM_RANKING'
    }));
    window.scrollTo(0, 0);
  };

  const handleTeamComplete = (orderedIds: string[]) => {
    setGameState(prev => ({
      ...prev,
      teamRanking: orderedIds,
      phase: 'RESULTS'
    }));
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (gameState.phase) {
      case 'HOME':
        return renderHome();
      case 'INTRO':
        return renderIntro();
      case 'PERSONAL_RANKING':
        return currentScenario ? (
          <SortableList 
            items={currentScenario.items}
            initialOrder={gameState.personalRanking.length > 0 ? gameState.personalRanking : undefined}
            onComplete={handlePersonalComplete}
            title="개인 순위"
            description="자신의 판단에 따라 순위를 매겨주세요. 타일을 길게 눌러 이동할 수 있습니다."
            submitLabel="저장 후 팀 단계로 이동"
            colorTheme={currentScenario.themeColor}
          />
        ) : null;
      case 'TEAM_RANKING':
        return currentScenario ? (
          <SortableList 
            items={currentScenario.items}
            onComplete={handleTeamComplete}
            title="팀 순위"
            description="팀원들과 충분히 토론하여 합의된 순위를 결정하세요."
            submitLabel="최종 결과 보기"
            colorTheme={currentScenario.themeColor}
          />
        ) : null;
      case 'RESULTS':
        return currentScenario ? (
          <Results 
            scenario={currentScenario}
            personalRanking={gameState.personalRanking}
            teamRanking={gameState.teamRanking}
            onRestart={() => setGameState({ scenarioId: null, phase: 'HOME', personalRanking: [], teamRanking: [] })}
          />
        ) : null;
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-100 selection:text-gray-900">
      {/* Header for non-home pages */}
      {gameState.phase !== 'HOME' && (
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-3 flex items-center justify-between shadow-sm">
          <button 
            onClick={() => setGameState({ scenarioId: null, phase: 'HOME', personalRanking: [], teamRanking: [] })}
            className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            나가기
          </button>
          <span className="font-extrabold text-gray-900 text-sm tracking-tight">
            {gameState.phase === 'PERSONAL_RANKING' ? 'STEP 1: 개인 순위' : 
             gameState.phase === 'TEAM_RANKING' ? 'STEP 2: 팀 순위' : 
             gameState.phase === 'INTRO' ? 'MISSION' : 'REPORT'}
          </span>
          <div className="w-12"></div> {/* Spacer for centering */}
        </header>
      )}
      
      {renderContent()}
    </div>
  );
};

export default App;