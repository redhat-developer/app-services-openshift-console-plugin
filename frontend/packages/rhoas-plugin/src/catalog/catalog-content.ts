import { kafkaIcon } from '../const';

export const RHOASServices = [{
  serviceName: 'kafka',
  name: 'Red Hat OpenShift Application Services',
  type: 'managedservices',
  uid: 'streams-1615213269575',
  description:
    'Red Hat OpenShift Streams for Apache Kafka is a managed cloud service that provides a streamlined developer experience for building, deploying, and scaling real-time applications in hybrid-cloud environments. The combination of seamless operations across distributed microservices, large data transfer volumes, and managed operations allows teams to focus on core competencies, accelerate time to value and reduce operational cost.',
  provider: 'Red Hat, Inc.',
  tags: ['kafka'],
  icon: kafkaIcon,
  ctaLabel: 'Connect',
  details: 'tbd',
  model: {
    version: 'v1alpha1',
    kind: 'KafkaConnection',
    id: 'kafkaconnection',
    plural: 'kafkaconnections',
    label: 'Kafka Connection',
    labelPlural: 'Kafka Connections',
    abbr: 'AKC',
  }
}
]
