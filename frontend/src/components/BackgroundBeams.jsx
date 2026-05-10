import React from 'react';

export default function BackgroundBeams() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base Gradient Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M64 0H0V64' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '64px 64px'
        }}
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.015] noise-bg mix-blend-overlay" />

      {/* Animated Gradient Blobs */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[1400px] bg-accent/25 blur-[150px] rounded-full animate-float-slow" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[800px] bg-purple-500/15 blur-[120px] rounded-full animate-float-medium" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[700px] bg-indigo-500/12 blur-[100px] rounded-full animate-float-slow" style={{ animationDelay: '2s' }} />
    </div>
  );
}
