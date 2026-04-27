"use client";

import { Puck, createUsePuck } from "@puckeditor/core";
import { config } from "../../../../puck.config";

const initialData = {
    content: [],
    root: {
        props: {
            title: "My Digital Menu Draft"
        }
    },
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
            // 1. Let the new CSS Variables handle the complete dark theme layout naturally!
            // 2. We only override the headerActions to inject our deploy button
            overrides={{
                headerActions: CustomHeaderActions,
            }}
        />

    );
}