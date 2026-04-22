"use client";

import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Send, Eye, ArrowLeft, Settings2, Palette, Copy, Check, ExternalLink, Moon, Sun, Github, Linkedin, Mail } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dynamic reactions for the "NO" button
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

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.5, ease: "easeOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function Home() {
  const { theme: globalTheme } = useTheme();
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form');
  const [mode, setMode] = useState<'default' | 'advanced'>('default');
  const [experienceType, setExperienceType] = useState<'fun' | 'serious'>('fun');
  const [theme, setTheme] = useState<'cute' | 'dark' | 'minimal' | 'gradient'>('cute');
  const [formData, setFormData] = useState({
    receiverName: '',
    senderName: '',
    customMessage: '',
  });

  // Interaction State
  const [noCount, setNoCount] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [isRepelling, setIsRepelling] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/surprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          theme,
          mode,
          experienceType,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const fullUrl = `${window.location.origin}${data.url}`;
        setGeneratedLink(fullUrl);
        setStep('success');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        alert(data.error || 'Failed to generate link');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    if (isRepelling && experienceType === 'fun') {
      // Tighter range to stay on screen
      let randomX = (Math.random() - 0.5) * 250;
      let randomY = (Math.random() - 0.5) * 250;
      
      // Strict safe zone around center
      if (Math.abs(randomX) < 150) randomX += randomX > 0 ? 150 : -150;
      if (Math.abs(randomY) < 150) randomY += randomY > 0 ? 150 : -150;
      
      setNoButtonPosition({ x: randomX, y: randomY });
    }
  };

  const handleYesClick = () => {
    setIsAccepted(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#ff8e8e', '#f06292', '#ffffff']
    });
  };

  const resetInteraction = () => {
    setNoCount(0);
    setIsAccepted(false);
    setIsRepelling(false);
    setNoButtonPosition({ x: 0, y: 0 });
  };

  const isFormValid = formData.receiverName.trim() !== '';

  const currentReaction = noCount > 0 ? NO_REACTIONS[Math.min(noCount - 1, NO_REACTIONS.length - 1)] : null;
  const yesButtonSize = 1 + noCount * 0.25;

  const themes = [
    { id: 'cute', label: 'Cute', color: 'bg-pink-100 border-pink-300' },
    { id: 'dark', label: 'Dark', color: 'bg-zinc-800 border-zinc-600' },
    { id: 'minimal', label: 'Minimal', color: 'bg-white border-zinc-200' },
    { id: 'gradient', label: 'Gradient', color: 'bg-gradient-to-br from-indigo-100 to-rose-100 border-rose-200' },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-2 md:p-4 relative overflow-hidden bg-[#fafafa] dark:bg-[#09090b]">
      {/* Dynamic Animated Blobs */}
      <div className="blob blob-1 bg-rose-500/10 dark:bg-rose-500/5" />
      <div className="blob blob-2 bg-indigo-500/10 dark:bg-indigo-500/5" />
      <div className="blob blob-3 bg-amber-500/10 dark:bg-amber-500/5" />

      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div
            key="form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full max-w-lg glass p-6 md:p-8 rounded-[2rem] shadow-2xl space-y-6 relative z-10"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-1.5">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="inline-flex items-center justify-center p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl mb-1 shadow-inner cursor-pointer transition-transform"
              >
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
              </motion.div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                Just For <span className="gradient-text">You</span>
              </h1>
              <p className="text-zinc-400 dark:text-zinc-500 font-medium text-xs">
                Generate a unique surprise page for someone special
              </p>
            </motion.div>

            <div className="space-y-6">
              {/* Mode Selection */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 p-1.5 bg-zinc-100/80 dark:bg-zinc-800/50 rounded-[1.5rem]">
                <button
                  onClick={() => setMode('default')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-[1.2rem] transition-all duration-300 font-bold text-sm",
                    mode === 'default'
                      ? "bg-white dark:bg-zinc-700 shadow-md text-rose-500 scale-[1.02]"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  Default
                </button>
                <button
                  onClick={() => setMode('advanced')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-[1.2rem] transition-all duration-300 font-bold text-sm",
                    mode === 'advanced'
                      ? "bg-white dark:bg-zinc-700 shadow-md text-rose-500 scale-[1.02]"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  )}
                >
                  <Settings2 className="w-4 h-4" />
                  Advanced
                </button>
              </motion.div>

              {/* Input Fields */}
              <div className="space-y-5">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    Receiver's Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="receiverName"
                      value={formData.receiverName}
                      onChange={handleInputChange}
                      placeholder="Who's the lucky one?"
                      className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/40 transition-all text-zinc-900 dark:text-white font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 opacity-0 group-focus-within:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleInputChange}
                    placeholder="Stay anonymous?"
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/40 transition-all text-zinc-900 dark:text-white font-medium"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    The Surprise Message
                  </label>
                  <textarea
                    name="customMessage"
                    value={formData.customMessage}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Write something sweet..."
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/40 transition-all text-zinc-900 dark:text-white font-medium resize-none"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Experience Type</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setExperienceType('fun')}
                      className={cn(
                        "py-1.5 rounded-md text-[11px] font-bold transition-all",
                        experienceType === 'fun' ? "bg-white dark:bg-zinc-800 shadow-sm text-rose-500" : "text-zinc-500"
                      )}
                    >
                      Fun (Repelling)
                    </button>
                    <button
                      type="button"
                      onClick={() => setExperienceType('serious')}
                      className={cn(
                        "py-1.5 rounded-md text-[11px] font-bold transition-all",
                        experienceType === 'serious' ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-800 dark:text-zinc-200" : "text-zinc-500"
                      )}
                    >
                      Serious (Normal)
                    </button>
                  </div>
                </motion.div>

                {mode === 'advanced' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-2"
                  >
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Select Visual Theme
                      </label>
                      <div className="grid grid-cols-4 gap-4">
                        {themes.map((t) => (
                          <motion.button
                            key={t.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTheme(t.id as any)}
                            className={cn(
                              "h-12 rounded-2xl border-4 transition-all relative overflow-hidden",
                              t.color,
                              theme === t.id ? "border-rose-500 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                          >
                            {theme === t.id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-rose-500/10">
                                <Check className="w-5 h-5 text-rose-600" />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Actions */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => { setStep('preview'); resetInteraction(); }}
                  disabled={!isFormValid || loading}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-2xl font-bold transition-all disabled:opacity-50 group"
                >
                  <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Preview
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!isFormValid || loading}
                  className="flex-[1.5] flex items-center justify-center gap-3 px-8 py-4.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-[0_10px_30px_-10px_rgba(244,63,94,0.4)] transition-all disabled:opacity-50 active:scale-95 group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                  {loading ? 'Processing...' : 'Generate Magic'}
                </button>
              </motion.div>

              <motion.p variants={itemVariants} className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Self-destructs after 24 hours
              </motion.p>
            </div>
          </motion.div>
        ) : step === 'preview' ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-4xl space-y-6"
          >
            <button
              onClick={() => setStep('form')}
              className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md hover:bg-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Editor
            </button>

            <div className={cn(
              "w-full min-h-[500px] rounded-[2rem] shadow-xl relative flex flex-col items-center justify-center p-8 transition-all duration-500",
              globalTheme === 'dark' ? "bg-zinc-950 text-white" : "bg-white text-zinc-900",
              theme === 'cute' && (globalTheme === 'dark' ? "bg-[#1a0f12] text-rose-100" : "bg-pink-50 text-zinc-900"),
              theme === 'dark' && "bg-zinc-950 text-white",
              theme === 'gradient' && (globalTheme === 'dark' 
                ? "bg-gradient-to-br from-indigo-950 via-zinc-950 to-rose-950 text-zinc-100" 
                : "bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-zinc-900")
            )}>
              {/* Preview Indicator */}
              <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 z-50 pointer-events-none">
                Preview Mode
              </div>
              <AnimatePresence mode="wait">
                {!isAccepted ? (
                  <motion.div
                    key="interaction"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="text-center space-y-10 max-w-xl w-full"
                  >
                    <div className="h-48 sm:h-64 flex items-center justify-center">
                      {isRepelling ? (
                        <motion.img
                          key="repel"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          src={REPEL_GIF}
                          alt="Scared"
                          className="h-full rounded-[2rem] shadow-2xl border-4 border-rose-500/20"
                        />
                      ) : noCount > 0 ? (
                        <motion.img
                          key={noCount}
                          initial={{ opacity: 0, y: 30, rotate: -10 }}
                          animate={{ opacity: 1, y: 0, rotate: 0 }}
                          src={currentReaction?.gif}
                          alt="Reaction"
                          className="h-full rounded-[2rem] shadow-2xl object-contain"
                        />
                      ) : (
                        <motion.div
                          animate={{ y: [0, -20, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-32 h-32 bg-rose-100 rounded-full flex items-center justify-center shadow-xl"
                        >
                          <Heart className="w-16 h-16 text-rose-500 fill-rose-500" />
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-4 px-6">
                      <h2 className="text-4xl sm:text-7xl font-black tracking-tight leading-none text-inherit">
                        Hey <span className="text-rose-500">{formData.receiverName || 'Sarah'}</span>!
                      </h2>
                      <p className="text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 font-medium italic min-h-[4rem] flex items-center justify-center">
                        {noCount > 0
                          ? currentReaction?.message
                          : (formData.customMessage || 'I have a very important question for you...')
                        }
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-10 pt-4 relative">
                      <motion.button
                        animate={{ scale: experienceType === 'fun' ? 1 : 1 }} // Growth removed as requested
                        onClick={handleYesClick}
                        className="px-14 py-6 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-3xl shadow-[0_20px_50px_-10px_rgba(244,63,94,0.5)] transition-colors active:scale-95 z-10 whitespace-nowrap"
                      >
                        YES!
                      </motion.button>
                      
                      <motion.button
                        animate={{ 
                          x: experienceType === 'fun' ? noButtonPosition.x : 0, 
                          y: experienceType === 'fun' ? noButtonPosition.y : 0,
                          scale: isRepelling && experienceType === 'fun' ? 0.9 : 1,
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 600, 
                          damping: 20
                        }}
                        onMouseMove={experienceType === 'fun' ? handleNoHover : undefined}
                        onMouseEnter={experienceType === 'fun' ? handleNoHover : undefined}
                        onClick={handleNoClick}
                        className={cn(
                          "px-14 py-6 bg-red-600 text-white rounded-2xl font-black text-3xl transition-all z-50 shadow-2xl cursor-pointer"
                        )}
                      >
                        No
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="w-64 h-64 sm:w-80 sm:h-80 mx-auto"
                    >
                      <img
                        src={SUCCESS_GIF}
                        alt="Happy Dance"
                        className="w-full h-full rounded-[3rem] shadow-2xl object-cover"
                      />
                    </motion.div>
                    <div className="space-y-4">
                      <h2 className="text-6xl sm:text-8xl font-black gradient-text">
                        YAAAAAAY! 🎉
                      </h2>
                      <p className="text-2xl sm:text-3xl text-zinc-600 dark:text-zinc-300 font-bold">
                        {formData.receiverName || 'Sarah'} said YES!
                        {formData.senderName && <span className="block mt-4 text-rose-500 font-black tracking-widest text-lg uppercase">Sent with love by {formData.senderName}</span>}
                      </p>
                    </div>
                    <button
                      onClick={resetInteraction}
                      className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-rose-500 transition-colors"
                    >
                      Restart preview
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full max-w-xl glass p-12 rounded-[3rem] shadow-2xl text-center space-y-10 relative z-10"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-inner"
              >
                <Check className="w-12 h-12 text-green-500" />
              </motion.div>
              <h2 className="text-4xl font-black text-zinc-900 dark:text-white leading-tight">
                Magic link is <span className="text-green-500">Live!</span>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                Share this with <span className="font-black text-rose-500">{formData.receiverName}</span>.
                They'll have 24 hours to open it!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-5 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl group transition-all hover:border-rose-500/30">
                <input
                  readOnly
                  value={generatedLink}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-zinc-500 truncate"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={copyToClipboard}
                  className={cn(
                    "p-3 rounded-xl transition-all shadow-lg",
                    copied ? "bg-green-500 text-white" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-110"
                  )}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </motion.button>
              </div>

              <motion.a
                whileHover={{ x: 5 }}
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
              >
                Launch Page
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>

            <button
              onClick={() => setStep('form')}
              className="w-full py-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95"
            >
              Create New
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Credentials */}
      <footer className="mt-8 mb-4 flex flex-col items-center justify-center gap-4 relative z-10 w-full max-w-xl">
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/subhadipshil-dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg hover:border-rose-500/50 hover:scale-110 transition-all group"
          >
            <Github className="w-5 h-5 text-zinc-600 group-hover:text-rose-500" />
          </a>
          <a 
            href="https://www.linkedin.com/in/subhadip-shil-867aaa255/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg hover:border-rose-500/50 hover:scale-110 transition-all group"
          >
            <Linkedin className="w-5 h-5 text-zinc-600 group-hover:text-rose-500" />
          </a>
          <a 
            href="mailto:subhadipshil.dev@gmail.com"
            className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg hover:border-rose-500/50 hover:scale-110 transition-all group"
          >
            <Mail className="w-5 h-5 text-zinc-600 group-hover:text-rose-500" />
          </a>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-400 dark:text-zinc-600 flex items-center gap-2">
            Developed with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by Subhadip Shil
          </p>
          <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-zinc-300 dark:text-zinc-700">
            © 2024 Just For You
          </p>
        </div>
      </footer>
    </main>
  );
}
