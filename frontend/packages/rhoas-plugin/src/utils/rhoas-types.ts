import { K8sResourceCommon } from '@console/internal/module/k8s';

// FIXME replace with generic type
export interface CloudKafka {
  id: string;
  kind: string;
  href: string;
  status: string;
  cloudProvider: string;
  multiAz: true;
  region: string;
  owner: string;
  name: string;
  bootstrapServerHost: string;
  createdAt: string;
  updatedAt: string;
}

export interface KafkaRequest extends K8sResourceCommon {
  spec: {
    accessTokenSecretName: string;
  };
  status: { userKafkas: CloudKafka[]; conditions: StatusCondition[] };
}

export interface StatusCondition {
  type: string | 'Finished' | 'UserKafkasUpToDate' | 'AcccesTokenSecretValid';
  status: 'True' | 'False';
  message: string;
  reason: string;
}
