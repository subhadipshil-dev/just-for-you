"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, AlertCircle, Home } from 'lucide-react';
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
const SUCCESS_GIF = "https://media1.tenor.com/m/O9P6oHeJ5MwAAAAC/dog-smile.gif";

export default function ReceiverPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const [noCount, setNoCount] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);
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
        : "bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-zinc-900")
    )}>
      <div className="absolute top-8 px-4 py-2 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
        <Clock className="w-3 h-3" /> Expiry: {timeLeft}
      </div>

      <AnimatePresence mode="wait">
        {!isAccepted ? (
          <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8 max-w-md">
            <div className="h-48 flex items-center justify-center mb-4">
              {isRepelling && data.experienceType === 'fun' ? (
                <motion.img 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={REPEL_GIF} 
                  className="h-full rounded-2xl shadow-xl border-4 border-rose-500/20" 
                />
              ) : noCount > 0 ? (
                <motion.img 
                  key={noCount}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={currentReaction?.gif} 
                  className="h-full rounded-2xl shadow-xl" 
                />
              ) : (
                <div className="w-24 h-24 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center animate-bounce">
                  <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
                </div>
              )}
            </div>
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
                  setIsAccepted(true);
                  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
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
        ) : (
          <motion.div key="a" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-10">
            <img src={SUCCESS_GIF} className="w-72 h-72 mx-auto rounded-[3rem] shadow-2xl object-cover" />
            <div className="space-y-4">
              <h2 className="text-6xl font-black text-rose-500">YAY! 🎉</h2>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{data.receiverName} said YES!</p>
                {data.senderName && <p className="text-xl text-rose-400 font-medium">Sent with love by {data.senderName}</p>}
              </div>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
              <Heart className="w-4 h-4" /> Make your own
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
