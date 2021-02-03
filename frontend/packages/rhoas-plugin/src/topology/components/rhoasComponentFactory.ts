import * as React from 'react';
import {
  GraphElement,
  ComponentFactory,
} from '@patternfly/react-topology';

import { withEditReviewAccess } from '@console/topology/src/utils';
import {
  nodeDragSourceSpec,
  withContextMenu,
  createMenuItems,
} from '@console/topology/src/components/graph-view';
import {
  withDragNode,
  withSelection,
} from '@patternfly/react-topology';
import { kebabOptionsToMenu } from '@console/internal/components/utils';
import KafkaNode from './KafkaNode';
import { K8sResourceKind, modelFor, referenceFor } from '@console/internal/module/k8s';
import { KebabOption } from '@console/internal/components/utils';
import { getResource } from '@console/topology/src/utils';
import { ModifyApplication } from '@console/topology/src/actions';
import { MANAGED_KAFKA_TOPOLOGY_TYPE } from '../rhoas-topology-plugin'

import {
  Node
} from '@patternfly/react-topology';


export const rhoasActions = (
  contextMenuResource: K8sResourceKind
): KebabOption[] => {
  if (!contextMenuResource) {
    return null;
  }

  const model = modelFor(referenceFor(contextMenuResource));
  return [
    ModifyApplication(model, contextMenuResource)
  ];
};

export const rhoasContextMenu = (element: Node) => {
  return createMenuItems(kebabOptionsToMenu(rhoasActions(getResource(element))));
};

export const getRhoasComponentFactory = (): ComponentFactory => {
  return (kind, type): React.ComponentType<{ element: GraphElement }> | undefined => {
    switch (type) {
      // Using resource kind as model kind for simplicity
      case MANAGED_KAFKA_TOPOLOGY_TYPE:
        return withEditReviewAccess('patch')(
          withDragNode(nodeDragSourceSpec(type))(
            withSelection({ controlled: true })(withContextMenu(rhoasContextMenu)(KafkaNode)),
          )
        );
      default:
        return undefined;
    }
  };
};
