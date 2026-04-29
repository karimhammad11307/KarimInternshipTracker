import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";

// Import our components
import { Layout } from "./components/Layout";
import { Home } from "./routes/Home";
import { Menu } from "./routes/Menu";
import { Editor } from "./routes/Editor";

// 1. Create a root route
// The root route is the outermost wrapper for our app.
// We use our Layout component here so the header/footer appears on all pages.
const rootRoute = createRootRoute({
  component: Layout,
});

// 2. Create individual routes
// Each route is attached to the root route and maps a URL path to a component.

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu",
  component: Menu,
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor",
  component: Editor,
});

// 3. Build the route tree
// We tell the router how the routes connect together.
export const routeTree = rootRoute.addChildren([indexRoute, menuRoute, editorRoute]);

// 4. Create the router instance
export const router = createRouter({ routeTree });

// 5. Register the router for TypeScript safety
// This ensures that links and navigation functions have autocompletion and type checking for paths.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
