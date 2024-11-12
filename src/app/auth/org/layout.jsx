'use client';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
