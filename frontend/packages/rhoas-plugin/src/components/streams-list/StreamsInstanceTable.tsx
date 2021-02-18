import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Bullseye,
  Title,
  EmptyStateIcon
} from '@patternfly/react-core';
import {
  sortable,
  cellWidth,
  Table,
  TableHeader,
  TableBody,
  RowSelectVariant,
  SortByDirection
} from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

import { Timestamp } from '@console/internal/components/utils';
import './StreamsInstanceTable.css';

type FormattedKafkas = {
  cells: JSX.Element[];
  selected: boolean;
};

const StreamsInstanceTable: any = ({ pageKafkas, setSelectedKafka, currentKafkaConnections, setAllKafkasConnected }) => {

  const [formattedKafkas, setFormattedKafkas] = React.useState<FormattedKafkas[]>([]);
  const [kafkaRows, setKafkaRows] = React.useState(pageKafkas);
  const [sortBy, setSortBy] = React.useState({})
  const { t } = useTranslation();

  const formatTableRowData = (updatedRows) => {
    const tableRow = updatedRows && updatedRows.map(({ id, name, bootstrapServerHost, provider, region, owner, createdAt }) => {
      return {
        cells: [
          { title: name },
          { title: <a href="/">{bootstrapServerHost}</a> },
          { title: provider },
          { title: region },
          { title: <a href="/">{owner}</a> },
          { title: <Timestamp timestamp={createdAt} /> },
        ],
        ...(currentKafkaConnections.includes(id) && { disableSelection : true })
      }
    })

    if(pageKafkas && pageKafkas.length === currentKafkaConnections.length) {
      setAllKafkasConnected(true);
    }
    else {
      setFormattedKafkas(tableRow);
    }
  }

  React.useEffect(() => {
    setKafkaRows(pageKafkas);
    formatTableRowData(kafkaRows);
  }, [pageKafkas, kafkaRows, currentKafkaConnections]);

  const tableColumns = [
    { title: t('rhoas-plugin~Cluster Name'), transforms: [sortable] },
    { title: t('rhoas-plugin~Bootstrap URL'), transforms: [sortable, cellWidth(20)] },
    { title: t('rhoas-plugin~Provider'), transforms: [sortable] },
    { title: t('rhoas-plugin~Region'), transforms: [sortable] },
    { title: t('rhoas-plugin~Owner'), transforms: [sortable] },
    { title: t('rhoas-plugin~Created'), transforms: [sortable] },
  ];

  const emptyStateRows = [
    {
      heightAuto: true,
      cells: [
        {
          props: { colSpan: 8 },
          title: (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h2" size="lg">
                  No results found
                </Title>
                <EmptyStateBody>
                  No results match the filter criteria. Remove all filters or clear all filters to show results.
                </EmptyStateBody>
                <Button variant="link">Clear all filters</Button>
              </EmptyState>
            </Bullseye>
          )
        }
      ]
    }
  ]

  const onSelectTableRow = (event, isSelected, rowId) => {
    let rows = formattedKafkas.map((row, index) => {
      row.selected = rowId === index;
      return row;
    });
    setFormattedKafkas(rows);
    setSelectedKafka(rowId);
  };

  const onSort = (_event, index, direction) => {
    console.log('what is index' + index);
    const sortedRows = kafkaRows.sort((a,b) =>
      (a[index] < b[index] ? -1 : a[index] > b[index] ? 1 : 0));

    setSortBy({index, direction});
    formatTableRowData(direction === SortByDirection.asc ? sortedRows : sortedRows.reverse())
    setKafkaRows(direction === SortByDirection.asc ? sortedRows : sortedRows.reverse())
  }

  return (
    <>
    { formattedKafkas || pageKafkas && (
      <Table
        aria-label={t('rhoas-plugin~List of Kafka Instances')}
        cells={tableColumns}
        rows={pageKafkas.length === 0 ? emptyStateRows : formattedKafkas}
        onSelect={onSelectTableRow}
        selectVariant={RowSelectVariant.radio}
        className="mk-streams-table"
        onSort={onSort}
        sortBy={sortBy}
      >
        <TableHeader />
        <TableBody />
      </Table>
    )}
    </>
  );
};

export default StreamsInstanceTable;
