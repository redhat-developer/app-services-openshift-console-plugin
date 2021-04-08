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
import { LoadingInline } from '@console/internal/components/utils/status-box';
import { createServiceAccountIfNeeded, createSecretIfNeeded } from '../../utils/resourceCreators';
import { APITokenLengthMinimum } from '../../const';

type ServiceTokenProps = {
  namespace: string;
};

export const ServiceToken: React.FC<ServiceTokenProps> = ({ namespace }: ServiceTokenProps) => {
  const [sendDisabled, setSendDisabled] = React.useState(false);
  const [apiTokenValue, setApiTokenValue] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  const { t } = useTranslation();

  const onCreate = async () => {
    setIsLoading(true);
    setSendDisabled(true);
    try {
      await createSecretIfNeeded(namespace, apiTokenValue);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(t('rhoas-plugin~There was an error with this API token', { error }));
      setSendDisabled(true);
      return;
    }
    try {
      await createServiceAccountIfNeeded(namespace);
    } catch (error) {
      setErrorMessage(t('rhoas-plugin~Cannot create service account', { error }));
    }
    setSendDisabled(false);
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.p}>
          <Trans t={t} ns="rhoas-plugin">
            Enter your API token from{' '}
            <a
              href="https://cloud.redhat.com/openshift/token"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://cloud.redhat.com
            </a>
            , so we can check what services you have access to based on your subscription.
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
        {errorMessage && <Alert variant="danger" isInline title={errorMessage} />}
        <FormGroup fieldId="action-group">
          <Button
            key="confirm"
            variant="primary"
            onClick={onCreate}
            isDisabled={apiTokenValue.length < APITokenLengthMinimum ? true : sendDisabled}
          >
            {t('rhoas-plugin~Connect')}
          </Button>
          <Button
            key="reset"
            variant="link"
            onClick={() => {
              setApiTokenValue('');
              setErrorMessage('');
            }}
          >
            {t('rhoas-plugin~Reset')}
          </Button>
        </FormGroup>
        {isLoading && <LoadingInline />}
      </Form>
    </>
  );
};
