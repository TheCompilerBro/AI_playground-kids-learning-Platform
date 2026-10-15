import type { LabSample } from '../types';

export interface LabDataset {
  id: string;
  name: string;
  description: string;
  categoryA: string;
  categoryB: string;
  trainingSamples: LabSample[];
  testSamples: LabSample[];
}

export const LAB_DATASETS: LabDataset[] = [
  {
    id: 'fruit-classifier',
    name: 'Fruit vs Not Fruit',
    description: 'Teach the AI to recognize edible fruits versus everyday non-fruit objects.',
    categoryA: 'Fruit',
    categoryB: 'Not Fruit',
    trainingSamples: [
      {
        id: 'train-1',
        name: 'Red Apple',
        category: 'Fruit',
        features: ['Red color', 'Round shape', 'Stem on top', 'Sweet skin'],
        emoji: '🍎',
        notes: 'Classic fruit with smooth curved skin'
      },
      {
        id: 'train-2',
        name: 'Ripe Banana',
        category: 'Fruit',
        features: ['Yellow color', 'Curved shape', 'Peelable', 'Soft texture'],
        emoji: '🍌',
        notes: 'Long curved shape, distinctive bright color'
      },
      {
        id: 'train-3',
        name: 'Strawberry',
        category: 'Fruit',
        features: ['Red color', 'Cone shape', 'Tiny exterior seeds', 'Green leafy crown'],
        emoji: '🍓',
        notes: 'Surface texture with seeds'
      },
      {
        id: 'train-4',
        name: 'Purple Grapes',
        category: 'Fruit',
        features: ['Purple color', 'Small spheres in a bunch', 'Juicy'],
        emoji: '🍇',
        notes: 'Clustered round shapes'
      },
      {
        id: 'train-5',
        name: 'Tennis Ball',
        category: 'Not Fruit',
        features: ['Fuzzy texture', 'Neon yellow/green', 'Round sphere', 'Bouncy rubber'],
        emoji: '🎾',
        notes: 'Round and yellow like some fruit, but it is sports equipment!'
      },
      {
        id: 'train-6',
        name: 'Toy Robot',
        category: 'Not Fruit',
        features: ['Metallic grey', 'Sharp square corners', 'Plastic/metal material', 'Gears & lights'],
        emoji: '🤖',
        notes: 'Artificial machine with hard straight edges'
      },
      {
        id: 'train-7',
        name: 'Building Brick',
        category: 'Not Fruit',
        features: ['Plastic material', 'Rectangular studs', 'Hard edges'],
        emoji: '🧱',
        notes: 'Synthetic building block'
      },
      {
        id: 'train-8',
        name: 'Rubber Duck',
        category: 'Not Fruit',
        features: ['Yellow color', 'Animal shape', 'Squeaky hollow plastic'],
        emoji: '🦆',
        notes: 'Yellow toy, definitely not food!'
      }
    ],
    testSamples: [
      {
        id: 'test-1',
        name: 'Green Watermelon',
        category: 'Fruit',
        features: ['Green striped exterior', 'Heavy round shape', 'Red juicy interior'],
        emoji: '🍉',
        isTestSample: true,
        notes: 'Testing if the AI recognizes a green striped fruit'
      },
      {
        id: 'test-2',
        name: 'Red Toy Ball',
        category: 'Not Fruit',
        features: ['Red color', 'Smooth round shape', 'Made of rubber', 'Bounces'],
        emoji: '🔴',
        isTestSample: true,
        notes: 'Tricky! It is red and round like an apple, but made of rubber.'
      },
      {
        id: 'test-3',
        name: 'Sweet Pineapple',
        category: 'Fruit',
        features: ['Spiky crown', 'Golden brown rough diamond skin', 'Tropical sweet scent'],
        emoji: '🍍',
        isTestSample: true,
        notes: 'Testing if spiky skin confuses the model'
      },
      {
        id: 'test-4',
        name: 'Plastic Apple Toy',
        category: 'Not Fruit',
        features: ['Looks exactly like an apple', 'Made of hollow plastic', 'Not edible'],
        emoji: '🍏',
        isTestSample: true,
        notes: 'Ultra tricky! It looks identical to fruit on the surface, but it is plastic.'
      }
    ]
  },
  {
    id: 'cat-dog-classifier',
    name: 'Cat vs Dog',
    description: 'Train the model to spot the differences between feline and canine friends.',
    categoryA: 'Cat',
    categoryB: 'Dog',
    trainingSamples: [
      {
        id: 'cd-train-1',
        name: 'Tabby Kitten',
        category: 'Cat',
        features: ['Pointed triangular ears', 'Long whiskers', 'Slit pupils', 'Curled tail'],
        emoji: '🐱'
      },
      {
        id: 'cd-train-2',
        name: 'Black Cat',
        category: 'Cat',
        features: ['Sleek fur', 'Pointy ears', 'Quiet padded paws'],
        emoji: '🐈‍⬛'
      },
      {
        id: 'cd-train-3',
        name: 'Golden Retriever',
        category: 'Dog',
        features: ['Floppy folded ears', 'Long snout', 'Panting tongue', 'Wagging bushy tail'],
        emoji: '🐕'
      },
      {
        id: 'cd-train-4',
        name: 'French Bulldog',
        category: 'Dog',
        features: ['Short flat snout', 'Bat ears', 'Sturdy stocky body'],
        emoji: '🐶'
      }
    ],
    testSamples: [
      {
        id: 'cd-test-1',
        name: 'Fluffy Husky',
        category: 'Dog',
        features: ['Pointed ears like a wolf', 'Thick fur', 'Curled bushy tail'],
        emoji: '🐺',
        isTestSample: true,
        notes: 'Pointed ears might trick the AI into thinking it is a cat!'
      },
      {
        id: 'cd-test-2',
        name: 'Sleeping Calico',
        category: 'Cat',
        features: ['Tri-color patch fur', 'Whiskers', 'Compact sleeping pose'],
        emoji: '🐈',
        isTestSample: true
      }
    ]
  }
];
