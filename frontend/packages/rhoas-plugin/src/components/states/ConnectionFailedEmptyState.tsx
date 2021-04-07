import * as React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { history } from '@console/internal/components/utils';
import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon';
import { useTranslation, Trans } from 'react-i18next';

type ConnectionFailedEmptyStateProps = {
  currentNamespace: string;
};

export const ConnectionFailedEmptyState = ({
  currentNamespace,
}: ConnectionFailedEmptyStateProps) => {
  const { t } = useTranslation();

  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={TimesCircleIcon} />
      <Title headingLevel="h4" size="lg">
        {t('rhoas-plugin~Could not connect to Kafka instances')}
      </Title>
      <EmptyStateBody>
        <Trans t={t} ns="rhoas-plugin">
          To make sure the instance exists and that you&lsquo;re authorized to access it, you can
          see your Kafka instances at{' '}
          <a
            href="https://cloud.redhat.com/openshift/token"
            rel="noopener noreferrer"
            target="_blank"
          >
            https://cloud.redhat.com.
          </a>{' '}
          To discover more managed services, go to the{' '}
          <Button
            isInline
            variant="link"
            onClick={() =>
              history.push(`/catalog/ns/${currentNamespace}?catalogType=managedservices`)
            }
          >
            managed services catalog.
          </Button>
        </Trans>
      </EmptyStateBody>
    </EmptyState>
  );
};
