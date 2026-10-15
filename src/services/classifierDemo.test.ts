import { describe, it, expect } from 'vitest';
import { classifierDemo } from './classifierDemo';
import { LAB_DATASETS } from '../data/labData';

describe('ClassifierDemoService', () => {
  const fruitDataset = LAB_DATASETS[0];

  it('trains model and tallies category distribution', () => {
    const labeled = {
      'train-1': 'Fruit',
      'train-2': 'Fruit',
      'train-5': 'Not Fruit',
    };

    const result = classifierDemo.trainModel(fruitDataset.id, labeled);
    expect(result.totalExamples).toBe(3);
    expect(result.categoryDistribution['Fruit']).toBe(2);
    expect(result.categoryDistribution['Not Fruit']).toBe(1);
    expect(result.trainingCompleted).toBe(true);
  });

  it('predicts green watermelon with organic features', () => {
    const watermelon = fruitDataset.testSamples[0];
    const labeled = {
      'train-1': 'Fruit',
      'train-2': 'Fruit',
    };

    const prediction = classifierDemo.predict(fruitDataset.id, watermelon, labeled);
    expect(prediction.predictedCategory).toBe('Fruit');
    expect(prediction.isCorrect).toBe(true);
    expect(prediction.confidence).toBeGreaterThan(70);
  });

  it('demonstrates dataset mistake when sports ball is not trained', () => {
    const redBall = fruitDataset.testSamples[1]; // Red Toy Ball
    // If tennis ball was NOT labeled as Not Fruit, model gets fooled by red/round features
    const labeled = {
      'train-1': 'Fruit',
      'train-2': 'Fruit',
    };

    const prediction = classifierDemo.predict(fruitDataset.id, redBall, labeled);
    expect(prediction.predictedCategory).toBe('Fruit');
    expect(prediction.isCorrect).toBe(false);
    expect(prediction.explanation).toContain('tricked');
    expect(prediction.reflectionQuestion).toBeDefined();
  });

  it('corrects prediction when sports ball is included in training set', () => {
    const redBall = fruitDataset.testSamples[1]; // Red Toy Ball
    const labeled = {
      'train-1': 'Fruit',
      'train-5': 'Not Fruit', // Tennis ball trained as Not Fruit
    };

    const prediction = classifierDemo.predict(fruitDataset.id, redBall, labeled);
    expect(prediction.predictedCategory).toBe('Not Fruit');
    expect(prediction.isCorrect).toBe(true);
  });
});
