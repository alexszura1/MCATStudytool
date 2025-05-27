import React from 'react';

// Re-purposed or new icons
export const AtomIcon: React.FC<{ className?: string }> = ({ className }) => ( // C/P
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5zM12 12a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 12H2.25m19.5 0h-3M12 5.25V2.25m0 19.5v-3M6.343 6.343l-2.121-2.121m15.556 15.556-2.121-2.121M6.343 17.657l-2.121 2.121m15.556-15.556-2.121 2.121" />
</svg>
);

export const DnaIcon: React.FC<{ className?: string }> = ({ className }) => ( // B/B
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h1.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5H6A2.25 2.25 0 013.75 6zM3.75 18A2.25 2.25 0 016 15.75h1.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5H6A2.25 2.25 0 013.75 18zM15 6a2.25 2.25 0 012.25-2.25h1.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5h-1.5A2.25 2.25 0 0115 6zM15 18a2.25 2.25 0 012.25-2.25h1.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5h-1.5A2.25 2.25 0 0115 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h7.5M8.25 16.5h7.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12c0-.828.672-1.5 1.5-1.5h4.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-4.5c-.828 0-1.5-.672-1.5-1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 7.5c0 .828-.448 1.5-.75 1.5S8.25 8.328 8.25 7.5c0-.828.448-1.5.75-1.5S9.75 6.672 9.75 7.5zM9.75 16.5c0 .828-.448 1.5-.75 1.5s-.75-.672-.75-1.5c0-.828.448-1.5.75-1.5s.75.672.75 1.5zM14.25 7.5c0 .828.448 1.5.75 1.5s.75-.672.75-1.5c0-.828-.448-1.5-.75-1.5s-.75.672.75 1.5zM14.25 16.5c0 .828.448 1.5.75 1.5s.75-.672.75-1.5c0-.828-.448-1.5-.75-1.5s-.75.672.75 1.5z" />
  </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6.39-2.908a.75.75 0 0 1 .766.027l3.5 2.25a.75.75 0 0 1 0 1.262l-3.5 2.25A.75.75 0 0 1 8 12.25v-4.5a.75.75 0 0 1 .39-.658Z" clipRule="evenodd" />
  </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);

export const BetterXCircleIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const RefreshCwIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => ( // P/S
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.676.75.75 0 11.981 1.65A10.473 10.473 0 0118 18a10.5 10.5 0 01-10.5-10.5c0-1.767.373-3.443 1.042-4.999.207-.48.69-.748 1.188-.742a.747.747 0 01.296.07Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 0012 6a9 9 0 009 9 8.97 8.97 0 003.463-.676.75.75 0 11.981 1.65A10.473 10.473 0 0121 18a10.5 10.5 0 01-10.5-10.5c0-1.767.373-3.443 1.042-4.999.207-.48.69-.748 1.188-.742a.747.747 0 01.296.07Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.058 6.058A8.963 8.963 0 003.75 10.5a8.963 8.963 0 002.308 4.442"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.942 6.058A8.963 8.963 0 0120.25 10.5a8.963 8.963 0 01-2.308 4.442"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75A3.75 3.75 0 1112.75 9 3.752 3.752 0 019 12.75z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 15a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z"/>
  </svg>
);

// Rank Icons
export const UnrankedIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5 text-slate-500"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

export const BronzeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5 text-orange-600"}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 6a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H8a1 1 0 01-1-1V6zm1 4a1 1 0 000 2h2a1 1 0 100-2H8zm1 3a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
  </svg>
);

export const SilverIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5 text-slate-400"}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 3a1 1 0 100 2h2a1 1 0 100-2H9zm-1 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

export const GoldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5 text-yellow-400"}>
    <path d="M10 1a1.5 1.5 0 00-1.446.897l-1.916 3.888-4.29.624a1.5 1.5 0 00-.832 2.568l3.104 3.026-.732 4.272a1.5 1.5 0 002.176 1.581L10 15.49l3.838 2.018a1.5 1.5 0 002.176-1.581l-.732-4.272 3.104-3.026a1.5 1.5 0 00-.832-2.568l-4.29-.624L11.446 1.897A1.5 1.5 0 0010 1z" />
  </svg>
);

export const PlatinumIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5 text-cyan-400"}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 6a.75.75 0 01.729-.745L10 5.25l.271.005A.75.75 0 0111 6v1.115l1.224.612a.75.75 0 01.419 1.048l-.64 1.28a.75.75 0 01-1.048.42L10 9.885l-1.955.978a.75.75 0 01-1.048-.42l-.64-1.28a.75.75 0 01.42-1.048L8 7.115V6a.75.75 0 01.75-.75L9 5.25zm2.25 6.939A.75.75 0 0110.5 12.75v2.5a.75.75 0 01-1.5 0v-2.5a.75.75 0 01.75-.75L10.5 12l.25.004z" clipRule="evenodd" />
  </svg>
);

export const DiamondIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5 text-blue-400"}>
    <path d="M10 3.084l-6.364 6.364a1.5 1.5 0 000 2.121l6.364 6.364a1.5 1.5 0 002.121 0l6.364-6.364a1.5 1.5 0 000-2.121L12.12 3.084a1.5 1.5 0 00-2.121 0zM9.03 8.03a.75.75 0 011.06-1.06l1.72 1.72a.75.75 0 010 1.06l-1.72 1.72a.75.75 0 01-1.06-1.06L9.94 10l-.91-.91V8.03zm2 0v.91L12 10l-.91.91a.75.75 0 01-1.06 1.06L8.28 10.22a.75.75 0 010-1.06l1.72-1.72a.75.75 0 011.06 1.06z" />
  </svg>
);

export const EliteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5 text-purple-400"}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.5 6A1.5 1.5 0 0110 4.5h.008A1.5 1.5 0 0111.5 6v.5a.5.5 0 00.5.5H13a1.5 1.5 0 011.5 1.5v.008A1.5 1.5 0 0113 10h-.5a.5.5 0 00-.5.5V12a1.5 1.5 0 01-1.5 1.5h-.008A1.5 1.5 0 018 12v-.5a.5.5 0 00-.5-.5H6a1.5 1.5 0 01-1.5-1.5v-.008A1.5 1.5 0 016 7h.5a.5.5 0 00.5-.5V6z" clipRule="evenodd" />
  </svg>
);

export const ChampionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5 text-red-500"}>
    <path fillRule="evenodd" d="M10 2c-1.717 0-3.408.59-4.834 1.546L3.91 4.79A8.55 8.55 0 002.02 8.806c-.31.924-.47 1.89-.47 2.865 0 1.58.38 3.078 1.03 4.43l.75 1.56a1.5 1.5 0 002.608.577l.216-.36a6.96 6.96 0 012.846-2.012c.314-.11.64-.198.97-.262A4.943 4.943 0 0110 14.5c.042 0 .083.002.125.004.33.064.657.152.97.262a6.96 6.96 0 012.846 2.012l.216.36a1.5 1.5 0 002.608-.577l.75-1.56c.65-1.352 1.03-2.85 1.03-4.43 0-.976-.16-1.941-.47-2.866a8.551 8.551 0 00-1.89-4.015l-1.256-1.245A8.458 8.458 0 0010 2zM8.5 7a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v.5a.5.5 0 00.5.5h.5a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-.5a.5.5 0 00-.5.5v.5a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-.5a.5.5 0 00-.5-.5h-.5a.5.5 0 01-.5-.5v-2a.5.5 0 01.5-.5h.5a.5.5 0 00.5-.5V7z" clipRule="evenodd" />
  </svg>
);

export const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const RANK_ICONS: Record<string, React.FC<{ className?: string }>> = {
  UnrankedIcon,
  BronzeIcon,
  SilverIcon,
  GoldIcon,
  PlatinumIcon,
  DiamondIcon,
  EliteIcon,
  ChampionIcon,
  AtomIcon, 
  DnaIcon,
  BrainIcon,
};
