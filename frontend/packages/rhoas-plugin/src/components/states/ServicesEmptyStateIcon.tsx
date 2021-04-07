import * as React from 'react';
import { cloudServicesIcon } from '../../const';

export const ServicesEmptyStateIcon = () => {
  return (
    <embed src={cloudServicesIcon} className="pf-c-empty-state__icon" height="50" width="50" />
  );
};
