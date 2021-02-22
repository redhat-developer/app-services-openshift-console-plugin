import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
} from '@patternfly/react-core';
import './StreamsInstanceFilter.css';

const StreamsInstanceFilter = ({textInputNameValue, handleTextInputNameChange }) => {
  const { t } = useTranslation();

  return (
    <Toolbar id="toolbar-filter-instances">
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarItem>
            <TextInput
              value={textInputNameValue}
              type="text"
              onChange={handleTextInputNameChange}
              aria-label={t('rhoas-plugin~Search by name')}
              placeholder={t('rhoas-plugin~Search by name...')}
              className="mk-streams-filter"
            />
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

export default StreamsInstanceFilter;
