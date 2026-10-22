export interface AssessmentResult {
  score: number;
  maxScore?: number;
  severity: string;
  interpretation: string;
  recommendation?: string;
  hasCrisisRisk?: boolean;
  date?: string;
}

export function getScreenerMaxScore(screenerId: string, screener?: any): number {
  if (screenerId === 'asrs') return 6;
  if (screenerId === 'phq-9') return 27;
  if (screenerId === 'gad-7') return 21;
  if (screenerId === 'ptsd') return 5;
  if (screenerId === 'ocd') return 72;

  if (screener?.scoring?.method === 'who5') return 25;
  if (screener?.scoring?.method === 'audit-c') return 12;
  if (screener?.scoring?.method === 'cbi') return 100;
  if (screener?.scoring?.method === 'c-ssrs') return 6;
  if (screener?.scoring?.method === 'asq') return 5;

  if (screener?.scoring?.bands && screener.scoring.bands.length > 0) {
    const maxBand = Math.max(...screener.scoring.bands.map((b: any) => b.max ?? 0));
    if (maxBand > 0) return maxBand;
  }

  if (screener?.questions && Array.isArray(screener.questions)) {
    const scoredQuestions = screener.questions.filter((q: any) => q.scored !== false);
    let totalMax = 0;
    for (const q of scoredQuestions) {
      if (Array.isArray(q.options) && q.options.length > 0) {
        const maxVal = Math.max(...q.options.map((opt: any) => opt.value ?? 0));
        totalMax += maxVal;
      }
    }
    if (totalMax > 0) return totalMax;
  }

  return 27;
}

function bandForScore(
  bands: Array<{
    min: number;
    max: number;
    severity: string;
    interpretation?: string;
    recommendation?: string;
    hasCrisisRisk?: boolean;
  }>,
  score: number
) {
  return (
    bands.find((b) => score >= b.min && score <= b.max) ??
    bands[bands.length - 1]
  );
}

function sumAnswers(
  answers: Record<number, number>,
  questions: any[],
  opts?: { reverseMax?: number; skipUnscored?: boolean }
) {
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === undefined) return;
    if (opts?.skipUnscored && q.scored === false) return;
    const raw = answers[i];
    if (q.reverseScored && opts?.reverseMax !== undefined) {
      score += opts.reverseMax - raw;
    } else {
      score += raw;
    }
  });
  return score;
}

export function scoreAdditionalScreener(
  screener: any,
  answers: Record<number, number>
): AssessmentResult {
  const scoring = screener?.scoring;
  if (!scoring) {
    return {
      score: 0,
      maxScore: getScreenerMaxScore('', screener),
      severity: 'Unavailable',
      interpretation: '',
      recommendation: '',
      hasCrisisRisk: false,
    };
  }

  const method = scoring.method as string;
  const maxScore = getScreenerMaxScore(screener?.id || '', screener);

  if (method === 'sum' || method === 'sumReverse') {
    const score = sumAnswers(answers, screener.questions, {
      reverseMax: scoring.reverseMax,
      skipUnscored: true,
    });
    const band = bandForScore(scoring.bands, score);
    return {
      score,
      maxScore,
      severity: band.severity,
      interpretation: band.interpretation ?? band.severity,
      recommendation: band.recommendation ?? '',
      hasCrisisRisk: Boolean(band.hasCrisisRisk),
    };
  }

  if (method === 'who5') {
    const raw = sumAnswers(answers, screener.questions);
    const percentage = raw * 4;
    const band = bandForScore(scoring.bands, raw);
    return {
      score: raw,
      maxScore: 25,
      severity: `${band.severity} (${percentage}/100)`,
      interpretation: band.interpretation ?? band.severity,
      recommendation: band.recommendation ?? '',
      hasCrisisRisk: false,
    };
  }

  if (method === 'audit-c') {
    const scoredIndices: number[] = scoring.scoredQuestionIndices ?? [1, 2, 3];
    let score = 0;
    scoredIndices.forEach((i) => {
      if (answers[i] !== undefined) score += answers[i];
    });
    const sexIdx = scoring.sexQuestionIndex ?? 0;
    const isMale = answers[sexIdx] === 1;
    const cutoff = isMale ? scoring.cutoffs.male : scoring.cutoffs.female;
    const outcome = score >= cutoff ? scoring.positive : scoring.negative;
    return {
      score,
      maxScore: 12,
      severity: outcome.severity,
      interpretation: outcome.interpretation,
      recommendation: outcome.recommendation,
      hasCrisisRisk: false,
    };
  }

  if (method === 'c-ssrs') {
    const wish = answers[0] === 1;
    const thoughts = answers[1] === 1;
    const methodThought = answers[2] === 1;
    const intent = answers[3] === 1;
    const plan = answers[4] === 1;
    const behaviorRecent = answers[5] === 2;
    const behaviorLifetime = answers[5] === 1;
    const score = [
      wish,
      thoughts,
      methodThought,
      intent,
      plan,
      behaviorRecent || behaviorLifetime,
    ].filter(Boolean).length;

    let key: 'negative' | 'positive' | 'high' = 'negative';
    if (intent || plan || behaviorRecent) key = 'high';
    else if (wish || thoughts || methodThought || behaviorLifetime) key = 'positive';

    const outcome = scoring.results[key];
    return {
      score,
      maxScore: 6,
      severity: outcome.severity,
      interpretation: outcome.interpretation,
      recommendation: outcome.recommendation,
      hasCrisisRisk: Boolean(outcome.hasCrisisRisk),
    };
  }

  if (method === 'asq') {
    const anyOf14 = [0, 1, 2, 3].some((i) => (answers[i] ?? 0) > 0);
    const acute = answers[4] === 1;
    const score =
      [0, 1, 2, 3].reduce((n, i) => n + ((answers[i] ?? 0) > 0 ? 1 : 0), 0) +
      (acute ? 1 : 0);

    let key: 'negative' | 'nonAcute' | 'acute' = 'negative';
    if (acute) key = 'acute';
    else if (anyOf14) key = 'nonAcute';

    const outcome = scoring.results[key];
    return {
      score,
      maxScore: 5,
      severity: outcome.severity,
      interpretation: outcome.interpretation,
      recommendation: outcome.recommendation,
      hasCrisisRisk: Boolean(outcome.hasCrisisRisk),
    };
  }

  if (method === 'cbi') {
    const reverseMax = scoring.reverseMax ?? 100;
    const avg = (indices: number[]) => {
      const vals = indices
        .filter((i) => answers[i] !== undefined)
        .map((i) => {
          const q = screener.questions[i];
          const raw = answers[i];
          return q.reverseScored ? reverseMax - raw : raw;
        });
      if (!vals.length) return 0;
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };

    const personal = avg(scoring.subscales.personal.indices);
    const work = avg(scoring.subscales.work.indices);
    const client = avg(scoring.subscales.client.indices);
    const score = Math.round((personal + work + client) / 3);
    const threshold = scoring.highThreshold ?? 50;
    const flags = [
      personal >= threshold ? 'Personal Burnout ≥50' : null,
      work >= threshold ? 'Work Burnout ≥50' : null,
      client >= threshold ? 'Client Burnout ≥50' : null,
    ].filter(Boolean);

    const severity =
      flags.length > 0
        ? `High degree of burnout (≥50): ${flags.join('; ')}`
        : `Personal ${Math.round(personal)}, Work ${Math.round(work)}, Client ${Math.round(client)}`;

    return {
      score,
      maxScore: 100,
      severity,
      interpretation: scoring.interpretation,
      recommendation: scoring.recommendation,
      hasCrisisRisk: false,
    };
  }

  return {
    score: 0,
    maxScore,
    severity: 'Unavailable',
    interpretation: '',
    recommendation: '',
    hasCrisisRisk: false,
  };
}

export function scoreAssessment(
  screenerId: string,
  screener: any,
  answers: Record<number, number>
): AssessmentResult {
  let score = 0;
  let severity = 'None-minimal';
  let interpretation = '';
  let recommendation = '';
  let hasCrisisRisk = false;
  const maxScore = getScreenerMaxScore(screenerId, screener);

  if (screenerId === 'phq-9') {
    Object.values(answers).forEach((val) => (score += val));
    if (score <= 4) severity = 'None-minimal';
    else if (score <= 9) severity = 'Mild';
    else if (score <= 14) severity = 'Moderate';
    else if (score <= 19) severity = 'Moderately Severe';
    else severity = 'Severe';

    if (answers[8] && answers[8] > 0) hasCrisisRisk = true;
    interpretation = `PHQ-9 Severity: ${severity}`;
  } else if (screenerId === 'gad-7') {
    Object.values(answers).forEach((val) => (score += val));
    if (score <= 4) severity = 'Minimal';
    else if (score <= 9) severity = 'Mild';
    else if (score <= 14) severity = 'Moderate';
    else severity = 'Severe';
    interpretation = `GAD-7 Severity: ${severity}`;
  } else if (screenerId === 'asrs') {
    let partAScore = 0;
    for (let i = 0; i < 6; i++) {
      if (answers[i] !== undefined) {
        const q = screener.questions[i];
        const threshold = q?.positiveThreshold ?? (i < 3 ? 2 : 3);
        if (answers[i] >= threshold) partAScore++;
      }
    }
    score = partAScore;
    severity = partAScore >= 4 ? 'Positive Screen for ADHD' : 'Negative Screen';
    interpretation = `ASRS Part A Score: ${partAScore}/6. ${severity}`;
  } else if (screenerId === 'ptsd') {
    if (answers[0] === 0) {
      severity = 'N/A - No trauma exposure reported';
    } else {
      for (let i = 1; i <= 5; i++) {
        if (answers[i]) score += answers[i];
      }
      severity = score >= 3 ? 'Positive Screen (Consider clinical follow-up)' : 'Negative Screen';
    }
    interpretation = `PTSD Screen: ${severity}`;
  } else if (screenerId === 'ocd') {
    Object.values(answers).forEach((val) => (score += val));
    severity = score >= 21 ? 'Positive Screen for OCD' : 'Likely Negative';
    interpretation = `OCI-R Score: ${score}. ${severity}`;
  } else if (screener?.scoring) {
    const additionalResult = scoreAdditionalScreener(screener, answers);
    return {
      score: additionalResult.score,
      maxScore: additionalResult.maxScore ?? maxScore,
      severity: additionalResult.severity,
      interpretation: additionalResult.interpretation,
      recommendation: additionalResult.recommendation,
      hasCrisisRisk: additionalResult.hasCrisisRisk,
    };
  }

  return { score, maxScore, severity, interpretation, recommendation, hasCrisisRisk };
}
