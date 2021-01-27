import { getExecutableCodeRef } from '@console/dynamic-plugin-sdk/src/coderefs/coderef-utils';

export const rhoasProvider = getExecutableCodeRef(() =>
  import('./useRhoasServices' /* webpackChunkName: "rhoasProvider-provider" */).then((m) => m.default),
);
