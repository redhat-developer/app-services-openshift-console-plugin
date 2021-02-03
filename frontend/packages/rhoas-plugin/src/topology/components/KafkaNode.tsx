import * as React from 'react';
import {
  observer,

} from '@patternfly/react-topology';
import {
  BaseNode,
} from '@console/topology/src/components/graph-view';
import { ManagedKafkaConnectionModel } from '../../models';
import { calculateRadius } from '@console/shared';
import { managedKafkaIcon } from '../../const';
// import { getServiceBindingStatus } from '@console/topology/src/utils';
import { dropTargetSpec } from "./dropTargetSpec"
import { useDndDrop } from '@patternfly/react-topology'

const KafkaNode: React.FC<any> = ({
  element,
  selected,
  onSelect,
  ...props
}) => {
  const { width, height } = element.getBounds();
  const size = Math.min(width, height);
  const iconRadius = Math.min(width, height) * 0.25;
  const { radius, decoratorRadius } = calculateRadius(size);
  const serviceBinding = true;// getServiceBindingStatus(props);
  console.log("service binding status", serviceBinding)
  const spec = React.useMemo(() => dropTargetSpec(serviceBinding), [serviceBinding]);
  const [dndDropProps, dndDropRef] = useDndDrop(spec, props as any);
  console.log(dndDropProps, dndDropRef);

  return (
    <BaseNode
      className="KafkaNode"
      onSelect={onSelect}
      icon={managedKafkaIcon}
      innerRadius={iconRadius}
      selected={selected}
      kind={ManagedKafkaConnectionModel.kind}
      element={element}
      decoratorRadius={decoratorRadius}
      outerRadius={radius}
      {...props}
    />
  );
};

export default observer(KafkaNode);
