import React from 'react';
import { Sparkles, Radio, Brain, ShieldAlert } from 'lucide-react';
import { IndiaMapHero } from './IndiaMapHero';
interface HeroPageProps {
  onExplore: () => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({ onExplore }) => {
  // Backend warm-up moved to App.tsx: one /api/health ping fires on app mount
  // (covers every route), so the Render instance wakes before real data calls.

  return (
    <div className="w-full min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] md:min-h-0 md:max-h-[calc(100vh-64px)] bg-[#ECF8F8] text-[#0F1B29] flex flex-col justify-center font-sans px-4 sm:px-6 lg:px-8 py-2 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-0">
        
        {/* Left Column: Text Content and Animated Feature Cards directly below */}
        <div className="md:col-span-6 space-y-4 flex flex-col justify-center animate-in fade-in slide-in-from-left-4 duration-500 min-h-0">
          
          {/* Sparkle Badge with three dots */}
          <div className="space-y-1.5 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex gap-1 pl-3">
              <span className="w-1 h-1 rounded-full bg-[#0F1B29]/40 animate-pulse" />
              <span className="w-1 h-1 rounded-full bg-[#0F1B29]/40 animate-pulse delay-75" />
              <span className="w-1 h-1 rounded-full bg-[#0F1B29]/40 animate-pulse delay-150" />
            </div>
            <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#DDDDDD]/60 border border-[#DDDDDD] text-[#0F1B29] text-[10px] font-bold uppercase tracking-wider w-fit">
              <span>DATABASE-FIRST DISASTER INTELLIGENCE</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-normal leading-[1.1] text-[#0F1B29] tracking-tight">
            Verify the signal.<br />
            Respond <span className="font-bold">with evidence</span>.
          </h1>

          {/* Horizontal Divider Line */}
          <div className="w-20 h-[3px] bg-[#0F1B29]" />

          {/* Subtitle */}
          <p className="text-[#747F8D] text-xs sm:text-sm leading-relaxed max-w-lg">
            A national weather and disaster intelligence platform that turns official feeds, verified reports, and grounded analysis into timely situational awareness.
          </p>

          {/* Action Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-[#DDDDDD] hover:bg-[#0F1B29] hover:text-white border border-[#DDDDDD] hover:border-[#0F1B29] text-[#0F1B29] font-bold text-xs transition-all duration-300 shadow-xs cursor-pointer"
            >
              Explore Platform &rarr;
            </button>
          </div>

          {/* Feature Cards: Animated cards with entrance delays and hover micro-lifts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            
            {/* Card 1: Real-time Monitoring */}
            <div 
              onClick={onExplore}
              className="bg-white border border-[#DDDDDD] rounded-xl p-3.5 flex flex-col justify-between gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:border-[#747F8D]/50 hover:bg-[#ECF8F8]/20 group cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75"
            >
              <div className="w-8 h-8 rounded-lg bg-[#DDDDDD] text-[#0F1B29] flex items-center justify-center shrink-0 group-hover:bg-[#0F1B29] group-hover:text-white transition-colors duration-300">
                <Radio className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-[11px] text-[#0F1B29]">Real-time Monitoring</h3>
                <p className="text-[10px] text-[#747F8D] leading-relaxed">
                  Track active alerts and meteorological telemetry as they unfold.
                </p>
              </div>
            </div>

            {/* Card 2: Grounded Intelligence */}
            <div 
              onClick={onExplore}
              className="bg-white border border-[#DDDDDD] rounded-xl p-3.5 flex flex-col justify-between gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:border-[#747F8D]/50 hover:bg-[#ECF8F8]/20 group cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150"
            >
              <div className="w-8 h-8 rounded-lg bg-[#DDDDDD] text-[#0F1B29] flex items-center justify-center shrink-0 group-hover:bg-[#0F1B29] group-hover:text-white transition-colors duration-300">
                <Brain className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-[11px] text-[#0F1B29]">Grounded Intelligence</h3>
                <p className="text-[10px] text-[#747F8D] leading-relaxed">
                  Search verified event records with source citations and clear confidence.
                </p>
              </div>
            </div>

            {/* Card 3: Faster Response */}
            <div 
              onClick={onExplore}
              className="bg-white border border-[#DDDDDD] rounded-xl p-3.5 flex flex-col justify-between gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:border-[#747F8D]/50 hover:bg-[#ECF8F8]/20 group cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300"
            >
              <div className="w-8 h-8 rounded-lg bg-[#DDDDDD] text-[#0F1B29] flex items-center justify-center shrink-0 group-hover:bg-[#0F1B29] group-hover:text-white transition-colors duration-300">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-[11px] text-[#0F1B29]">Faster Response</h3>
                <p className="text-[10px] text-[#747F8D] leading-relaxed">
                  Access evacuation bearing guidance and local emergency helplines.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: India Map Illustration (Increased map width ratio) */}
        <div className="md:col-span-6 flex items-center justify-center animate-in fade-in slide-in-from-right-4 duration-500 min-h-0 overflow-hidden">
          <IndiaMapHero />
        </div>

      </div>
    </div>
  );
};

export default HeroPage;
