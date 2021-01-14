import * as React from 'react';
import StreamsInstanceFilter from './StreamsInstanceFilter';
import StreamsInstanceTable from './StreamsInstanceTable';
import {
  PageSection,
  PageSectionVariants,
  Title
} from '@patternfly/react-core';

const StreamsInstancePage = () => {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1">
          OpenShift Streams for Apache Kafka
        </Title>
        <p>Select all those OpenShift Streams instances you'd like to connect to.</p>
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <StreamsInstanceFilter/>
        <StreamsInstanceTable/>
      </PageSection>
    </>
  )
}

export default StreamsInstancePage;
