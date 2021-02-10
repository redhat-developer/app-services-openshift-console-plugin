import { k8sKill } from '@console/internal/module/k8s';
import { ManagedKafkaConnectionModel } from '../models/rhoas';

export const deleteManagedKafkaConnection = (name: string, namespace: string) => {
  return {
    labelKey: 'rhoas-plugin~Delete Kafka Connection',
    callback: async () => {
      try {
        await k8sKill(ManagedKafkaConnectionModel, {
          metadata: {
            name: name,
            namespace: namespace
          }
        })
      } catch (error) {
        console.warn('Could not delete Kafka connection');
      }
    }
  };
};
