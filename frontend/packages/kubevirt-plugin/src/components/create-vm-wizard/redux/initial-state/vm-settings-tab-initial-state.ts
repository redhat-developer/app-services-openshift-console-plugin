import { OrderedSet } from 'immutable';

import { TemplateSupport } from '../../../../constants/vm-templates/support';
import { ProvisionSource } from '../../../../constants/vm/provision-source';
import { CommonData, VMSettingsField, VMWizardProps } from '../../types';
import { asDisabled, asHidden, asRequired } from '../../utils/utils';
import { InitialStepStateGetter, VMSettings } from './types';

export const getInitialVmSettings = (data: CommonData): VMSettings => {
  const {
    data: { isCreateTemplate, isProviderImport, initialData },
  } = data;

  const hiddenByProvider = asHidden(isProviderImport, VMWizardProps.isProviderImport);
  const hiddenByProviderOrTemplate = isProviderImport
    ? hiddenByProvider
    : asHidden(isCreateTemplate, VMWizardProps.isCreateTemplate);
  const hiddenByProviderOrCloneCommonBaseDiskImage = isProviderImport
    ? hiddenByProvider
    : asHidden(false);
  const hiddenByOperatingSystem = asHidden(true, VMSettingsField.OPERATING_SYSTEM);

  const fields = {
    [VMSettingsField.NAME]: {
      isRequired: asRequired(true),
      validations: [],
      value: initialData.name || undefined,
    },
    [VMSettingsField.HOSTNAME]: {},
    [VMSettingsField.DESCRIPTION]: {},
    [VMSettingsField.TEMPLATE_PROVIDER]: {
      isRequired: asRequired(isCreateTemplate),
      isHidden: asHidden(!isCreateTemplate),
    },
    [VMSettingsField.TEMPLATE_SUPPORTED]: {
      isHidden: asHidden(!isCreateTemplate),
      value: TemplateSupport.NO_SUPPORT.getValue(),
    },
    [VMSettingsField.OPERATING_SYSTEM]: {
      isRequired: asRequired(true),
      isDisabled: asDisabled(!isCreateTemplate && !isProviderImport, 'create-vm-flow'),
    },
    [VMSettingsField.CLONE_COMMON_BASE_DISK_IMAGE]: {
      value: false,
      isHidden: hiddenByOperatingSystem,
    },
    [VMSettingsField.MOUNT_WINDOWS_GUEST_TOOLS]: {
      value: false,
      isHidden: asHidden(true, VMSettingsField.OPERATING_SYSTEM),
    },
    [VMSettingsField.FLAVOR]: {
      isRequired: asRequired(true),
    },
    [VMSettingsField.MEMORY]: {
      binaryUnitValidation: true,
    },
    [VMSettingsField.CPU]: {},
    [VMSettingsField.WORKLOAD_PROFILE]: {
      isRequired: asRequired(true),
    },
    [VMSettingsField.PROVISION_SOURCE_TYPE]: {
      isHidden: hiddenByProviderOrCloneCommonBaseDiskImage,
      isRequired: asRequired(!isProviderImport),
      sources: OrderedSet(ProvisionSource.getAdvancedWizardSources().map((s) => s.getValue())),
      initialized: !(
        initialData.source?.url ||
        initialData.source?.container ||
        (initialData.source?.pvcName && initialData.source?.pvcNamespace)
      ),
    },
    [VMSettingsField.CONTAINER_IMAGE]: {
      isHidden: hiddenByProviderOrCloneCommonBaseDiskImage,
    },
    [VMSettingsField.IMAGE_URL]: {
      isHidden: hiddenByProviderOrCloneCommonBaseDiskImage,
    },
    [VMSettingsField.START_VM]: {
      value: !!initialData.startVM,
      isHidden: hiddenByProviderOrTemplate,
    },
    [VMSettingsField.CLONE_PVC_NS]: {
      isHidden: hiddenByProviderOrCloneCommonBaseDiskImage,
    },
    [VMSettingsField.CLONE_PVC_NAME]: {},
    [VMSettingsField.DEFAULT_STORAGE_CLASS]: {},
  };

  Object.keys(fields).forEach((k) => {
    fields[k].key = k;
  });
  return fields;
};

export const getVmSettingsInitialState: InitialStepStateGetter = (data) => ({
  value: getInitialVmSettings(data),
  error: null,
  hasAllRequiredFilled: false,
  isValid: false,
  isLocked: false,
  isHidden: data.data.isProviderImport && data.data.isSimpleView,
  isCreateDisabled: false,
  isUpdateDisabled: false,
  isDeleteDisabled: false,
});
