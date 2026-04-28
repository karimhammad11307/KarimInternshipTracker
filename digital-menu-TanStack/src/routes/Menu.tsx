import { Render } from "@measured/puck";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { config } from "../editor/puckConfig";

export function Menu() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Retrieve the published data from localStorage
    const saved = localStorage.getItem("puck-menu-data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved menu data", e);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Menu is Empty!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          It looks like you haven't published anything from the editor yet.
        </p>
        <Link 
          to="/editor" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors"
        >
          Go to Editor
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      {/* 
        The Render component takes the same config as the editor,
        and the data output by the editor, and renders the final UI.
        This is what your end-users will see.
      */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700">
        <Render config={config} data={data} />
      </div>
    </div>
  );
}
