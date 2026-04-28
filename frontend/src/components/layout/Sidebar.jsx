import { NavLink } from 'react-router-dom';
import { Code2, History, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: Code2, label: 'Editor' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="h-full w-12 bg-vscode-sidebar flex flex-col items-center py-4 border-r border-vscode-border fixed left-0 top-0 z-50"
    >
      <div className="mb-6">
        <div className="w-8 h-8 bg-vscode-button rounded flex items-center justify-center">
          <Code2 size={20} className="text-white" />
        </div>
      </div>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex items-center justify-center w-10 h-10 rounded transition-colors ${
                isActive
                  ? 'text-white bg-vscode-button'
                  : 'text-vscode-text-muted hover:text-white hover:bg-vscode-activity'
              }`
            }
            title={item.label}
          >
            <item.icon size={22} />
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="w-8 h-8 rounded-full bg-vscode-activity flex items-center justify-center text-xs text-vscode-text-muted font-mono">
          M
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
