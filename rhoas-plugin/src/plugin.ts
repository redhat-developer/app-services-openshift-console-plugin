import * as _ from 'lodash';
import { AddAction } from '@console/dev-console/src/extensions/add-actions';
import {
  ModelDefinition,
  CustomFeatureFlag,
  HrefNavItem,
  RoutePage,
  Plugin,
} from '@console/plugin-sdk';
import { NamespaceRedirect } from '@console/internal/components/utils/namespace-redirect';
import { MaintenanceIcon } from '@patternfly/react-icons';
import { FLAG_RHOAS_KAFKA } from './const';

import * as models from './models';

type ConsumedExtensions =
  | ModelDefinition
  | CustomFeatureFlag
  | HrefNavItem
  | RoutePage
  | AddAction


const plugin: Plugin<ConsumedExtensions> = [
  {
    type: 'ModelDefinition',
    properties: {
      models: _.values(models),
    },
  },
  {
    type: 'FeatureFlag/Model',
    properties: {
      model: models.ManagedKafkaRequestModel,
      flag: FLAG_RHOAS_KAFKA,
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: ['/managedServices/rhosak', '/managedServices/rhosak/ns/:ns'],
      loader: async () =>
        (
          await import(
            './components/rhosak-page/ManagedKafkas' /* webpackChunkName: "helm-plugin-releases-list-page" */
          )
        ).default,
    },
    flags: {
      required: [FLAG_RHOAS_KAFKA],
    },
  },
  {
    type: 'AddAction',
    flags: {
      required: [],
    },
    properties: {
      id: 'rhosak',
      url: '/managedServices/rhosak',
      // t('rhoas-plugin~ManagedService')
      label: '%rhoas-plugin~ManagedService-Kafka%',
      // t('rhoas-plugin~ManagedService')
      description: '%rhoas-plugin~ManagedService-Kafka-Long%',
      icon: <MaintenanceIcon/>,
    },
  }
];

export default plugin;
