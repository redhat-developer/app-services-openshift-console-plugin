import * as React from 'react';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import { history, LoadingBox } from '@console/internal/components/utils';
import { referenceForModel } from '@console/internal/module/k8s';
import { useActiveNamespace } from '@console/shared';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import StreamsInstancePage from './InstancePage';
import { ManagedServicesRequestModel } from '../../models/rhoas';
import { ServicesRequestCRName } from '../../const';
import {
  createManagedKafkaConnection,
  createManagedServicesRequestIfNeeded,
  listOfCurrentKafkaConnectionsById,
} from '../../utils/resourceCreators';
import { KafkaRequest } from '../../utils/rhoas-types';
import { getCondition, getFinishedCondition } from '../../utils/conditionHandler';

const ManagedKafkas = () => {
  const [currentNamespace] = useActiveNamespace();
  const [selectedKafka, setSelectedKafka] = React.useState<number>();
  const [currentKafkaConnections, setCurrentKafkaConnections] = React.useState<string[]>([]);

  const createKafkaRequestFlow = async () => {
    await createManagedServicesRequestIfNeeded(currentNamespace);

    const currentKafka = await listOfCurrentKafkaConnectionsById(currentNamespace);
    if (currentKafka) {
      setCurrentKafkaConnections(currentKafka);
    }
  };

  React.useEffect(() => {
    createKafkaRequestFlow();
  }, []);

  const [watchedKafkaRequest] = useK8sWatchResource<KafkaRequest>({
    kind: referenceForModel(ManagedServicesRequestModel),
    name: ServicesRequestCRName,
    namespace: currentNamespace,
    isList: false,
    optional: true,
  });

  if (!watchedKafkaRequest || !watchedKafkaRequest.status) {
    return (
      <>
        <LoadingBox />
      </>
    );
  }

  const condition = getFinishedCondition(watchedKafkaRequest);
  if (condition && condition.status === "False") {
    if (getCondition(watchedKafkaRequest, "AcccesTokenSecretValid")?.status == "False") {
      return (<>
        <div>Invalid access token</div>
      </>)
    } else {
      return (<>
        <div>Failed to load list of services</div>
        <div>{condition.message}</div>
      </>)
    }
  }

  const remoteKafkaInstances = watchedKafkaRequest.status.userKafkas;

  const createManagedKafkaConnectionFlow = async () => {
    const kafkaId = remoteKafkaInstances[selectedKafka].id;
    const kafkaName = remoteKafkaInstances[selectedKafka].name;
    try {
      await createManagedKafkaConnection(kafkaId, kafkaName, currentNamespace);
      history.push(`/topology/ns/${currentNamespace}`);
    } catch (error) {
      // TODO
    }
  };

  const disableCreateButton = () => {
    if (selectedKafka === null || selectedKafka === undefined) {
      return true;
    }
    if (currentKafkaConnections.length === remoteKafkaInstances.length) {
      return true;
    }
    return false;
  };

  return (
    <>
      <NamespacedPage variant={NamespacedPageVariants.light} disabled hideApplications>
        <StreamsInstancePage
          kafkaArray={remoteKafkaInstances}
          selectedKafka={selectedKafka}
          setSelectedKafka={setSelectedKafka}
          currentKafkaConnections={currentKafkaConnections}
          createManagedKafkaConnectionFlow={createManagedKafkaConnectionFlow}
          disableCreateButton={disableCreateButton}
        />
      </NamespacedPage>
    </>
  );
};

export default ManagedKafkas;
