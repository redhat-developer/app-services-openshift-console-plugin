import * as React from 'react';
import { useTranslation } from 'react-i18next';
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
import { useActiveNamespace } from '@console/shared';
import { ServiceToken } from '../../components/access-services/ServicesToken';
import { ServiceAccountCRName, kafkaIcon, operatorIcon } from '../../const';
import { CloudServiceAccountRequest } from '../../models';
import { isResourceStatusSuccessfull } from '../../utils/conditionHandler';
import { referenceForModel } from '@console/internal/module/k8s';
import { CATALOG_TYPE } from '../const';

const useRhoasCatalog: CatalogExtensionHook<CatalogItem[]> = (): [CatalogItem[], boolean, any] => {
  const [currentNamespace] = useActiveNamespace();
  const { t } = useTranslation();
  const [serviceAccount, loaded] = useK8sWatchResource({
    kind: referenceForModel(CloudServiceAccountRequest),
    isList: false,
    name: ServiceAccountCRName,
    namespace: currentNamespace,
    namespaced: true,
  });

  const isServiceAccountValid = isResourceStatusSuccessfull(serviceAccount);
  const services = React.useMemo(() => {
    if (!loaded) return [];

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
            {t('rhoas-plugin~RHOAS can include Streams for Kafka, Service Registry')}
          </FlexItem>
          <FlexItem>{token}</FlexItem>
        </Flex>
      );
    };

    const drawerDescription = (
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
          <TextContent>
            <Text component={TextVariants.p}>
              Red Hat OpenShift Application Services provide a streamlined developer experience for
              building, deploying, and scaling cloud-native applications in open hybrid-cloud
              environments. The combination of enterprise-grade Kubernetes, cloud-native approach to
              application delivery, and managed operations allows teams to focus on core
              competencies, accelerate time to value and reduce operational cost.
            </Text>
          </TextContent>
        </FlexItem>
        <Divider component="li" />
        <FlexItem>
          <ServiceToken />
        </FlexItem>
      </Flex>
    );

    const detailsDescriptions = [
      {
        value: drawerDescription,
      },
    ];

    if (isServiceAccountValid) {
      const serviceKafkaCard: CatalogItem[] = [
        {
          name: 'Streams for Apache Kafka',
          type: CATALOG_TYPE,
          uid: 'streams-1615213269575',
          description: 'Streams for Apache Kafka',
          provider: 'Red Hat',
          tags: ['kafka', 'service'],
          creationTimestamp: '2019-09-04T13:56:06Z',
          attributes: {
            version: '1',
            type: 'kafka',
          },
          icon: {
            class: 'kafkaIcon',
            url: kafkaIcon,
          },
          cta: {
            label: 'Connect',
            href: `/rhoas/ns/${currentNamespace}/kafka`,
          },
          details: {
            properties: [{ label: 'Type', value: 'Red Hat Cloud Service' }],
            descriptions: [
              {
                value: <p />,
              },
            ],
          },
        },
      ];
      return serviceKafkaCard;
    }

    const cloudServicesCard: CatalogItem[] = [
      {
        name: 'Red Hat Cloud Services',
        type: CATALOG_TYPE,
        uid: 'services-1615213269575',
        description: tokenStatusFooter(),
        provider: 'Red Hat',
        tags: ['kafka', 'service'],
        creationTimestamp: '2019-09-04T13:56:06Z',
        attributes: {
          version: '1',
          type: 'kafka',
        },
        icon: {
          class: 'CloudServicesIcon',
          url: operatorIcon,
        },
        details: {
          properties: [{ label: 'Type', value: 'Red Hat Cloud Service' }],
          descriptions: detailsDescriptions,
        },
      },
    ];
    return cloudServicesCard;
  }, [currentNamespace, isServiceAccountValid, loaded, serviceAccount, t]);

  return [services, loaded, undefined];
};

export default useRhoasCatalog;
