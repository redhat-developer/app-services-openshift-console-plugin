import * as React from 'react';
import { 
  Button, 
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Title 
} from '@patternfly/react-core';
import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon';
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';

export const ManagedKafkaEmptyState: any = ({ title, body, action, icon }) => {

  const renderIcon = () => {
    switch (icon) {
      case 'TimesCircleIcon':
        return TimesCircleIcon;
      case 'CubesIcon':
        return CubesIcon;
      default:
        return undefined;
    }
  }

  return (
  <EmptyState>
    <EmptyStateIcon icon={renderIcon()} />
    <Title headingLevel="h4" size="lg">
      {title}
    </Title>
    <EmptyStateBody>
      {body}
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <Button variant="link">{action}</Button>
    </EmptyStateSecondaryActions>
  </EmptyState>
  )
}
