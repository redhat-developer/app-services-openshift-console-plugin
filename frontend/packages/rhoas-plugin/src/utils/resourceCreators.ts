import { k8sCreate, k8sGet, k8sPatch, k8sUpdate, k8sWaitForUpdate } from '@console/internal/module/k8s/resource';
import * as _ from 'lodash';

import {
  AccessTokenSecretName,
  ServiceAccountSecretName,
  ManagedServiceAccountCRName,
  ManagedServicesRequestCRName,
} from '../const';

import {
  ManagedServicesRequestModel,
  ManagedServiceAccountRequest,
  ManagedKafkaConnectionModel,
} from '../models/rhoas';
import { getFinishedCondition } from './conditionHandler';
import { SecretModel } from '@console/internal/models';

/**
 * Create service account for purpose of supplying connection credentials
 *
 * @param currentNamespace
 */
export const createManagedServiceAccount = async (currentNamespace: string) => {
  const serviceAcct = {
    apiVersion: `${ManagedServicesRequestModel.apiGroup}/${ManagedServicesRequestModel.apiVersion}`,
    kind: ManagedServiceAccountRequest.kind,
    metadata: {
      name: ManagedServiceAccountCRName,
      namespace: currentNamespace,
      annotations: {
        refreshTime: new Date().toISOString()
      },
    },
    spec: {
      accessTokenSecretName: AccessTokenSecretName,
      serviceAccountName: `RHOASOperator-ServiceAccount-${currentNamespace}`,
      serviceAccountDescription:
        'Service account created by RHOASOperator to access managed services',
      serviceAccountSecretName: ServiceAccountSecretName,
      reset: false,
    },
  };


  await k8sCreate(ManagedServiceAccountRequest, serviceAcct);
};

/**
 * Create request to fetch all managed kafkas from upstream
 */
export const createManagedServicesRequest = async function (currentNamespace: string) {
  const mkRequest = {
    apiVersion: `${ManagedServicesRequestModel.apiGroup}/${ManagedServicesRequestModel.apiVersion}`,
    kind: ManagedServicesRequestModel.kind,
    metadata: {
      annotations: {
        refreshTime: new Date().toISOString()
      },
      name: ManagedServicesRequestCRName,
      namespace: currentNamespace,
    },
    spec: {
      accessTokenSecretName: AccessTokenSecretName,
    },
  };

  return await k8sCreate(ManagedServicesRequestModel, mkRequest);
};

/**
 * Create request to fetch all managed kafkas from upstream
 */
export const patchServiceAccountRequest = async function (request: any) {
  const path = '/metadata/annotations/refreshTime';
  return await k8sPatch(ManagedServiceAccountRequest, request, [
    {
      path,
      op: "replace",
      value: new Date().toISOString(),
    },
  ]);
};

/**
 * Create request to fetch all managed kafkas from upstream
 */
export const patchManagedServicesRequest = async function (request: any) {
  const path = '/metadata/annotations/refreshTime';

  return await k8sPatch(ManagedServicesRequestModel, request, [
    {
      path,
      op: "replace",
      value: new Date().toISOString(),
    },
  ]);
};

export const createManagedServicesRequestIfNeeded = async (currentNamespace) => {
  let currentRequest;
  try {
    currentRequest = await k8sGet(
      ManagedServicesRequestModel,
      ManagedServicesRequestCRName,
      currentNamespace,
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.info("rhoas: ManagedServicesRequest already exist")
  }
  try {
    if (currentRequest) {
      return await patchManagedServicesRequest(currentRequest);
    } else {
      return await createManagedServicesRequest(currentNamespace);
    }
  } catch (error) {
    return;
  }
};

export const createSecretIfNeeded = async function (currentNamespace: string, apiTokenValue: string) {
  let currentSecret
  try {
    currentSecret = await k8sGet(SecretModel,
      AccessTokenSecretName,
      currentNamespace,
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.info("rhoas: auth secret doesn't exist")
  }

  if (currentSecret) {
    delete currentSecret.data
    currentSecret.stringData = { value: apiTokenValue };
    return await k8sUpdate(SecretModel, currentSecret)
  } else {
    const secret = {
      apiVersion: SecretModel.apiVersion,
      kind: SecretModel.kind,
      metadata: {
        name: AccessTokenSecretName,
        namespace: currentNamespace,
      },
      stringData: {
        value: apiTokenValue,
      }
    };
    return await k8sCreate(SecretModel, secret);
  }
}

export const createServiceAccountIfNeeded = async (currentNamespace) => {
  let managedServiceAccount;
  try {
    managedServiceAccount = await k8sGet(
      ManagedServiceAccountRequest,
      ManagedServiceAccountCRName,
      currentNamespace,
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.info("rhoas: ServiceAccount doesn't exist. Creating new ServiceAccount")
  }
  let request;
  if (managedServiceAccount) {
    request = await patchServiceAccountRequest(managedServiceAccount)
  } else {
    request = await createManagedServiceAccount(currentNamespace);
  }

  await k8sWaitForUpdate(ManagedServiceAccountRequest, request, (resource) => {
    const condition = getFinishedCondition(resource);

    if (condition) {
      if (condition.status === "True") {
        return true
      } else {
        let errorToLog = condition.message
        throw new Error(errorToLog)
      }
    }
    return false
  }, 10000)
};

/**
 * createManagedKafkaConnection
 * @param kafkaId
 * @param kafkaName
 * @param currentNamespace
 */
export const createManagedKafkaConnection = async (
  kafkaId: string,
  kafkaName: string,
  currentNamespace: string,
) => {
  const kafkaConnection = {
    apiVersion: `${ManagedServicesRequestModel.apiGroup}/${ManagedServicesRequestModel.apiVersion}`,
    kind: ManagedKafkaConnectionModel.kind,
    metadata: {
      name: kafkaName,
      namespace: currentNamespace,
    },
    spec: {
      kafkaId,
      accessTokenSecretName: AccessTokenSecretName,
      credentials: {
        serviceAccountSecretName: ServiceAccountSecretName,
      },
    },
  };

  const createdConnection = await k8sCreate(ManagedKafkaConnectionModel, kafkaConnection);
  return await k8sWaitForUpdate(ManagedKafkaConnectionModel, createdConnection, (resource) => {
    const condition = getFinishedCondition(resource);

    if (condition) {
      if (condition.status === "True") {
        return true
      } else {
        throw new Error(`Message: ${condition.message} reason: ${condition.reason}`)
      }
    }
    return false
  }, 10000)
};

export const listOfCurrentKafkaConnectionsById = async (currentNamespace: string) => {
  const localArray = [];
  const kafkaConnections = await k8sGet(ManagedKafkaConnectionModel, null, currentNamespace);
  if (kafkaConnections) {
    const callback = (kafka) => {
      const { kafkaId } = kafka.spec;
      localArray.push(kafkaId);
    };
    kafkaConnections.items.map(callback);
    return localArray;
  }
};