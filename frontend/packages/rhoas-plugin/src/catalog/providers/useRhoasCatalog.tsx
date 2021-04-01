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
import { isResourceStatusSuccessfull } from '../../utils/conditionHandler';
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
            <span>{CatalogContent.cloudServices.card.description}</span>
          </FlexItem>
          <FlexItem>{token}</FlexItem>
        </Flex>
      );
    };

    const cloudServicesCardDescription1 = (
      <>
        <Text component={TextVariants.p}>
          {CatalogContent.cloudServices.information.paragraph1}
        </Text>
      </>
    );

    const cloudServicesCardDescription2 = (
      <Text component={TextVariants.p}>{t('rhoas-plugin~Cloud Services Card Description')}</Text>
    );

    const serviceKafkaCardDetailsDescription = () => {
      const informationArray = CatalogContent.serviceKafka.information;
      const serviceKafkaCardDescription = informationArray.map((text) => {
        let splitString = text.split('-');
        if (splitString.length > 1) {
          const bold = <b>{splitString[0]}</b> + splitString[1];
          splitString = bold;
        }
        const pfTextString = <Text component={TextVariants.p}>{splitString}</Text>;
        return {
          value: pfTextString,
        };
      });
      return serviceKafkaCardDescription;
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
        value: cloudServicesCardDescription1,
      },
      {
        value: cloudServicesCardDescription2,
      },
    ];

    if (isServiceAccountValid) {
      const serviceKafkaCard: CatalogItem[] = [
        {
          name: CatalogContent.serviceKafka.card.title,
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
            descriptions: serviceKafkaCardDetailsDescription(),
          },
        },
      ];
      return serviceKafkaCard;
    }

    const cloudServicesCard: CatalogItem[] = [
      {
        name: CatalogContent.cloudServices.card.title,
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
