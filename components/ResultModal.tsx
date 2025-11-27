import React from 'react';
import { FoodItem } from '../types';

interface ResultModalProps {
  item: FoodItem | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const handleFindNearby = () => {
    const query = encodeURIComponent(item.name);
    // Maps Grounding - direct link since we aren't using the API for this specific action yet, but good for UX.
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-background-light dark:bg-background-dark shadow-2xl rounded-xl overflow-hidden animate-scale-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Hero Image/Banner */}
        <div className="w-full h-48 bg-primary/20 flex items-center justify-center relative overflow-hidden">
             {/* If we had real images, we'd put them here. For now, a placeholder pattern or icon */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent"></div>
             <span className="material-symbols-outlined text-9xl text-primary/40 select-none">
                {item.icon || 'restaurant'}
             </span>
        </div>

        <div className="flex flex-col p-6 sm:p-8 text-center">
          <h1 className="text-[#181411] dark:text-white text-2xl sm:text-3xl font-bold leading-tight pb-1 pt-2">
            Chúc mừng!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal pb-6">
            Món ăn hôm nay của bạn là:
          </p>
          
          <div className="pb-8">
             <p className="text-primary text-4xl sm:text-5xl font-black leading-tight tracking-tight break-words">
                {item.name}
             </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={handleFindNearby}
              className="flex items-center justify-center gap-2 rounded-xl h-14 px-5 bg-primary text-white text-base font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">near_me</span>
              <span>Tìm quán gần đây</span>
            </button>
            <button 
              onClick={onClose}
              className="flex items-center justify-center rounded-xl h-14 px-5 bg-gray-200/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 text-base font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
