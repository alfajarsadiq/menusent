import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const pictures = [
  "page1",
  "page2",
  "page3",
];

export const pageAtom = atom(0);
export const pages = [
  {
    front: "front",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "front",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);

  // --- WhatsApp Configuration ---
  const phoneNumber = "971566368870"; 
  const message = encodeURIComponent("Hi! I would like to place an order.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  // ---------------------------

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return (
    <>
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
        
        {/* TOP HEADER SECTION */}
        <div className="w-full flex justify-between items-start p-5 md:p-10">
          {/* LEFT: Logo */}
          <a
            className="pointer-events-auto"
            href="https://lessons.wawasensei.dev/courses/react-three-fiber"
          >
            <img className="w-24 md:w-44 shadow-sm" src="/images/grilltown.png" alt="Logo" />
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

        {/* BOTTOM SECTION: Navigation Dock */}
        <div className="w-full pointer-events-auto flex justify-center pb-8 md:pb-10">
          {/* Glassmorphism Floating Dock */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-2xl overflow-x-auto max-w-[90vw]">
            
            {[...pages].map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 px-6 py-3 rounded-full font-bold text-sm uppercase shrink-0 ${
                  index === page
                    ? "bg-[#FF4F18] text-white shadow-lg scale-105" // Active: Radiant Orange
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
                  ? "bg-[#FF4F18] text-white shadow-lg scale-105" // Active
                  : "bg-transparent text-white/80 hover:bg-white/10 hover:text-white" // Inactive
              }`}
              onClick={() => setPage(pages.length)}
            >
              Back Cover
            </button>
            
          </div>
        </div>
      </main>
    </>
  );
};