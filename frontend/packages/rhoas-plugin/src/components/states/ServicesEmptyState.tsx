import * as React from 'react';
import { Button, EmptyState, EmptyStateIcon, Title } from '@patternfly/react-core';
import { history } from '@console/internal/components/utils';
import { ServicesEmptyStateIcon } from './ServicesEmptyStateIcon';

type ServicesEmptyStateProps = {
  title: string;
  message?: string;
  actionLabel: string;
  action?: () => void;
  icon?: React.ComponentClass;
  iconClass?: string;
};

export const ServicesEmptyState = ({
  title,
  message,
  actionLabel,
  action,
  iconClass,
}: ServicesEmptyStateProps) => (
  <>
    <EmptyState>
      <EmptyStateIcon className={iconClass} icon={ServicesEmptyStateIcon} />
      <Title headingLevel="h4" size="lg">
        {title}
      </Title>
      {message || (
        <Title headingLevel="h5" size="md">
          {message}
        </Title>
      )}
      <Button variant="link" onClick={action || history.goBack}>
        {actionLabel}
      </Button>
    </EmptyState>
  </>
);
