import React, { useState, useEffect } from 'react';
import { AppView, DEFAULT_LISTS, FoodItem, FoodList } from './types';
import { Wheel } from './components/Wheel';
import { ResultModal } from './components/ResultModal';
import { FoodManagement } from './components/FoodManagement';

function App() {
  const [view, setView] = useState<AppView>(AppView.HOME);

  // State for Lists
  const [lists, setLists] = useState<FoodList[]>(() => {
    const saved = localStorage.getItem('foodLists');
    return saved ? JSON.parse(saved) : DEFAULT_LISTS;
  });

  const [activeListId, setActiveListId] = useState<string>(() => {
    const savedLists = localStorage.getItem('foodLists');
    const initialLists = savedLists ? JSON.parse(savedLists) : DEFAULT_LISTS;
    return initialLists.length > 0 ? initialLists[0].id : '';
  });

  // Ensure activeListId is valid if lists change
  useEffect(() => {
    if (lists.length > 0 && !lists.find(l => l.id === activeListId)) {
      setActiveListId(lists[0].id);
    } else if (lists.length === 0 && activeListId !== '') {
      setActiveListId(''); // No lists, no active ID
    }
  }, [lists, activeListId]);

  const [spinTrigger, setSpinTrigger] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultItem, setResultItem] = useState<FoodItem | null>(null);

  useEffect(() => {
    localStorage.setItem('foodLists', JSON.stringify(lists));
  }, [lists]);

  const activeList = lists.find(l => l.id === activeListId) || lists[0];
  const activeFoods = activeList ? activeList.items : [];

  const handleSpin = () => {
    if (isSpinning || activeFoods.length === 0) return;
    setIsSpinning(true);
    setSpinTrigger(prev => prev + 1);
  };

  const onSpinEnd = (item: FoodItem) => {
    setIsSpinning(false);
    setResultItem(item);
  };

  const closeResult = () => {
    setResultItem(null);
  };

  if (view === AppView.MANAGE_LIST) {
    return (
      <FoodManagement
        lists={lists}
        setLists={setLists}
        onBack={() => setView(AppView.HOME)}
        initialActiveListId={activeListId}
      />
    );
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden">
      {/* Container */}
      <div className="flex h-full grow flex-col max-w-[960px] mx-auto w-full">

        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-10 py-3 border-b border-[#f5f2f0] dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary">
              {/* Logo Icon */}
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M42 20L28 6C26 4 23 4 21 6L6 21C4 23 4 26 6 28L20 42C22 44 25 44 27 42L42 27C44 25 44 22 42 20Z" fill="currentColor" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                <circle cx="24" cy="24" r="6" fill="white" />
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight text-[#181411] dark:text-gray-100">Ăn Gì Hôm Nay?</h2>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-col items-center flex-1 px-4 py-8 gap-6 w-full transform scale-[0.8] origin-top md:scale-100">

          {/* List Selector */}
          <div className="w-full max-w-sm">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">
              Chọn danh sách quay:
            </label>
            <div className="relative">
              <select
                value={activeListId}
                onChange={(e) => setActiveListId(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#181411] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer shadow-sm"
              >
                {lists.map(list => (
                  <option key={list.id} value={list.id}>{list.name} ({list.items.length} món)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Prompt Text */}
          <h3 className="text-center text-[#181411] dark:text-gray-100 text-xl md:text-2xl font-bold animate-pulse mt-2">
            {isSpinning ? 'Đang chọn món...' : `Hôm nay ăn gì (${activeList?.name})?`}
          </h3>

          {/* Wheel Component */}
          <Wheel
            items={activeFoods}
            isSpinning={isSpinning}
            onSpinEnd={onSpinEnd}
            spinTrigger={spinTrigger}
          />

          {/* Spin Button */}
          <div className="w-full max-w-sm px-4">
            <button
              onClick={handleSpin}
              disabled={isSpinning || activeFoods.length === 0}
              className="w-full h-14 rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
            >
              {isSpinning ? (
                <span className="material-symbols-outlined animate-spin">autorenew</span>
              ) : (
                <span className="material-symbols-outlined">casino</span>
              )}
              {isSpinning ? 'ĐANG QUAY...' : 'QUAY'}
            </button>
          </div>

        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-[#f5f2f0] dark:border-white/5 p-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setView(AppView.MANAGE_LIST)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              <span className="material-symbols-outlined">edit_note</span>
              <span>Quản lý danh sách</span>
            </button>
          </div>
          <p className="text-xs text-gray-400">© 2024 Ăn Gì Hôm Nay?</p>
        </footer>

      </div>

      {/* Modal Overlay */}
      {resultItem && (
        <ResultModal item={resultItem} onClose={closeResult} />
      )}
    </div>
  );
}

export default App;
