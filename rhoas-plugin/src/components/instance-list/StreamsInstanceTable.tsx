import React, {useEffect} from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';

const StreamsInstanceTable = () => {

  useEffect(() => {
    getKafkaInstances();
  })

  const getKafkaInstances = async () => {
    // try {
    //   coFetchJSON('./../../../mock/crds/ManagedKafkaRequest.yaml')
    //   .then((response) => {

    //   })
    // } catch (error) {
    //   console.log('Error fetching kafka instances')
    // }
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
