import * as React from 'react';
import StreamsInstancePage from '../streams-list/StreamsInstancePage';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import { FormFooter } from '@console/shared';
import { history } from '@console/internal/components/utils';
import AuthTokenModal from '../authentication-token/AuthTokenModal';

const ManagedKafkas = () => {
  return (
    <>
      <NamespacedPage variant={NamespacedPageVariants.light} hideApplications>
        <AuthTokenModal/>
        <StreamsInstancePage />
        <FormFooter
          isSubmitting={false}
          errorMessage=""
          submitLabel="Create"
          disableSubmit={false}
          resetLabel="Reset"
          sticky
          handleCancel={history.goBack}
        />
      </NamespacedPage>
    </>
  );
};

export default ManagedKafkas;
