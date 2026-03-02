import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
