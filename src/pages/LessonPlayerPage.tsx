import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LESSONS } from '../data/lessons';
import { PageContainer } from '../components/layout/PageContainer';
import { LessonPlayerView } from '../components/lesson/LessonPlayerView';
import { ErrorState } from '../components/ui/ErrorState';

export const LessonPlayerPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const lesson = LESSONS.find((l) => l.id === lessonId);

  if (!lesson) {
    return (
      <PageContainer size="narrow">
        <ErrorState
          title="Lesson Not Found"
          message="We couldn't find the lesson you were looking for. Let's return to the lesson library!"
          onRetry={() => navigate('/lessons')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="narrow">
      <LessonPlayerView lesson={lesson} />
    </PageContainer>
  );
};
