import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="h-screen w-screen flex bg-vscode-bg overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-12 h-full overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
