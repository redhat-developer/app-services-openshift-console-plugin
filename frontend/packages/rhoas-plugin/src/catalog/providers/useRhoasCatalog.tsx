import { CatalogExtensionHook, CatalogItem } from '@console/plugin-sdk';
import { CATALOG_TYPE } from '../rhoas-catalog-plugin';
import * as React from 'react';
import { Divider, Label, TextContent, Text, TextVariants} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import { AccessTokenSecretName, managedKafkaIcon } from '../../const';
import { useTranslation } from 'react-i18next';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { SecretModel } from '@console/internal/models';
import { useActiveNamespace } from '@console/shared';
import { AccessManagedServices } from '../../components/access-managed-services/AccessManagedServices';

const useRhoasCatalog: CatalogExtensionHook<CatalogItem[]> = (): [CatalogItem[], boolean, any] => {
  const [currentNamespace] = useActiveNamespace();
  const href = '/managedServices/managedkafka'; // `/catalog/ns/${namespace}/rhoas/kafka`;
  const { t } = useTranslation();
  const [tokenSecret] = useK8sWatchResource({ kind: SecretModel.kind, isList: false, name: AccessTokenSecretName, namespace: currentNamespace, namespaced: true })

  const tokenStatusFooter = () => {
    if (tokenSecret === null || tokenSecret !== null && Object.keys(tokenSecret).length === 0) {
      return (
        <Label variant="outline" color="orange" icon={<LockIcon />}>
          {t('rhoas-plugin~Unlock with token')}
        </Label>
      )
    }
    else {
      <span>{t('rhoas-plugin~Unlocked')}</span>
    }
  }

  const cardDescription = 'Test';

  const drawerDescription = (
    <>
      <div>
        <TextContent>
          <Text component={TextVariants.p}>
            Installed cluster-side, creates rresources in specific namespaces. The RHOAS operator could include these services below:
          </Text>
          <Text component={TextVariants.p}>
            Kafka Connect: We will add a descsription for Kafka Connect here.
          </Text>
          <Text component={TextVariants.p}>
            API Management: We will add a description for API Management here.
          </Text>
          <Text component={TextVariants.p}>
            Red Hat Open Data Hub: We will add a description for Red Hat Open Data Hub here.
          </Text>
        </TextContent>
      </div>
      <Divider component="li"/>
      {AccessManagedServices}
      </>
  );

  const detailsDescriptions = [
    {
      value: <p>{cardDescription}</p>,
    },
    {
      value: drawerDescription,
    },
  ];


  const managedServicesCard: CatalogItem[] = [
    {
      name: 'Red Hat OpenShift Application Services',
      type: CATALOG_TYPE,
      uid: new Date().getTime().toString(),
      description: tokenStatusFooter(),
      provider: 'Red Hat',
      tags: ['Kafka', 'service', 'managed'],
      creationTimestamp: '2019-09-04T13:56:06Z',
      attributes: {
        version: '1',
      },
      icon: {
        class: 'kafkaIcon',
        url: managedKafkaIcon,
      },
      cta: {
        label: 'Connect to server',
        href,
      },
      details: {
        properties: [{ label: 'Type', value: 'Red Hat Managed Service' }],
        descriptions: detailsDescriptions
      },
    },
  ];

  const managedKafkaCard: CatalogItem[] = [
    {
      name: 'Red Hat OpenShift Strerams for Apache Kafka',
      type: CATALOG_TYPE,
      uid: new Date().getTime().toString(),
      description: tokenStatusFooter(),
      provider: 'Red Hat',
      tags: ['Kafka', 'service', 'managed'],
      creationTimestamp: '2019-09-04T13:56:06Z',
      attributes: {
        version: '1',
      },
      icon: {
        class: 'kafkaIcon',
        url: managedKafkaIcon,
      },
      cta: {
        label: 'Install Service',
        href,
      },
      details: {
        properties: [{ label: 'Type', value: 'Red Hat Managed Service' }],
        descriptions: [
          {
            value: <p>Here is where we provide the description for Red Hat OpenShift Streams for Apache Kafka</p>,
          }
        ]
      },
    },
  ];

  // const rhoasServicesDrawer: CatalogItem[] = [
  //   {
  //     name: 'Red Hat OpenShift Application Services',
  //     type: CATALOG_TYPE,
  //     uid: new Date().getTime().toString(),
  //     description: drawerDescription,
  //     provider: 'Red Hat',
  //     tags: ['Kafka', 'service', 'managed'],
  //     creationTimestamp: '2019-09-04T13:56:06Z',
  //     attributes: {
  //       version: '1',
  //     },
  //     icon: {
  //       class: 'kafkaIcon',
  //       url: managedKafkaIcon,
  //     },
  //     cta: {
  //       label: 'Connect to server',
  //       href,
  //     },
  //     details: {
  //       properties: [{ label: 'Type', value: 'Red Hat Managed Service' }],
  //       descriptions: [
  //         {
  //           label: '',
  //           value: '',
  //         },
  //       ],
  //     },
  //   },
  // ];

  const services = React.useMemo(() => (tokenSecret ? managedKafkaCard : managedServicesCard), [tokenSecret]);
  return [services, true, undefined];
};

export default useRhoasCatalog;
