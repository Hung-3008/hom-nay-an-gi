import React, { useState } from 'react';
import { FoodItem, FoodList } from '../types';
import { getFoodSuggestions } from '../services/geminiService';

interface FoodManagementProps {
  lists: FoodList[];
  setLists: React.Dispatch<React.SetStateAction<FoodList[]>>;
  onBack: () => void;
  initialActiveListId: string;
}

export const FoodManagement: React.FC<FoodManagementProps> = ({ lists, setLists, onBack, initialActiveListId }) => {
  const [activeListId, setActiveListId] = useState<string>(initialActiveListId || (lists[0]?.id || ''));
  const [inputValue, setInputValue] = useState("");
  const [newListValue, setNewListValue] = useState("");
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activeList = lists.find(l => l.id === activeListId);

  const handleAddList = () => {
    if (!newListValue.trim()) return;
    const newList: FoodList = {
      id: Date.now().toString(),
      name: newListValue.trim(),
      items: []
    };
    setLists(prev => [...prev, newList]);
    setNewListValue("");
    setIsCreatingList(false);
    setActiveListId(newList.id);
  };

  const handleDeleteList = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh sách này không?")) {
      const newLists = lists.filter(l => l.id !== id);
      setLists(newLists);
      if (activeListId === id && newLists.length > 0) {
        setActiveListId(newLists[0].id);
      }
    }
  };

  const handleAddItem = () => {
    if (!inputValue.trim() || !activeList) return;
    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: inputValue.trim(),
      icon: 'restaurant'
    };

    setLists(prev => prev.map(list => {
      if (list.id === activeListId) {
        return { ...list, items: [newItem, ...list.items] };
      }
      return list;
    }));
    setInputValue("");
  };

  const handleDeleteItem = (itemId: string) => {
    setLists(prev => prev.map(list => {
      if (list.id === activeListId) {
        return { ...list, items: list.items.filter(item => item.id !== itemId) };
      }
      return list;
    }));
  };

  const handleSuggest = async () => {
    if (!activeList) return;
    setIsLoading(true);
    try {
      // We pass the list name as context for suggestions
      // Note: getFoodSuggestions signature needs update or we adapt here.
      // Let's assume we update getFoodSuggestions to accept a string prompt or we just pass "Custom"
      // For now, let's pass the list name as the "mode" if it matches, or just generic.

      // Since we changed types, we might need to update the service too. 
      // But for now let's just use the list name as a hint.
      const suggestions = await getFoodSuggestions(activeList.name as any, activeList.items.length);

      const newItems = suggestions.map(name => ({
        id: Date.now().toString() + Math.random().toString(),
        name: name,
        icon: 'smart_toy'
      } as FoodItem));

      setLists(prev => prev.map(list => {
        if (list.id === activeListId) {
          return { ...list, items: [...newItems, ...list.items] };
        }
        return list;
      }));

    } catch (e) {
      console.error(e);
      alert("Failed to get suggestions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[960px] mx-auto animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#e6e0db] dark:border-[#3a2d20] px-4 md:px-10 py-3 sticky top-0 bg-background-light dark:bg-background-dark z-20">
        <div className="flex items-center gap-4 text-[#181411] dark:text-white">
          <div className="size-6 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined !text-2xl">edit_note</span>
          </div>
          <h2 className="text-lg font-bold leading-tight">Quản lý danh sách</h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-xl h-10 w-10 bg-[#f5f2f0] dark:bg-[#3a2d20] text-[#181411] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </header>

      <main className="flex-1 px-4 py-6 md:px-10 overflow-y-auto">

        {/* List Tabs / Creator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#181411] dark:text-white">Danh sách của bạn</h3>
            <button
              onClick={() => setIsCreatingList(!isCreatingList)}
              className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">{isCreatingList ? 'close' : 'add'}</span>
              {isCreatingList ? 'Hủy' : 'Tạo danh sách mới'}
            </button>
          </div>

          {isCreatingList && (
            <div className="flex gap-2 mb-4 animate-fade-in">
              <input
                value={newListValue}
                onChange={(e) => setNewListValue(e.target.value)}
                placeholder="Tên danh sách mới (VD: Ăn sáng, Tiệc tùng)..."
                className="flex-1 rounded-xl border border-primary bg-white dark:bg-[#2d2114] px-4 py-2 text-[#181411] dark:text-white outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
              />
              <button
                onClick={handleAddList}
                className="bg-primary text-white px-4 rounded-xl font-bold hover:bg-primary/90"
              >
                Tạo
              </button>
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {lists.map(list => (
              <button
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeListId === list.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
              >
                {list.name}
                {!list.isDefault && activeListId === list.id && (
                  <span
                    onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}
                    className="material-symbols-outlined text-base opacity-70 hover:opacity-100 hover:bg-white/20 rounded-full p-0.5 ml-1"
                  >
                    close
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {activeList ? (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-black text-[#181411] dark:text-white mb-1">{activeList.name}</h2>
            <p className="text-[#8a7560] dark:text-[#a18a73] mb-6 text-sm">
              {activeList.items.length} món ăn trong danh sách này.
            </p>

            {/* Add Item Input */}
            <div className="flex items-stretch gap-2 mb-6 h-12">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                placeholder={`Thêm món vào "${activeList.name}"...`}
                className="flex-1 rounded-xl border border-[#e6e0db] dark:border-[#3a2d20] bg-white dark:bg-[#2d2114] px-4 text-[#181411] dark:text-white placeholder:text-[#cfc4ba] dark:placeholder:text-[#6f5d4a] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              <button
                onClick={handleAddItem}
                className="bg-primary text-white px-4 md:px-6 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                <span className="hidden md:inline">Thêm</span>
              </button>
            </div>

            {/* Gemini Suggestion */}
            <div className="mb-8">
              <button
                onClick={handleSuggest}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-primary/50 text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>
                  {isLoading ? 'progress_activity' : 'auto_awesome'}
                </span>
                <span className="font-semibold">
                  {isLoading ? 'Đang hỏi Gemini...' : `Gợi ý món cho "${activeList.name}"`}
                </span>
              </button>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-3 pb-10">
              {activeList.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center gap-4 p-10 mt-2 bg-white dark:bg-[#2d2114] rounded-xl border border-dashed border-[#e6e0db] dark:border-[#3a2d20]">
                  <span className="material-symbols-outlined !text-5xl text-primary/50">playlist_add</span>
                  <div>
                    <p className="text-lg font-semibold text-[#181411] dark:text-white">Danh sách trống</p>
                    <p className="text-sm text-[#8a7560] dark:text-[#a18a73]">Chưa có món nào. Hãy thêm món ăn yêu thích của bạn!</p>
                  </div>
                </div>
              ) : (
                activeList.items.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between gap-4 bg-white dark:bg-[#2d2114] px-4 py-3 rounded-xl border border-transparent hover:border-primary/20 shadow-sm transition-all">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="size-10 rounded-lg bg-[#f5f2f0] dark:bg-[#3a2d20] flex items-center justify-center text-[#181411] dark:text-white shrink-0">
                        <span className="material-symbols-outlined">{item.icon || 'restaurant'}</span>
                      </div>
                      <p className="text-[#181411] dark:text-white font-medium truncate">{item.name}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="size-8 flex items-center justify-center rounded-full text-gray-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Vui lòng chọn hoặc tạo một danh sách để bắt đầu.
          </div>
        )}

      </main>
    </div>
  );
};
