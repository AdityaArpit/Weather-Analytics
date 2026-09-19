import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, Loader2, Send, Sparkles, User, Volume2, VolumeX, X } from 'lucide-react';
import type { CitedSource, EvidenceBundle } from '../../types/disaster';
import { apiUrl } from '../../lib/api';
import { AudioRecorderButton } from '../common/AudioRecorderButton';
import { ChatSkeleton } from '../common/Skeletons';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  associatedBundle?: EvidenceBundle | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: CitedSource[];
}

function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[S\d+\]/gi, ' ')
    .replace(/[*_`>#-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  associatedBundle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setMessages((current) => current.length ? current : [{
      id: 'welcome',
      role: 'assistant',
      content: associatedBundle
        ? `Hello. I can answer using verified evidence for **${associatedBundle.eventName}**.`
        : 'Hello. Ask about verified Indian weather and disaster events. I will cite sources when evidence is available.',
      sources: [],
    }]);
  }, [isOpen, associatedBundle]);

  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
  }, [messages, isRunning]);

  const playTTS = async (text: string) => {
    const cleanText = stripMarkdownForSpeech(text);
    if (!cleanText) return;
    if (isPlayingAudio) {
      audioRef.current?.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    try {
      const response = await fetch(apiUrl('/api/tts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voiceName: 'Kore' }),
      });
      const data = await response.json().catch(() => null);
      if (data?.audioBase64) {
        const audio = audioRef.current || new Audio();
        audioRef.current = audio;
        audio.src = `data:audio/mp3;base64,${data.audioBase64}`;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
      } else if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-IN';
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const sendMessage = async (text: string) => {
    const message = text.trim();
    if (!message || isRunning) return;
    setMessages((current) => [...current, { id: `u-${Date.now()}`, role: 'user', content: message }]);
    setInputValue('');
    setIsRunning(true);
    try {
      const response = await fetch(apiUrl('/api/past/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: messages.filter((item) => item.id !== 'welcome').map((item) => ({ role: item.role, content: item.content })),
          associatedBundle,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.details || data?.error || 'AI Assistant query failed');
      setMessages((current) => [...current, {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: String(data?.reply || 'No grounded answer was available.'),
        sources: Array.isArray(data?.sources) ? data.sources : [],
      }]);
    } catch (err) {
      setMessages((current) => [...current, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: (err as Error).message || 'The assistant could not complete that request.',
        sources: [],
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-white border-l border-[#DDDDDD] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      <audio ref={audioRef} className="hidden" />
      <div className="p-4 sm:p-5 border-b border-[#DDDDDD] flex items-center justify-between bg-[#ECF8F8]/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0F1B29] flex items-center justify-center text-white font-bold shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#0F1B29]">AI Research Assistant</h3>
            <p className="text-[11px] text-[#747F8D]">English-only, evidence grounded</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="p-1.5 rounded-xl text-[#747F8D] hover:text-[#0F1B29] hover:bg-[#ECF8F8] transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div ref={viewportRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';
          return (
            <div key={message.id} className={`flex gap-3 items-start ${isAssistant ? '' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isAssistant ? 'bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD]' : 'bg-[#0F1B29] text-white'}`}>
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`space-y-1.5 max-w-[86%] ${isAssistant ? 'text-left' : 'text-right'}`}>
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${isAssistant ? 'bg-white border border-[#DDDDDD] rounded-tl-none text-[#0F1B29]' : 'bg-[#0F1B29] text-white rounded-tr-none shadow-sm'}`}>
                  {isAssistant ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown> : message.content}
                </div>
                {isAssistant && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => void playTTS(message.content)}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-xl border transition-colors ${isPlayingAudio ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-[#0F1B29] bg-white border-[#DDDDDD] hover:bg-[#ECF8F8]'}`}
                    >
                      {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
                    </button>
                    {message.sources?.map((source) => (
                      <a key={source.id} href={source.url} target="_blank" rel="noreferrer noopener" className="text-[10px] px-1.5 py-0.5 rounded bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD]">
                        [{source.id}]
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isRunning && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#ECF8F8] text-[#0F1B29] border border-[#DDDDDD]">
              <Bot className="w-4 h-4" />
            </div>
            <div className="space-y-2 rounded-2xl border border-[#DDDDDD] bg-[#ECF8F8]/60 p-3.5 w-72 sm:w-80 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F1B29] px-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#747F8D]" />
                <span>Reviewing evidence...</span>
              </div>
              <ChatSkeleton />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage(inputValue);
        }}
        className="p-3 sm:p-4 border-t border-[#DDDDDD] bg-[#ECF8F8]/40 flex items-end gap-2"
      >
        <AudioRecorderButton
          onTranscribed={(text) => setInputValue(text)}
          tooltip="Record voice query"
          className="p-2 shrink-0 bg-white border border-[#DDDDDD] hover:bg-[#ECF8F8] rounded-xl"
        />
        <textarea
          rows={1}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Ask a disaster intelligence question..."
          className="min-h-10 max-h-28 flex-1 resize-none px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-[#DDDDDD] text-[#0F1B29] placeholder:text-slate-400 focus:outline-none focus:border-[#747F8D] focus:ring-2 focus:ring-[#DDDDDD]/40 shadow-sm"
        />
        <button type="submit" disabled={!inputValue.trim() || isRunning} className="p-2.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 disabled:opacity-50 text-white shadow-sm shrink-0">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AIAssistantDrawer;
