import * as React from 'react';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import { history, LoadingBox } from '@console/internal/components/utils';
import { referenceForModel } from '@console/internal/module/k8s';
import { useActiveNamespace } from '@console/shared';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import ServiceInstance from './ServiceInstance';
import { CloudServicesRequestModel } from '../../models/rhoas';
import { ServicesRequestCRName } from '../../const';
import {
  createKafkaConnection,
  createCloudServicesRequestIfNeeded,
  deleteKafkaConnection,
  listOfCurrentKafkaConnectionsById,
} from '../../utils/resourceCreators';
import { KafkaRequest } from '../../utils/rhoas-types';
import {
  isResourceStatusSuccessfull,
  isAcccesTokenSecretValid,
  getFinishedCondition,
} from '../../utils/conditionHandler';
import { ServicesErrorState } from '../states/ServicesErrorState';
import { useTranslation } from 'react-i18next';

const ServiceListPage = () => {
  const [currentNamespace] = useActiveNamespace();
  const [selectedKafka, setSelectedKafka] = React.useState<number>();
  const [currentKafkaConnections, setCurrentKafkaConnections] = React.useState<string[]>([]);
  const { t } = useTranslation();
  const [kafkaCreateError, setKafkaCreateError] = React.useState<string>();

  React.useEffect(() => {
    const createKafkaRequestFlow = async () => {
      await createCloudServicesRequestIfNeeded(currentNamespace);

      const currentKafka = await listOfCurrentKafkaConnectionsById(currentNamespace);
      if (currentKafka) {
        setCurrentKafkaConnections(currentKafka);
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

  if (kafkaCreateError) {
    return (
      <ServicesErrorState
        title={t('Failed to create connection')}
        message={kafkaCreateError + t('Please try again')}
        actionInfo={t('rhoas-plugin~Go back to Services Catalog')}
      />
    );
  }

  if (!watchedKafkaRequest || !watchedKafkaRequest.status) {
    return (
      <>
        <LoadingBox />
      </>
    );
  }

  if (!isResourceStatusSuccessfull(watchedKafkaRequest)) {
    if (!isAcccesTokenSecretValid(watchedKafkaRequest)) {
      return (
        <ServicesErrorState
          title={t('Could not fetch services')}
          message={t('Could not connect to RHOAS with API Token')}
          actionInfo={t('rhoas-plugin~Go back to Services Catalog')}
        />
      );
    }
    return (
      <>
        <ServicesErrorState
          title={t('Could not fetch services')}
          message={
            t('Failed to load list of services') +
            getFinishedCondition(watchedKafkaRequest)?.message
          }
          actionInfo={t('rhoas-plugin~Go back to Services Catalog')}
        />
        <div />
      </>
    );
  }

  const remoteKafkaInstances = watchedKafkaRequest.status.userKafkas;

  const createKafkaConnectionFlow = async () => {
    const kafkaId = remoteKafkaInstances[selectedKafka].id;
    const kafkaName = remoteKafkaInstances[selectedKafka].name;
    try {
      await createKafkaConnection(kafkaId, kafkaName, currentNamespace);
      history.push(`/topology/ns/${currentNamespace}`);
    } catch (error) {
      deleteKafkaConnection(kafkaName, currentNamespace);
      setKafkaCreateError(error);
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
        <ServiceInstance
          kafkaArray={remoteKafkaInstances}
          selectedKafka={selectedKafka}
          setSelectedKafka={setSelectedKafka}
          currentKafkaConnections={currentKafkaConnections}
          createKafkaConnectionFlow={createKafkaConnectionFlow}
          disableCreateButton={disableCreateButton}
        />
      </NamespacedPage>
    </>
  );
};

export default ServiceListPage;