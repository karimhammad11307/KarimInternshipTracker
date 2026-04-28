import { Link, Outlet } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true" || 
      (!("darkMode" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              MenuBuilder
            </Link>
            
            <nav className="flex gap-4">
              {/* Active links get styled via TanStack router's generic styling or activeProps */}
              <Link 
                to="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                activeProps={{ className: "text-blue-600 dark:text-blue-400 font-semibold" }}
              >
                Home
              </Link>
              <Link 
                to="/menu" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                activeProps={{ className: "text-blue-600 dark:text-blue-400 font-semibold" }}
              >
                View Menu
              </Link>
              <Link 
                to="/editor" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                activeProps={{ className: "text-blue-600 dark:text-blue-400 font-semibold" }}
              >
                Editor
              </Link>
            </nav>
          </div>

          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {/* Outlet is where TanStack Router renders the child routes */}
        <Outlet />
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Learning Sandbox: Puck Visual Editor + TanStack Router</p>
      </footer>
    </div>
  );
}
