import * as React from 'react';
import { connect } from 'react-redux';
import {
  observer,
  Node,
  useDndDrop,
  WithContextMenuProps,
  WithCreateConnectorProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { calculateRadius } from '@console/shared';
import { RootState } from '@console/internal/redux';
import { getServiceBindingStatus } from '@console/topology/src/utils';
import { obsDropTargetSpec } from '@console/topology/src/operators/components/OperatorBackedService';
import { KafkaConnectionModel } from '../../models';
import { kafkaIcon } from '../../const';
import TrapezoidBaseNode from './TrapezoidBaseNode';

import './KafkaNode.scss';

interface StateProps {
  serviceBinding: boolean;
}

type KafkaNodeProps = {
  element: Node;
} & WithSelectionProps &
  WithDragNodeProps &
  WithContextMenuProps &
  WithCreateConnectorProps &
  StateProps;

const KafkaNode: React.FC<KafkaNodeProps> = ({
  element,
  selected,
  onSelect,
  serviceBinding,
  ...props
}) => {
  const { width, height } = element.getBounds();
  const size = Math.min(width, height);
  const iconRadius = Math.min(width, height) * 0.25;
  const { radius } = calculateRadius(size);
  const spec = React.useMemo(() => obsDropTargetSpec(serviceBinding), [serviceBinding]);
  const [dndDropProps, dndDropRef] = useDndDrop(spec, { element, ...props });

  return (
    <TrapezoidBaseNode
      className="KafkaNode"
      onSelect={onSelect}
      icon={kafkaIcon}
      innerRadius={iconRadius}
      selected={selected}
      kind={KafkaConnectionModel.kind}
      element={element}
      outerRadius={radius}
      {...props}
      dndDropRef={dndDropRef}
      {...dndDropProps}
    />
  );
};

const mapStateToProps = (state: RootState): StateProps => {
  return {
    serviceBinding: getServiceBindingStatus(state),
  };
};

export default connect(mapStateToProps)(observer(KafkaNode));
