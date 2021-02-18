import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
} from '@patternfly/react-core';

const StreamsInstanceFilter = ({ pageKafkas, setPageKafkas }) => {
  console.log('what is kafkaArray' + JSON.stringify(pageKafkas));
  const [textInputNameValue, setTextInputNameValue] = React.useState('');
  // const [kafkaNamesList, setKafkaNamesList] = React.useState([]);
  const { t } = useTranslation();

  // const getListOfKafkaNames

  // React.useEffect(() => {

  // }, [kafkaArray]);


  const handleTextInputNameChange = value => {
    setTextInputNameValue(value);


      let filteredKafkas = pageKafkas.filter(kafka => kafka.name.includes(value));
      console.log('what is filteredKafkas' + JSON.stringify(filteredKafkas));
      setPageKafkas(filteredKafkas);

      // pageKafkas.forEach(kafka => {
      //   console.log('what is kafka.name' + kafka.name);
      //   if(kafka.name.includes(value)) {
      //     console.log('includes value');
      //   }
      //   else {
      //     console.log('does not includes value');
      //   }
      // })

    
  };

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
            />
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

export default StreamsInstanceFilter;
