import React from 'react';
import { SchoolInfo } from '../types';

interface HeaderLogosProps {
  schoolInfo: SchoolInfo;
  titleColor?: string;
  subtitleColor?: string;
}

export const HeaderLogos: React.FC<HeaderLogosProps> = ({
  schoolInfo,
  titleColor = 'text-yellow-300',
  subtitleColor = 'text-white',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-2">
      {/* 3 Logos Row */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur rounded-full p-1 border-2 border-slate-900 shadow-md flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
          <img
            src={schoolInfo.logo1Url}
            alt="Kemdikbud"
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png';
            }}
          />
        </div>
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur rounded-full p-1 border-2 border-slate-900 shadow-md flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
          <img
            src={schoolInfo.logo2Url}
            alt="Daerah"
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Lambang_Kabupaten_Jember.png';
            }}
          />
        </div>
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur rounded-full p-1 border-2 border-slate-900 shadow-md flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
          <img
            src={schoolInfo.logo3Url}
            alt="Sekolah"
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png';
            }}
          />
        </div>
      </div>

      {/* Main Title */}
      <h1 className={`text-2xl md:text-3xl font-black font-heading tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${titleColor}`}>
        {schoolInfo.schoolName}
      </h1>

      {/* Subtitle */}
      <p className={`text-sm md:text-base font-bold flex items-center justify-center gap-2 mt-0.5 ${subtitleColor}`}>
        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
        {schoolInfo.portalTitle}
        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
      </p>
    </div>
  );
};
