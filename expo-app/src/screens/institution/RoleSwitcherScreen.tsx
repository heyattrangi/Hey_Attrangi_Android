import React, { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { RoleSwitcher, InstitutionSkeletons } from '../../components/institution';
import { useInstitutionStore } from '../../store/institutionStore';
import { MainStackParamList } from '../../navigation/types';
import { hapticSelection, hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'RoleSwitcher'>;
};

export const RoleSwitcherScreen: React.FC<Props> = ({ navigation }) => {
  const availableRoles = useInstitutionStore((s) => s.availableRoles);
  const activeRoleId = useInstitutionStore((s) => s.activeRoleId);
  const pendingRoleId = useInstitutionStore((s) => s.pendingRoleId);
  const status = useInstitutionStore((s) => s.status);
  const loadSnapshot = useInstitutionStore((s) => s.loadSnapshot);
  const requestRoleSwitch = useInstitutionStore((s) => s.requestRoleSwitch);
  const confirmRoleSwitch = useInstitutionStore((s) => s.confirmRoleSwitch);
  const cancelRoleSwitch = useInstitutionStore((s) => s.cancelRoleSwitch);

  useEffect(() => {
    if (availableRoles.length === 0) void loadSnapshot();
  }, [availableRoles.length, loadSnapshot]);

  return (
    <AppScreen gradient="topRightSoft" includeBottomInset>
      <AppHeader title="Switch Role" onBack={() => navigation.goBack()} />
      {status === 'loading' && availableRoles.length === 0 ? (
        <InstitutionSkeletons variant="resources" />
      ) : (
        <RoleSwitcher
          roles={availableRoles}
          activeRoleId={activeRoleId}
          pendingRoleId={pendingRoleId}
          onSelectRole={(id) => {
            void hapticSelection();
            requestRoleSwitch(id);
          }}
          onConfirmSwitch={() => {
            void hapticSuccess();
            void confirmRoleSwitch().then(() => navigation.goBack());
          }}
          onCancelSwitch={cancelRoleSwitch}
        />
      )}
    </AppScreen>
  );
};
