import { LAB_DATASETS } from '../data/labData';
import type { LabPrediction, LabSample } from '../types';

export interface ModelTrainingResult {
  datasetId: string;
  totalExamples: number;
  categoryDistribution: Record<string, number>;
  trainingCompleted: boolean;
  trainingTimestamp: string;
}

export class ClassifierDemoService {
  /**
   * Evaluates the chosen training examples and prepares the model state.
   */
  trainModel(datasetId: string, labeledExamples: Record<string, string>): ModelTrainingResult {
    const dataset = LAB_DATASETS.find((d) => d.id === datasetId) || LAB_DATASETS[0];
    const categoryDistribution: Record<string, number> = {
      [dataset.categoryA]: 0,
      [dataset.categoryB]: 0,
    };

    Object.values(labeledExamples).forEach((category) => {
      if (category in categoryDistribution) {
        categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
      }
    });

    return {
      datasetId,
      totalExamples: Object.keys(labeledExamples).length,
      categoryDistribution,
      trainingCompleted: true,
      trainingTimestamp: new Date().toISOString(),
    };
  }

  /**
   * Generates a deterministic, educational prediction for a test sample.
   * Explains feature correlation, confidence, and why mistakes occur.
   */
  predict(
    datasetId: string,
    testSample: LabSample,
    labeledExamples: Record<string, string>
  ): LabPrediction {
    const dataset = LAB_DATASETS.find((d) => d.id === datasetId) || LAB_DATASETS[0];
    const categoryACount = Object.values(labeledExamples).filter((c) => c === dataset.categoryA).length;

    // Default if dataset is Fruit vs Not Fruit
    if (dataset.id === 'fruit-classifier') {
      if (testSample.id === 'test-1') {
        // Green Watermelon
        const hasFruitExamples = categoryACount > 0;
        const confidence = hasFruitExamples ? 88 : 52;
        return {
          sample: testSample,
          predictedCategory: 'Fruit',
          confidence,
          isCorrect: true,
          explanation:
            'The AI recognized curved organic shape and rind features similar to apples and grapes in your training data.',
          reflectionQuestion:
            'Notice the watermelon has green stripes. If your training set had no green items, would the AI still guess correctly?',
        };
      }

      if (testSample.id === 'test-2') {
        // Red Toy Ball
        // If user labeled tennis ball as Not Fruit, AI might know sports balls are Not Fruit
        const labeledTennisBallAsNotFruit = labeledExamples['train-5'] === 'Not Fruit';
        if (!labeledTennisBallAsNotFruit) {
          return {
            sample: testSample,
            predictedCategory: 'Fruit',
            confidence: 76,
            isCorrect: false,
            explanation:
              'The AI was tricked! It saw a round shape and bright red color (just like your Red Apple example) and guessed Fruit.',
            reflectionQuestion:
              'How could adding more toys and balls to the "Not Fruit" training category help prevent this mistake?',
          };
        } else {
          return {
            sample: testSample,
            predictedCategory: 'Not Fruit',
            confidence: 81,
            isCorrect: true,
            explanation:
              'Great work! Because you taught the model with toy examples like the tennis ball, it learned that rubber balls are Not Fruit.',
            reflectionQuestion:
              'Why is it important to show both fruits AND toys during training?',
          };
        }
      }

      if (testSample.id === 'test-3') {
        // Sweet Pineapple
        return {
          sample: testSample,
          predictedCategory: 'Fruit',
          confidence: 79,
          isCorrect: true,
          explanation:
            'The AI detected organic texture and crown features. Because of its unique spiky texture, confidence was slightly lower than for smooth fruits.',
          reflectionQuestion:
            'What happens when an AI encounters an object with an unusual texture it hasn’t seen before?',
        };
      }

      if (testSample.id === 'test-4') {
        // Plastic Apple Toy
        return {
          sample: testSample,
          predictedCategory: 'Fruit',
          confidence: 91,
          isCorrect: false,
          explanation:
            'A classic visual illusion! To a camera or image AI, this plastic replica looks identical to a real red apple, so it predicted Fruit with high confidence.',
          reflectionQuestion:
            'Why can vision AI be fooled by artificial toys that look just like real food?',
        };
      }
    }

    // Default fallback prediction for other datasets
    const isCatDog = dataset.id === 'cat-dog-classifier';
    if (isCatDog && testSample.id === 'cd-test-1') {
      // Husky with pointed ears
      return {
        sample: testSample,
        predictedCategory: 'Cat',
        confidence: 68,
        isCorrect: false,
        explanation:
          'Tricky! The Husky has pointed triangular ears that strongly resemble the cat examples in your training set.',
        reflectionQuestion:
          'If an AI only uses ear shape to tell cats and dogs apart, what kind of mistakes will it make?',
      };
    }

    // Generic prediction
    const predicted = testSample.category;
    const confidence = Math.min(95, Math.max(60, 50 + categoryACount * 8));

    return {
      sample: testSample,
      predictedCategory: predicted,
      confidence,
      isCorrect: true,
      explanation: `The model compared ${testSample.features.slice(0, 2).join(' and ')} against your ${Object.keys(labeledExamples).length} training examples.`,
      reflectionQuestion:
        'Why does having more varied examples lead to higher prediction confidence?',
    };
  }
}

export const classifierDemo = new ClassifierDemoService();
