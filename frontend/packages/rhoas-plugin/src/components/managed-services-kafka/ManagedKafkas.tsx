import * as React from 'react';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import { history, LoadingBox } from '@console/internal/components/utils';
import { referenceForModel } from '@console/internal/module/k8s';
import { useActiveNamespace } from '@console/shared';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import StreamsInstancePage from '../streams-list/StreamsInstancePage';
import { ManagedServicesRequestModel } from '../../models/rhoas';
import { ManagedServicesRequestCRName } from '../../const';
import {
  createManagedKafkaConnection,
  createManagedServicesRequestIfNeeded,
  listOfCurrentKafkaConnectionsById,
} from '../../utils/resourceCreators';
import { KafkaRequest } from '../../types/rhoas-types';
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
    name: ManagedServicesRequestCRName,
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
        <p>Invalid access token</p>
      </>)
    } else {
      return (<>
        <p>Failed to load list of services</p>
        <p>Message: {condition.message}</p>
        <p>Reason: {condition.reason}</p>
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
