import { DashboardShell } from '@/components/dashboard/DashboardShell';

export const metadata = {
  title: 'Dashboard — Royal Optical',
};

// Must be dynamic — depends on Supabase auth session at runtime.
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
