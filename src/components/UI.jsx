import { atom, useAtom } from "jotai";
import { useEffect } from "react";

// Global state for the current page index
export const pageAtom = atom(0);
// Global state for the pause animation
export const pauseAtom = atom(false);

export const UI = ({ logo, whatsapp, pages = [] }) => {
  const [page, setPage] = useAtom(pageAtom);
  const [paused, setPaused] = useAtom(pauseAtom);

  // --- Dynamic WhatsApp Configuration ---
  const message = encodeURIComponent("Hi! I would like to place an order.");
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${message}`;

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return (
    <>
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
        
        {/* TOP HEADER SECTION */}
        <div className="w-full flex justify-between items-start p-5 md:p-10">
          {/* LEFT: Dynamic Logo */}
          <a className="pointer-events-auto" href="#">
            <img 
              className="w-24 md:w-44 shadow-sm" 
              src={logo} 
              alt="Restaurant Logo" 
            />
          </a>

          {/* RIGHT: Order Now Pill Button */}
          <a
            className="pointer-events-auto bg-white text-black font-bold py-3 px-8 rounded-full shadow-xl hover:bg-[#FF4F18] hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer uppercase text-sm md:text-base tracking-wider mt-6 md:mt-16"
            href={whatsappUrl} 
            target="_blank"
            rel="noopener noreferrer"
          >
            Order Now
          </a>
        </div>

        {/* BOTTOM SECTION: Navigation Dock & Controls */}
        {/* MOBILE FIX: Used 'justify-between' to separate Dock (Left) and Button (Right) without overlap */}
        <div className="w-full pointer-events-auto flex items-center justify-between md:justify-center pb-8 md:pb-10 px-4 relative gap-3">
          
          {/* 1. Page Navigation Dock */}
          {/* Mobile: flex-1 (takes available space), Desktop: max-w-2xl + centered */}
          <div className="flex-1 md:flex-none flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-2xl overflow-x-auto scrollbar-hide md:max-w-2xl md:mx-auto">
            
            {/* Pages */}
            {pages.map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 px-6 py-3 rounded-full font-bold text-sm uppercase shrink-0 ${
                  index === page
                    ? "bg-[#FF4F18] text-white shadow-lg scale-105" // Active
                    : "bg-transparent text-white/80 hover:bg-white/10 hover:text-white" // Inactive
                }`}
                onClick={() => setPage(index)}
              >
                {index === 0 ? "Cover" : `Page ${index}`}
              </button>
            ))}
            
            <button
              className={`transition-all duration-300 px-6 py-3 rounded-full font-bold text-sm uppercase shrink-0 ${
                page === pages.length
                  ? "bg-[#FF4F18] text-white shadow-lg scale-105"
                  : "bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setPage(pages.length)}
            >
              Back Cover
            </button>
          </div>

          {/* 2. Pause / Resume Button */}
          {/* Mobile: Static (Right side flex item), Desktop: Absolute (Bottom Right) */}
          <div className="shrink-0 z-20 md:absolute md:right-10 md:bottom-10">
            <button
              onClick={() => setPaused(!paused)}
              className="pointer-events-auto bg-white hover:bg-gray-100 text-[#FF4F18] w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border-2 border-[#FF4F18]"
              title={paused ? "Resume Animation" : "Pause Animation"}
            >
              {paused ? (
                 // PLAY ICON (Resume)
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              ) : (
                // PAUSE ICON
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </main>
    </>
  );
};
