import { Client } from "./client";
import { Metadata } from "next";
import { Render } from "@measured/puck";
import { config } from "../../../puck.config";

export const metadata: Metadata = {
  title: "Puck Editor",
};

export default async function Page({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}) {
  const resolvedParams = await params;
  const puckPath = resolvedParams.puckPath || [];
  const isEdit = puckPath[0] === "edits";
  const path = `/${puckPath.join("/")}`;

  // This is a dynamic fake-backend, so we pass an empty initial state.
  // The actual state will be managed by the Puck component and saved to localStorage.
  const initialData = {
    content: [],
    root: {
      props: {
        title: "My E-Commerce Page",
      },
    },
  };

  if (isEdit) {
    // Render the interactive Puck editor
    return <Client initialData={initialData} path={path} />;
  }

  // Render the public-facing live page without the editor UI
  return <Render config={config} data={initialData} />;
}
