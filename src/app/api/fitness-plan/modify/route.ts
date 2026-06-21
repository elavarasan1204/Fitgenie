import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGeminiModel } from '@/lib/gemini/client';
import { buildPlanModificationPrompt } from '@/lib/gemini/fitness-plan';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { modification_request } = await request.json();

    if (!modification_request) {
      return NextResponse.json(
        { error: 'Modification request is required' },
        { status: 400 }
      );
    }

    // Get current active plan
    const { data: currentPlan, error: planError } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (planError || !currentPlan) {
      return NextResponse.json(
        { error: 'No active fitness plan found' },
        { status: 400 }
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Generate modifications with Gemini
    const model = getGeminiModel();
    const prompt = buildPlanModificationPrompt(
      JSON.stringify(currentPlan.plan_data, null, 2),
      modification_request,
      profile
    );

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let modifications;
    try {
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
      modifications = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse modification suggestions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      modifications: modifications.modifications,
      summary: modifications.summary,
      current_plan: currentPlan,
    });
  } catch (error) {
    console.error('Plan modification error:', error);
    return NextResponse.json(
      { error: 'Failed to generate modifications' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan_id, updated_plan_data } = await request.json();

    if (!plan_id || !updated_plan_data) {
      return NextResponse.json(
        { error: 'Plan ID and updated data are required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: existingPlan } = await supabase
      .from('fitness_plans')
      .select('version')
      .eq('id', plan_id)
      .eq('user_id', user.id)
      .single();

    if (!existingPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Update plan with incremented version
    const { data: updatedPlan, error: updateError } = await supabase
      .from('fitness_plans')
      .update({
        plan_data: updated_plan_data,
        version: (existingPlan.version || 1) + 1,
      })
      .eq('id', plan_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan: updatedPlan });
  } catch (error) {
    console.error('Plan update error:', error);
    return NextResponse.json(
      { error: 'Failed to apply modifications' },
      { status: 500 }
    );
  }
}
