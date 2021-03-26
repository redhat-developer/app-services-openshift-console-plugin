import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Form,
  FormGroup,
  TextInput,
  TextContent,
  Text,
  TextVariants,
  Alert,
} from '@patternfly/react-core';
import { createServiceAccountIfNeeded, createSecretIfNeeded } from '../../utils/resourceCreators';
import { APITokenLengthMinimum } from '../../const';

type ServiceTokenProps = {
  namespace: string;
};

export const ServiceToken: React.FC<ServiceTokenProps> = ({ namespace }: ServiceTokenProps) => {
  const [sendDisabled, setSendDisabled] = React.useState(false);
  const [apiTokenValue, setApiTokenValue] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const { t } = useTranslation();

  const onCreate = async () => {
    setSendDisabled(true);
    try {
      await createSecretIfNeeded(namespace, apiTokenValue);
    } catch (error) {
      setErrorMessage(t('rhoas-plugin~Problem with creating secret', { error, namespace }));
      setSendDisabled(false);
      return;
    }
    try {
      await createServiceAccountIfNeeded(namespace);
    } catch (error) {
      setErrorMessage(t('rhoas-plugin~Cannot create service account', { error, namespace }));
    }
    setSendDisabled(false);
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.p}>
          <Trans t={t} ns="rhoas-plugin">
            To access this Cloud Service, input the API token which can be located at{' '}
            <a
              href="https://cloud.redhat.com/openshift/token"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://cloud.redhat.com/openshift/token
            </a>
          </Trans>
        </Text>
      </TextContent>
      <Form>
        <FormGroup fieldId="api-token-value" label={t('rhoas-plugin~API Token')} isRequired>
          <TextInput
            value={apiTokenValue}
            onChange={setApiTokenValue}
            type="password"
            name="apitoken"
            aria-label={t('rhoas-plugin~API Token')}
          />
        </FormGroup>
        <TextContent>
          <Text component={TextVariants.small}>
            {t('rhoas-plugin~Cant create an access token? Contact your administrator')}
          </Text>
        </TextContent>
        {errorMessage && <Alert variant="danger" isInline title={errorMessage} />}
        <FormGroup fieldId="action-group">
          <Button
            key="confirm"
            variant="primary"
            onClick={onCreate}
            isDisabled={apiTokenValue.length < APITokenLengthMinimum ? true : sendDisabled}
          >
            {t('rhoas-plugin~Create')}
          </Button>
        </FormGroup>
      </Form>
    </>
  );
};
