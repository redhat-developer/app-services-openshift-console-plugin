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
import { FLAG_RHOAS } from './const';

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
    type: 'NavItem/Href',
    properties: {
      id: 'rhoas',
      perspective: 'dev',
      section: 'resources',
      insertBefore: 'project',
      componentProps: {
        name: '%rhoas-plugin~Rhoas%',
        href: '/rhoas',
        testID: 'rhoas',
        // 'data-quickstart-id': 'qs-nav-helm',
      },
    },
    flags: {
      required: [FLAG_RHOAS],
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: ['/rhoas'],
      loader: async () =>
        (
          await import(
            './components/rhoas-page/RhoasPage' /* webpackChunkName: "helm-plugin-releases-list-page" */
          )
        ).default,
    },
    flags: {
      required: [FLAG_RHOAS],
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
