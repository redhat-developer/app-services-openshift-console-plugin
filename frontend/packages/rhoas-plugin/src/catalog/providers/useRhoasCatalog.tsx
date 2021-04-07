import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, FlexItem, Divider, Label, Text, TextVariants } from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import { CatalogExtensionHook, CatalogItem } from '@console/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { referenceForModel, K8sResourceKind } from '@console/internal/module/k8s';
import { ServiceToken } from '../../components/access-services/ServicesToken';
import { ServiceAccountCRName, kafkaIcon, operatorIcon } from '../../const';
import { CloudServiceAccountRequest } from '../../models';
import { isResourceStatusSuccessful } from '../../utils/conditionHandler';
import { CATALOG_TYPE } from '../const';
import * as CatalogContent from '../catalog-content.json';

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
  const isServiceAccountValid = isResourceStatusSuccessful(serviceAccount as K8sResourceKind);
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

    const serviceKafkaCardDetailsDescription = () => {
      return CatalogContent.serviceKafka.information.map((text) => {
        return {
          value: <Text component={TextVariants.p}>{text}</Text>,
        };
      });
    };

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
        value: (
          <Text component={TextVariants.p}>
            {t(
              'rhoas-plugin~Red Hat OpenShift Application Services include:\n- Red Hat OpenShift API Management\n- Red Hat OpenShift Streams for Apache Kafka',
            )}
          </Text>
        ),
      },
      {
        value: (
          <Text component={TextVariants.p}>
            {t('rhoas-plugin~Cloud Services Card Description')}
          </Text>
        ),
      },
    ];

    if (isServiceAccountValid) {
      const serviceKafkaCard: CatalogItem[] = [
        {
          name: t('rhoas-plugin~Red Hat OpenShift Application Services'),
          type: CATALOG_TYPE,
          uid: 'streams-1615213269575',
          description: CatalogContent.serviceKafka.information[0],
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
            descriptions: serviceKafkaCardDetailsDescription(),
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
