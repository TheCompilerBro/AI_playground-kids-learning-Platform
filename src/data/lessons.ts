import type { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'what-is-ai',
    title: 'What Is AI?',
    summary: 'Discover what Artificial Intelligence really is: a helpful computer tool that learns patterns, not a magic living creature.',
    learningBand: 'explorer',
    durationMinutes: 4,
    badgeId: 'badge-what-is-ai',
    icon: 'Sparkles',
    objectives: [
      'Understand what AI stands for (Artificial Intelligence)',
      'Learn that AI is built by people to solve specific tasks',
      'Discover that computers look for patterns in pictures and words'
    ],
    steps: [
      {
        id: 'step-1',
        type: 'concept',
        title: 'Meet AI: The Pattern Helper!',
        instruction: 'Artificial Intelligence (AI) is a kind of computer program created by humans.',
        helperText: 'Think of AI like a very fast computer assistant that looks through lots of examples to spot patterns and help people with tasks like finding photos, recommending music, or translating languages. It does not have feelings, dreams, or a brain like yours!'
      },
      {
        id: 'step-2',
        type: 'activity',
        title: 'Activity: Tool or Living Friend?',
        instruction: 'Click on the items below to see if they are a Human Friend or an AI Tool.',
        activityConfig: {
          type: 'sort',
          instruction: 'Categorize each item as a "Living Person" or an "AI Computer Tool".',
          categories: ['Living Person', 'AI Computer Tool'],
          items: [
            { id: 'item-1', label: 'Your Best Friend', category: 'Living Person', iconName: 'Smile', description: 'Has real feelings, eats food, and plays outside!' },
            { id: 'item-2', label: 'Voice Assistant on Phone', category: 'AI Computer Tool', iconName: 'Mic', description: 'A computer program listening for sound patterns.' },
            { id: 'item-3', label: 'School Teacher', category: 'Living Person', iconName: 'GraduationCap', description: 'A wonderful person who cares and teaches you.' },
            { id: 'item-4', label: 'Photo Tagging App', category: 'AI Computer Tool', iconName: 'Camera', description: 'Software matching shapes in pixels.' }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'quiz',
        title: 'Quick Check: What is AI?',
        instruction: 'Choose the best answer below:',
        question: {
          id: 'q-what-is-ai',
          prompt: 'What is Artificial Intelligence (AI)?',
          options: [
            { id: 'opt-1', text: 'A magic alien creature with feelings', isCorrect: false, hint: 'Remember, AI does not have real emotions or a living body!' },
            { id: 'opt-2', text: 'A computer tool made by people that finds patterns in data', isCorrect: true },
            { id: 'opt-3', text: 'A toy that never ever makes any mistakes', isCorrect: false, hint: 'AI can definitely make mistakes!' }
          ],
          explanation: 'Exactly! AI is a computer tool created by people. It learns from patterns in data to help solve specific tasks.',
          encouragement: 'Great job thinking carefully about how technology works!'
        }
      },
      {
        id: 'step-4',
        type: 'celebrate',
        title: 'You Completed "What Is AI?"',
        instruction: 'You earned the Curious Thinker badge! You now know AI is a pattern-finding tool built by people.'
      }
    ]
  },
  {
    id: 'teach-a-robot',
    title: 'Teach a Robot',
    summary: 'Computers do not know what an apple or a dog looks like until we give them lots of labeled examples. Let’s practice teaching!',
    learningBand: 'explorer',
    durationMinutes: 5,
    badgeId: 'badge-teach-robot',
    icon: 'Bot',
    objectives: [
      'Learn what a "label" is in machine learning',
      'Understand how computers need examples to learn',
      'Practice sorting objects into categories'
    ],
    steps: [
      {
        id: 'step-1',
        type: 'concept',
        title: 'How Do Computers Learn?',
        instruction: 'When you were very small, someone pointed to a ball and said "ball". Computers need the same thing!',
        helperText: 'A computer cannot see meaning on its own. We have to show it many examples and give each one a label, such as "Round" or "Sharp". This is called training data!'
      },
      {
        id: 'step-2',
        type: 'activity',
        title: 'Activity: Help the Robot Sort Shapes',
        instruction: 'Assign each object to either "Round Objects" or "Pointy Objects".',
        activityConfig: {
          type: 'sort',
          instruction: 'Label these examples correctly so the robot understands the difference!',
          categories: ['Round Objects', 'Pointy Objects'],
          items: [
            { id: 'shape-1', label: 'Juicy Orange', category: 'Round Objects', iconName: 'Circle', description: 'Curved and round in shape.' },
            { id: 'shape-2', label: 'Sharpened Pencil', category: 'Pointy Objects', iconName: 'PenTool', description: 'Has a sharp tip at the end.' },
            { id: 'shape-3', label: 'Soccer Ball', category: 'Round Objects', iconName: 'CircleDot', description: 'Rolls smoothly in all directions.' },
            { id: 'shape-4', label: 'Party Hat Cone', category: 'Pointy Objects', iconName: 'Triangle', description: 'Has a pointed peak on top.' }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'quiz',
        title: 'Quick Check: Teaching Computers',
        instruction: 'Pick the right answer:',
        question: {
          id: 'q-teach-robot',
          prompt: 'How does an AI computer learn to recognize an apple?',
          options: [
            { id: 'opt-1', text: 'It magically knows what an apple is as soon as you plug it in', isCorrect: false, hint: 'Computers start with zero knowledge until we give them data.' },
            { id: 'opt-2', text: 'Humans show it many photos of apples with the label "Apple"', isCorrect: true },
            { id: 'opt-3', text: 'By eating real apples for lunch', isCorrect: false, hint: 'Computers do not eat food!' }
          ],
          explanation: 'Spot on! AI needs humans to provide labeled examples so it can study the patterns and learn what an apple looks like.',
          encouragement: 'You are thinking like a real computer scientist!'
        }
      },
      {
        id: 'step-4',
        type: 'celebrate',
        title: 'Robot Trained Successfully!',
        instruction: 'You earned the Robot Teacher badge! Now you know that labeled examples are the fuel for AI.'
      }
    ]
  },
  {
    id: 'pattern-detective',
    title: 'Pattern Detective',
    summary: 'Put on your detective hat! Uncover repeating sequences and see how AI guesses what comes next.',
    learningBand: 'detective',
    durationMinutes: 6,
    badgeId: 'badge-pattern-detective',
    icon: 'Search',
    objectives: [
      'Spot repeating sequences and mathematical rules',
      'Make accurate predictions based on observed clues',
      'Connect human pattern recognition with computer algorithms'
    ],
    steps: [
      {
        id: 'step-1',
        type: 'concept',
        title: 'What Is a Pattern?',
        instruction: 'A pattern is a rule or rhythm that repeats again and again.',
        helperText: 'When an AI suggests the next word you want to text, or predicts whether tomorrow might be sunny, it looks for patterns in what happened before. If you spot the rule, you can predict what comes next!'
      },
      {
        id: 'step-2',
        type: 'activity',
        title: 'Activity: Complete the Sequence',
        instruction: 'Look at the pattern and choose the missing piece!',
        activityConfig: {
          type: 'pattern',
          instruction: 'Find the repeating rhythm and pick what fills the blank space:',
          patternSequence: ['☀️ Sun', '🌧️ Rain', '☀️ Sun', '🌧️ Rain', '☀️ Sun', '❓ [Blank]'],
          patternMissingIndex: 5,
          patternOptions: ['🌧️ Rain', '❄️ Snow', '🌪️ Storm'],
          patternCorrectAnswer: '🌧️ Rain'
        }
      },
      {
        id: 'step-3',
        type: 'quiz',
        title: 'Detective Challenge',
        instruction: 'How does this help AI?',
        question: {
          id: 'q-pattern-detective',
          prompt: 'When a music app recommends a new song you might enjoy, what pattern is it using?',
          options: [
            { id: 'opt-1', text: 'It looks at the songs you listened to before and finds similar ones', isCorrect: true },
            { id: 'opt-2', text: 'It picks a completely random sound without looking at anything', isCorrect: false, hint: 'If it were random, it might play sounds you dislike!' },
            { id: 'opt-3', text: 'It reads your private thoughts with mind control', isCorrect: false, hint: 'Computers cannot read human minds!' }
          ],
          explanation: 'Yes! The app notices the patterns in artists, tempos, and genres you listen to and looks for songs that match that pattern.',
          encouragement: 'Awesome detective work! You cracked the case.'
        }
      },
      {
        id: 'step-4',
        type: 'celebrate',
        title: 'Case Closed, Detective!',
        instruction: 'You earned the Pattern Detective badge! Patterns are the secret clue behind AI predictions.'
      }
    ]
  },
  {
    id: 'train-your-first-ai',
    title: 'Train Your First AI',
    summary: 'Discover the difference between training data and testing data, and see how variety makes models smarter.',
    learningBand: 'detective',
    durationMinutes: 7,
    badgeId: 'badge-train-ai',
    icon: 'BrainCircuit',
    objectives: [
      'Understand the difference between Training and Testing data',
      'Discover why showing only one type of example causes bias or confusion',
      'Learn how variety makes an AI model much more reliable'
    ],
    steps: [
      {
        id: 'step-1',
        type: 'concept',
        title: 'Training vs Testing',
        instruction: 'Training is studying with the practice book; testing is trying out brand-new questions!',
        helperText: 'When we build an AI, we split our data into two groups: Training Examples (used to teach the model) and Testing Examples (new examples the model has never seen before). If the model only studies red apples, it might fail when tested on a green Granny Smith apple!'
      },
      {
        id: 'step-2',
        type: 'activity',
        title: 'Activity: Choose a Diverse Training Set',
        instruction: 'Which set of examples is best for training an AI to recognize all kinds of dogs?',
        activityConfig: {
          type: 'feature_match',
          instruction: 'Pick the training set that will make the AI model the smartest and most accurate.',
          categories: ['Best Training Set (High Variety)', 'Weak Training Set (Too Narrow)'],
          items: [
            { id: 'set-a', label: '10 Photos of Fluffy White Poodles Only', category: 'Weak Training Set (Too Narrow)', iconName: 'AlertCircle', description: 'The AI will only learn that dogs are white and fluffy!' },
            { id: 'set-b', label: 'Photos of Poodles, Bulldogs, Huskies & Golden Retrievers', category: 'Best Training Set (High Variety)', iconName: 'CheckCircle2', description: 'Teaches the AI different colors, ear shapes, and sizes!' }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'quiz',
        title: 'Knowledge Check: Training Variety',
        instruction: 'Answer this question:',
        question: {
          id: 'q-train-ai',
          prompt: 'If you only train an AI with pictures of yellow bananas, what might happen if you show it a green banana?',
          options: [
            { id: 'opt-1', text: 'It might get confused and fail to recognize it as a banana', isCorrect: true },
            { id: 'opt-2', text: 'It will always know it is a banana because computers know everything', isCorrect: false, hint: 'Models only know what their examples teach them!' },
            { id: 'opt-3', text: 'The computer screen will turn green', isCorrect: false, hint: 'The screen colors do not change because of a banana.' }
          ],
          explanation: 'That is right! Because it only saw yellow bananas, the AI learned the wrong rule: "Bananas must be yellow." Variety in training data is essential!',
          encouragement: 'High five! You understand one of the biggest challenges in real AI research!'
        }
      },
      {
        id: 'step-4',
        type: 'celebrate',
        title: 'AI Trainer Certified!',
        instruction: 'You earned the AI Trainer badge! Remember: variety in examples makes a model smarter.'
      }
    ]
  },
  {
    id: 'ai-can-make-mistakes',
    title: 'AI Can Make Mistakes',
    summary: 'AI is not magic and it does not always know the right answer. Learn why errors happen and when to ask an adult.',
    learningBand: 'creator',
    durationMinutes: 6,
    badgeId: 'badge-mistakes-expert',
    icon: 'ShieldCheck',
    objectives: [
      'Recognize that AI predictions are estimates, not guarantees',
      'Understand tricky visual illusions and missing data',
      'Remember to always verify important information with a parent or teacher'
    ],
    steps: [
      {
        id: 'step-1',
        type: 'concept',
        title: 'AI Is Not All-Knowing',
        instruction: 'Even the most advanced AI can get confused by tricky pictures or questions it has never seen.',
        helperText: 'Because AI relies on matching numbers and shapes, it can be tricked by optical illusions, shadows, or unfamiliar angles. It doesn’t actually understand what an object is in real life the way a human does!'
      },
      {
        id: 'step-2',
        type: 'activity',
        title: 'Activity: The Blueberry Muffin Mystery',
        instruction: 'See why a vision model got confused by these two photos!',
        activityConfig: {
          type: 'spot_mistake',
          instruction: 'Why did the AI classify a blueberry muffin as a Chihuahua puppy?',
          categories: ['Reason for Mistake', 'Incorrect Explanation'],
          items: [
            { id: 'muffin-reason', label: 'Dark blueberries look just like dark puppy eyes and nose on a round tan surface', category: 'Reason for Mistake', iconName: 'Eye', description: 'The pattern of dark spots on tan background tricked the pixel detector!' },
            { id: 'muffin-fake', label: 'The computer was hungry and wanted a muffin snack', category: 'Incorrect Explanation', iconName: 'XCircle', description: 'Computers do not feel hunger or crave food!' }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'quiz',
        title: 'Responsible AI Rule',
        instruction: 'What should you do with important answers?',
        question: {
          id: 'q-ai-mistakes',
          prompt: 'What should you do if an AI gives you an answer about something important (like medicine or health)?',
          options: [
            { id: 'opt-1', text: 'Trust it 100% without checking because AI is never wrong', isCorrect: false, hint: 'Never trust AI blindly with important safety or health questions!' },
            { id: 'opt-2', text: 'Double-check with a parent, teacher, or trusted adult', isCorrect: true },
            { id: 'opt-3', text: 'Ask another robot and hope for the best', isCorrect: false, hint: 'Other robots can make the same mistake!' }
          ],
          explanation: 'Spot on! AI is a helpful tool, but human beings—like parents, doctors, and teachers—must always make important decisions.',
          encouragement: 'You are now an expert at using technology safely and smartly!'
        }
      },
      {
        id: 'step-4',
        type: 'celebrate',
        title: 'Mistake Investigator Mastered!',
        instruction: 'You earned the Mistake Investigator badge! You know the most important rule: always check important answers!'
      }
    ]
  }
];
