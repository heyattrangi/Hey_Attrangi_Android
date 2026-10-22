/**
 * Authoritative Clinical Assessment Data Layer for Hey Attrangi Android App
 * Source of Truth: app-heyattrangi (data/clinicalAssessments.ts, lib/data/screeners.ts, lib/data/additionalScreeners.ts)
 * Total Active Screeners: 15
 */

export interface ClinicalAssessment {
  id: string;
  title: string;
  shortName: string;
  description: string;
  time: string;
  image: string;
  href: string;
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
  reverseScored?: boolean;
  scored?: boolean;
  subscale?: string;
}

export interface ScreenerDefinition {
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  scoring?: any;
  skipLogic?: any;
}

export const CLINICAL_ASSESSMENTS: ClinicalAssessment[] = [
  {
    "id": "asrs",
    "title": "Adult ADHD Self-Report Scale",
    "shortName": "ASRS-v1.1",
    "description": "Start the assessment to know if your struggles with attention and focus might be more than occasional distractions.",
    "time": "3 mins quiz",
    "image": "/assessments/adhd.png",
    "href": "/patient/assessments/asrs",
    "category": "ADHD"
  },
  {
    "id": "ocd",
    "title": "How severe are my OCD symptoms?",
    "shortName": "OCI-R",
    "description": "Start the assessment to understand whether your thoughts or behaviours might be signs of OCD.",
    "time": "5 mins quiz",
    "image": "/assessments/ocd.png",
    "href": "/patient/assessments/ocd",
    "category": "OCD"
  },
  {
    "id": "phq-9",
    "title": "Am I Sad or Depressed?",
    "shortName": "PHQ-9",
    "description": "Start with the assessment to understand whether your feelings of sadness may be more than a temporary mood.",
    "time": "5 mins quiz",
    "image": "/assessments/depression.png",
    "href": "/patient/assessments/phq-9",
    "category": "Depression"
  },
  {
    "id": "gad-7",
    "title": "Am I Anxious?",
    "shortName": "GAD-7",
    "description": "Take this quick assessment to understand if your feelings of worry or stress indicate anxiety.",
    "time": "3 mins quiz",
    "image": "/assessments/anxiety.png",
    "href": "/patient/assessments/gad-7",
    "category": "Anxiety"
  },
  {
    "id": "ptsd",
    "title": "Primary Care PTSD Screen",
    "shortName": "PC-PTSD-5",
    "description": "Start the assessment to understand if you might be experiencing signs of Post-Traumatic Stress.",
    "time": "4 mins quiz",
    "image": "/assessments/ptsd.png",
    "href": "/patient/assessments/ptsd",
    "category": "PTSD"
  },
  {
    "id": "gad-2",
    "title": "GAD-2 — Generalized Anxiety Disorder-2",
    "shortName": "GAD-2",
    "description": "Anxiety, ultra-brief screen. Over the last 2 weeks, how often have you been bothered by the following problems?",
    "time": "1 min quiz",
    "image": "/assessments/anxiety.png",
    "href": "/patient/assessments/gad-2",
    "category": "Anxiety"
  },
  {
    "id": "pss-10",
    "title": "PSS-10 — Perceived Stress Scale",
    "shortName": "PSS-10",
    "description": "General perceived stress. In the last month, how often have you experienced the following?",
    "time": "3 mins quiz",
    "image": "/assessments/anxiety.png",
    "href": "/patient/assessments/pss-10",
    "category": "Stress"
  },
  {
    "id": "who-5",
    "title": "WHO-5 — Well-Being Index",
    "shortName": "WHO-5",
    "description": "General well-being check-in. Please indicate which is closest to how you have been feeling over the last two weeks.",
    "time": "2 mins quiz",
    "image": "/assessments/depression.png",
    "href": "/patient/assessments/who-5",
    "category": "Wellbeing"
  },
  {
    "id": "asq",
    "title": "ASQ — Ask Suicide-Screening Questions",
    "shortName": "ASQ",
    "description": "Suicide risk screen (NIMH Toolkit). Free — U.S. federal government work for clinical use.",
    "time": "2 mins quiz",
    "image": "/assessments/ptsd.png",
    "href": "/patient/assessments/asq",
    "category": "Safety"
  },
  {
    "id": "c-ssrs",
    "title": "C-SSRS — Columbia Suicide Severity Rating Scale",
    "shortName": "C-SSRS",
    "description": "Screen Version (Recent). Suicide severity screen with skip logic and crisis routing.",
    "time": "3 mins quiz",
    "image": "/assessments/ptsd.png",
    "href": "/patient/assessments/c-ssrs",
    "category": "Safety"
  },
  {
    "id": "rses",
    "title": "Rosenberg Self-Esteem Scale",
    "shortName": "RSES",
    "description": "Statements about your general feelings about yourself. Indicate how much you agree or disagree with each.",
    "time": "3 mins quiz",
    "image": "/assessments/ocd.png",
    "href": "/patient/assessments/rses",
    "category": "Self-Esteem"
  },
  {
    "id": "audit-c",
    "title": "AUDIT-C — Alcohol Use Disorders Identification Test, Concise",
    "shortName": "AUDIT-C",
    "description": "First 3 items of AUDIT. Sex at administration affects cutoff (women ≥3, men ≥4).",
    "time": "2 mins quiz",
    "image": "/assessments/adhd.png",
    "href": "/patient/assessments/audit-c",
    "category": "Substance Use"
  },
  {
    "id": "audit",
    "title": "AUDIT — Alcohol Use Disorders Identification Test",
    "shortName": "AUDIT",
    "description": "Full Alcohol Use Disorders Identification Test with WHO 4-zone risk framework.",
    "time": "4 mins quiz",
    "image": "/assessments/adhd.png",
    "href": "/patient/assessments/audit",
    "category": "Substance Use"
  },
  {
    "id": "scoff",
    "title": "SCOFF Questionnaire",
    "shortName": "SCOFF",
    "description": "Eating disorders screening questionnaire (1 point per Yes; cutoff ≥2).",
    "time": "2 mins quiz",
    "image": "/assessments/ocd.png",
    "href": "/patient/assessments/scoff",
    "category": "Eating Disorders"
  },
  {
    "id": "cbi",
    "title": "Copenhagen Burnout Inventory",
    "shortName": "CBI",
    "description": "Personal, work-related, and client-related burnout. High degree of burnout described as ≥50 on the 0–100 scale.",
    "time": "6 mins quiz",
    "image": "/assessments/anxiety.png",
    "href": "/patient/assessments/cbi",
    "category": "Burnout"
  }
];

export const SCREENERS: Record<string, ScreenerDefinition> = {
  "asrs": {
    "title": "Adult ADHD Self-Report Scale",
    "description": "Start the assessment to know if your struggles with attention and focus might be more than occasional distractions.",
    "questions": [
      {
        "id": "asrs_1",
        "text": "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 2
      },
      {
        "id": "asrs_2",
        "text": "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 2
      },
      {
        "id": "asrs_3",
        "text": "How often do you have problems remembering appointments or obligations?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 2
      },
      {
        "id": "asrs_4",
        "text": "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_5",
        "text": "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_6",
        "text": "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_7",
        "text": "How often do you make careless mistakes when you have to work on a boring or difficult project?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_8",
        "text": "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_9",
        "text": "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 2
      },
      {
        "id": "asrs_10",
        "text": "How often do you misplace or have difficulty finding things at home or at work?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_11",
        "text": "How often are you distracted by activity or noise around you?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_12",
        "text": "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 2
      },
      {
        "id": "asrs_13",
        "text": "How often do you feel restless or fidgety?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_14",
        "text": "How often do you have difficulty unwinding and relaxing when you have time to yourself?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_15",
        "text": "How often do you find yourself talking too much when you are in social situations?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_16",
        "text": "When you're in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 2
      },
      {
        "id": "asrs_17",
        "text": "How often do you have difficulty waiting your turn in situations when turn taking is required?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 3
      },
      {
        "id": "asrs_18",
        "text": "How often do you interrupt others when they are busy?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Rarely",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Often",
            "value": 3
          },
          {
            "text": "Very Often",
            "value": 4
          }
        ],
        "positiveThreshold": 2
      }
    ]
  },
  "ocd": {
    "title": "How severe are my OCD symptoms?",
    "description": "Start the assessment to understand whether your thoughts or behaviours might be signs of OCD.",
    "questions": [
      {
        "id": "ocd_1",
        "text": "I have saved up so many things that they get in the way.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_2",
        "text": "I check things more often than necessary.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_3",
        "text": "I get upset if objects are not arranged properly.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_4",
        "text": "I feel compelled to count while I am doing things.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_5",
        "text": "I find it difficult to touch an object when I know it has been touched by strangers or certain people.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_6",
        "text": "I find it difficult to control my own thoughts.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_7",
        "text": "I collect things I don't need.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_8",
        "text": "I repeatedly check doors, windows, drawers, etc.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_9",
        "text": "I get upset if others change the way I have arranged things.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_10",
        "text": "I feel I have to repeat certain numbers.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_11",
        "text": "I sometimes have to wash or clean myself simply because I feel contaminated.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_12",
        "text": "I am upset by unpleasant thoughts that come into my mind against my will.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_13",
        "text": "I avoid throwing things away because I am afraid I might need them later.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_14",
        "text": "I repeatedly check gas and water taps and light switches after turning them off.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_15",
        "text": "I need things to be arranged in a particular order.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_16",
        "text": "I feel that there are good and bad numbers.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_17",
        "text": "I wash my hands more often and longer than necessary.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      },
      {
        "id": "ocd_18",
        "text": "I frequently get nasty thoughts and have difficulty in getting rid of them.",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "A little",
            "value": 1
          },
          {
            "text": "Moderately",
            "value": 2
          },
          {
            "text": "A lot",
            "value": 3
          },
          {
            "text": "Extremely",
            "value": 4
          }
        ]
      }
    ]
  },
  "phq-9": {
    "title": "Am I Sad or Depressed? (PHQ-9)",
    "description": "Start with the assessment to understand whether your feelings of sadness may be more than a temporary mood.",
    "questions": [
      {
        "id": "phq-9_1",
        "text": "Little interest or pleasure in doing things",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "phq-9_2",
        "text": "Feeling down, depressed, or hopeless",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "phq-9_3",
        "text": "Trouble falling or staying asleep, or sleeping too much",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "phq-9_4",
        "text": "Feeling tired or having little energy",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "phq-9_5",
        "text": "Poor appetite or overeating",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "phq-9_6",
        "text": "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "phq-9_7",
        "text": "Trouble concentrating on things, such as reading the newspaper or watching television",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "phq-9_8",
        "text": "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "phq-9_9",
        "text": "Thoughts that you would be better off dead, or of hurting yourself in some way",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      }
    ]
  },
  "gad-7": {
    "title": "Am I Anxious? (GAD-7)",
    "description": "Take this quick assessment to understand if your feelings of worry or stress indicate anxiety.",
    "questions": [
      {
        "id": "gad-7_1",
        "text": "Feeling nervous, anxious, or on edge",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "gad-7_2",
        "text": "Not being able to stop or control worrying",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "gad-7_3",
        "text": "Worrying too much about different things",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "gad-7_4",
        "text": "Trouble relaxing",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "gad-7_5",
        "text": "Being so restless that it is hard to sit still",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "gad-7_6",
        "text": "Becoming easily annoyed or irritable",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "gad-7_7",
        "text": "Feeling afraid, as if something awful might happen",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      }
    ]
  },
  "ptsd": {
    "title": "Primary Care PTSD Screen",
    "description": "Start the assessment to understand if you might be experiencing signs of Post-Traumatic Stress.",
    "questions": [
      {
        "id": "ptsd_1",
        "text": "Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. For example: a serious accident or fire; a physical or sexual assault or abuse; an earthquake or flood; a war; seeing someone be killed or seriously injured; having a loved one die through homicide or suicide. Have you ever experienced this kind of event?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ],
        "isGate": true
      },
      {
        "id": "ptsd_2",
        "text": "had nightmares about the event(s) or thought about the event(s) when you did not want to?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "ptsd_3",
        "text": "tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "ptsd_4",
        "text": "been constantly on guard, watchful, or easily startled?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "ptsd_5",
        "text": "felt numb or detached from people, activities, or your surroundings?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "ptsd_6",
        "text": "felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      }
    ]
  },
  "gad-2": {
    "title": "GAD-2 — Generalized Anxiety Disorder-2",
    "description": "Over the last 2 weeks, how often have you been bothered by the following problems?",
    "questions": [
      {
        "id": "gad-2_1",
        "text": "Feeling nervous, anxious, or on edge",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      },
      {
        "id": "gad-2_2",
        "text": "Not being able to stop or control worrying",
        "options": [
          {
            "text": "Not at all",
            "value": 0
          },
          {
            "text": "Several days",
            "value": 1
          },
          {
            "text": "More than half the days",
            "value": 2
          },
          {
            "text": "Nearly every day",
            "value": 3
          }
        ]
      }
    ],
    "scoring": {
      "method": "sum",
      "scoreLabel": "Total score (0-6)",
      "bands": [
        {
          "min": 0,
          "max": 2,
          "severity": "Negative screen",
          "interpretation": "Screen result (cutoff ≥3): Negative screen",
          "recommendation": "No further anxiety screen indicated based on GAD-2 alone."
        },
        {
          "min": 3,
          "max": 6,
          "severity": "Positive screen",
          "interpretation": "Screen result (cutoff ≥3): Positive screen",
          "recommendation": "If positive, administer full GAD-7 rather than diagnosing off GAD-2 alone."
        }
      ]
    }
  },
  "pss-10": {
    "title": "PSS-10 — Perceived Stress Scale",
    "description": "In the last month, how often have you experienced the following?",
    "questions": [
      {
        "id": "pss-10_1",
        "text": "In the last month, how often have you been upset because of something that happened unexpectedly?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Almost never",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Fairly often",
            "value": 3
          },
          {
            "text": "Very often",
            "value": 4
          }
        ],
        "reverseScored": false
      },
      {
        "id": "pss-10_2",
        "text": "In the last month, how often have you felt that you were unable to control the important things in your life?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Almost never",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Fairly often",
            "value": 3
          },
          {
            "text": "Very often",
            "value": 4
          }
        ],
        "reverseScored": false
      },
      {
        "id": "pss-10_3",
        "text": "In the last month, how often have you felt nervous and stressed?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Almost never",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Fairly often",
            "value": 3
          },
          {
            "text": "Very often",
            "value": 4
          }
        ],
        "reverseScored": false
      },
      {
        "id": "pss-10_4",
        "text": "In the last month, how often have you felt confident about your ability to handle your personal problems?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Almost never",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Fairly often",
            "value": 3
          },
          {
            "text": "Very often",
            "value": 4
          }
        ],
        "reverseScored": true
      },
      {
        "id": "pss-10_5",
        "text": "In the last month, how often have you felt that things were going your way?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Almost never",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Fairly often",
            "value": 3
          },
          {
            "text": "Very often",
            "value": 4
          }
        ],
        "reverseScored": true
      },
      {
        "id": "pss-10_6",
        "text": "In the last month, how often have you found that you could not cope with all the things that you had to do?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Almost never",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Fairly often",
            "value": 3
          },
          {
            "text": "Very often",
            "value": 4
          }
        ],
        "reverseScored": false
      },
      {
        "id": "pss-10_7",
        "text": "In the last month, how often have you been able to control irritations in your life?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Almost never",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Fairly often",
            "value": 3
          },
          {
            "text": "Very often",
            "value": 4
          }
        ],
        "reverseScored": true
      },
      {
        "id": "pss-10_8",
        "text": "In the last month, how often have you felt that you were on top of things?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Almost never",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Fairly often",
            "value": 3
          },
          {
            "text": "Very often",
            "value": 4
          }
        ],
        "reverseScored": true
      },
      {
        "id": "pss-10_9",
        "text": "In the last month, how often have you been angered because of things that happened that were outside of your control?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Almost never",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Fairly often",
            "value": 3
          },
          {
            "text": "Very often",
            "value": 4
          }
        ],
        "reverseScored": false
      },
      {
        "id": "pss-10_10",
        "text": "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Almost never",
            "value": 1
          },
          {
            "text": "Sometimes",
            "value": 2
          },
          {
            "text": "Fairly often",
            "value": 3
          },
          {
            "text": "Very often",
            "value": 4
          }
        ],
        "reverseScored": false
      }
    ],
    "scoring": {
      "method": "sumReverse",
      "reverseMax": 4,
      "scoreLabel": "Total Score (reverse-scored items 4,5,7,8 auto-corrected; range 0-40)",
      "bands": [
        {
          "min": 0,
          "max": 13,
          "severity": "Low stress",
          "interpretation": "Perceived stress level: Low stress",
          "recommendation": "Screening tool only — not a diagnosis."
        },
        {
          "min": 14,
          "max": 26,
          "severity": "Moderate stress",
          "interpretation": "Perceived stress level: Moderate stress",
          "recommendation": "Screening tool only — not a diagnosis."
        },
        {
          "min": 27,
          "max": 40,
          "severity": "High stress",
          "interpretation": "Perceived stress level: High stress",
          "recommendation": "Screening tool only — not a diagnosis. Consider clinical follow-up."
        }
      ]
    }
  },
  "who-5": {
    "title": "WHO-5 — Well-Being Index",
    "description": "Please indicate which is closest to how you have been feeling over the last two weeks.",
    "questions": [
      {
        "id": "who-5_1",
        "text": "I have felt cheerful and in good spirits",
        "options": [
          {
            "text": "All of the time",
            "value": 5
          },
          {
            "text": "Most",
            "value": 4
          },
          {
            "text": "More than half",
            "value": 3
          },
          {
            "text": "Less than half",
            "value": 2
          },
          {
            "text": "Some",
            "value": 1
          },
          {
            "text": "At no time",
            "value": 0
          }
        ]
      },
      {
        "id": "who-5_2",
        "text": "I have felt calm and relaxed",
        "options": [
          {
            "text": "All of the time",
            "value": 5
          },
          {
            "text": "Most",
            "value": 4
          },
          {
            "text": "More than half",
            "value": 3
          },
          {
            "text": "Less than half",
            "value": 2
          },
          {
            "text": "Some",
            "value": 1
          },
          {
            "text": "At no time",
            "value": 0
          }
        ]
      },
      {
        "id": "who-5_3",
        "text": "I have felt active and vigorous",
        "options": [
          {
            "text": "All of the time",
            "value": 5
          },
          {
            "text": "Most",
            "value": 4
          },
          {
            "text": "More than half",
            "value": 3
          },
          {
            "text": "Less than half",
            "value": 2
          },
          {
            "text": "Some",
            "value": 1
          },
          {
            "text": "At no time",
            "value": 0
          }
        ]
      },
      {
        "id": "who-5_4",
        "text": "I woke up feeling fresh and rested",
        "options": [
          {
            "text": "All of the time",
            "value": 5
          },
          {
            "text": "Most",
            "value": 4
          },
          {
            "text": "More than half",
            "value": 3
          },
          {
            "text": "Less than half",
            "value": 2
          },
          {
            "text": "Some",
            "value": 1
          },
          {
            "text": "At no time",
            "value": 0
          }
        ]
      },
      {
        "id": "who-5_5",
        "text": "My daily life has been filled with things that interest me",
        "options": [
          {
            "text": "All of the time",
            "value": 5
          },
          {
            "text": "Most",
            "value": 4
          },
          {
            "text": "More than half",
            "value": 3
          },
          {
            "text": "Less than half",
            "value": 2
          },
          {
            "text": "Some",
            "value": 1
          },
          {
            "text": "At no time",
            "value": 0
          }
        ]
      }
    ],
    "scoring": {
      "method": "who5",
      "scoreLabel": "Raw Score (range 0-25)",
      "percentageLabel": "Percentage Score (raw x4, range 0-100)",
      "cutoffPercentage": 50,
      "bands": [
        {
          "min": 0,
          "max": 12,
          "severity": "Below cutoff",
          "interpretation": "Below cutoff — consider further assessment for possible mental health condition",
          "recommendation": "Cutoff <50% (raw <13) suggested for further assessment, e.g. depressive disorder — per WHO's own comment, not a diagnosis."
        },
        {
          "min": 13,
          "max": 25,
          "severity": "Above cutoff",
          "interpretation": "Above cutoff (percentage score ≥50)",
          "recommendation": "No further assessment flag based on WHO-5 cutoff alone. Screening tool only — not a diagnosis."
        }
      ]
    }
  },
  "asq": {
    "title": "ASQ — Ask Suicide-Screening Questions",
    "description": "NIMH Toolkit. Acuity question is asked only if Yes to any of questions 1–4.",
    "skipLogic": {
      "type": "asq",
      "gateQuestionIndices": [
        0,
        1,
        2,
        3
      ],
      "acuityQuestionIndex": 4
    },
    "questions": [
      {
        "id": "asq_1",
        "text": "In the past few weeks, have you wished you were dead?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "asq_2",
        "text": "In the past few weeks, have you felt that you or your family would be better off if you were dead?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "asq_3",
        "text": "In the past week, have you been having thoughts about killing yourself?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "asq_4",
        "text": "Have you ever tried to kill yourself? (if yes, note most recent attempt: within last 12 months / over 1 year ago)",
        "options": [
          {
            "text": "No",
            "value": 0
          },
          {
            "text": "Yes, over 1 year ago",
            "value": 1
          },
          {
            "text": "Yes, within last 12 months",
            "value": 2
          }
        ]
      },
      {
        "id": "asq_5",
        "text": "Acuity question — ask ONLY if Yes to any of 1-4: Are you having thoughts of killing yourself right now?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      }
    ],
    "scoring": {
      "method": "asq",
      "scoreLabel": "Screening Result (per NIMH toolkit's own action routing)",
      "results": {
        "negative": {
          "severity": "Negative screen — no intervention necessary at this time (clinical judgment can override)",
          "interpretation": "Negative screen — no intervention necessary at this time (clinical judgment can override)",
          "recommendation": "CRISIS ROUTING: -",
          "hasCrisisRisk": false
        },
        "nonAcute": {
          "severity": "Non-acute positive screen",
          "interpretation": "Positive screen (non-acute) — further evaluation indicated per NIMH ASQ toolkit action routing.",
          "recommendation": "988 Suicide and Crisis Lifeline: call or text 988. Crisis Text Line: text HOME to 741741.",
          "hasCrisisRisk": true
        },
        "acute": {
          "severity": "Acute positive screen",
          "interpretation": "Acute positive screen — acuity question endorsed. Immediate safety assessment indicated.",
          "recommendation": "988 Suicide and Crisis Lifeline: call or text 988. Crisis Text Line: text HOME to 741741.",
          "hasCrisisRisk": true
        }
      }
    }
  },
  "c-ssrs": {
    "title": "C-SSRS — Columbia Suicide Severity Rating Scale, Screen Version (Recent)",
    "description": "Screen Version (Recent). Skip logic: always ask 1 and 2. If Yes to 2, ask 3, 4, 5, 6. If No to 2, skip to 6 (still always asked).",
    "skipLogic": {
      "type": "c-ssrs",
      "gateQuestionIndex": 1,
      "gateNoValue": 0,
      "jumpToIndex": 5
    },
    "questions": [
      {
        "id": "c-ssrs_1",
        "text": "Have you wished you were dead or wished you could go to sleep and not wake up? (Past month)",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "c-ssrs_2",
        "text": "Have you actually had any thoughts about killing yourself? (Past month)",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "c-ssrs_3",
        "text": "Have you been thinking about how you might do this? (Past month)",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "c-ssrs_4",
        "text": "Have you had these thoughts and had some intention of acting on them? (Past month)",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "c-ssrs_5",
        "text": "Have you started to work out or worked out the details of how to kill yourself? Did you intend to carry out this plan? (Past month)",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "c-ssrs_6",
        "text": "Have you done anything, started to do anything, or prepared to do anything to end your life? (Examples: took pills, tried to shoot yourself, cut yourself, tried to hang yourself, or collected pills, obtained a gun, gave away valuables, wrote a will or suicide note, etc.) — always ask",
        "options": [
          {
            "text": "No",
            "value": 0
          },
          {
            "text": "Yes, but not within the past 3 months",
            "value": 1
          },
          {
            "text": "Yes, within the past 3 months",
            "value": 2
          }
        ]
      }
    ],
    "scoring": {
      "method": "c-ssrs",
      "scoreLabel": "Screen result",
      "crisisRoutingNote": "Any HIGH RISK / positive flag should trigger crisis-escalation workflow.",
      "results": {
        "negative": {
          "severity": "Negative screen — no risk indicators endorsed.",
          "interpretation": "Negative screen — no risk indicators endorsed.",
          "recommendation": "CRISIS ROUTING: -",
          "hasCrisisRisk": false
        },
        "positive": {
          "severity": "Positive screen — further evaluation indicated",
          "interpretation": "Positive screen — risk indicators endorsed.",
          "recommendation": "CRISIS ROUTING: escalate per clinical crisis workflow (therapist + emergency contact + emergency services where warranted).",
          "hasCrisisRisk": true
        },
        "high": {
          "severity": "HIGH RISK — crisis routing indicated",
          "interpretation": "HIGH RISK flag — intent, plan, and/or recent preparatory behavior endorsed.",
          "recommendation": "CRISIS ROUTING: escalate per clinical crisis workflow (therapist + emergency contact + emergency services where warranted).",
          "hasCrisisRisk": true
        }
      }
    }
  },
  "rses": {
    "title": "Rosenberg Self-Esteem Scale (RSES)",
    "description": "Instructions: below is a list of statements dealing with your general feelings about yourself. Indicate how much you agree or disagree with each.",
    "questions": [
      {
        "id": "rses_1",
        "text": "On the whole, I am satisfied with myself.",
        "options": [
          {
            "text": "Strongly agree",
            "value": 3
          },
          {
            "text": "Agree",
            "value": 2
          },
          {
            "text": "Disagree",
            "value": 1
          },
          {
            "text": "Strongly disagree",
            "value": 0
          }
        ],
        "reverseScored": false
      },
      {
        "id": "rses_2",
        "text": "At times, I think I am no good at all.",
        "options": [
          {
            "text": "Strongly agree",
            "value": 3
          },
          {
            "text": "Agree",
            "value": 2
          },
          {
            "text": "Disagree",
            "value": 1
          },
          {
            "text": "Strongly disagree",
            "value": 0
          }
        ],
        "reverseScored": true
      },
      {
        "id": "rses_3",
        "text": "I feel that I have a number of good qualities.",
        "options": [
          {
            "text": "Strongly agree",
            "value": 3
          },
          {
            "text": "Agree",
            "value": 2
          },
          {
            "text": "Disagree",
            "value": 1
          },
          {
            "text": "Strongly disagree",
            "value": 0
          }
        ],
        "reverseScored": false
      },
      {
        "id": "rses_4",
        "text": "I am able to do things as well as most other people.",
        "options": [
          {
            "text": "Strongly agree",
            "value": 3
          },
          {
            "text": "Agree",
            "value": 2
          },
          {
            "text": "Disagree",
            "value": 1
          },
          {
            "text": "Strongly disagree",
            "value": 0
          }
        ],
        "reverseScored": false
      },
      {
        "id": "rses_5",
        "text": "I feel I do not have much to be proud of.",
        "options": [
          {
            "text": "Strongly agree",
            "value": 3
          },
          {
            "text": "Agree",
            "value": 2
          },
          {
            "text": "Disagree",
            "value": 1
          },
          {
            "text": "Strongly disagree",
            "value": 0
          }
        ],
        "reverseScored": true
      },
      {
        "id": "rses_6",
        "text": "I certainly feel useless at times.",
        "options": [
          {
            "text": "Strongly agree",
            "value": 3
          },
          {
            "text": "Agree",
            "value": 2
          },
          {
            "text": "Disagree",
            "value": 1
          },
          {
            "text": "Strongly disagree",
            "value": 0
          }
        ],
        "reverseScored": true
      },
      {
        "id": "rses_7",
        "text": "I feel that I'm a person of worth, at least on an equal plane with others.",
        "options": [
          {
            "text": "Strongly agree",
            "value": 3
          },
          {
            "text": "Agree",
            "value": 2
          },
          {
            "text": "Disagree",
            "value": 1
          },
          {
            "text": "Strongly disagree",
            "value": 0
          }
        ],
        "reverseScored": false
      },
      {
        "id": "rses_8",
        "text": "I wish I could have more respect for myself.",
        "options": [
          {
            "text": "Strongly agree",
            "value": 3
          },
          {
            "text": "Agree",
            "value": 2
          },
          {
            "text": "Disagree",
            "value": 1
          },
          {
            "text": "Strongly disagree",
            "value": 0
          }
        ],
        "reverseScored": true
      },
      {
        "id": "rses_9",
        "text": "All in all, I am inclined to feel that I am a failure.",
        "options": [
          {
            "text": "Strongly agree",
            "value": 3
          },
          {
            "text": "Agree",
            "value": 2
          },
          {
            "text": "Disagree",
            "value": 1
          },
          {
            "text": "Strongly disagree",
            "value": 0
          }
        ],
        "reverseScored": true
      },
      {
        "id": "rses_10",
        "text": "I take a positive attitude toward myself.",
        "options": [
          {
            "text": "Strongly agree",
            "value": 3
          },
          {
            "text": "Agree",
            "value": 2
          },
          {
            "text": "Disagree",
            "value": 1
          },
          {
            "text": "Strongly disagree",
            "value": 0
          }
        ],
        "reverseScored": false
      }
    ],
    "scoring": {
      "method": "sumReverse",
      "reverseMax": 3,
      "scoreLabel": "Total score (0-30; higher = higher self-esteem)",
      "bands": [
        {
          "min": 0,
          "max": 14,
          "severity": "Below 15 — commonly cited as low self-esteem",
          "interpretation": "Descriptive band (commonly-cited, not a diagnostic cutoff): Below 15 — commonly cited as low self-esteem",
          "recommendation": "Screening / descriptive only — not a diagnostic cutoff."
        },
        {
          "min": 15,
          "max": 25,
          "severity": "15–25 — commonly cited average range",
          "interpretation": "Descriptive band (commonly-cited, not a diagnostic cutoff): within commonly cited average range",
          "recommendation": "Screening / descriptive only — not a diagnostic cutoff."
        },
        {
          "min": 26,
          "max": 30,
          "severity": "Above 25 — commonly cited as higher self-esteem",
          "interpretation": "Descriptive band (commonly-cited, not a diagnostic cutoff): higher self-esteem range",
          "recommendation": "Screening / descriptive only — not a diagnostic cutoff."
        }
      ]
    }
  },
  "audit-c": {
    "title": "AUDIT-C — Alcohol Use Disorders Identification Test, Concise",
    "description": "First 3 items of AUDIT. Sex at administration affects cutoff (women ≥3, men ≥4).",
    "questions": [
      {
        "id": "audit-c_1",
        "text": "Sex at administration (affects cutoff)",
        "options": [
          {
            "text": "Woman / female",
            "value": 0
          },
          {
            "text": "Man / male",
            "value": 1
          }
        ],
        "scored": false
      },
      {
        "id": "audit-c_2",
        "text": "How often do you have a drink containing alcohol?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Monthly or less",
            "value": 1
          },
          {
            "text": "2 to 4 times a month",
            "value": 2
          },
          {
            "text": "2 to 3 times a week",
            "value": 3
          },
          {
            "text": "4 or more times a week",
            "value": 4
          }
        ]
      },
      {
        "id": "audit-c_3",
        "text": "How many drinks containing alcohol do you have on a typical day when you are drinking?",
        "options": [
          {
            "text": "1 or 2",
            "value": 0
          },
          {
            "text": "3 or 4",
            "value": 1
          },
          {
            "text": "5 or 6",
            "value": 2
          },
          {
            "text": "7 to 9",
            "value": 3
          },
          {
            "text": "10 or more",
            "value": 4
          }
        ]
      },
      {
        "id": "audit-c_4",
        "text": "How often do you have six or more drinks on one occasion?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Less than monthly",
            "value": 1
          },
          {
            "text": "Monthly",
            "value": 2
          },
          {
            "text": "Weekly",
            "value": 3
          },
          {
            "text": "Daily or almost daily",
            "value": 4
          }
        ]
      }
    ],
    "scoring": {
      "method": "audit-c",
      "scoreLabel": "Total score (0-12)",
      "sexQuestionIndex": 0,
      "scoredQuestionIndices": [
        1,
        2,
        3
      ],
      "cutoffs": {
        "female": 3,
        "male": 4
      },
      "positive": {
        "severity": "Positive screen",
        "interpretation": "Screen result (cutoff: women ≥3, men ≥4): Positive screen",
        "recommendation": "Same 3 questions and scoring as AUDIT items 1-3. Consider full AUDIT and clinical follow-up."
      },
      "negative": {
        "severity": "Negative screen",
        "interpretation": "Screen result (cutoff: women ≥3, men ≥4): Negative screen",
        "recommendation": "No positive screen based on AUDIT-C sex-specific cutoff."
      }
    }
  },
  "audit": {
    "title": "AUDIT — Alcohol Use Disorders Identification Test",
    "description": "Alcohol Use Disorders Identification Test (WHO).",
    "questions": [
      {
        "id": "audit_1",
        "text": "How often do you have a drink containing alcohol?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Monthly or less",
            "value": 1
          },
          {
            "text": "2 to 4 times a month",
            "value": 2
          },
          {
            "text": "2 to 3 times a week",
            "value": 3
          },
          {
            "text": "4 or more times a week",
            "value": 4
          }
        ]
      },
      {
        "id": "audit_2",
        "text": "How many drinks containing alcohol do you have on a typical day when you are drinking?",
        "options": [
          {
            "text": "1 or 2",
            "value": 0
          },
          {
            "text": "3 or 4",
            "value": 1
          },
          {
            "text": "5 or 6",
            "value": 2
          },
          {
            "text": "7 to 9",
            "value": 3
          },
          {
            "text": "10 or more",
            "value": 4
          }
        ]
      },
      {
        "id": "audit_3",
        "text": "How often do you have six or more drinks on one occasion?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Less than monthly",
            "value": 1
          },
          {
            "text": "Monthly",
            "value": 2
          },
          {
            "text": "Weekly",
            "value": 3
          },
          {
            "text": "Daily or almost daily",
            "value": 4
          }
        ]
      },
      {
        "id": "audit_4",
        "text": "How often during the last year have you found that you were not able to stop drinking once you had started?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Less than monthly",
            "value": 1
          },
          {
            "text": "Monthly",
            "value": 2
          },
          {
            "text": "Weekly",
            "value": 3
          },
          {
            "text": "Daily or almost daily",
            "value": 4
          }
        ]
      },
      {
        "id": "audit_5",
        "text": "How often during the last year have you failed to do what was normally expected of you because of drinking?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Less than monthly",
            "value": 1
          },
          {
            "text": "Monthly",
            "value": 2
          },
          {
            "text": "Weekly",
            "value": 3
          },
          {
            "text": "Daily or almost daily",
            "value": 4
          }
        ]
      },
      {
        "id": "audit_6",
        "text": "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Less than monthly",
            "value": 1
          },
          {
            "text": "Monthly",
            "value": 2
          },
          {
            "text": "Weekly",
            "value": 3
          },
          {
            "text": "Daily or almost daily",
            "value": 4
          }
        ]
      },
      {
        "id": "audit_7",
        "text": "How often during the last year have you had a feeling of guilt or remorse after drinking?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Less than monthly",
            "value": 1
          },
          {
            "text": "Monthly",
            "value": 2
          },
          {
            "text": "Weekly",
            "value": 3
          },
          {
            "text": "Daily or almost daily",
            "value": 4
          }
        ]
      },
      {
        "id": "audit_8",
        "text": "How often during the last year have you been unable to remember what happened the night before because you had been drinking?",
        "options": [
          {
            "text": "Never",
            "value": 0
          },
          {
            "text": "Less than monthly",
            "value": 1
          },
          {
            "text": "Monthly",
            "value": 2
          },
          {
            "text": "Weekly",
            "value": 3
          },
          {
            "text": "Daily or almost daily",
            "value": 4
          }
        ]
      },
      {
        "id": "audit_9",
        "text": "Have you or someone else been injured as a result of your drinking?",
        "options": [
          {
            "text": "No",
            "value": 0
          },
          {
            "text": "Yes, but not in the last year",
            "value": 2
          },
          {
            "text": "Yes, during the last year",
            "value": 4
          }
        ]
      },
      {
        "id": "audit_10",
        "text": "Has a relative, friend, doctor, or other health worker been concerned about your drinking or suggested you cut down?",
        "options": [
          {
            "text": "No",
            "value": 0
          },
          {
            "text": "Yes, but not in the last year",
            "value": 2
          },
          {
            "text": "Yes, during the last year",
            "value": 4
          }
        ]
      }
    ],
    "scoring": {
      "method": "sum",
      "scoreLabel": "Total score (0-40)",
      "bands": [
        {
          "min": 0,
          "max": 7,
          "severity": "Zone I (0-7) — Low risk / abstinence",
          "interpretation": "Risk zone (WHO 4-zone framework): Zone I (0-7) — Low risk / abstinence",
          "recommendation": "Screening tool only. Score ≥8 is the standard cutoff for hazardous/harmful use."
        },
        {
          "min": 8,
          "max": 15,
          "severity": "Zone II (8-15) — Hazardous use",
          "interpretation": "Risk zone (WHO 4-zone framework): Zone II (8-15) — Hazardous use",
          "recommendation": "Score ≥8 is the standard cutoff for hazardous/harmful use. Screening tool only — not a diagnosis."
        },
        {
          "min": 16,
          "max": 19,
          "severity": "Zone III (16-19) — Harmful use",
          "interpretation": "Risk zone (WHO 4-zone framework): Zone III (16-19) — Harmful use",
          "recommendation": "Consider brief intervention and clinical follow-up. Screening tool only — not a diagnosis."
        },
        {
          "min": 20,
          "max": 40,
          "severity": "Zone IV (20-40) — Possible dependence",
          "interpretation": "Risk zone (WHO 4-zone framework): Zone IV (20-40) — Possible dependence",
          "recommendation": "Consider referral for specialized assessment. Screening tool only — not a diagnosis."
        }
      ]
    }
  },
  "scoff": {
    "title": "SCOFF Questionnaire",
    "description": "Eating disorders screening questionnaire.",
    "questions": [
      {
        "id": "scoff_1",
        "text": "Do you make yourself Sick because you feel uncomfortably full?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "scoff_2",
        "text": "Do you worry you have lost Control over how much you eat?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "scoff_3",
        "text": "Have you recently lost more than One stone (about 6.35 kg / 14 lbs) in a 3-month period?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "scoff_4",
        "text": "Do you believe yourself to be Fat when others say you are too thin?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      },
      {
        "id": "scoff_5",
        "text": "Would you say that Food dominates your life?",
        "options": [
          {
            "text": "Yes",
            "value": 1
          },
          {
            "text": "No",
            "value": 0
          }
        ]
      }
    ],
    "scoring": {
      "method": "sum",
      "scoreLabel": "Total score (0-5; 1 point per Yes)",
      "bands": [
        {
          "min": 0,
          "max": 1,
          "severity": "Negative screen",
          "interpretation": "Screen result (cutoff ≥2): Negative screen",
          "recommendation": "Screening tool only — does not diagnose an eating disorder."
        },
        {
          "min": 2,
          "max": 5,
          "severity": "Positive screen",
          "interpretation": "Screen result (cutoff ≥2): Positive screen",
          "recommendation": "Screening tool only — does not diagnose an eating disorder. Consider clinical follow-up."
        }
      ]
    }
  },
  "cbi": {
    "title": "Copenhagen Burnout Inventory (CBI)",
    "description": "Definition: a state of prolonged physical and psychological exhaustion. Use the term that fits your context (patients, users, students, etc.) in place of \"clients.\"",
    "questions": [
      {
        "id": "cbi_1",
        "text": "How often do you feel tired?",
        "options": [
          {
            "text": "Always",
            "value": 100
          },
          {
            "text": "Often",
            "value": 75
          },
          {
            "text": "Sometimes",
            "value": 50
          },
          {
            "text": "Seldom",
            "value": 25
          },
          {
            "text": "Never/almost never",
            "value": 0
          }
        ],
        "subscale": "personal",
        "reverseScored": false
      },
      {
        "id": "cbi_2",
        "text": "How often are you physically exhausted?",
        "options": [
          {
            "text": "Always",
            "value": 100
          },
          {
            "text": "Often",
            "value": 75
          },
          {
            "text": "Sometimes",
            "value": 50
          },
          {
            "text": "Seldom",
            "value": 25
          },
          {
            "text": "Never/almost never",
            "value": 0
          }
        ],
        "subscale": "personal",
        "reverseScored": false
      },
      {
        "id": "cbi_3",
        "text": "How often are you emotionally exhausted?",
        "options": [
          {
            "text": "Always",
            "value": 100
          },
          {
            "text": "Often",
            "value": 75
          },
          {
            "text": "Sometimes",
            "value": 50
          },
          {
            "text": "Seldom",
            "value": 25
          },
          {
            "text": "Never/almost never",
            "value": 0
          }
        ],
        "subscale": "personal",
        "reverseScored": false
      },
      {
        "id": "cbi_4",
        "text": "How often do you think: \"I can't take it anymore\"?",
        "options": [
          {
            "text": "Always",
            "value": 100
          },
          {
            "text": "Often",
            "value": 75
          },
          {
            "text": "Sometimes",
            "value": 50
          },
          {
            "text": "Seldom",
            "value": 25
          },
          {
            "text": "Never/almost never",
            "value": 0
          }
        ],
        "subscale": "personal",
        "reverseScored": false
      },
      {
        "id": "cbi_5",
        "text": "How often do you feel worn out?",
        "options": [
          {
            "text": "Always",
            "value": 100
          },
          {
            "text": "Often",
            "value": 75
          },
          {
            "text": "Sometimes",
            "value": 50
          },
          {
            "text": "Seldom",
            "value": 25
          },
          {
            "text": "Never/almost never",
            "value": 0
          }
        ],
        "subscale": "personal",
        "reverseScored": false
      },
      {
        "id": "cbi_6",
        "text": "How often do you feel weak and susceptible to illness?",
        "options": [
          {
            "text": "Always",
            "value": 100
          },
          {
            "text": "Often",
            "value": 75
          },
          {
            "text": "Sometimes",
            "value": 50
          },
          {
            "text": "Seldom",
            "value": 25
          },
          {
            "text": "Never/almost never",
            "value": 0
          }
        ],
        "subscale": "personal",
        "reverseScored": false
      },
      {
        "id": "cbi_7",
        "text": "Is your work emotionally exhausting?",
        "options": [
          {
            "text": "To a very high degree",
            "value": 100
          },
          {
            "text": "To a high degree",
            "value": 75
          },
          {
            "text": "Somewhat",
            "value": 50
          },
          {
            "text": "To a low degree",
            "value": 25
          },
          {
            "text": "To a very low degree",
            "value": 0
          }
        ],
        "subscale": "work",
        "reverseScored": false
      },
      {
        "id": "cbi_8",
        "text": "Do you feel burnt out because of your work?",
        "options": [
          {
            "text": "To a very high degree",
            "value": 100
          },
          {
            "text": "To a high degree",
            "value": 75
          },
          {
            "text": "Somewhat",
            "value": 50
          },
          {
            "text": "To a low degree",
            "value": 25
          },
          {
            "text": "To a very low degree",
            "value": 0
          }
        ],
        "subscale": "work",
        "reverseScored": false
      },
      {
        "id": "cbi_9",
        "text": "Does your work frustrate you?",
        "options": [
          {
            "text": "To a very high degree",
            "value": 100
          },
          {
            "text": "To a high degree",
            "value": 75
          },
          {
            "text": "Somewhat",
            "value": 50
          },
          {
            "text": "To a low degree",
            "value": 25
          },
          {
            "text": "To a very low degree",
            "value": 0
          }
        ],
        "subscale": "work",
        "reverseScored": false
      },
      {
        "id": "cbi_10",
        "text": "Do you feel worn out at the end of the working day?",
        "options": [
          {
            "text": "Always",
            "value": 100
          },
          {
            "text": "Often",
            "value": 75
          },
          {
            "text": "Sometimes",
            "value": 50
          },
          {
            "text": "Seldom",
            "value": 25
          },
          {
            "text": "Never/almost never",
            "value": 0
          }
        ],
        "subscale": "work",
        "reverseScored": false
      },
      {
        "id": "cbi_11",
        "text": "Are you exhausted in the morning at the thought of another day at work?",
        "options": [
          {
            "text": "Always",
            "value": 100
          },
          {
            "text": "Often",
            "value": 75
          },
          {
            "text": "Sometimes",
            "value": 50
          },
          {
            "text": "Seldom",
            "value": 25
          },
          {
            "text": "Never/almost never",
            "value": 0
          }
        ],
        "subscale": "work",
        "reverseScored": false
      },
      {
        "id": "cbi_12",
        "text": "Do you feel that every working hour is tiring for you?",
        "options": [
          {
            "text": "Always",
            "value": 100
          },
          {
            "text": "Often",
            "value": 75
          },
          {
            "text": "Sometimes",
            "value": 50
          },
          {
            "text": "Seldom",
            "value": 25
          },
          {
            "text": "Never/almost never",
            "value": 0
          }
        ],
        "subscale": "work",
        "reverseScored": false
      },
      {
        "id": "cbi_13",
        "text": "Do you have enough energy for family and friends during leisure time?",
        "options": [
          {
            "text": "Always",
            "value": 100
          },
          {
            "text": "Often",
            "value": 75
          },
          {
            "text": "Sometimes",
            "value": 50
          },
          {
            "text": "Seldom",
            "value": 25
          },
          {
            "text": "Never/almost never",
            "value": 0
          }
        ],
        "subscale": "work",
        "reverseScored": true
      },
      {
        "id": "cbi_14",
        "text": "Do you find it hard to work with clients?",
        "options": [
          {
            "text": "To a very high degree",
            "value": 100
          },
          {
            "text": "To a high degree",
            "value": 75
          },
          {
            "text": "Somewhat",
            "value": 50
          },
          {
            "text": "To a low degree",
            "value": 25
          },
          {
            "text": "To a very low degree",
            "value": 0
          }
        ],
        "subscale": "client",
        "reverseScored": false
      },
      {
        "id": "cbi_15",
        "text": "Do you find it frustrating to work with clients?",
        "options": [
          {
            "text": "To a very high degree",
            "value": 100
          },
          {
            "text": "To a high degree",
            "value": 75
          },
          {
            "text": "Somewhat",
            "value": 50
          },
          {
            "text": "To a low degree",
            "value": 25
          },
          {
            "text": "To a very low degree",
            "value": 0
          }
        ],
        "subscale": "client",
        "reverseScored": false
      },
      {
        "id": "cbi_16",
        "text": "Does it drain your energy to work with clients?",
        "options": [
          {
            "text": "To a very high degree",
            "value": 100
          },
          {
            "text": "To a high degree",
            "value": 75
          },
          {
            "text": "Somewhat",
            "value": 50
          },
          {
            "text": "To a low degree",
            "value": 25
          },
          {
            "text": "To a very low degree",
            "value": 0
          }
        ],
        "subscale": "client",
        "reverseScored": false
      },
      {
        "id": "cbi_17",
        "text": "Do you feel that you give more than you get back when you work with clients?",
        "options": [
          {
            "text": "To a very high degree",
            "value": 100
          },
          {
            "text": "To a high degree",
            "value": 75
          },
          {
            "text": "Somewhat",
            "value": 50
          },
          {
            "text": "To a low degree",
            "value": 25
          },
          {
            "text": "To a very low degree",
            "value": 0
          }
        ],
        "subscale": "client",
        "reverseScored": false
      },
      {
        "id": "cbi_18",
        "text": "Are you tired of working with clients?",
        "options": [
          {
            "text": "To a very high degree",
            "value": 100
          },
          {
            "text": "To a high degree",
            "value": 75
          },
          {
            "text": "Somewhat",
            "value": 50
          },
          {
            "text": "To a low degree",
            "value": 25
          },
          {
            "text": "To a very low degree",
            "value": 0
          }
        ],
        "subscale": "client",
        "reverseScored": false
      },
      {
        "id": "cbi_19",
        "text": "Do you sometimes wonder how long you will be able to continue working with clients?",
        "options": [
          {
            "text": "To a very high degree",
            "value": 100
          },
          {
            "text": "To a high degree",
            "value": 75
          },
          {
            "text": "Somewhat",
            "value": 50
          },
          {
            "text": "To a low degree",
            "value": 25
          },
          {
            "text": "To a very low degree",
            "value": 0
          }
        ],
        "subscale": "client",
        "reverseScored": false
      }
    ],
    "scoring": {
      "method": "cbi",
      "scoreLabel": "Average burnout score (0-100)",
      "subscales": {
        "personal": {
          "indices": [
            0,
            1,
            2,
            3,
            4,
            5
          ],
          "label": "Personal Burnout score (average of answered items, 0-100)"
        },
        "work": {
          "indices": [
            6,
            7,
            8,
            9,
            10,
            11,
            12
          ],
          "label": "Work Burnout score (average of answered items, 0-100)"
        },
        "client": {
          "indices": [
            13,
            14,
            15,
            16,
            17,
            18
          ],
          "label": "Client Burnout score (average of answered items, 0-100)"
        }
      },
      "highThreshold": 50,
      "interpretation": "The CBI's own normative study (Borritz & Kristensen, National Institute of Occupational Health, Denmark, 2004) reports population means and describes \"high degree of burnout\" descriptively as a score of 50 or more on the 0-100 scale — this is how the PUMA study characterizes its own data, not a clinically validated diagnostic threshold the way PHQ-9's cutoffs are. Treat scores as a continuous severity indicator for clinician review, not a pass/fail diagnostic flag.",
      "recommendation": "Treat scores as a continuous severity indicator for clinician review, not a pass/fail diagnostic flag.",
      "reverseMax": 100
    }
  }
};
