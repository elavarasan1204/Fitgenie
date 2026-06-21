import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGeminiModel } from '@/lib/gemini/client';
import { buildCoachSystemPrompt } from '@/lib/gemini/coach';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user profile for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get active fitness plan for context
    const { data: activePlan } = await supabase
      .from('fitness_plans')
      .select('plan_data')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    // Get recent chat history for context
    const { data: recentHistory } = await supabase
      .from('chat_history')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    // Build conversation history for Gemini
    const history = (recentHistory || []).reverse().map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Generate response
    const model = getGeminiModel();
    const systemPrompt = buildCoachSystemPrompt(profile, activePlan?.plan_data || null);

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'System context: ' + systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood! I\'m FitGenie AI Coach, ready to help with fitness, nutrition, and wellness questions. How can I help you today? 💪' }] },
        ...history,
      ],
    });

    const result = await chat.sendMessage(message);
    let responseText = result.response.text();

    // Check for plan modification flag
    let hasPlanModification = false;
    let modificationRequest = '';

    if (responseText.includes('PLAN_MODIFICATION_DETECTED')) {
      hasPlanModification = true;
      const parts = responseText.split('PLAN_MODIFICATION_DETECTED');
      responseText = parts[0].trim();

      try {
        const modData = JSON.parse(parts[1].trim());
        modificationRequest = modData.modification_request;
      } catch {
        // If JSON parsing fails, use the raw text
        modificationRequest = parts[1]?.trim() || message;
      }
    }

    // Save user message
    await supabase.from('chat_history').insert({
      user_id: user.id,
      role: 'user',
      content: message,
    });

    // Save assistant response
    await supabase.from('chat_history').insert({
      user_id: user.id,
      role: 'assistant',
      content: responseText,
    });

    return NextResponse.json({
      message: responseText,
      has_plan_modification: hasPlanModification,
      modification_request: modificationRequest,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const { data: messages, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: 'Failed to load chat history' }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json({ error: 'Failed to load chat history' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await supabase
      .from('chat_history')
      .delete()
      .eq('user_id', user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Clear chat error:', error);
    return NextResponse.json({ error: 'Failed to clear chat' }, { status: 500 });
  }
}
