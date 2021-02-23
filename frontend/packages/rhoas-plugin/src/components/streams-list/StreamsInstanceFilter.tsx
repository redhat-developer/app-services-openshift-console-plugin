import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
} from '@patternfly/react-core';
import { useDocumentListener, KEYBOARD_SHORTCUTS } from '@console/shared';

const StreamsInstanceFilter = ({ textInputNameValue, handleTextInputNameChange }) => {
  const { t } = useTranslation();
  const { ref } = useDocumentListener();

  return (
    <Toolbar id="toolbar-filter-instances">
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarItem>
            <div className="has-feedback">
              <TextInput
                value={textInputNameValue}
                type="text"
                onChange={handleTextInputNameChange}
                aria-label={t('rhoas-plugin~Search by name')}
                placeholder={t('rhoas-plugin~Search by name...')}
                className="co-text-filter"
                ref={ref}
              />
              <span className="form-control-feedback form-control-feedback--keyboard-hint">
                <kbd>{KEYBOARD_SHORTCUTS.focusFilterInput}</kbd>
              </span>
            </div>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

export default StreamsInstanceFilter;
