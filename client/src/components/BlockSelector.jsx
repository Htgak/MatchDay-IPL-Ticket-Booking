import React from 'react';

const CATEGORY_STYLES = {
  Premium: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    badge: 'bg-amber-500 text-black',
    dot: 'bg-amber-400',
    ring: 'ring-amber-500/50',
  },
  Gold: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-500 text-black',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-500/50',
  },
  Silver: {
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/40',
    badge: 'bg-blue-400 text-black',
    dot: 'bg-blue-300',
    ring: 'ring-blue-400/50',
  },
};

export default function BlockSelector({ standName, blocks, onSelectBlock, onBack }) {
  return (
    <div className="w-full flex flex-col gap-6 animate-[fade-in-up_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">arrow_back</span>
        </button>
        <div>
          <h2 className="text-headline-md font-headline-md text-on-surface font-bold">{standName}</h2>
          <p className="text-label-sm font-label-sm text-on-surface-variant">Select a block to view seats</p>
        </div>
      </div>

      {/* Block Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {blocks.map((block) => {
          const styles = CATEGORY_STYLES[block.category] || CATEGORY_STYLES.Silver;
          const availPct = block.total_seats > 0
            ? Math.round((block.available_seats / block.total_seats) * 100)
            : 0;
          const isSoldOut = block.available_seats === 0;

          return (
            <button
              key={block.id}
              onClick={() => !isSoldOut && onSelectBlock(block)}
              disabled={isSoldOut}
              className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 
                transition-all duration-200 group
                ${isSoldOut
                  ? 'opacity-40 cursor-not-allowed border-outline-variant/20 bg-surface-container'
                  : `cursor-pointer ${styles.bg} ${styles.border} hover:ring-2 ${styles.ring} hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]`
                }`}
            >
              {/* Block name */}
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shadow-sm">
                <span className="text-headline-md font-headline-md text-on-surface font-black">{block.name}</span>
              </div>

              {/* Category badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
                {block.category}
              </span>

              {/* Price */}
              <div className="text-center">
                <p className="text-headline-sm font-black text-on-surface">₹{block.price.toLocaleString()}</p>
                <p className="text-label-xs text-on-surface-variant">per seat</p>
              </div>

              {/* Availability bar */}
              <div className="w-full">
                <div className="flex justify-between text-[9px] text-on-surface-variant mb-1">
                  <span>{isSoldOut ? 'Sold Out' : `${block.available_seats} left`}</span>
                  <span>{availPct}%</span>
                </div>
                <div className="w-full h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      availPct > 50 ? 'bg-emerald-500' : availPct > 20 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${availPct}%` }}
                  />
                </div>
              </div>

              {isSoldOut && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-surface-container/60 backdrop-blur-sm">
                  <span className="text-label-sm font-bold text-on-surface-variant">SOLD OUT</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
