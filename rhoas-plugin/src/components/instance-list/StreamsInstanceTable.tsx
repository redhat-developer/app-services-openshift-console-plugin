import React, {useEffect} from 'react';
import { coFetchJSON } from '@console/internal/co-fetch';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';

const StreamsInstanceTable = () => {

  const 

  useEffect(() => {
    getKafkaInstances();
  })

  const getKafkaInstances = async () => {
    try {
      coFetchJSON('./../../../mock/crds/ManagedKafkaRequest.yaml')
      .then((response) => {

      })
    } catch (error) {
      console.log('Error fetching kafka instances')
    }
  }

  return (
    <Table
      aria-label="List of Kafka Instances"
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  )
}

export default StreamsInstanceTable;
