import * as React from 'react';
import * as _ from 'lodash';
import { Form, ActionGroup, ButtonVariant, Button } from '@patternfly/react-core';
import { FormikProps, FormikValues } from 'formik';
import { ButtonBar } from '@console/internal/components/utils';
import { GitImportFormProps } from './import-types';
import GitSection from './git/GitSection';
import BuilderSection from './builder/BuilderSection';
import AppSection from './app/AppSection';
import AdvancedSection from './advanced/AdvancedSection';
import ServerlessSection from './serverless/ServerlessSection';
import DockerSection from './git/DockerSection';

const GitImportForm: React.FC<FormikProps<FormikValues> & GitImportFormProps> = ({
  values,
  errors,
  handleSubmit,
  handleReset,
  builderImages,
  status,
  isSubmitting,
  dirty,
}) => (
  <Form onSubmit={handleSubmit}>
    <GitSection />
    <BuilderSection image={values.image} builderImages={builderImages} />
    <DockerSection buildStrategy={values.build.strategy} />
    <AppSection project={values.project} />
    <ServerlessSection />
    <AdvancedSection values={values} />
    <ButtonBar errorMessage={status && status.submitError} inProgress={isSubmitting}>
      <ActionGroup className="pf-c-form">
        <Button
          type="submit"
          variant={ButtonVariant.primary}
          isDisabled={!dirty || !_.isEmpty(errors)}
        >
          Create
        </Button>
        <Button type="button" variant={ButtonVariant.secondary} onClick={handleReset}>
          Cancel
        </Button>
      </ActionGroup>
    </ButtonBar>
  </Form>
);

export default GitImportForm;
