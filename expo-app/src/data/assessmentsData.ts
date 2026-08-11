export interface ClinicalAssessment {
  id: string;
  title: string;
  shortName: string;
  description: string;
  time: string;
  category: string;
}

export interface QuestionOption {
  text: string;
  value: number;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
  positiveThreshold?: number;
  isGate?: boolean;
}

export interface ScreenerDefinition {
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  scoring?: any[];
}

export const CLINICAL_ASSESSMENTS: ClinicalAssessment[] = [
  {
    id: 'phq-9',
    title: 'Am I Sad or Depressed?',
    shortName: 'PHQ-9',
    description: 'Understand whether feelings of sadness may be more than a temporary mood.',
    time: '5 mins quiz',
    category: 'Depression',
  },
  {
    id: 'gad-7',
    title: 'Am I Anxious?',
    shortName: 'GAD-7',
    description: 'Quick assessment to understand if your feelings of worry or stress indicate anxiety.',
    time: '3 mins quiz',
    category: 'Anxiety',
  },
  {
    id: 'asrs',
    title: 'Adult ADHD Self-Report Scale',
    shortName: 'ASRS-v1.1',
    description: 'Know if struggles with attention and focus might be more than occasional distractions.',
    time: '3 mins quiz',
    category: 'ADHD',
  },
  {
    id: 'ocd',
    title: 'How severe are my OCD symptoms?',
    shortName: 'OCI-R',
    description: 'Understand whether your thoughts or behaviors might be signs of OCD.',
    time: '5 mins quiz',
    category: 'OCD',
  },
  {
    id: 'ptsd',
    title: 'Primary Care PTSD Screen',
    shortName: 'PC-PTSD-5',
    description: 'Understand if you might be experiencing signs of Post-Traumatic Stress.',
    time: '4 mins quiz',
    category: 'PTSD',
  },
  {
    id: 'gad-2',
    title: 'GAD-2 — Generalized Anxiety Disorder-2',
    shortName: 'GAD-2',
    description: 'Ultra-brief 2-item anxiety screening check-in.',
    time: '1 min quiz',
    category: 'Anxiety',
  },
  {
    id: 'pss-10',
    title: 'PSS-10 — Perceived Stress Scale',
    shortName: 'PSS-10',
    description: 'General perceived stress scale over the past month.',
    time: '3 mins quiz',
    category: 'Stress',
  },
  {
    id: 'who-5',
    title: 'WHO-5 — Well-Being Index',
    shortName: 'WHO-5',
    description: 'General well-being check-in over the last two weeks.',
    time: '2 mins quiz',
    category: 'Wellbeing',
  },
  {
    id: 'asq',
    title: 'ASQ — Ask Suicide-Screening Questions',
    shortName: 'ASQ',
    description: 'NIMH suicide risk screening tool.',
    time: '2 mins quiz',
    category: 'Safety',
  },
  {
    id: 'c-ssrs',
    title: 'C-SSRS — Columbia Suicide Severity Rating Scale',
    shortName: 'C-SSRS',
    description: 'Suicide severity screen with skip logic and crisis routing.',
    time: '3 mins quiz',
    category: 'Safety',
  },
  {
    id: 'rses',
    title: 'Rosenberg Self-Esteem Scale',
    shortName: 'RSES',
    description: 'Evaluate general self-worth and self-esteem.',
    time: '3 mins quiz',
    category: 'Self-Esteem',
  },
  {
    id: 'audit-c',
    title: 'AUDIT-C — Alcohol Use Disorders Identification Test',
    shortName: 'AUDIT-C',
    description: 'Concise alcohol use screening test.',
    time: '2 mins quiz',
    category: 'Substance Use',
  },
];

export const SCREENERS: Record<string, ScreenerDefinition> = {
  'phq-9': {
    title: 'Am I Sad or Depressed? (PHQ-9)',
    description: 'Understand whether feelings of sadness may be more than a temporary mood.',
    questions: [
      {
        id: 'phq-9_1',
        text: 'Little interest or pleasure in doing things',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq-9_2',
        text: 'Feeling down, depressed, or hopeless',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq-9_3',
        text: 'Trouble falling or staying asleep, or sleeping too much',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq-9_4',
        text: 'Feeling tired or having little energy',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq-9_5',
        text: 'Poor appetite or overeating',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq-9_6',
        text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq-9_7',
        text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq-9_8',
        text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq-9_9',
        text: 'Thoughts that you would be better off dead, or of hurting yourself in some way',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
    ],
  },
  'gad-7': {
    title: 'Am I Anxious? (GAD-7)',
    description: 'Take this quick assessment to understand if your feelings of worry or stress indicate anxiety.',
    questions: [
      {
        id: 'gad-7_1',
        text: 'Feeling nervous, anxious, or on edge',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad-7_2',
        text: 'Not being able to stop or control worrying',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad-7_3',
        text: 'Worrying too much about different things',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad-7_4',
        text: 'Trouble relaxing',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad-7_5',
        text: 'Being so restless that it is hard to sit still',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad-7_6',
        text: 'Becoming easily annoyed or irritable',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad-7_7',
        text: 'Feeling afraid, as if something awful might happen',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
    ],
  },
  asrs: {
    title: 'Adult ADHD Self-Report Scale (ASRS-v1.1)',
    description: 'Assess struggles with attention and focus.',
    questions: [
      {
        id: 'asrs_1',
        text: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?',
        options: [
          { text: 'Never', value: 0 },
          { text: 'Rarely', value: 1 },
          { text: 'Sometimes', value: 2 },
          { text: 'Often', value: 3 },
          { text: 'Very Often', value: 4 },
        ],
        positiveThreshold: 2,
      },
      {
        id: 'asrs_2',
        text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?',
        options: [
          { text: 'Never', value: 0 },
          { text: 'Rarely', value: 1 },
          { text: 'Sometimes', value: 2 },
          { text: 'Often', value: 3 },
          { text: 'Very Often', value: 4 },
        ],
        positiveThreshold: 2,
      },
      {
        id: 'asrs_3',
        text: 'How often do you have problems remembering appointments or obligations?',
        options: [
          { text: 'Never', value: 0 },
          { text: 'Rarely', value: 1 },
          { text: 'Sometimes', value: 2 },
          { text: 'Often', value: 3 },
          { text: 'Very Often', value: 4 },
        ],
        positiveThreshold: 2,
      },
      {
        id: 'asrs_4',
        text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',
        options: [
          { text: 'Never', value: 0 },
          { text: 'Rarely', value: 1 },
          { text: 'Sometimes', value: 2 },
          { text: 'Often', value: 3 },
          { text: 'Very Often', value: 4 },
        ],
        positiveThreshold: 3,
      },
      {
        id: 'asrs_5',
        text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',
        options: [
          { text: 'Never', value: 0 },
          { text: 'Rarely', value: 1 },
          { text: 'Sometimes', value: 2 },
          { text: 'Often', value: 3 },
          { text: 'Very Often', value: 4 },
        ],
        positiveThreshold: 3,
      },
      {
        id: 'asrs_6',
        text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?',
        options: [
          { text: 'Never', value: 0 },
          { text: 'Rarely', value: 1 },
          { text: 'Sometimes', value: 2 },
          { text: 'Often', value: 3 },
          { text: 'Very Often', value: 4 },
        ],
        positiveThreshold: 3,
      },
    ],
  },
  ptsd: {
    title: 'Primary Care PTSD Screen (PC-PTSD-5)',
    description: 'Understand signs of Post-Traumatic Stress.',
    questions: [
      {
        id: 'ptsd_1',
        text: 'Have you ever experienced a traumatic event (serious accident, assault, war, or disaster)?',
        options: [
          { text: 'Yes', value: 1 },
          { text: 'No', value: 0 },
        ],
        isGate: true,
      },
      {
        id: 'ptsd_2',
        text: 'Had nightmares about the event(s) or thought about it when you did not want to?',
        options: [
          { text: 'Yes', value: 1 },
          { text: 'No', value: 0 },
        ],
      },
      {
        id: 'ptsd_3',
        text: 'Tried hard not to think about the event(s) or went out of your way to avoid reminders?',
        options: [
          { text: 'Yes', value: 1 },
          { text: 'No', value: 0 },
        ],
      },
      {
        id: 'ptsd_4',
        text: 'Been constantly on guard, watchful, or easily startled?',
        options: [
          { text: 'Yes', value: 1 },
          { text: 'No', value: 0 },
        ],
      },
      {
        id: 'ptsd_5',
        text: 'Felt numb or detached from people, activities, or surroundings?',
        options: [
          { text: 'Yes', value: 1 },
          { text: 'No', value: 0 },
        ],
      },
    ],
  },
  ocd: {
    title: 'OCI-R — Obsessive-Compulsive Inventory',
    description: 'Understand whether thoughts or behaviors might be signs of OCD.',
    questions: [
      {
        id: 'ocd_1',
        text: 'I saved up so many things that they get in the way.',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'A little', value: 1 },
          { text: 'Moderately', value: 2 },
          { text: 'A lot', value: 3 },
          { text: 'Extremely', value: 4 },
        ],
      },
      {
        id: 'ocd_2',
        text: 'I check things more often than necessary.',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'A little', value: 1 },
          { text: 'Moderately', value: 2 },
          { text: 'A lot', value: 3 },
          { text: 'Extremely', value: 4 },
        ],
      },
      {
        id: 'ocd_3',
        text: 'I get upset if objects are not arranged properly.',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'A little', value: 1 },
          { text: 'Moderately', value: 2 },
          { text: 'A lot', value: 3 },
          { text: 'Extremely', value: 4 },
        ],
      },
    ],
  },
  'gad-2': {
    title: 'GAD-2 — Ultra-Brief Anxiety Screen',
    description: 'Ultra-brief 2-item anxiety screen.',
    questions: [
      {
        id: 'gad-2_1',
        text: 'Feeling nervous, anxious, or on edge',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'gad-2_2',
        text: 'Not being able to stop or control worrying',
        options: [
          { text: 'Not at all', value: 0 },
          { text: 'Several days', value: 1 },
          { text: 'More than half the days', value: 2 },
          { text: 'Nearly every day', value: 3 },
        ],
      },
    ],
  },
  'pss-10': {
    title: 'PSS-10 — Perceived Stress Scale',
    description: 'Perceived stress over the past month.',
    questions: [
      {
        id: 'pss-10_1',
        text: 'How often have you been upset because of something that happened unexpectedly?',
        options: [
          { text: 'Never', value: 0 },
          { text: 'Almost Never', value: 1 },
          { text: 'Sometimes', value: 2 },
          { text: 'Fairly Often', value: 3 },
          { text: 'Very Often', value: 4 },
        ],
      },
      {
        id: 'pss-10_2',
        text: 'How often have you felt that you were unable to control the important things in your life?',
        options: [
          { text: 'Never', value: 0 },
          { text: 'Almost Never', value: 1 },
          { text: 'Sometimes', value: 2 },
          { text: 'Fairly Often', value: 3 },
          { text: 'Very Often', value: 4 },
        ],
      },
    ],
  },
  'who-5': {
    title: 'WHO-5 Well-Being Index',
    description: 'General well-being over the last 2 weeks.',
    questions: [
      {
        id: 'who-5_1',
        text: 'I have felt cheerful and in good spirits',
        options: [
          { text: 'At no time', value: 0 },
          { text: 'Some of the time', value: 1 },
          { text: 'Less than half the time', value: 2 },
          { text: 'More than half the time', value: 3 },
          { text: 'Most of the time', value: 4 },
          { text: 'All of the time', value: 5 },
        ],
      },
    ],
  },
  asq: {
    title: 'Ask Suicide-Screening Questions (ASQ)',
    description: 'NIMH suicide risk screening tool.',
    questions: [
      {
        id: 'asq_1',
        text: 'In the past few weeks, have you wished you were dead?',
        options: [
          { text: 'Yes', value: 1 },
          { text: 'No', value: 0 },
        ],
      },
    ],
  },
  'c-ssrs': {
    title: 'Columbia Suicide Severity Rating Scale (C-SSRS)',
    description: 'Suicide severity screening tool.',
    questions: [
      {
        id: 'c-ssrs_1',
        text: 'Have you wished you were dead or wished you could go to sleep and not wake up?',
        options: [
          { text: 'Yes', value: 1 },
          { text: 'No', value: 0 },
        ],
      },
    ],
  },
  rses: {
    title: 'Rosenberg Self-Esteem Scale (RSES)',
    description: 'Evaluate general self-esteem.',
    questions: [
      {
        id: 'rses_1',
        text: 'On the whole, I am satisfied with myself.',
        options: [
          { text: 'Strongly Disagree', value: 0 },
          { text: 'Disagree', value: 1 },
          { text: 'Agree', value: 2 },
          { text: 'Strongly Agree', value: 3 },
        ],
      },
    ],
  },
  'audit-c': {
    title: 'AUDIT-C Alcohol Screen',
    description: 'Concise alcohol use screening test.',
    questions: [
      {
        id: 'audit-c_1',
        text: 'How often do you have a drink containing alcohol?',
        options: [
          { text: 'Never', value: 0 },
          { text: 'Monthly or less', value: 1 },
          { text: '2-4 times a month', value: 2 },
          { text: '2-3 times a week', value: 3 },
          { text: '4+ times a week', value: 4 },
        ],
      },
    ],
  },
};
