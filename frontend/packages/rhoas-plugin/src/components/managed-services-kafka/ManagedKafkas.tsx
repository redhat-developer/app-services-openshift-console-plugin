import * as React from 'react';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import { history } from '@console/internal/components/utils';
import './ManagedKafkas.css';
import StreamsInstancePage from '../streams-list/StreamsInstancePage';
import { ManagedKafkaRequestModel } from '../../models/rhoas';
import { useActiveNamespace } from '@console/shared';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { ManagedKafkaRequestCRName } from '../../const';
import {
  createManagedKafkaConnection,
  createManagedKafkaRequestIfNeeded,
  createServiceAccountIfNeeded,
  listOfCurrentKafkaConnectionsById
} from './resourceCreators';
import { referenceForModel } from '@console/internal/module/k8s';
import { LoadingBox } from '@console/internal/components/utils';

import { KafkaRequest } from "./types"

const ManagedKafkas = () => {
  const [currentNamespace] = useActiveNamespace();
  const [selectedKafka, setSelectedKafka] = React.useState<number>();
  const [currentKafkaConnections, setCurrentKafkaConnections] = React.useState([]);

  const createKafkaRequestFlow = async () => {
    await createManagedKafkaRequestIfNeeded(currentNamespace);
    const accountCreated = await createServiceAccountIfNeeded(currentNamespace);
    const currentKafka = await listOfCurrentKafkaConnectionsById(currentNamespace)
    if (currentKafka) {
      setCurrentKafkaConnections(currentKafka);
    }
    // if (accountCreated) {
    //   setServiceAccountCreated(true);
    // }
  }

  React.useEffect(() => {
    createKafkaRequestFlow()
  }, []);

  const [watchedKafkaRequest] = useK8sWatchResource<KafkaRequest>({
    kind: referenceForModel(ManagedKafkaRequestModel),
    name: ManagedKafkaRequestCRName,
    namespace: currentNamespace,
    isList: false
  })

  // TO DO: Replace this once we get error handling from operator
  if (!watchedKafkaRequest || !watchedKafkaRequest.status) {
    return (
      <div>
        <LoadingBox/>
      </div>
    )
  }

  let remoteKafkaInstances = watchedKafkaRequest.status.userKafkas;

  const createManagedKafkaConnectionFlow = async () => {
    // TODO verify if service account sercret exist
    const kafkaId = remoteKafkaInstances[selectedKafka].id;
    const kafkaName = remoteKafkaInstances[selectedKafka].name;
    if (currentKafkaConnections) {
      if (!currentKafkaConnections.includes(kafkaId)) {
        createManagedKafkaConnection(kafkaId, kafkaName, currentNamespace);
      }
    }
    history.push(`/topology/ns/${currentNamespace}`);
  };

  const disableCreate = () => {
    if (selectedKafka === null || selectedKafka === undefined) {
      return true;
    }
    if (currentKafkaConnections.length === remoteKafkaInstances.length) {
      return true;
    }
    else {
      return false;
    }
  }

  return (
    <>
      <NamespacedPage variant={NamespacedPageVariants.light} disabled hideApplications>
        <StreamsInstancePage
          kafkaArray={remoteKafkaInstances}
          setSelectedKafka={setSelectedKafka}
          currentKafkaConnections={currentKafkaConnections}
          currentNamespace={currentNamespace}
          createManagedKafkaConnectionFlow={createManagedKafkaConnectionFlow}
          disableCreate={disableCreate}
        />
      </NamespacedPage>
    </>
  );
};

export default ManagedKafkas;
