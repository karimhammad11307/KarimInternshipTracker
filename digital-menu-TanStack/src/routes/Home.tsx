import { Link } from "@tanstack/react-router";
import { ArrowRight, Edit3, LayoutDashboard } from "lucide-react";

export function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
        Digital Menu Builder <br/>
        <span className="text-blue-600 dark:text-blue-400 text-3xl">Sandbox</span>
      </h1>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed">
        A simple project to explore how the <span className="font-semibold text-gray-800 dark:text-gray-200">Puck Visual Editor</span> integrates with <span className="font-semibold text-gray-800 dark:text-gray-200">TanStack Router</span>. Build digital menus dynamically and render them seamlessly.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link 
          to="/editor" 
          className="group flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Edit3 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Visual Editor</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4 flex-grow">
            Drag and drop components to build your custom menu using Puck.
          </p>
          <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium mt-auto group-hover:underline">
            Open Editor <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link 
          to="/menu" 
          className="group flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <LayoutDashboard size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Live Menu</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4 flex-grow">
            View the final rendered output of the components created in the editor.
          </p>
          <div className="flex items-center text-green-600 dark:text-green-400 font-medium mt-auto group-hover:underline">
            View Menu <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
