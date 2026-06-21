import type { Profile } from '@/types';

export function buildFitnessPlanPrompt(profile: Profile): string {
  return `You are an expert fitness coach and nutritionist. Based on the following user profile, generate a comprehensive, personalized fitness plan.

USER PROFILE:
- Name: ${profile.full_name || 'User'}
- Age: ${profile.age || 'Not specified'}
- Gender: ${profile.gender || 'Not specified'}
- Height: ${profile.height_cm ? profile.height_cm + ' cm' : 'Not specified'}
- Weight: ${profile.weight_kg ? profile.weight_kg + ' kg' : 'Not specified'}
- BMI: ${profile.bmi || 'Not calculated'}
- Goal: ${profile.goal || 'General Fitness'}${profile.custom_goal ? ' - ' + profile.custom_goal : ''}
- Activity Level: ${profile.activity_level || 'Not specified'}
- Diet Preference: ${profile.diet_preference || 'Not specified'}${profile.custom_diet ? ' - ' + profile.custom_diet : ''}
- Medical Conditions: ${profile.medical_conditions || 'None'}
- Additional Notes: ${profile.additional_notes || 'None'}

Generate a COMPLETE fitness plan in the following JSON format. Return ONLY valid JSON, no markdown, no code blocks:

{
  "user_summary": "Brief summary of the user's profile and current fitness status",
  "goal_summary": "Detailed explanation of the user's goal and strategy to achieve it",
  "bmi_analysis": "Analysis of user's BMI and what it means for their fitness journey",
  "daily_calorie_target": <number>,
  "water_intake_target": <number in ml>,
  "weekly_workout_schedule": [
    {
      "day": "Monday",
      "focus": "Chest & Triceps",
      "rest_day": false,
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "10-12",
          "duration_minutes": 0,
          "notes": "Optional tips"
        }
      ]
    }
  ],
  "exercise_recommendations": ["List of general exercise tips and recommendations"],
  "breakfast_plan": {
    "description": "Breakfast plan description",
    "total_calories": <number>,
    "items": [
      {
        "name": "Food item",
        "portion": "1 cup",
        "calories": <number>,
        "protein_g": <number>,
        "carbs_g": <number>,
        "fat_g": <number>
      }
    ]
  },
  "lunch_plan": { same structure as breakfast_plan },
  "dinner_plan": { same structure as breakfast_plan },
  "snacks_recommendations": ["List of healthy snack ideas with portions"],
  "recovery_suggestions": ["List of recovery tips"]
}

IMPORTANT:
- Include ALL 7 days in the weekly schedule (Monday through Sunday), with at least 1-2 rest days
- Provide at least 4-5 exercises per workout day
- Meal plans should match the diet preference (${profile.diet_preference || 'balanced'})
- Total daily calories across meals should approximate the daily_calorie_target
- Be specific with portions and calorie counts
- Consider any medical conditions mentioned
- Return ONLY the JSON object, nothing else`;
}

export function buildPlanModificationPrompt(
  currentPlan: string,
  modificationRequest: string,
  profile: Profile
): string {
  return `You are an expert fitness coach. The user wants to modify their current fitness plan.

CURRENT PLAN:
${currentPlan}

USER PROFILE:
- Goal: ${profile.goal || 'General Fitness'}
- Diet: ${profile.diet_preference || 'Not specified'}
- Medical Conditions: ${profile.medical_conditions || 'None'}

MODIFICATION REQUEST:
"${modificationRequest}"

Analyze the request and generate proposed changes. Return ONLY valid JSON in this format:

{
  "modifications": [
    {
      "section": "The section being modified (e.g., 'breakfast_plan', 'weekly_workout_schedule')",
      "current_value": <the current value of this section from the plan>,
      "proposed_value": <the new proposed value>,
      "reason": "Brief explanation of why this change is recommended"
    }
  ],
  "summary": "Overall summary of what changes are being proposed and why"
}

Return ONLY the JSON object, no markdown or code blocks.`;
}
