"use client";

import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "../../../puck.config";

export function Client({ initialData, path }: { initialData: Data; path: string }) {
  return (
    <Puck
      config={config}
      data={initialData}
      onPublish={async (data: Data) => {
        // 1. Log the data so it can be inspected
        console.log("Published Data:", data);

        // 2. Save JSON.stringify(data) to the browser's localStorage
        localStorage.setItem("puck-draft", JSON.stringify(data));

        // 3. Trigger a simple alert
        alert("Saved to Local Storage!");
      }}
    />
  );
}
