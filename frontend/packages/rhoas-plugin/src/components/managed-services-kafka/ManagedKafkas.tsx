import * as React from 'react';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import { FormFooter } from '@console/shared';
import { history } from '@console/internal/components/utils';
import './ManagedKafkas.css';
import StreamsInstancePage from '../streams-list/StreamsInstancePage';
import { ManagedServiceAccountRequest, ManagedKafkaRequestModel } from '../../models/rhoas';
import { useActiveNamespace } from '@console/shared';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { k8sGet } from '@console/internal/module/k8s/resource';
import { ManagedServiceAccountCRName, ManagedKafkaRequestCRName } from '../../const';
import { Button, EmptyState, EmptyStateIcon, EmptyStateSecondaryActions, Title } from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';
import {
  createManagedKafkaConnection,
  createManagedKafkaRequestIfNeeded,
  createManagedServiceAccount,
  listOfCurrentKafkaConnectionsById
} from './resourceCreators';

import { KafkaRequest } from "./types"

const ManagedKafkas = () => {
  const [currentNamespace] = useActiveNamespace();
  const [selectedKafka, setSelectedKafka] = React.useState<number>();
  const [serviceAccountCreated, setServiceAccountCreated] = React.useState(false);
  const [currentKafkaConnections, setCurrentKafkaConnections] = React.useState([]);
  const [kafkaRequest, setKafkaRequest] = React.useState();

  const [kafkaRequestChange, loaded, error] = useK8sWatchResource<KafkaRequest>({
    kind: ManagedKafkaRequestModel.kind,
    name: ManagedKafkaRequestCRName,
    namespace: currentNamespace,
    isList: false
  })

  console.log("what is ManagedKafkas", kafkaRequestChange, loaded, error);
  console.log('what is kafkaRequest' + JSON.stringify(kafkaRequest));

  const createServiceAccountIfNeeded = async () => {
    const managedServiceAccount = await k8sGet(ManagedServiceAccountRequest, ManagedServiceAccountCRName, currentNamespace);
    if (!managedServiceAccount) {
      await createManagedServiceAccount(currentNamespace);
      setServiceAccountCreated(true);
    }
  }

  const createKafkaRequestFlow = async () => {
    const request = await createManagedKafkaRequestIfNeeded(currentNamespace);
    setKafkaRequest(request);
    createServiceAccountIfNeeded();
    const currentKafka = await listOfCurrentKafkaConnectionsById(currentNamespace)
    if (currentKafka) {
      setCurrentKafkaConnections(currentKafka);
    }
  }

  // React.useEffect(() => {
  //   setKafkaRequest(kafkaRequestChange);
  // }, [kafkaRequestChange]);

  React.useEffect(() => {

    createKafkaRequestFlow()
  }, []);

  if (kafkaRequest === undefined || !kafkaRequest.status || kafkaRequest.status?.userKafkas?.length === 0) {
    return <NamespacedPage disabled variant={NamespacedPageVariants.light} hideApplications>
      <EmptyState>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg">
          No Managed Kafka Clusters found
        </Title>
        <EmptyStateSecondaryActions>
          <Button variant="link">Go back to Managed Services Catalog</Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    </NamespacedPage>
  }

  const kafkaRequestData = kafkaRequest !== undefined ? kafkaRequest.status.userKafkas : [];
  console.log('what is kafkaRequestData' + kafkaRequestData);

  const createManagedKafkaConnectionFlow = async () => {
    // TODO verify if service account sercret exist
    const kafkaId = kafkaRequestData[selectedKafka].id;
    const kafkaName = kafkaRequestData[selectedKafka].name;
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
    if (currentKafkaConnections.length === kafkaRequestData.length) {
      return true;
    }
    else {
      return false;
    }
  }

  return (
    <>
      <NamespacedPage disabled variant={NamespacedPageVariants.light} hideApplications>
        <>
          {serviceAccountCreated ? (<><p>Created Service Account</p></>) : ""}
          <StreamsInstancePage
            kafkaArray={kafkaRequestData}
            setSelectedKafka={setSelectedKafka}
            currentKafkaConnections={currentKafkaConnections}
          />
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
        </>
      </NamespacedPage>
    </>
  );
};

export default ManagedKafkas;
