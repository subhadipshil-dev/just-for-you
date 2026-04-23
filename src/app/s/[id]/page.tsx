"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, AlertCircle, Home, Download, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';
import Link from 'next/link';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NO_REACTIONS = [
  { message: "Are you sure?", gif: "https://media1.tenor.com/m/aDPdgi1NlhEAAAAC/angry-madebychie.gif" },
  { message: "Think again! 🥺", gif: "https://media1.tenor.com/m/Jjdy8O1wbZ0AAAAC/star-chat-star-tamil-chat.gif" },
  { message: "Pwease? 👉👈", gif: "https://media1.tenor.com/m/cjX9rzoDhwIAAAAC/braba-angry.gif" },
  { message: "Don't do this to me... 😭", gif: "https://media1.tenor.com/m/1bC9W9qzSvgAAAAC/sad-unhappy.gif" },
  { message: "I'll be very sad...", gif: "https://media1.tenor.com/m/OroVCOXbuUUAAAAC/sadhamstergirl.gif" },
  { message: "You're breaking my heart 💔", gif: "https://media1.tenor.com/m/oQ-ffebqvI4AAAAC/plz.gif" },
  { message: "Last chance... 🥺", gif: "https://media1.tenor.com/m/lMywQp5vRHUAAAAC/cry.gif" },
  { message: "I'm gonna cry! 😭", gif: "https://media1.tenor.com/m/jxgp8fqwkikAAAAC/startamilchat-sanjay-chat.gif" },
];
const REPEL_GIF = "https://media1.tenor.com/m/zmyMkoQ_YoUAAAAC/scared-dog.gif";

export default function ReceiverPage() {
  const { id } = useParams();
  const { theme: globalTheme } = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const [noCount, setNoCount] = useState(0);
  const [acceptedStep, setAcceptedStep] = useState(0);
  const [enteredName, setEnteredName] = useState("");
  const certificateRef = useRef<HTMLDivElement>(null);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [isRepelling, setIsRepelling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/surprise/${id}`);
        const result = await response.json();
        if (response.ok) {
          setData(result);
          updateCountdown(result.expiresAt);
        } else {
          setError(result.error || 'Something went wrong');
        }
      } catch (err) {
        setError('Failed to load surprise');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const updateCountdown = (expiresAt: string) => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expiresAt).getTime() - now;
      if (distance < 0) {
        setTimeLeft('Expired');
        clearInterval(timer);
        return;
      }
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  };
  const handleNoClick = () => {
    setNoCount(prev => {
      const nextCount = prev + 1;
      if (nextCount > NO_REACTIONS.length) {
        setIsRepelling(true);
      }
      return nextCount;
    });
  };

  const handleNoHover = () => {
    if (isRepelling && data.experienceType === 'fun') {
      // Tighter range to stay on screen
      let randomX = (Math.random() - 0.5) * 500;
      let randomY = (Math.random() - 0.5) * 500;
      
      // Strict safe zone around center
      if (Math.abs(randomX) < 150) randomX += randomX > 0 ? 150 : -150;
      if (Math.abs(randomY) < 150) randomY += randomY > 0 ? 150 : -150;
      
      setNoButtonPosition({ x: randomX, y: randomY });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-8 h-8 border-2 border-rose-100 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-zinc-500 mb-8">{error}</p>
        <Link href="/" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold">Back Home</Link>
      </div>
    );
  }

  const currentReaction = noCount > 0 ? NO_REACTIONS[Math.min(noCount - 1, NO_REACTIONS.length - 1)] : null;
  const yesButtonSize = 1 + noCount * 0.25;

  return (
    <main className={cn(
      "min-h-screen flex flex-col items-center justify-center p-6 relative transition-colors duration-500",
      globalTheme === 'dark' ? "bg-zinc-950 text-white" : "bg-white text-zinc-900",
      data.theme === 'cute' && (globalTheme === 'dark' ? "bg-[#1a0f12] text-rose-100" : "bg-pink-50 text-zinc-900"),
      data.theme === 'dark' && "bg-zinc-950 text-white",
      data.theme === 'gradient' && (globalTheme === 'dark' 
        ? "bg-gradient-to-br from-indigo-950 via-zinc-950 to-rose-950 text-zinc-100" 
        : "bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-zinc-900"),
      "print:bg-white print:text-black print:p-0 print:min-h-0 print:block"
    )}>
      <div className="absolute top-8 px-4 py-2 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 print:hidden">
        <Clock className="w-3 h-3" /> Expiry: {timeLeft}
      </div>

      <div className="w-full max-w-md flex flex-col items-center z-10 print:max-w-none print:w-auto">
        {acceptedStep < 3 && (
          <div className="h-48 flex items-center justify-center mb-8 w-full print:hidden">
            {isRepelling && data.experienceType === 'fun' ? (
              <motion.img 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={REPEL_GIF}
                alt="Reaction gif" 
                className="h-full rounded-2xl shadow-xl border-4 border-rose-500/20" 
              />
            ) : noCount > 0 ? (
              <motion.img 
                key={noCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={currentReaction?.gif}
                alt="Reaction gif"
                className="h-full rounded-2xl shadow-xl" 
              />
            ) : (
              <div className="w-24 h-24 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center animate-bounce">
                <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
              </div>
            )}
          </div>
        )}

        <div className="w-full relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {acceptedStep === 0 && (
              <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-8 w-full">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight text-inherit">Hey {data.receiverName}!</h1>
                  <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium italic">
                    {noCount > 0 ? currentReaction?.message : (data.customMessage || 'I have a question for you...')}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-6 pt-4">
                  <motion.button
                    animate={{ scale: 1 }}
                    onClick={() => {
                      setAcceptedStep(1);
                      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                      setTimeout(() => setAcceptedStep(2), 2500);
                    }}
                    className="px-12 py-5 bg-rose-500 text-white rounded-2xl font-bold text-2xl shadow-lg z-10"
                  >
                    YES!
                  </motion.button>
                  <motion.button
                    animate={{ 
                      x: data.experienceType === 'fun' ? noButtonPosition.x : 0, 
                      y: data.experienceType === 'fun' ? noButtonPosition.y : 0,
                      scale: isRepelling && data.experienceType === 'fun' ? 0.9 : 1,
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 600, 
                      damping: 20
                    }}
                    onMouseMove={data.experienceType === 'fun' ? handleNoHover : undefined}
                    onMouseEnter={data.experienceType === 'fun' ? handleNoHover : undefined}
                    onClick={handleNoClick}
                    className={cn(
                      "px-12 py-5 bg-red-600 text-white rounded-2xl font-bold text-2xl transition-all z-50 shadow-xl cursor-pointer",
                      isRepelling && data.experienceType === 'fun' && "opacity-90"
                    )}
                  >
                    No
                  </motion.button>
                </div>
                {data.senderName && noCount === 0 && (
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest pt-8">From {data.senderName}</p>
                )}
              </motion.div>
            )}

            {acceptedStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center w-full flex flex-col items-center justify-center pt-8">
                <h2 className="text-3xl font-bold text-rose-500 mb-3">I was secretly hoping for that 💖</h2>
                <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">Okay… that made me really happy</p>
              </motion.div>
            )}

            {acceptedStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center w-full pt-4">
                <h2 className="text-2xl font-bold mb-3 text-zinc-800 dark:text-zinc-100">Can I make this moment a little official? 😌</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8">Let’s save this as a small memory 💌</p>
                
                <div className="space-y-4 max-w-[280px] mx-auto">
                  <input 
                    type="text" 
                    placeholder="What should I call you? (optional)"
                    value={enteredName}
                    onChange={e => setEnteredName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-rose-100 dark:border-rose-900/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm focus:outline-none focus:border-rose-400 transition-colors text-center font-medium placeholder:text-zinc-400"
                  />
                  <button 
                    onClick={() => setAcceptedStep(3)}
                    className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg hover:bg-rose-600 transition-colors shadow-rose-500/20"
                  >
                    Yes, please ✨
                  </button>
                  <button 
                    onClick={() => setAcceptedStep(3)}
                    className="w-full py-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-sm font-bold transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              </motion.div>
            )}

            {acceptedStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="text-center w-full flex flex-col items-center print:block print:w-auto">
                <div 
                  ref={certificateRef} 
                  className="w-full max-w-[380px] bg-[#fffaf5] dark:bg-[#1a1614] p-6 sm:p-8 relative overflow-hidden text-center shrink-0 print:mx-auto print:max-w-[100%] print:shadow-none print:border-8 print:border-rose-100"
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(225, 29, 72, 0.25)",
                    borderRadius: "1.5rem",
                    border: "8px solid #ffe4e6",
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact"
                  }}
                >
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#f43f5e 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                  
                  <div className="relative z-10 border-2 border-dashed border-rose-200 dark:border-rose-900/50 rounded-xl p-5 sm:p-6 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4 fill-rose-100 dark:fill-rose-900/30 drop-shadow-sm" />
                    
                    <h3 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mb-2 font-serif tracking-tight">CERTIFICATE</h3>
                    <div className="text-[10px] sm:text-xs tracking-[0.2em] text-zinc-400 uppercase mb-6">of a beautiful moment</div>
                    
                    <p className="text-center text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed mb-8 italic font-serif">
                      "This formally recognizes that on this day, a small 'yes' made something feel truly special."
                    </p>
                    
                    <div className="space-y-4 text-left">
                      <div>
                        <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Awarded To</span>
                        <div className="font-serif text-lg sm:text-xl font-bold text-zinc-800 dark:text-zinc-100 border-b-2 border-rose-100 dark:border-rose-900/50 pb-1">
                          {enteredName || data.receiverName}
                        </div>
                      </div>
                      
                      {data.senderName && (
                        <div>
                          <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">With Love From</span>
                          <div className="font-serif text-md sm:text-lg font-bold text-zinc-800 dark:text-zinc-100 border-b-2 border-rose-100 dark:border-rose-900/50 pb-1">
                            {data.senderName}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-end pt-4">
                        <div>
                          <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Date</span>
                          <div className="font-mono text-xs sm:text-sm font-semibold text-rose-500">
                            {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                          </div>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-rose-200 flex items-center justify-center opacity-50">
                          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-[380px] print:hidden">
                  <button 
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                  >
                    <Download className="w-5 h-5" /> Save as PDF
                  </button>
                  <Link 
                    href="/" 
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-2xl font-bold shadow-sm transition-all active:scale-95"
                  >
                    <X className="w-5 h-5" /> Close
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
