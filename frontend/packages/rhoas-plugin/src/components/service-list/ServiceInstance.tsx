import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FormFooter, FormHeader, FlexForm, FormBody, TechPreviewBadge } from '@console/shared';
import FormSection from '@console/dev-console/src/components/import/section/FormSection';
import { history } from '@console/internal/components/utils';
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';
import { Title, Split, SplitItem } from '@patternfly/react-core';
import ServiceInstanceFilter from '../service-table/ServiceInstanceFilter';
import ServiceInstanceTable from '../service-table/ServiceInstanceTable';
import { ServicesEmptyState } from '../states/ServicesEmptyState';
import { CloudKafka } from '../../utils/rhoas-types';

type ServiceInstanceProps = {
  kafkaArray: CloudKafka[];
  selectedKafka: number;
  setSelectedKafka: (selectedKafka: number) => void;
  currentKafkaConnections: string[];
  createKafkaConnectionFlow: () => void;
  isSubmitting: boolean;
};

const areAllServicesSelected = (currentServices: string[], listOfServices: CloudKafka[]) =>
  listOfServices.some(
    (service) => service.status !== 'ready' || !currentServices.includes(service.id),
  );

const ServiceInstance: React.FC<ServiceInstanceProps> = ({
  kafkaArray,
  selectedKafka,
  setSelectedKafka,
  currentKafkaConnections,
  createKafkaConnectionFlow,
  isSubmitting,
}: ServiceInstanceProps) => {
  const [textInputNameValue, setTextInputNameValue] = React.useState<string>('');
  const pageKafkas = React.useMemo(
    () => kafkaArray.filter((kafka) => kafka.name.includes(textInputNameValue)),
    [kafkaArray, textInputNameValue],
  );

  const { t } = useTranslation();

  const title = (
    <Split className="odc-form-section-pipeline" hasGutter>
      <SplitItem className="odc-form-section__heading">
        <Title headingLevel="h1" size="2xl">
          {t('rhoas-plugin~Select Kafka Instance')}
        </Title>
      </SplitItem>
      <SplitItem>
        <TechPreviewBadge />
      </SplitItem>
    </Split>
  );

  return (
    <FlexForm>
      <FormBody flexLayout>
        <FormHeader
          title={title}
          helpText={t(
            'rhoas-plugin~The selected Kafka instance will be added to the topology view.',
          )}
        />
        <FormSection fullWidth>
          {!areAllServicesSelected(currentKafkaConnections, kafkaArray) ? (
            <ServicesEmptyState
              title={t('rhoas-plugin~All available Kafka instances are connected to this project')}
              actionLabel={t('rhoas-plugin~See Kafka instances in topology view')}
              icon={CubesIcon}
            />
          ) : kafkaArray.length === 0 ? (
            <ServicesEmptyState
              title={t('rhoas-plugin~No Kafka Clusters found')}
              actionLabel={t('rhoas-plugin~Go back to Services Catalog')}
              icon={CubesIcon}
            />
          ) : (
            <>
              <ServiceInstanceFilter
                textInputNameValue={textInputNameValue}
                setTextInputNameValue={setTextInputNameValue}
              />
              <ServiceInstanceTable
                kafkaArray={kafkaArray}
                pageKafkas={pageKafkas}
                setTextInputNameValue={setTextInputNameValue}
                selectedKafka={selectedKafka}
                setSelectedKafka={setSelectedKafka}
                currentKafkaConnections={currentKafkaConnections}
              />
            </>
          )}
        </FormSection>
      </FormBody>
      <FormFooter
        handleSubmit={createKafkaConnectionFlow}
        isSubmitting={isSubmitting}
        errorMessage=""
        submitLabel={t('rhoas-plugin~Next')}
        disableSubmit={selectedKafka === undefined || isSubmitting}
        resetLabel={t('rhoas-plugin~Cancel')}
        sticky
        handleCancel={history.goBack}
      />
    </FlexForm>
  );
};

export default ServiceInstance;
