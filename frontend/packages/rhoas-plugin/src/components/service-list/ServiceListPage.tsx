import * as React from 'react';
import ServiceInstance from './ServiceInstance';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import { history, LoadingBox } from '@console/internal/components/utils';
import { referenceForModel } from '@console/internal/module/k8s';
import { useActiveNamespace } from '@console/shared';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { CloudServicesRequestModel } from '../../models/rhoas';
import { ServicesRequestCRName } from '../../const';
import {
  createKafkaConnection,
  createCloudServicesRequestIfNeeded,
  deleteKafkaConnection,
  listOfCurrentKafkaConnectionsById,
} from '../../utils/resourceCreators';
import { KafkaRequest } from '../../utils/rhoas-types';
import { isResourceStatusSuccessful, isAccessTokenSecretValid } from '../../utils/conditionHandler';

const ServiceListPage: React.FC = () => {
  const [currentNamespace] = useActiveNamespace();
  const [selectedKafka, setSelectedKafka] = React.useState<number>();
  const [currentKafkaConnections, setCurrentKafkaConnections] = React.useState<string[]>();
  const [kafkaCreateError, setKafkaCreateError] = React.useState<string>();
  const [kafkaListError, setKafkaListError] = React.useState<string>();
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);

  React.useEffect(() => {
    const createKafkaRequestFlow = async () => {
      try {
        await createCloudServicesRequestIfNeeded(currentNamespace);

        const currentKafka = await listOfCurrentKafkaConnectionsById(currentNamespace);
        if (currentKafka) {
          setCurrentKafkaConnections(currentKafka);
        }
      } catch (error) {
        setKafkaListError(error);
      }
    };
    createKafkaRequestFlow();
  }, [currentNamespace]);

  const [watchedKafkaRequest] = useK8sWatchResource<KafkaRequest>({
    kind: referenceForModel(CloudServicesRequestModel),
    name: ServicesRequestCRName,
    namespace: currentNamespace,
    isList: false,
    optional: true,
  });

  const remoteKafkaInstances = watchedKafkaRequest?.status?.userKafkas || [];

  const createKafkaConnectionFlow = React.useCallback(async () => {
    setSubmitting(true);
    const { id, name } = remoteKafkaInstances[selectedKafka];
    try {
      await createKafkaConnection(id, name, currentNamespace);
      history.push(`/topology/ns/${currentNamespace}`);
      setSubmitting(false);
    } catch (error) {
      deleteKafkaConnection(name, currentNamespace);
      setKafkaCreateError(error);
      setSubmitting(false);
    }
  }, [currentNamespace, remoteKafkaInstances, selectedKafka]);

  if (
    !watchedKafkaRequest ||
    !watchedKafkaRequest.status ||
    currentKafkaConnections === undefined
  ) {
    return <LoadingBox />;
  }

  return (
    <NamespacedPage variant={NamespacedPageVariants.light} disabled hideApplications>
      <ServiceInstance
        kafkaArray={remoteKafkaInstances}
        selectedKafka={selectedKafka}
        setSelectedKafka={setSelectedKafka}
        currentKafkaConnections={currentKafkaConnections}
        createKafkaConnectionFlow={createKafkaConnectionFlow}
        isSubmitting={isSubmitting}
        currentNamespace={currentNamespace}
        kafkaCreateError={kafkaCreateError}
        kafkaListError={kafkaListError}
        isResourceStatusSuccessful={isResourceStatusSuccessful}
        isAccessTokenSecretValid={isAccessTokenSecretValid}
      />
    </NamespacedPage>
  );
};

export default ServiceListPage;
