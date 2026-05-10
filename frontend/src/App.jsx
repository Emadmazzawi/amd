import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Play, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import BackgroundBeams from './components/BackgroundBeams';
import SpotlightCard from './components/SpotlightCard';

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Settings
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);

  const handleOptimize = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      // The FastAPI server must be running and allow CORS
      const prompt = `<|im_start|>system\nYou are an expert VLSI Verification Co-Pilot. Optimize the given Verilog code for synthesis, prevent latches, and fix testbench races.<|im_end|>\n<|im_start|>user\nInstruction: Optimize the following Verilog module for hardware synthesis.\n\nCode:\n${code}<|im_end|>\n<|im_start|>assistant\n`;

      const response = await fetch('http://localhost:8000/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          temperature: temperature,
          max_tokens: maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setOutput(data.choices[0].text);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-foreground overflow-x-hidden selection:bg-accent/30">
      <BackgroundBeams />

      <main className="container mx-auto px-4 py-12 md:py-24 max-w-7xl relative z-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent-bright text-xs font-mono tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-bright animate-pulse" />
            AMD MI300X ACCELERATED
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight">
            VLSI Verification <br/>
            <span className="bg-gradient-to-r from-[#5E6AD2] via-indigo-400 to-[#5E6AD2] bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] bg-clip-text text-transparent">
              Co-Pilot
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto">
            Hardware synthesis optimization powered by fine-tuned Qwen 3.5 architecture.
            Eliminate latches, prevent races, and verify logic instantly.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Settings Sidebar (col-span-3) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 space-y-6"
          >
            <SpotlightCard className="p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-semibold tracking-tight">Parameters</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm text-foreground-muted">Temperature</label>
                    <span className="text-xs font-mono text-accent-bright">{temperature}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1" 
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-accent bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm text-foreground-muted">Max Tokens</label>
                    <span className="text-xs font-mono text-accent-bright">{maxTokens}</span>
                  </div>
                  <input 
                    type="range" 
                    min="256" max="4096" step="256" 
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full accent-accent bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer" 
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-foreground-subtle flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    Ensure backend FastAPI server is running on port 8000.
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Main Editor (col-span-9) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Input Panel */}
            <SpotlightCard className="p-0 flex flex-col h-[600px]">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-black/20">
                <h3 className="text-sm font-medium tracking-tight">Input Verilog</h3>
                <span className="text-xs font-mono text-foreground-subtle">.v</span>
              </div>
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="module my_design (...);"
                className="flex-1 w-full bg-transparent resize-none p-6 text-sm font-mono text-foreground-muted focus:text-foreground focus:outline-none focus:ring-0 leading-relaxed"
                spellCheck={false}
              />
              <div className="p-4 border-t border-white/[0.06] bg-black/20">
                <button 
                  onClick={handleOptimize}
                  disabled={isLoading || !code.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-accent text-white font-medium shadow-accent-glow hover:bg-accent-bright transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  {isLoading ? 'Synthesizing...' : 'Optimize & Verify'}
                </button>
              </div>
            </SpotlightCard>

            {/* Output Panel */}
            <SpotlightCard className="p-0 flex flex-col h-[600px]">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-black/20">
                <h3 className="text-sm font-medium tracking-tight flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Optimized Output
                </h3>
              </div>
              <div className="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {error ? (
                  <div className="text-red-400 bg-red-400/10 border border-red-400/20 p-4 rounded-lg">
                    {error}
                  </div>
                ) : output ? (
                  <div className="text-foreground">{output}</div>
                ) : (
                  <div className="h-full flex items-center justify-center text-foreground-subtle text-center">
                    Awaiting Verilog input...
                  </div>
                )}
              </div>
            </SpotlightCard>

          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;
