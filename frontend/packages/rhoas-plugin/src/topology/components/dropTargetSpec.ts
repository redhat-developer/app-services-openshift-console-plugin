import {
  DropTargetSpec,
  CREATE_CONNECTOR_DROP_TYPE,
  isEdge,
} from '@patternfly/react-topology';
import { GraphElement } from '@patternfly/react-topology';
import {
  NodeComponentProps,
  canDropEdgeOnNode,
  highlightNode,
  nodesEdgeIsDragging,
} from '@console/topology/src/components/graph-view';


export const dropTargetSpec = (
  serviceBinding: boolean,
): DropTargetSpec<
  GraphElement,
  any,
  { canDrop: boolean; dropTarget: boolean; edgeDragging: boolean },
  NodeComponentProps
> => ({
  accept: [CREATE_CONNECTOR_DROP_TYPE],
  canDrop: (item, monitor, props) => {
    if (!serviceBinding) {
      return false;
    }

    if (isEdge(item)) {
      return canDropEdgeOnNode(monitor.getOperation()?.type, item, props.element);
    }
    if (item === props.element) {
      return false;
    }
    return !props.element.getTargetEdges().find((e) => e.getSource() === item);
  },
  collect: (monitor, props) => {
    return {
      canDrop: serviceBinding && highlightNode(monitor, props.element),
      dropTarget: monitor.isOver({ shallow: true }),
      edgeDragging: nodesEdgeIsDragging(monitor, props),
    };
  },
  dropHint: 'createServiceBinding',
});
