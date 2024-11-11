import { CompactLayout } from 'src/layouts/compact';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <CompactLayout textAlign="start" maxWidth="100%" justifyContent="start">
        {children}
      </CompactLayout>
    </AuthGuard>
  );
}
