import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "../editor/puckConfig";

// Initial data for the editor so it's not completely empty.
// In a real app, you'd fetch this from a database.
const initialData = {
  content: [],
  root: {
    props: {
      title: "My Digital Menu"
    }
  },
};

export function Editor() {
  // Load saved data from localStorage, or use initialData if none exists
  const getSavedData = () => {
    const saved = localStorage.getItem("puck-menu-data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return initialData;
  };

  // Save data to localStorage whenever the user publishes
  const handlePublish = (data: any) => {
    localStorage.setItem("puck-menu-data", JSON.stringify(data));
    alert("Menu published successfully! Go to the Menu page to see it.");
  };

  return (
    <div className="flex-grow flex flex-col">
      {/* 
        The Puck component renders the entire visual editor UI.
        We pass it our custom config to tell it what components are available,
        the initial data to render, and a callback for when the user clicks 'Publish'.
      */}
      <Puck
        config={config}
        data={getSavedData()}
        onPublish={handlePublish}
      />
    </div>
  );
}
