import * as React from 'react';
import { Button, EmptyState, EmptyStateIcon, Title } from '@patternfly/react-core';
import { history } from '@console/internal/components/utils';

type ServicesEmptyStateProps = {
  title: string;
  actionInfo?: string;
  action?: () => void;
  icon: React.ComponentClass;
};

export const ServicesEmptyState = ({
  title,
  actionInfo,
  action,
  icon,
}: ServicesEmptyStateProps) => {
  let stateAction;
  if (action) {
    stateAction = action;
  } else {
    stateAction = () => {
      history.goBack();
    };
  }

  return (
    <EmptyState>
      <EmptyStateIcon icon={icon} />
      <Title headingLevel="h4" size="lg">
        {title}
      </Title>
      <Button variant="link" onClick={stateAction}>
        {actionInfo}
      </Button>
    </EmptyState>
  );
};
