import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
