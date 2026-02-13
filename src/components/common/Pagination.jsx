import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center justify-between mt-6">
            <span className="text-slate-400 text-sm">عرض 1-10 من 50 طلب</span>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="size-8 flex items-center justify-center rounded-lg bg-glass-surface border border-glass-border text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <span className="material-symbols-outlined text-sm rotate-180">chevron_left</span>
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i + 1)}
                        className={`size-8 flex items-center justify-center rounded-lg border text-sm font-numbers transition-all ${currentPage === i + 1
                                ? 'bg-primary text-white border-primary shadow-glow'
                                : 'bg-glass-surface border-glass-border text-slate-300 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="size-8 flex items-center justify-center rounded-lg bg-glass-surface border border-glass-border text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
