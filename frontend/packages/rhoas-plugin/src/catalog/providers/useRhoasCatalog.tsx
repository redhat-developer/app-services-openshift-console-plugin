import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Flex,
  FlexItem,
  Divider,
  Label,
  Text,
  TextVariants,
  TextList,
  TextListItem,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import { CatalogExtensionHook, CatalogItem } from '@console/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { referenceForModel, K8sResourceKind } from '@console/internal/module/k8s';
import { ServiceToken } from '../../components/access-services/ServicesToken';
import { ServiceAccountCRName, kafkaIcon, operatorIcon } from '../../const';
import { CloudServiceAccountRequest } from '../../models';
import { isResourceStatusSuccessfull } from '../../utils/conditionHandler';
import { CATALOG_TYPE } from '../const';

const useRhoasCatalog: CatalogExtensionHook<CatalogItem[]> = ({
  namespace,
}): [CatalogItem[], boolean, any] => {
  const { t } = useTranslation();

  const [serviceAccount, loaded, errorMsg] = useK8sWatchResource({
    kind: referenceForModel(CloudServiceAccountRequest),
    isList: false,
    name: ServiceAccountCRName,
    namespace,
    namespaced: true,
  });

  const loadedOrError = loaded || errorMsg;
  const isServiceAccountValid = isResourceStatusSuccessfull(serviceAccount as K8sResourceKind);
  const services = React.useMemo(() => {
    if (!loaded && !errorMsg) return [];

    const tokenStatusFooter = () => {
      let token;
      if (serviceAccount === null || !isServiceAccountValid) {
        token = (
          <Label variant="outline" color="orange" icon={<LockIcon />}>
            {t('rhoas-plugin~Unlock with token')}
          </Label>
        );
      } else {
        token = t('rhoas-plugin~Unlocked');
      }
      return (
        <Flex direction={{ default: 'column' }} className="catalog-tile-pf-body">
          <FlexItem className="catalog-tile-pf-description">
            <span>
              {t(
                'rhoas-plugin~Red Hat OpenShift Application Services include Red Hat OpenShift API Management and Red Hat OpenShift Streams for Apache Kafka',
              )}
            </span>
          </FlexItem>
          <FlexItem>{token}</FlexItem>
        </Flex>
      );
    };

    const serviceKafkaCardDescription1 = (
      <Text component={TextVariants.p}>{t('rhoas-plugin~Service Kafka Card Description 1')}</Text>
    );

    const serviceKafkaCardDescription2 = (
      <Text component={TextVariants.p}>{t('rhoas-plugin~Service Kafka Card Description 2')}</Text>
    );

    const serviceKafkaCardDescription3 = (
      <Text component={TextVariants.p}>
        <Trans t={t} ns="rhoas-plugin">
          <b>Delivered as a service, managed by Red Hat SRE</b> - Red Hat&lsquo;s specialized 24x7
          global SRE team fully manages the Kafka infrastructure and daily operations, including
          monitoring, logging, upgrades and patching, to proactively address issues and quickly
          solve problems.
        </Trans>
      </Text>
    );

    const serviceKafkaCardDescription4 = (
      <Text component={TextVariants.p}>
        <Trans t={t} ns="rhoas-plugin">
          <b>Streamlined developer experience</b> - a developer-first, consistent experience that
          shields the user from administrative tasks, supports self-service, and easily connects to
          other OpenShift workloads.
        </Trans>
      </Text>
    );

    const serviceKafkaCardDescription5 = (
      <Text component={TextVariants.p}>
        <Trans t={t} ns="rhoas-plugin">
          <b>Real-time, streaming data broker</b> - service that can run in any cloud to support
          large data transfer volumes between distributed microservices for enterprise-scale
          applications.
        </Trans>
      </Text>
    );

    const serviceKafkaCardDescription6 = (
      <Text component={TextVariants.p}>
        <Trans t={t} ns="rhoas-plugin">
          <b>Schema registry</b> - Red Hat OpenShift Service Registry is included, making it easy
          for development teams to publish, communicate and discover any streaming data topics.
        </Trans>
      </Text>
    );

    const serviceKafkaCardDescription7 = (
      <Text component={TextVariants.p}>
        <Trans t={t} ns="rhoas-plugin">
          <b>Connectors</b> - the Kafka brokers can securely connect to distributed services, making
          it easy to consume and share streaming data between applications and enterprise systems,
          cloud provider services, and SaaS applications.
        </Trans>
      </Text>
    );

    const cloudServicesCardDescription1 = (
      <>
        <Text component={TextVariants.p}>
          {t('rhoas-plugin~Red Hat OpenShift Application Services include:')}
        </Text>
        <TextList>
          <TextListItem>{t('rhoas-plugin~Red Hat OpenShift API Management')}</TextListItem>
          <TextListItem>
            {t('rhoas-plugin~Red Hat OpenShift Streams for Apache Kafka')}
          </TextListItem>
        </TextList>
      </>
    );

    const cloudServicesCardDescription2 = (
      <Text component={TextVariants.p}>{t('rhoas-plugin~Cloud Services Card Description')}</Text>
    );

    const serviceKafkaCardDetailsDescription = [
      {
        value: serviceKafkaCardDescription1,
      },
      {
        value: serviceKafkaCardDescription2,
      },
      {
        value: serviceKafkaCardDescription3,
      },
      {
        value: serviceKafkaCardDescription4,
      },
      {
        value: serviceKafkaCardDescription5,
      },
      {
        value: serviceKafkaCardDescription6,
      },
      {
        value: serviceKafkaCardDescription7,
      },
    ];

    const cloudServicesCardDetailsDescription = [
      {
        label: t('rhoas-plugin~Unlock with API token'),
        value: <ServiceToken namespace={namespace} />,
      },
      {
        value: <Divider component="li" />,
      },
      {
        label: 'Description',
        value: cloudServicesCardDescription1,
      },
      {
        value: cloudServicesCardDescription2,
      },
    ];

    if (isServiceAccountValid) {
      const serviceKafkaCard: CatalogItem[] = [
        {
          name: t('rhoas-plugin~Red Hat OpenShift Streams for Apache Kafka'),
          type: CATALOG_TYPE,
          uid: 'streams-1615213269575',
          description: t('rhoas-plugin~Service Kafka Card Description 1'),
          provider: 'Red Hat, Inc.',
          tags: ['kafka'],
          icon: {
            url: kafkaIcon,
          },
          cta: {
            label: t('rhoas-plugin~Connect'),
            href: `/rhoas/ns/${namespace}/kafka`,
          },
          details: {
            descriptions: serviceKafkaCardDetailsDescription,
          },
        },
      ];
      return serviceKafkaCard;
    }

    const cloudServicesCard: CatalogItem[] = [
      {
        name: t('rhoas-plugin~Red Hat OpenShift Application Services'),
        type: CATALOG_TYPE,
        uid: 'services-1615213269575',
        description: tokenStatusFooter(),
        provider: 'Red Hat, Inc.',
        tags: ['kafka'],
        icon: {
          url: operatorIcon,
        },
        details: {
          descriptions: cloudServicesCardDetailsDescription,
        },
      },
    ];
    return cloudServicesCard;
  }, [loaded, errorMsg, t, namespace, isServiceAccountValid, serviceAccount]);

  return [services, loadedOrError, undefined];
};

export default useRhoasCatalog;
