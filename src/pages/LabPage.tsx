import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { LabView } from '../components/lab/LabView';

export const LabPage: React.FC = () => {
  return (
    <PageContainer size="default">
      <LabView />
    </PageContainer>
  );
};
