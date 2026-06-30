'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { ChatMessage, PlanModification } from '@/types';
import {
  Send,
  Loader2,
  Bot,
  User,
  Trash2,
  Sparkles,
  Check,
  X,
  RefreshCw,
  Zap,
} from 'lucide-react';

const suggestedQuestions = [
  'What exercises burn the most fat?',
  'Suggest a pre-workout meal',
  'How to improve my squat form?',
  'Change my breakfast plan',
];

export default function AiCoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [modifications, setModifications] = useState<PlanModification[] | null>(null);
  const [modSummary, setModSummary] = useState('');
  const [showModModal, setShowModModal] = useState(false);
  const [applyingMod, setApplyingMod] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (res.ok) setMessages(data.messages || []);
    } catch {
      console.error('Failed to load chat history');
    } finally {
      setFetchingHistory(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      user_id: '',
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to send message');
        return;
      }

      const aiMsg: ChatMessage = {
        id: `temp-ai-${Date.now()}`,
        user_id: '',
        role: 'assistant',
        content: data.message,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);

      if (data.has_plan_modification && data.modification_request) {
        await handlePlanModification(data.modification_request);
      }
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanModification = async (modRequest: string) => {
    try {
      const res = await fetch('/api/fitness-plan/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modification_request: modRequest }),
      });
      const data = await res.json();
      if (res.ok && data.modifications) {
        setModifications(data.modifications);
        setModSummary(data.summary || '');
        setShowModModal(true);
      }
    } catch {
      console.error('Failed to generate modifications');
    }
  };

  const handleApplyModifications = async () => {
    if (!modifications) return;
    setApplyingMod(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: currentPlan } = await supabase
        .from('fitness_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!currentPlan) { toast.error('No active plan found'); return; }

      const updatedPlanData = { ...currentPlan.plan_data };
      for (const mod of modifications) {
        if (mod.section in updatedPlanData) {
          (updatedPlanData as Record<string, unknown>)[mod.section] = mod.proposed_value;
        }
      }

      const res = await fetch('/api/fitness-plan/modify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: currentPlan.id, updated_plan_data: updatedPlanData }),
      });

      if (res.ok) {
        setShowModModal(false);
        setModifications(null);
        toast.success('Plan updated! Check your Fitness Plan page. ✅');
      } else {
        toast.error('Failed to apply changes');
      }
    } catch {
      toast.error('Failed to apply modifications');
    } finally {
      setApplyingMod(false);
    }
  };

  const clearChat = async () => {
    try {
      const res = await fetch('/api/chat', { method: 'DELETE' });
      if (res.ok) { setMessages([]); toast.success('Chat cleared'); }
    } catch {
      toast.error('Failed to clear chat');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (fetchingHistory) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(91,140,255,0.3)' }}>
            <Loader2 size={22} className="animate-spin text-white" />
          </div>
          <p style={{ color: '#7C849A', fontSize: '0.875rem' }}>Loading your conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-fade-in-up" style={{ height: 'calc(100vh - 5rem)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between mb-4 flex-shrink-0"
        style={{
          background: 'rgba(14, 20, 40, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '18px',
          padding: '14px 20px',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(91,140,255,0.3)',
            }}
            className="animate-pulse-glow"
          >
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight" style={{ color: '#FFFFFF' }}>AI Coach</h1>
            <div className="flex items-center gap-1.5">
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
              <span style={{ fontSize: '0.7rem', color: '#7C849A' }}>Powered by Gemini 2.5 Flash · Online</span>
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
              color: '#EF4444',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
            }}
          >
            <Trash2 size={13} />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1" style={{ minHeight: 0 }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 16px 48px rgba(91,140,255,0.3)',
              }}
              className="animate-pulse-glow"
            >
              <Sparkles size={34} className="text-white" />
            </div>
            <h2 className="text-lg font-bold mb-2 tracking-tight" style={{ color: '#FFFFFF' }}>
              Hey there! I&apos;m your AI Coach 💪
            </h2>
            <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: '#B8C0D4' }}>
              Ask me anything about fitness, nutrition, exercises, or request changes to your plan.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: 'rgba(14,20,40,0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#B8C0D4',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    backdropFilter: 'blur(12px)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.1)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,140,255,0.25)';
                    (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(14,20,40,0.6)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.color = '#B8C0D4';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{
              animation: 'fade-in-up 0.3s ease-out forwards',
              animationDelay: `${Math.min(index * 30, 300)}ms`,
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            {msg.role === 'assistant' && (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px',
                  boxShadow: '0 4px 12px rgba(91,140,255,0.3)',
                }}
              >
                <Bot size={15} className="text-white" />
              </div>
            )}

            <div
              style={{
                maxWidth: '78%',
                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                padding: '12px 16px',
                fontSize: '0.875rem',
                lineHeight: '1.65',
                ...(msg.role === 'user'
                  ? {
                      background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 20px rgba(91,140,255,0.25)',
                    }
                  : {
                      background: 'rgba(14, 20, 40, 0.7)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: '#FFFFFF',
                    }
                ),
              }}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div
                style={{
                  fontSize: '0.65rem',
                  marginTop: '6px',
                  color: msg.role === 'user' ? 'rgba(255,255,255,0.55)' : '#7C849A',
                }}
              >
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {msg.role === 'user' && (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(14,20,40,0.7)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px',
                }}
              >
                <User size={15} style={{ color: '#B8C0D4' }} />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '4px',
                boxShadow: '0 4px 12px rgba(91,140,255,0.3)',
              }}
            >
              <Bot size={15} className="text-white" />
            </div>
            <div
              style={{
                borderRadius: '20px 20px 20px 4px',
                padding: '14px 18px',
                background: 'rgba(14, 20, 40, 0.7)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex gap-1.5 items-center">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="flex-shrink-0"
        style={{
          background: 'rgba(14, 20, 40, 0.8)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '18px',
          padding: '12px 12px 12px 16px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
        }}
      >
        <div style={{ flex: 1 }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI coach anything... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="w-full bg-transparent outline-none resize-none text-sm"
            style={{
              maxHeight: '120px',
              color: '#FFFFFF',
              lineHeight: '1.5',
              padding: '6px 0',
              fontFamily: 'inherit',
              caretColor: '#5B8CFF',
            }}
          />
          {input && (
            <div style={{ fontSize: '0.65rem', color: '#7C849A', marginTop: '2px' }}>
              Enter ↵ to send · Shift+Enter for new line
            </div>
          )}
        </div>

        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: !input.trim() || loading
              ? 'rgba(91,140,255,0.15)'
              : 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
            border: '1px solid rgba(91,140,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s ease',
            boxShadow: !input.trim() || loading ? 'none' : '0 4px 16px rgba(91,140,255,0.3)',
          }}
          onMouseEnter={(e) => {
            if (input.trim() && !loading) {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(91,140,255,0.45)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = '';
            (e.currentTarget as HTMLElement).style.boxShadow = input.trim() && !loading ? '0 4px 16px rgba(91,140,255,0.3)' : 'none';
          }}
        >
          {loading
            ? <Loader2 size={17} className="animate-spin text-white" />
            : <Send size={17} style={{ color: !input.trim() ? '#7C849A' : '#FFFFFF' }} />
          }
        </button>
      </div>

      {/* Modification Modal */}
      {showModModal && modifications && (
        <div className="modal-overlay" onClick={() => setShowModModal(false)}>
          <div
            className="modal-card max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-2">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(91,140,255,0.3)',
                }}
              >
                <RefreshCw size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#FFFFFF' }}>📋 Review Plan Changes</h2>
                <p style={{ fontSize: '0.72rem', color: '#7C849A' }}>Review each proposed change carefully before approving</p>
              </div>
            </div>

            <div
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(91,140,255,0.06)',
                border: '1px solid rgba(91,140,255,0.12)',
                marginBottom: '20px',
                marginTop: '12px',
              }}
            >
              <p className="text-sm" style={{ color: '#B8C0D4' }}>{modSummary}</p>
            </div>

            <div className="space-y-4">
              {modifications.map((mod, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(5,8,22,0.5)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px',
                    padding: '18px',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm capitalize" style={{ color: '#FFFFFF' }}>
                        {mod.section.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: '#7C849A' }}>{mod.reason}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <Zap size={11} style={{ color: '#F59E0B' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#F59E0B' }}>CHANGE</span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <span className="badge badge-danger text-xs mb-2 inline-block">Current Value</span>
                      <pre
                        className="text-xs p-3 rounded-xl overflow-auto max-h-40 scrollbar-hide"
                        style={{
                          background: 'rgba(239,68,68,0.04)',
                          border: '1px solid rgba(239,68,68,0.12)',
                          color: '#B8C0D4',
                          fontFamily: 'monospace',
                          lineHeight: '1.5',
                        }}
                      >
                        {typeof mod.current_value === 'string' ? mod.current_value : JSON.stringify(mod.current_value, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="badge badge-success text-xs mb-2 inline-block">New Value</span>
                      <pre
                        className="text-xs p-3 rounded-xl overflow-auto max-h-40 scrollbar-hide"
                        style={{
                          background: 'rgba(34,197,94,0.04)',
                          border: '1px solid rgba(34,197,94,0.12)',
                          color: '#B8C0D4',
                          fontFamily: 'monospace',
                          lineHeight: '1.5',
                        }}
                      >
                        {typeof mod.proposed_value === 'string' ? mod.proposed_value : JSON.stringify(mod.proposed_value, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleApplyModifications}
                disabled={applyingMod}
                className="btn-primary flex-1 justify-center"
                style={{ padding: '14px' }}
              >
                {applyingMod ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Approve Changes
              </button>
              <button
                onClick={() => { setShowModModal(false); setModifications(null); }}
                className="btn-danger flex-1 justify-center"
                style={{ padding: '14px' }}
              >
                <X size={16} />
                Reject All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
