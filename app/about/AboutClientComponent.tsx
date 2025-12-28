// AboutClientComponent.tsx - Updated Content with YouTube Button 🎨

'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import AppClientWrapper from '@/components/AppClientWrapper';

// 🚀 Fixed animation variants with proper types
const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.6,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const fadeInSection: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

// 🚀 Updated paragraph data - รวม button ไว้ใน section เดียวกัน
const styledParagraphs = [
  {
    text: `Unda Alunda first began hearing these sounds as a child.\nAt the age of eleven, he started using the guitar as his own language.\nSince then, sound has become both his voice and his way of existing in the world.`,
    className: 'mt-24 text-left'
  },
  {
    text: `At fifteen, he began formally studying jazz music.\nHe later earned top honors in both Music Theory and Ear Training at the College of Music, Mahidol University,\nwhere he studied from high school through graduation.`,
    className: 'text-left'
  },
  {
    text: `From a young age, Unda believed that creating music free from bias and stylistic limitation—\nmusic that truly honors spirit, imagination, creativity, and feeling above tradition or theory—\nrequires deep knowledge and discipline first.`,
    className: 'italic text-[#f8fcdc]/90 text-left'
  },
  {
    text: `Only then can control be released,\nthe body allowed to speak,\nand music allowed to emerge simply as sound.`,
    className: 'font-semibold text-[#dc9e63] text-left'
  },
  {
    text: `Sometimes that sound appears as a single note.\nSometimes as a long, stretching silence.\nAnd sometimes as a question he continues to ask himself:`,
    className: 'text-left'
  },
  {
    text: `"Without music, would I still be me?"`,
    className: 'text-center italic text-2xl text-[#dc9e63] mt-10 mb-10',
  },
  {
    text: `Throughout his childhood, Unda spent ten to fifteen hours a day practicing guitar,\nand he began composing music not long after.`,
    className: 'text-left'
  },
  {
    text: `Over time, those sounds were shaped and refined,\nslowly built through the hands of a nineteen-year-old.\n\nThey became songs, melodies,\nand eventually a safe place—\nwhere he could feel completely and quietly himself.`,
    className: 'text-left'
  },
  {
    text: `In his early twenties,\nUnda began spending more time living.\nHe gathered real experiences,\nsought inspiration,\nand met new people,\neach leaving their own trace behind.`,
    className: 'text-left'
  },
  {
    text: `Whether through joy or sorrow, light or darkness,\nmusic has always been the vessel through which he expresses who he is.\nIt continues to carry him,\njust as it did in the beginning.`,
    className: 'text-left'
  },
  {
    text: `All of these sounds eventually came together as his first full-length album:`,
    className: 'italic text-center'
  },
  {
    text: `DARK WONDERFUL WORLD`,
    className: 'text-center text-[#dc9e63] text-2xl sm:text-3xl font-semibold'
  },
  {
    text: `Recorded live for the first time in Thailand\nin April 2024.`,
    className: 'text-sm text-center italic mt-10'
  }
] as const;

// 🚀 Updated section ranges - รวมทุกอย่างเข้า section สุดท้าย
const sectionRanges = [
  [0, 6],
  [6, 11],
  [11, 13], // รวมทั้ง text และ button
] as const;

export default function AboutClientComponent() {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollHintTriggerRef = useRef<HTMLDivElement | null>(null);

  // 🚀 Memoized scroll handler
  const handleScroll = useCallback(() => {
    const rect = scrollHintTriggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (rect.top < window.innerHeight - 300) {
      setShowScrollHint(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 🚀 Memoized viewport settings
  const viewportSettings = useMemo(() => ({ 
    once: true, 
    amount: 0.6 
  }), []);

  return (
    <AppClientWrapper>
      <main className="about-page-main font-[Cinzel] text-[#f8fcdc] px-4 sm:px-8 md:px-16 lg:px-32 py-5 max-w-5xl mx-auto leading-relaxed tracking-wide">
        
        {/* 🎯 Invisible H1 for SEO only */}
        <h1 className="sr-only">About Unda Alunda</h1>

        {/* 🎨 Updated opening sections */}
        <motion.section
          className="min-h-screen flex items-center justify-center text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInSection}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl"
            variants={fadeInUp}
            custom={0}
          >
            Have you ever heard a song that seems to understand you better than you understand yourself?
          </motion.h2>
        </motion.section>

        <motion.section
          ref={scrollHintTriggerRef}
          className="min-h-[60vh] flex items-center justify-center text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInSection}
        >
          <motion.h3
            className="text-2xl sm:text-3xl md:text-4xl"
            variants={fadeInUp}
            custom={1}
          >
            When was the last time you truly felt like yourself?
          </motion.h3>
        </motion.section>

        <motion.section
          className="min-h-screen flex flex-col items-center justify-center text-center space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInSection}
        >
          <motion.p className="text-2xl sm:text-3xl font-light italic tracking-wide" variants={fadeInUp} custom={2}>
            Sometimes, there is something within us that cannot be explained.
          </motion.p>
          <motion.p className="text-xl sm:text-2xl" variants={fadeInUp} custom={3}>
            It is not words.
          </motion.p>
          <motion.p className="text-xl sm:text-2xl" variants={fadeInUp} custom={4}>
            It is not logic.
          </motion.p>
          <motion.p className="text-xl sm:text-2xl text-[#dc9e63] font-semibold" variants={fadeInUp} custom={5}>
            Yet it knows us deeply and clearly,
          </motion.p>
          <motion.p className="text-xl sm:text-2xl italic" variants={fadeInUp} custom={6}>
            even in moments when we barely recognize who we are.
          </motion.p>
        </motion.section>

        {/* 📖 Story sections - Section 1 & 2 */}
        {sectionRanges.slice(0, 2).map(([start, end], sectionIndex) => (
          <motion.section
            key={sectionIndex}
            className="min-h-screen flex flex-col items-center justify-center text-center space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInSection}
          >
            {styledParagraphs.slice(start, end).map((p, i) => (
              <motion.p
                key={i}
                className={`text-lg sm:text-xl ${p.className}`}
                variants={fadeInUp}
                custom={i + 1}
              >
                {p.text}
              </motion.p>
            ))}
          </motion.section>
        ))}

        {/* 📖 Final Section - รวม text + button */}
        <motion.section
          className="min-h-screen flex flex-col items-center justify-center text-center space-y-4 pb-20"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInSection}
        >
          {/* Text content */}
          {styledParagraphs.slice(11, 13).map((p, i) => (
            <motion.p
              key={i}
              className={`text-lg sm:text-xl ${p.className}`}
              variants={fadeInUp}
              custom={i + 1}
            >
              {p.text}
            </motion.p>
          ))}

          {/* 🎥 YouTube Button - ต่อจาก text เลย */}
          <motion.a
            href="https://www.youtube.com/watch?v=ZxudWBd_0KQ&t=947s"
            target="_blank"
            rel="noopener noreferrer"
            className="video-hero-button mt-8"
            style={{ 
              fontWeight: '100',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center'
            }}
            variants={fadeInUp}
            custom={3}
          >
            <svg width="10" height="12" viewBox="0 0 10 12" fill="#f8fcdc" style={{ marginRight: '0.5rem', transition: 'fill 0.3s ease' }}>
              <path d="M0 0L10 6L0 12V0Z"/>
            </svg>
            WATCH FULL VIDEO
          </motion.a>
        </motion.section>

        {/* 🚀 Scroll hint */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-50"
            >
              <motion.p
                className="text-sm sm:text-base italic text-[#f8fcdc]/50"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                scroll down slowly...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </AppClientWrapper>
  );
}