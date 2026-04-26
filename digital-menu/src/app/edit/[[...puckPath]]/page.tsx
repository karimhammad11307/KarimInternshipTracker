"use client";

import { Puck, createUsePuck } from "@puckeditor/core";
import { config } from "../../../../puck.config";

const initialData = {
    content: [],
    root: {},
};

//  Create a strongly typed selector hook outside the component to prevent re-renders
const usePuckStore = createUsePuck();

//  We extract JUST the custom publish button into a component so it can use the hook
const CustomHeaderActions = () => {
    // Select ONLY the appState using a selector function (fixes the performance warning)
    const appState = usePuckStore((state) => state.appState);

    const handlePublish = () => {
        // We manually trigger the publish logic using the current data from appState
        console.log("Here is your pure JSON Representation:", appState.data);
        alert("Check your browser console (F12) to see the JSON data flow!");
    };

    return (
        <button
            onClick={handlePublish}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-4 py-2 rounded-md text-sm transition-all shadow-md"
        >
            🚀 Deploy Menu
        </button>
    );
};

export default function EditorPage() {
    return (
        <Puck
            config={config}
            data={initialData}
            onPublish={async (data) => {
                console.log("Here is your pure JSON Representation:", data);
                alert("Check your browser console (F12) to see the JSON data flow!");
            }}
            // We use Puck's native headerTitle for clean left-side branding
            headerTitle="MASTERY IT - Menu Architect"
            // We only override the headerActions to inject our button, 
            // leaving Puck's beautifully designed default header intact!
            overrides={{
                headerActions: CustomHeaderActions
            }}
        />
    );
}