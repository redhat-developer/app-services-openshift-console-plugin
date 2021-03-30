import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Flex,
  FlexItem,
  Divider,
  Label,
  TextContent,
  Text,
  TextVariants,
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
        <Flex direction={{ default: 'column' }}>
          <FlexItem>
            {t(
              'rhoas-plugin~Red Hat OpenShift Application Services include Red Hat OpenShift API Management and Red Hat OpenShift Streams for Apache Kafka',
            )}
          </FlexItem>
          <FlexItem>{token}</FlexItem>
        </Flex>
      );
    };

    const serviceKafkaCardDescription3 = (
      <Trans t={t} ns="rhoas-plugin">
        <b>Delivered as a service, managed by Red Hat SRE</b> - Red Hat`&lsquo;`s specialized 24x7
        global SRE team fully manages the Kafka infrastructure and daily operations, including
        monitoring, logging, upgrades and patching, to proactively address issues and quickly solve
        problems.
      </Trans>
    );

    const serviceKafkaCardDescription4 = (
      <Trans t={t} ns="rhoas-plugin">
        <b>Streamlined developer experience</b> - a developer-first, consistent experience that
        shields the user from administrative tasks, supports self-service, and easily connects to
        other OpenShift workloads.
      </Trans>
    );

    const serviceKafkaCardDescription5 = (
      <Trans t={t} ns="rhoas-plugin">
        <b>Real-time, streaming data broker</b> - service that can run in any cloud to support large
        data transfer volumes between distributed microservices for enterprise-scale applications.
      </Trans>
    );

    const serviceKafkaCardDescription6 = (
      <Trans t={t} ns="rhoas-plugin">
        <b>Schema registry</b> - Red Hat OpenShift Service Registry is included, making it easy for
        development teams to publish, communicate and discover any streaming data topics.
      </Trans>
    );

    const serviceKafkaCardDescription7 = (
      <Trans t={t} ns="rhoas-plugin">
        <b>Connectors</b> - the Kafka brokers can securely connect to distributed services, making
        it easy to consume and share streaming data between applications and enterprise systems,
        cloud provider services, and SaaS applications.
      </Trans>
    );

    const cloudServicesCardDescription1 = (
      <TextContent>
        <Text component={TextVariants.p}>
          {t('rhoas-plugin~Red Hat OpenShift Application Services include:')}
        </Text>
        <Text component={TextVariants.p}>{t('rhoas-plugin~Red Hat OpenShift API Management')}</Text>
        <Text component={TextVariants.p}>
          {t('rhoas-plugin~Red Hat OpenShift Streams for Apache Kafka')}
        </Text>
      </TextContent>
    );

    const serviceKafkaCardDetailsDescription = [
      {
        value: t('rhoas-plugin~ServiceKafkaCardDescription1'),
      },
      {
        value: t('rhoas-plugin~ServiceKafkaCardDescription2'),
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
        value: t('rhoas-plugin~Cloud Services Card Description'),
      },
    ];

    if (isServiceAccountValid) {
      const serviceKafkaCard: CatalogItem[] = [
        {
          name: t('rhoas-plugin~Red Hat OpenShift Streams for Apache Kafka'),
          type: CATALOG_TYPE,
          uid: 'streams-1615213269575',
          description: t('rhoas-plugin~ServiceKafkaCardDescription1'),
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
