import * as React from 'react';
import { ManagedKafkaRequestModel } from '../../models';
import { SecretModel } from '@console/internal/models';
import {
  k8sGet,
  k8sCreate,
} from '@console/internal/module/k8s';

const ManagedKafkas = () => {

  // TODO change namespace from URL (args)
  const namespace = "default";
  const secretName = "MyLittleSecret"
  const accessToken = "notrelevantyet"

  const onSubmit = async (event) => {
    event.preventDefault();
    const existingSecret = await k8sGet(SecretModel.kind, secretName, namespace, {})
    console.log(existingSecret)

    if (existingSecret) {
      return;
    }

    const secret = {
      apiVersion: SecretModel.apiVersion,
      kind: SecretModel.kind,
      metadata: {
        name: secretName,
        namespace
      },
      stringData: {
        accessToken
      },
      type: 'Opaque',
    };

    const mkRequest = {
      apiVersion: ManagedKafkaRequestModel.apiVersion,
      kind: ManagedKafkaRequestModel.kind,
      metadata: {
        // TODO better name generation
        name: 'KafkaRequest-' + new Date().getTime(),
        namespace
      },
      spec: {
        accessTokenSecretName: secretName,
      },
    };

    // TODO proper handling for create
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
