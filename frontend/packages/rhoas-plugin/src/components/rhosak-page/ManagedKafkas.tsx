import * as React from 'react';
import { ManagedKafkaRequestModel } from '../../models';
import { SecretModel } from '@console/internal/models';
import {
  k8sGet,
  k8sCreate,
} from '@console/internal/module/k8s';

const ManagedKafkas = () => {


  const onSubmit = async (event) => {
    event.preventDefault();
    const existingSecret = await k8sGet(SecretModel.kind, "testsomesecret", "default", {})
    console.log(existingSecret)

    if (existingSecret) {
      return;
    }

    const secret = {
      apiVersion: SecretModel.apiVersion,
      kind: SecretModel.kind,
      metadata: {
        name: 'testsomesecret',
        namespace: "default",
      },
      stringData: {
        accessToken: "hardcoded"
      },
      type: 'Opaque',
    };

    const mkRequest = {
      apiVersion: ManagedKafkaRequestModel.apiVersion,
      kind: ManagedKafkaRequestModel.kind,
      metadata: {
        name: 'KafkaRequest-' + new Date().getTime(),
        // TODO - namespace based url
        namespace: "default",
      },
      spec: {
        accessTokenSecretName: "testsomesecret",
      },
    };

    console.log(await k8sCreate(SecretModel, secret))
    console.log(await k8sCreate(ManagedKafkaRequestModel, mkRequest));
  }


  return (
    <>
      Hello from Managed Kafka plugin
      Provide accessTokenSecretName
      <input id="token" type="text"></input>
      <button onClick={onSubmit}></button>
    </>
  )

}

export default ManagedKafkas;
