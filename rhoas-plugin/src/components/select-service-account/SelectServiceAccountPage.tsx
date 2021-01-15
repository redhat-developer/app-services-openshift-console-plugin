import * as React from 'react';
import {
  PageSection,
  PageSectionVariants,
  Title
} from '@patternfly/react-core';

const SelectServiceAccountPage = () => {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1">
          Service account
        </Title>
        <p>Leverage a service account to access</p>
      </PageSection>
    </>
  )
}

export default SelectServiceAccountPage;
