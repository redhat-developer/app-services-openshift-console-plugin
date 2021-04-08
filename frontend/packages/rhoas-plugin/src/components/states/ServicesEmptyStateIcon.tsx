import * as React from 'react';
import { cloudServicesIcon } from '../../const';

export const ServicesEmptyStateIcon = () => {
  return (
    <img
      src={cloudServicesIcon}
      className="pf-c-empty-state__icon"
      width={54}
      height={54}
      alt="Cloud services icon"
    />
  );
};
