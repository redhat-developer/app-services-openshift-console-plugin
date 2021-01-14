import { K8sKind } from '@console/internal/module/k8s';

export const ManagedKafkaRequestModel: K8sKind = {
  apiGroup: 'rhoas.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'ManagedKafkaRequest',
  id: 'ManagedKafkaRequest',
  plural: '',
  label: 'Managed Kafka Request',
  labelPlural: '',
  abbr: 'MKR',
  namespaced: false,
  crd: true,
};

export const ManagedKafkaConnectionModel: K8sKind = {
  apiGroup: 'rhoas.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'ManagedKafkaConnection',
  id: 'ManagedKafkaConnection',
  plural: '',
  label: 'Managed Kafka Connection',
  labelPlural: '',
  abbr: 'MKC',
  namespaced: false,
  crd: true,
};

export const ManagedServiceAccountRequest: K8sKind = {
  apiGroup: 'rhoas.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'ManagedServiceAccountRequest',
  id: 'ManagedServiceAccountRequest',
  plural: '',
  label: 'Managed Service Account Request',
  labelPlural: '',
  abbr: 'MSAR',
  namespaced: false,
  crd: true,
};