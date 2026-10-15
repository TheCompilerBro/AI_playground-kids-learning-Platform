import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { FeedbackPanel } from './FeedbackPanel';

describe('FeedbackPanel', () => {
  it('renders correct feedback state with celebratory styling', () => {
    const handleContinue = vi.fn();
    render(
      <FeedbackPanel
        isCorrect={true}
        explanation="AI is a tool that learns patterns!"
        encouragement="Awesome job!"
        onContinue={handleContinue}
      />
    );

    expect(screen.getByText('✨ Great Thinking!')).toBeInTheDocument();
    expect(screen.getByText('AI is a tool that learns patterns!')).toBeInTheDocument();
    expect(screen.getByText('Awesome job!')).toBeInTheDocument();
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();

    const continueBtn = screen.getByText('Continue to Next Step');
    fireEvent.click(continueBtn);
    expect(handleContinue).toHaveBeenCalledTimes(1);
  });

  it('renders respectful retry feedback when answer is wrong', () => {
    const handleRetry = vi.fn();
    const handleContinue = vi.fn();

    render(
      <FeedbackPanel
        isCorrect={false}
        explanation="Take another look at the clues."
        onRetry={handleRetry}
        onContinue={handleContinue}
      />
    );

    expect(screen.getByText('🤔 Interesting Clue!')).toBeInTheDocument();
    expect(screen.getByText('Needs Another Look')).toBeInTheDocument();

    const retryBtn = screen.getByText('Try Again');
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
