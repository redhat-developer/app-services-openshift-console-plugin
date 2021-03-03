import { CatalogItemProvider, CatalogItemType, Plugin } from '@console/plugin-sdk';
import { FLAG_RHOAS } from '../const';
import { rhoasProvider } from './providers';

export type CatalogConsumedExtensions = CatalogItemProvider | CatalogItemType;

export const CATALOG_TYPE = 'managedservices';

export const rhoasCatalogPlugin: Plugin<CatalogConsumedExtensions> = [
  {
    type: 'Catalog/ItemType',
    properties: {
      type: CATALOG_TYPE,
      title: '%rhoas-plugin~Managed Services%',
      catalogDescription:
        '%rhoas-plugin~Browse managed services to connect applications and microservices to other services and support services to create a full solution.%',
      typeDescription: '%rhoas-plugin~Managed Services%',
      filters: [{ label: 'Managed', attribute: 'Managed' }],
    },
    flags: {
      required: [FLAG_RHOAS],
    },
  },
  {
    type: 'Catalog/ItemProvider',
    properties: {
      type: CATALOG_TYPE,
      provider: rhoasProvider,
    },
    flags: {
      required: [FLAG_RHOAS],
    },
  },
];