import * as React from 'react';
import { Helmet } from 'react-helmet';
import { PageBody } from '@console/shared';
import StreamsInstanceFilter from './StreamsInstanceFilter';
import StreamsInstanceTable from './StreamsInstanceTable';
import { PageHeading } from '@console/internal/components/utils';
import { LoadingBox } from '@console/internal/components/utils';
import { ManagedKafkaEmptyState } from './../empty-state/ManagedKafkaEmptyState';

// FIXME full typed experience React.FC<{ kafkaArray: ManagedKafkaModel[]}>
const StreamsInstancePage: any = ({ kafkaArray, setSelectedKafka, currentKafkaConnections, isWatchKafkasLoading }) => {

  const [unableToConnect, setUnableToConnect] = React.useState(false);

  const countTimeLoaded = () => {
    setUnableToConnect(true);
  }

  if (!unableToConnect) {
    setTimeout(countTimeLoaded, 10000)
  }

  return (
    <>
      <Helmet>
        <title>Select Managed Kafka Cluster</title>
      </Helmet>
      <PageHeading
        className="rhoas__page-heading"
        title="Select Managed Kafka Cluster"
      >
        <p>The managed Kafka cluster selected below will appear in the topology view.</p>
      </PageHeading>
      { unableToConnect ? (
        <PageBody>
          <ManagedKafkaEmptyState
            title="Could not connect"
            body="We weren't able to load your managed clusters"
            action="Try again"
            icon="TimesCircleIcon"
          />
        </PageBody>
      ) : (
        <PageBody>
          { isWatchKafkasLoading ? <LoadingBox/> 
          : kafkaArray.length === 0 ? (
            <ManagedKafkaEmptyState
              title="No Managed Kafka Clusters found"
              action="Go back to Managed Services Catalog"
              icon="CubesIcon"
            />
          ) : (
            <>
              <StreamsInstanceFilter />
              <StreamsInstanceTable
                kafkaArray={kafkaArray}
                setSelectedKafka={setSelectedKafka}
                currentKafkaConnections={currentKafkaConnections}
              />
            </>
          )}
        </PageBody>
      )}
    </>
  );
};

export default StreamsInstancePage;
