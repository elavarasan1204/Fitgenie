import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGeminiModel } from '@/lib/gemini/client';
import { buildFitnessPlanPrompt } from '@/lib/gemini/fitness-plan';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Please complete your profile first' },
        { status: 400 }
      );
    }

    // Check if profile has enough data
    if (!profile.height_cm || !profile.weight_kg || !profile.goal) {
      return NextResponse.json(
        { error: 'Please complete your height, weight, and goal in your profile' },
        { status: 400 }
      );
    }

    // Generate plan with Gemini
    const model = getGeminiModel();
    const prompt = buildFitnessPlanPrompt(profile);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON from response
    let planData;
    try {
      // Try to extract JSON from possible markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
      planData = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Deactivate old plans
    await supabase
      .from('fitness_plans')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Save new plan
    const { data: plan, error: planError } = await supabase
      .from('fitness_plans')
      .insert({
        user_id: user.id,
        plan_data: planData,
        version: 1,
        is_active: true,
      })
      .select()
      .single();

    if (planError) {
      return NextResponse.json(
        { error: 'Failed to save plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Plan generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan. Please try again.' },
      { status: 500 }
    );
  }
}
