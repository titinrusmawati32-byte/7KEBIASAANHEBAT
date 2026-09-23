import React, { useState, useEffect } from 'react';

export const ClockWidget: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}.${minutes}.${seconds} WIB`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-emerald-400 text-slate-900 font-extrabold text-base md:text-lg px-5 py-2 rounded-full border-brutal shadow-brutal animate-pulse">
      <span className="text-xl">⏰</span>
      <span>{timeStr || '11.30.57 WIB'}</span>
    </div>
  );
};
