import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Form,
  FormGroup,
  TextInput,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { useActiveNamespace } from '@console/shared';
import { createServiceAccountIfNeeded, createSecretIfNeeded } from '../../utils/resourceCreators';

export const AccessManagedServices: any = () => {
  const [apiTokenValue, setApiTokenValue] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [currentNamespace] = useActiveNamespace();
  const namespace = currentNamespace;
  const { t } = useTranslation();

  const onCreate = async () => {
    try {
      await createSecretIfNeeded(namespace, apiTokenValue);
    } catch (error) {
      setErrorMessage("Problem with creating secret. Please try again" + error);
      return;
    }
    try {
      await createServiceAccountIfNeeded(namespace);
    } catch (error) {
      setErrorMessage("Cannot create service account: " + error)
    }
  };

  const handleApiTokenValueChange = (value) => {
    setApiTokenValue(value);
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2}>
          {t('rhoas-plugin~Access Red Hat Cloud Services with API Token')}
        </Text>
        <Text component={TextVariants.p}>
          <span>
            {t(
              'rhoas-plugin~To access this Cloud Service, input the API token which can be located at',
            )}
            <a href="https://cloud.redhat.com/openshift/token" target="_blank">
              {' '}
              https://cloud.redhat.com/openshift/token
            </a>
          </span>
        </Text>
      </TextContent>
      <Form>
        <FormGroup
          fieldId="api-token-value"
          label="API Token"
          isRequired
          helperText={`${t(
            'rhoas-plugin~API token can be accessed at',
          )} cloud.redhat.com/openshift/token`}
        >
          <TextInput
            value={apiTokenValue}
            onChange={(value: string) => handleApiTokenValueChange(value)}
            type="password"
            id="offlinetoken"
            name="apitoken"
            placeholder=""
          />
        </FormGroup>
        <TextContent>
          <Text component={TextVariants.small}>
            {t('rhoas-plugin~Cant create an access token? Contact your administrator')}
          </Text>
        </TextContent>
        <FormGroup fieldId="action-group">
          <div className="text-muted">{errorMessage}</div>
          <Button
            key="confirm"
            variant="primary"
            onClick={onCreate}
            isDisabled={apiTokenValue.length < 500 ? true : false}
          >
            {t('rhoas-plugin~Create')}
          </Button>
          <Button key="reset"
            variant="link"
            onClick={() => { setApiTokenValue("") }}>

            {t('rhoas-plugin~Reset')}
          </Button>
        </FormGroup>
      </Form>
    </>
  );
};
