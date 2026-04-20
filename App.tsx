
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatBubble from './components/ChatBubble';
import { Message, IndustryPreset, AppState } from './types';
import { INDUSTRY_PRESETS } from './constants';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPreset, setCurrentPreset] = useState<IndustryPreset>(INDUSTRY_PRESETS[0]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, appState]);

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || appState === AppState.LOADING) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setAppState(AppState.LOADING);

    try {
      const response = await geminiService.getResponse(
        userMsg.content,
        messages,
        currentPreset.systemInstruction,
        currentPreset.id
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMsg]);
      setAppState(AppState.IDLE);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  }, [inputValue, messages, currentPreset, appState]);

  const handleReset = () => {
    setMessages([]);
    geminiService.resetChat();
    setAppState(AppState.IDLE);
  };

  const handlePresetChange = (preset: IndustryPreset) => {
    setCurrentPreset(preset);
    handleReset();
    setShowMobileSidebar(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside className={`fixed inset-y-0 left-0 transform ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
        <Sidebar 
          currentPreset={currentPreset} 
          onPresetChange={handlePresetChange} 
          onReset={handleReset} 
        />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white md:bg-transparent">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shadow-sm md:shadow-none z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMobileSidebar(true)}
              className="p-2 -ml-2 text-slate-500 md:hidden hover:bg-slate-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentPreset.icon}</span>
              <div>
                <h2 className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                  {currentPreset.name} Chat
                </h2>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Multilingual Active</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Fast NLP
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5c1.382 3.307 3.416 6.333 5.861 9.048m-9.362 0c2.445-2.715 4.479-5.741 5.861-9.048M12.751 5V3m-4.703 2c.288.751.644 1.484 1.062 2.193" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Agnostic
            </span>
          </div>
        </header>

        {/* Messages Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 bg-slate-50/50"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-4xl shadow-inner border border-indigo-100">
                {currentPreset.icon}
              </div>
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Welcome to LinguoBot</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Start typing in any language. Our system will automatically detect it and respond in kind, providing context-aware {currentPreset.name.toLowerCase()} support.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Hello!', 'Bonjour!', 'Hola!', '你好!', 'こんにちは!'].map((greet) => (
                  <button 
                    key={greet}
                    onClick={() => {
                      setInputValue(greet);
                    }}
                    className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    {greet}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))
          )}
          
          {appState === AppState.LOADING && (
            <div className="flex justify-start mb-4">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  AI
                </div>
                <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {appState === AppState.ERROR && (
            <div className="flex justify-center my-4">
              <div className="px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Engine Error. Please check your connection or reset the chat.
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <form 
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto relative flex items-center gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Type a message in any language...`}
                disabled={appState === AppState.LOADING}
                className="w-full pl-5 pr-14 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-300 border border-slate-200 px-1.5 py-0.5 rounded">Enter</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!inputValue.trim() || appState === AppState.LOADING}
              className="p-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl transition-all shadow-lg shadow-indigo-200 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="mt-3 text-center text-[10px] text-slate-400 font-medium">
            Powered by Linguo Engine • Automatic Language Detection Enabled
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
