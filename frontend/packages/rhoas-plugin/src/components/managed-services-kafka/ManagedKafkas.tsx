import * as React from 'react';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import { FormFooter } from '@console/shared';
import { history } from '@console/internal/components/utils';
import './ManagedKafkas.css';
import StreamsInstancePage from '../streams-list/StreamsInstancePage';
import { ManagedKafkaRequestModel } from '../../models/rhoas';
import { useActiveNamespace } from '@console/shared';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { ManagedKafkaRequestCRName } from '../../const';
import { Button, EmptyState, EmptyStateIcon, EmptyStateSecondaryActions, Title } from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';
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
  const [serviceAccountCreated, setServiceAccountCreated] = React.useState(false);
  const [currentKafkaConnections, setCurrentKafkaConnections] = React.useState([]);
  // const [remoteKafkaInstances, setRemoteKafkaInstances] = React.useState();
  const [isWatchKafkasLoading, setIsWatchKafkasLoading] = React.useState(true);

  let remoteKafkaInstances;

  const createKafkaRequestFlow = async () => {
    await createManagedKafkaRequestIfNeeded(currentNamespace);
    const accountCreated = await createServiceAccountIfNeeded(currentNamespace);
    const currentKafka = await listOfCurrentKafkaConnectionsById(currentNamespace)
    if (currentKafka) {
      setCurrentKafkaConnections(currentKafka);
    }
    if (accountCreated) {
      setServiceAccountCreated(true);
    }
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

  // if (!watchedKafkaRequest || !watchedKafkaRequest.status) {
  //   // TODO loader should be in center of page
  //   return (
  //     <div>
  //       <LoadingBox/>
  //     </div>
  //   )
  // }


  if (watchedKafkaRequest && watchedKafkaRequest.status) {
    remoteKafkaInstances = watchedKafkaRequest.status.userKafkas;
    setIsWatchKafkasLoading(false);
  }

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
        <>
          {serviceAccountCreated ? (<><p>Created Service Account</p></>) : ""}
          <StreamsInstancePage
            kafkaArray={!isWatchKafkasLoading && remoteKafkaInstances}
            setSelectedKafka={setSelectedKafka}
            currentKafkaConnections={currentKafkaConnections}
            isWatchKafkasLoading={isWatchKafkasLoading}
          />
          { remoteKafkaInstances && (
            <div className="co-m-pane__body" style={{ borderTop: 0, paddingTop: 0, paddingBottom: 0 }}>
              <FormFooter
                handleSubmit={() => createManagedKafkaConnectionFlow()}
                isSubmitting={false}
                errorMessage=""
                submitLabel={"Create"}
                disableSubmit={disableCreate()}
                resetLabel="Reset"
                sticky
                handleCancel={history.goBack}
              />
            </div>
          )}
        </>
      </NamespacedPage>
    </>
  );
};

export default ManagedKafkas;
