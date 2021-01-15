import React, {useState} from 'react';
import { coFetchJSON } from '@console/internal/co-fetch';
import {
  Form,
  FormGroup,
  TextInput,
  Button,
  Modal,
  ModalVariant
} from '@patternfly/react-core';

const CreateServiceAccount = () => {

  // States
  const [formName, setFormName] = useState('');

  // Functions
  const handleFormNameChange = value => {
    setFormName(value);
  }

  const addServiceAccount = async () => {
    try {
      await coFetchJSON('./../../mock/crds/ManagedServiceAccountRequest').then((response) => {
        console.log(response)
      });
    } catch (error) {
      // Handle error
    }
  }


  return (
    <>
      <Modal
        variant={ModalVariant.small}
        title="Create service account"
        isOpen={isModalOpen}
        onClose={this.handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={addServiceAccount}>
            Create
          </Button>,
          <Button key="cancel" variant="secondary" onClick={this.handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        <Form>
          <FormGroup
            label="Name"
            isRequired
            fieldId="service-account-name"
            // helperText="Please provide your full name"
          >
            <TextInput
              isRequired
              type="text"
              id="service-account-name"
              name="service-account-name"
              aria-describedby=""
              value={formName}
              onChange={handleFormNameChange}
            />
          </FormGroup>
        </Form>
      </Modal>
    </>
  )
}

export default CreateServiceAccount;
