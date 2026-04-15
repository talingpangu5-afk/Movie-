'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'motion/react'

const codeLines = [
  'import ai_engine as ai',
  '',
  'def fetch_movie_stream(movie_id):',
  '    # Initializing AI neural stream',
  '    stream = ai.NeuralStream(id=movie_id)',
  '    ',
  '    if stream.is_ready():',
  '        print(f"Streaming: {stream.title}")',
  '        return stream.render(quality="8K")',
  '    ',
  '    return ai.optimize_buffer()',
  '',
  '# Live Engine Status: ACTIVE',
  'fetch_movie_stream("tmdb_81125")'
]

export function PythonEngine() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Fixed particle data to satisfy React 19 purity requirements
  const particles = [
    { id: 0, x: '12%', y: '45%', opacity: 0.3, duration: 4.2 },
    { id: 1, x: '85%', y: '12%', opacity: 0.5, duration: 5.1 },
    { id: 2, x: '34%', y: '78%', opacity: 0.2, duration: 3.8 },
    { id: 3, x: '67%', y: '23%', opacity: 0.4, duration: 6.2 },
    { id: 4, x: '21%', y: '89%', opacity: 0.6, duration: 4.5 },
    { id: 5, x: '55%', y: '56%', opacity: 0.3, duration: 5.7 },
    { id: 6, x: '92%', y: '34%', opacity: 0.4, duration: 3.2 },
    { id: 7, x: '15%', y: '67%', opacity: 0.5, duration: 4.9 },
    { id: 8, x: '48%', y: '15%', opacity: 0.2, duration: 6.5 },
    { id: 9, x: '73%', y: '82%', opacity: 0.3, duration: 5.3 },
    { id: 10, x: '5%', y: '28%', opacity: 0.4, duration: 4.1 },
    { id: 11, x: '39%', y: '95%', opacity: 0.2, duration: 5.8 },
    { id: 12, x: '62%', y: '41%', opacity: 0.5, duration: 3.5 },
    { id: 13, x: '88%', y: '73%', opacity: 0.3, duration: 6.1 },
    { id: 14, x: '27%', y: '10%', opacity: 0.4, duration: 4.7 },
    { id: 15, x: '51%', y: '62%', opacity: 0.2, duration: 5.4 },
    { id: 16, x: '79%', y: '39%', opacity: 0.5, duration: 3.9 },
    { id: 17, x: '43%', y: '85%', opacity: 0.3, duration: 6.3 },
    { id: 18, x: '18%', y: '52%', opacity: 0.4, duration: 4.4 },
    { id: 19, x: '95%', y: '18%', opacity: 0.2, duration: 5.6 }
  ]

  useEffect(() => {
    if (isPaused) return

    if (currentLineIndex < codeLines.length) {
      const currentLine = codeLines[currentLineIndex]
      
      if (currentCharIndex < currentLine.length) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1)
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setDisplayedLines(prev => [...prev, currentLine])
          setCurrentLineIndex(prev => prev + 1)
          setCurrentCharIndex(0)
        }, 200)
        return () => clearTimeout(timeout)
      }
    } else {
      // Loop after a delay
      const timeout = setTimeout(() => {
        setDisplayedLines([])
        setCurrentLineIndex(0)
        setCurrentCharIndex(0)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [currentLineIndex, currentCharIndex, isPaused])

  const renderLine = (line: string, isCurrent: boolean = false) => {
    const text = isCurrent ? line.slice(0, currentCharIndex) : line
    
    // Simple syntax highlighting
    return text.split(/(\s+|[().,="':#]|def|import|as|if|return|print)/).map((part, i) => {
      if (['def', 'import', 'as', 'if', 'return'].includes(part)) {
        return <span key={i} className="text-blue-400 font-bold">{part}</span>
      }
      if (part === 'print') {
        return <span key={i} className="text-yellow-400">{part}</span>
      }
      if (part.startsWith('"') || part.startsWith("'") || part.startsWith('f"')) {
        return <span key={i} className="text-green-400">{part}</span>
      }
      if (part.startsWith('#')) {
        return <span key={i} className="text-gray-500 italic">{part}</span>
      }
      if (['(', ')', '.', ',', '=', ':', '"', "'"].includes(part)) {
        return <span key={i} className="text-gray-300">{part}</span>
      }
      return <span key={i} className="text-white">{part}</span>
    })
  }

  return (
    <section className="relative w-full py-12 overflow-hidden bg-gradient-to-b from-black via-blue-950/20 to-black">
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{ 
              x: p.x, 
              y: p.y,
              opacity: p.opacity
            }}
            animate={{ 
              y: [null, '-20px', '20px'],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          {/* Engine Label */}
          <div className="flex items-center gap-2 mb-3 px-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400/80">
              Live Python Engine Running...
            </span>
          </div>

          {/* Editor Container */}
          <div 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative group cursor-default"
          >
            {/* Neon Border Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            
            {/* Glassmorphism Editor */}
            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">main.py</span>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm sm:text-base min-h-[240px] leading-relaxed">
                {displayedLines.map((line, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="w-4 text-white/20 text-right select-none">{i + 1}</span>
                    <div>{renderLine(line)}</div>
                  </div>
                ))}
                
                {currentLineIndex < codeLines.length && (
                  <div className="flex gap-4">
                    <span className="w-4 text-white/20 text-right select-none">{currentLineIndex + 1}</span>
                    <div className="flex items-center">
                      {renderLine(codeLines[currentLineIndex], true)}
                      <motion.div
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-1.5 h-5 bg-blue-500 ml-0.5"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-1 w-full bg-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentLineIndex / codeLines.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
