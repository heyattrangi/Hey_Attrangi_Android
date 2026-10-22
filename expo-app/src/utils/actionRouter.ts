/**
 * Navigation helper for parsing Pragya backend action URLs
 * and safely routing to native Android screens.
 */

export function navigateFromActionUrl(url: string, navigation: any) {
  if (!url || !navigation) return;

  const urlLower = url.toLowerCase();

  try {
    // 0. Chat (/chat or /dashboard/chat)
    // `Chat`/`ChatTab` are both registered directly on MainStackParamList
    // (MainAppNavigator), not as a nested tab inside MainTabNavigator — a
    // `navigate('MainTabs', { screen: 'ChatTab' })` call has no matching
    // route and React Navigation logs an unhandled-action warning rather
    // than throwing, so a try/catch around it never falls through. Navigate
    // straight to the real route instead.
    if (urlLower.includes('/chat') || urlLower === 'chat') {
      navigation.navigate('Chat');
      return;
    }

    // 1. Assessment Runner (/dashboard/assessments/runner?id=gad-7)
    if (urlLower.includes('/assessments/runner') || urlLower.includes('assessment')) {
      const match = url.match(/[?&](?:id|assessmentId)=([^&]+)/i);
      const assessmentKey = match ? match[1] : 'gad-7';
      navigation.navigate('AssessmentRunner', { assessmentKey });
      return;
    }

    // 2. Breathing Exercise (/explore/activities/breathing?mode=box)
    if (urlLower.includes('breathing')) {
      const match = url.match(/[?&]mode=([^&]+)/i);
      const exerciseId = match ? match[1] : 'box';
      navigation.navigate('BreathingExercise', { exerciseId });
      return;
    }

    // 3. 5-4-3-2-1 Grounding
    if (urlLower.includes('grounding') || urlLower.includes('5-4-3-2-1')) {
      navigation.navigate('GroundingExercise');
      return;
    }

    // 4. PMR / Progressive Muscle Relaxation
    if (urlLower.includes('pmr') || urlLower.includes('muscle')) {
      navigation.navigate('PMRExercise');
      return;
    }

    // 5. Micro Moments
    if (urlLower.includes('micro') || urlLower.includes('moments')) {
      navigation.navigate('MicroMomentsExercise');
      return;
    }

    // 6. Journal Reflection
    if (urlLower.includes('journal') || urlLower.includes('reflection')) {
      navigation.navigate('JournalReflectionExercise');
      return;
    }

    // 7. General Fallback to Explore Tab or AuthWelcome
    try {
      navigation.navigate('MainTabs', { screen: 'ExploreTab' });
    } catch {
      try {
        navigation.navigate('ExploreTab');
      } catch {
        navigation.navigate('AuthWelcome');
      }
    }
  } catch (err) {
    console.warn('[ActionRouter] Navigation fallback handled silently:', err);
  }
}
