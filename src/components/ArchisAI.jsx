import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Plus, 
  MessageSquare, 
  Sparkles, 
  Paperclip, 
  Settings, 
  Database, 
  ArrowUp,
  Cpu,
  ShieldCheck
} from 'lucide-react';

const INITIAL_SESSIONS = [
  { id: '1', title: 'Jamabandi Record Audit #42', timestamp: 'Today' },
  { id: '2', title: 'GIS Boundary & Survey Match', timestamp: 'Yesterday' },
  { id: '3', title: 'Mutation History Cross-Check', timestamp: '3 days ago' },
];

const SUGGESTED_PROMPTS = [
  "Analyze uploaded Jamabandi for active encumbrances",
  "Cross-verify survey number KH-428/21 with GIS maps",
  "Detect historical title discrepancies or litigation",
  "Summarize chain of ownership for the last 30 years"
];

export default function ArchisAI() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Good day, Officer. I am **Archis AI**, your intelligent land governance and document verification assistant. How can I help you audit records, cross-verify spatial datasets, or analyze titles today?',
      timestamp: '10:30 AM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiResponseText = `I have analyzed your query regarding **"${query}"**. Based on connected state land registry revenue databases and OCR nodes:`;
      
      if (query.toLowerCase().includes('jamabandi') || query.toLowerCase().includes('encumbrance')) {
        aiResponseText += `\n\n- **Status**: Verified Clean\n- **Active Mortgages**: None recorded in the last 15 years.\n- **Current Title Holder**: Sukhdev Singh (Freehold)\n- **Confidence Score**: 98.9% match across revenue department databases.`;
      } else if (query.toLowerCase().includes('gis') || query.toLowerCase().includes('survey')) {
        aiResponseText += `\n\n- **Spatial Alignment**: Polygon coordinates match cadastral map sheet #14-B with zero overlap anomalies.\n- **Boundary Variance**: Within permissible government survey tolerance limits (< 0.2m).`;
      } else {
        aiResponseText += `\n\n- **Document Integrity**: Digital watermarks and registry stamps authenticated successfully.\n- **Recommendation**: Ready for final ledger commitment and mutation approval.`;
      }

      const aiMessage = {
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession = {
      id: newId,
      title: 'New Investigation',
      timestamp: 'Just now'
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setMessages([
      {
        role: 'assistant',
        content: 'New audit session initialized. Upload documents or ask a question to begin investigation.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex h-full min-h-[75vh] bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Sidebar - Chat History */}
      <div className={`w-72 bg-zinc-900/60 border-r border-zinc-800/80 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'}`}>
        <div className="p-4 border-b border-zinc-800/80">
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold shadow-lg shadow-emerald-500/10 transition-all cursor-pointer ${!isSidebarOpen && 'md:px-2'}`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className={`${!isSidebarOpen && 'md:hidden'}`}>New Investigation</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {isSidebarOpen && <p className="px-3 py-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Recent Audits</p>}
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${activeSessionId === session.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'}`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              {isSidebarOpen && (
                <div className="overflow-hidden truncate">
                  <p className="truncate">{session.title}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{session.timestamp}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-zinc-800/80 flex items-center justify-between text-zinc-500">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-mono text-zinc-400 text-[11px]">Archis Node v2.4</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 cursor-pointer mx-auto"
            title="Toggle Sidebar"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Interface Area */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                Archis AI Assistant
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">Online</span>
              </h2>
              <p className="text-xs text-zinc-400">Land Record OCR, Spatial Harmonization & Decision Support Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
              <Database className="w-3.5 h-3.5 text-emerald-400" /> State Node Active
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`space-y-1.5 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-emerald-600 text-black font-medium rounded-tr-sm' : 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 rounded-tl-sm'}`}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-600 font-mono px-1">{msg.timestamp}</p>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-start gap-4 max-w-3xl animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
                Archis AI is parsing land records and querying vector spatial databases...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 2 && (
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3 max-w-4xl mx-auto bg-black/60 border border-zinc-800 rounded-2xl p-2 focus-within:border-emerald-500/50 transition-all shadow-inner"
          >
            <button
              type="button"
              className="p-2 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              title="Attach Document"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Archis AI about land titles, survey numbers, or OCR results..."
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none px-2"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isGenerating}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black transition-all cursor-pointer shadow-md"
            >
              <ArrowUp className="w-4 h-4 font-bold" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}