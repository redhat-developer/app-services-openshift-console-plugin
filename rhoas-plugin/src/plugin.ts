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
    type: 'AddAction',
    flags: {
      required: [],
    },
    properties: {
      id: 'rhoas',
      url: '/catalog?catalogType=RhoasService',
      // t('rhoas-plugin~ManagedService')
      label: '%rhoas-plugin~ManagedService%',
      // t('rhoas-plugin~ManagedService')
      description: '%rhoas-plugin~ManagedService%',
      icon: "",
    },
  }
];

export default plugin;
