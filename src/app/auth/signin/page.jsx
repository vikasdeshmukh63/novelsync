import { JwtSignInView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in : NovelSych` };

export default function Page() {
  return <JwtSignInView />;
}
