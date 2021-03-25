import { StatusCondition, StatusEnabledResource } from './rhoas-types';

export const getCondition = (request: StatusEnabledResource, name: string) => {
  if (request && request.status && request.status.conditions) {
    for (const condition of request.status.conditions) {
      if (condition.type === name) {
        return condition as StatusCondition;
      }
    }
  }
  return undefined;
};

export const getFinishedCondition = (request: StatusEnabledResource) => {
  return getCondition(request, 'Finished');
};

export const isResourceStatusSuccessfull = (request: StatusEnabledResource) => {
  const condition = getCondition(request, 'Finished');
  return condition && condition.status === 'True';
};

export const isAcccesTokenSecretValid = (request: StatusEnabledResource) => {
  return getCondition(request, 'AcccesTokenSecretValid')?.status === 'True';
};
