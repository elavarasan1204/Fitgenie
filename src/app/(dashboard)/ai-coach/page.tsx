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
} from 'lucide-react';

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history
  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch {
      console.error('Failed to load chat history');
    } finally {
      setFetchingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');

    // Optimistically add user message
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

      // Add AI response
      const aiMsg: ChatMessage = {
        id: `temp-ai-${Date.now()}`,
        user_id: '',
        role: 'assistant',
        content: data.message,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);

      // Check for plan modification
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

      // Get current active plan
      const { data: currentPlan } = await supabase
        .from('fitness_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!currentPlan) {
        toast.error('No active plan found');
        return;
      }

      const updatedPlanData = { ...currentPlan.plan_data };
      for (const mod of modifications) {
        if (mod.section in updatedPlanData) {
          (updatedPlanData as Record<string, unknown>)[mod.section] = mod.proposed_value;
        }
      }

      const res = await fetch('/api/fitness-plan/modify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: currentPlan.id,
          updated_plan_data: updatedPlanData,
        }),
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
      if (res.ok) {
        setMessages([]);
        toast.success('Chat cleared');
      }
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
        <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Coach</h1>
            <p className="text-xs text-[var(--color-text-muted)]">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="btn-ghost text-sm !text-[var(--color-danger)]">
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mb-4 animate-pulse-glow">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Hey there! I&apos;m your AI Coach 💪</h2>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
              Ask me anything about fitness, nutrition, exercises, or request changes to your plan.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {['What exercises burn the most fat?', 'Suggest a pre-workout meal', 'How to improve my squat form?', 'Change my breakfast plan'].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="text-xs px-3 py-2 rounded-lg glass text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-primary)] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'gradient-primary text-white rounded-br-md'
                  : 'glass rounded-bl-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-white/60' : 'text-[var(--color-text-muted)]'}`}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-lighter)] flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} className="text-[var(--color-text-secondary)]" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
              <Bot size={16} className="text-white" />
            </div>
            <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-card p-3 flex items-end gap-3" style={{ transform: 'none' }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your AI coach anything..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm py-2 px-1"
          style={{ maxHeight: '120px' }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="btn-primary !p-3 !rounded-xl flex-shrink-0"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>

      {/* Modification Modal */}
      {showModModal && modifications && (
        <div className="modal-overlay" onClick={() => setShowModModal(false)}>
          <div className="glass-card max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-2">📋 Review Plan Changes</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">{modSummary}</p>

            <div className="space-y-6">
              {modifications.map((mod, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <h3 className="font-semibold text-sm mb-1 capitalize">{mod.section.replace(/_/g, ' ')}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">{mod.reason}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="badge badge-danger text-xs mb-2 inline-block">Current Value</span>
                      <pre className="text-xs p-3 rounded-lg overflow-auto max-h-40" style={{ background: 'var(--color-surface-light)' }}>
                        {typeof mod.current_value === 'string' ? mod.current_value : JSON.stringify(mod.current_value, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="badge badge-success text-xs mb-2 inline-block">New Value</span>
                      <pre className="text-xs p-3 rounded-lg overflow-auto max-h-40" style={{ background: 'var(--color-surface-light)' }}>
                        {typeof mod.proposed_value === 'string' ? mod.proposed_value : JSON.stringify(mod.proposed_value, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleApplyModifications} disabled={applyingMod} className="btn-primary flex-1 justify-center">
                {applyingMod ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Approve
              </button>
              <button onClick={() => { setShowModModal(false); setModifications(null); }} className="btn-danger flex-1 justify-center">
                <X size={16} />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
