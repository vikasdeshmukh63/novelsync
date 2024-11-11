'use client';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userAbout } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EmoloyeeAccountGeneral from '../employee-account-general';
import EmployeeAccountMediaLinks from '../employee-account-social-links';
import EmployeeAccountProfessional from '../employee-account-professional';
import EmployeeAccountNotifications from '../employee-account-notifications';
import EmployeeAccountChangePassword from '../employee-account-change-password';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'personal',
    label: 'Pesonal',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'professional',
    label: 'Professional',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  {
    value: 'notifications',
    label: 'Notifications',
    icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  },
  {
    value: 'media',
    label: 'Media',
    icon: <Iconify icon="solar:share-bold" width={24} />,
  },
  {
    value: 'security',
    label: 'Security',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function EmployeeAccountView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('personal');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Manage Account"
          links={[
            { name: 'Dashboard', href: paths.overview.employees },
            { name: 'Employees', href: paths.overview.employees },
            { name: 'Account' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {currentTab === 'personal' && <EmoloyeeAccountGeneral />}

        {currentTab === 'professional' && <EmployeeAccountProfessional />}

        {currentTab === 'notifications' && <EmployeeAccountNotifications />}

        {currentTab === 'media' && (
          <EmployeeAccountMediaLinks socialLinks={_userAbout.socialLinks} />
        )}

        {currentTab === 'security' && <EmployeeAccountChangePassword />}
      </Container>
    </DashboardContent>
  );
}
