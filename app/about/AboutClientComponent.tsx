//AboutClientComponent.tsx

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppClientWrapper from '@/components/AppClientWrapper';


const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.6,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};


const styledParagraphs = [
  {
    text: `Unda Alunda began hearing those sounds as a child.\nAt the age of 11, he started using the guitar as his own language.\nAnd ever since, "sound" has become both his voice—and his way of being—in this world.`,
    className: 'mt-24 text-left'
  },
  {
    text: `At 15, he began formally studying jazz.\nHe went on to earn top honors in both Theory and Ear Training at the College of Music, Mahidol University, where he studied from high school through graduation.`,
    className: 'text-left'
  },
  {
    text: `From a young age, he believed that to create music free from bias and stylistic constraint—\nto truly honor spirit, imagination, creativity, and feeling above tradition or theory—`,
    className: 'italic text-[#f8fcdc]/90 text-left'
  },
  {
    text: `One must first possess enough knowledge and discipline\nto let go of control.\nTo let the body speak.\nTo let music come through… as sound.`,
    className: 'font-semibold text-[#dc9e63] text-left'
  },
  {
    text: `Sometimes it arrives as a note.\nSometimes as a long, stretching silence.\nAnd sometimes… as a question he keeps asking himself:`,
    className: 'text-left'
  },
  {
    text: `“Without music… would I still be me?”`,
  className: 'text-center italic text-2xl text-[#dc9e63] mt-10 mb-10',
  },
  {
    text: `Unda spent much of his childhood practicing guitar 10–15 hours a day,\nand began composing music not long after.`,
    className: 'text-left'
  },
  {
    text: `Those sounds were gradually shaped and refined,\nbuilt up slowly from the hands of a 19-year-old.\n\nThey became songs.\nThey became melodies.\nAnd eventually… they became a safe place—\nwhere he could feel completely, quietly, himself.`,
    className: 'text-left'
  },
  {
    text: `That journey led him to the stage of Overdrive Guitar Contest XI,\nthe biggest guitar competition in Thailand,\nwhere he performed Against and First Aid,\ntwo original songs born from trial, error, and inner searching.`,
    className: 'text-left'
  },
  {
    text: `He shared them publicly for the first time—\nand won first prize.`,
    className: 'font-semibold text-center'
  },
  {
    text: `It was the moment when the name “Unda Alunda” first began to be spoken in Thailand.`,
    className: 'text-center font-semibold mb-15'
  },
  {
    text: `Not long after,\nhe won Hardrock Pattaya Guitar Battle 2019,\njudged by world-class artists Alex Hutchings and Matteo Mancuso—\na milestone that further amplified the reach of his voice.`,
    className: 'text-left mt-10'
  },
  {
    text: `But that voice wouldn’t stay within Thailand for long.`,
    className: 'italic text-left mb-10'
  },
  {
    text: `In 2020, he submitted an entry to the international Abasi Neural Contest,\nheld by Neural DSP in collaboration with Tosin Abasi of Animals as Leaders.\nOut of over 600 submissions from around the world—he won.`,
    className: 'text-left'
  },
  {
    text: `Not only did he earn the judges’ respect,\nbut Tosin also invited him to officially join Abasi Concepts as a signed artist.`,
    className: 'text-left'
  },
  {
    text: `The following year, he received the highest jury scores\nfrom Aaron Marshall (Intervals), Jakub Zytecki, and Sam Jacobs\nin the MRNB Contest, which featured thousands of players globally.`,
    className: 'text-left'
  },
  {
    text: `And slowly, his name began to spread—\nhis Instagram following grew steadily\nas many world-renowned guitarists and composers\nbegan to listen.\nTo pay attention.\nTo hear what he had to say… through sound.`,
    className: 'text-left'
  },
  {
    text: `In his early twenties,\nUnda began spending more time living—\ngathering real experiences,\nseeking inspiration,\nmeeting new people,\neach of whom left a trace.`,
    className: 'text-left'
  },
  {
    text: `Whether joy or sorrow, light or darkness,\nmusic has always been the vessel through which he’s expressed who he is.\nAnd it continues to carry him—\nas it did in the beginning.`,
    className: 'text-left'
  },
  {
    text: `Until finally…\nthose sounds came together as his first full-length album:`,
    className: 'italic text-center'
  },
  {
    text: `DARK WONDERFUL WORLD`,
    className: 'text-center text-[#dc9e63] text-2xl sm:text-3xl font-semibold'
  },
  {
    text: `Recorded live for the first time in Thailand\nin April 2024.`,
    className: 'text-sm text-center italic mt-10'
  },
  {
    text: `Live performance at Mahidol University, Nakhon Pathom in Thailand.`,
    className: 'text-sm text-center italic mb-24'
  }
];


const sectionRanges = [
  [0, 6],
  [6, 11],
  [11, 17],
  [17, 19],
  [19, 23],
];

export default function AboutClientComponent() {

  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollHintTriggerRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const handleScroll = () => {
    const rect = scrollHintTriggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (rect.top < window.innerHeight - 300) {
      setShowScrollHint(false);
    }
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  return (
    <AppClientWrapper>
    <main className="about-page-main font-[Cinzel] text-[#f8fcdc] px-4 sm:px-8 md:px-16 lg:px-32 py-5 max-w-5xl mx-auto leading-relaxed tracking-wide">
      <motion.section
        className="min-h-screen flex items-center justify-center text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInSection}
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl"
          variants={fadeInUp}
          custom={0}
        >
          Have you ever heard a song that seems to know you better than you know yourself..?
        </motion.h1>
      </motion.section>

      <motion.section
  ref={scrollHintTriggerRef}
  className="min-h-[60vh] flex items-center justify-center text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeInSection}
      >
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl"
          variants={fadeInUp}
          custom={1}
        >
          When was the last time you truly felt like… yourself..?
        </motion.h2>
      </motion.section>

      <motion.section
        className="min-h-screen flex flex-col items-center justify-center text-center space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeInSection}
      >
        <motion.p className="text-2xl sm:text-3xl font-light italic tracking-wide" variants={fadeInUp} custom={2}>
          Sometimes, there's something within us that defies explanation.
        </motion.p>
        <motion.p className="text-xl sm:text-2xl" variants={fadeInUp} custom={3}>
          It's not words.
        </motion.p>
        <motion.p className="text-xl sm:text-2xl" variants={fadeInUp} custom={4}>
          It's not logic.
        </motion.p>
        <motion.p className="text-xl sm:text-2xl text-[#dc9e63] font-semibold" variants={fadeInUp} custom={5}>
          But it knows us—deeply, clearly.
        </motion.p>
        <motion.p className="text-xl sm:text-2xl italic" variants={fadeInUp} custom={6}>
          Even in moments when we barely recognize ourselves.
        </motion.p>
      </motion.section>

      {sectionRanges.map(([start, end], sectionIndex) => (
        <motion.section
          key={sectionIndex}
          className="min-h-screen flex flex-col items-center justify-center text-center space-y-4 "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
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

            {/* Floating Scroll Hint */}
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
