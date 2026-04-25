# Architecture Notes: Puck & Next.js Integration Guide

This document serves as a technical Q&A guide for the team, detailing the inner workings of our lightweight e-commerce prototype built with Next.js and the Puck visual page builder.

## 1. Core Architecture: Config vs. Representation

**Q: What is the "Config vs. Representation" concept in our architecture?**
**A:** This is the foundational principle of visual builders like Puck.
* **The Configuration (`puck.config.tsx`):** This is the rulebook. It defines what blocks exist (e.g., `HeadingBlock`, `HeroBlock`, `ProductCard`) and what data they require (such as text fields, image URLs, or select dropdowns for sizes).
* **The Representation (JSON Data):** This is the actual data generated when a user interacts with the editor. The UI acts as a visual layer over a portable JSON schema. When a user drags a component onto the canvas and fills out the fields, Puck uses the configuration to generate a structured JSON tree. This JSON represents the entire page layout and content, and it is what is sent to the backend.

## 2. File Structure and Next.js Routing

**Q: How does routing work in Next.js for our Puck editor?**
**A:** Next.js uses **File-System Routing**, meaning folders themselves dictate the routes rather than a centralized `routes.js` file. We leverage a **Catch-All Route** by naming our folder `[...puckPath]`. Any URL that doesn't match a dedicated folder (whether it is `/edit`, `/hello-world`, or `/store/products`) will fall into `src/app/[...puckPath]/page.tsx`.

**Q: Where is the `/edit` route defined, and how can we change it?**
**A:** Because we use a catch-all route, `/edit` isn't a physical folder. It is intercepted dynamically in `page.tsx`. We check the URL segments like this:
```tsx
const isEdit = puckPath[0] === "edit";
```
If you wanted to change the editor route to `/builder` or `/admin`, you would simply change that string check (e.g., `puckPath[0] === "builder"`). Alternatively, you could restructure the folders to have a dedicated `src/app/admin/page.tsx` file for a strict, hard-coded route.

**Q: What is a critical detail to remember about route parameters in modern Next.js (15+)?**
**A:** Route parameters have undergone a breaking change. The `params` object inside server components like `page.tsx` is now a Promise. It must be `await`ed before you can access the URL segments.
```tsx
export default async function Page({ params }: { params: Promise<{ puckPath: string[] }> }) {
  const resolvedParams = await params;
  const puckPath = resolvedParams.puckPath || [];
  // ...
}
```

## 3. Data Flow and Component Architecture

**Q: How does data flow from a URL request to rendering the Puck editor UI?**
**A:** The grand data flow happens in four steps:
1. **The Request:** The user navigates to `localhost:3000/edit` in their browser.
2. **The Server (`page.tsx`):** Next.js intercepts this request on the server side. It prepares the "initial data" (an empty canvas or existing JSON layout) and sends it down to the browser.
3. **The Client (`client.tsx`):** Once the code reaches the browser, the Client Component takes over and imports the `<Puck>` visual builder engine.
4. **The UI Injection (`puck.config.tsx`):** The `<Puck>` engine reads the rules from `puck.config.tsx` to automatically draw the left sidebar, the right properties sidebar, and the middle canvas.

**Q: How do we separate the interactive Editor from the Live Public Website?**
**A:** We use conditional rendering inside `page.tsx` based on the `isEdit` variable.
* **If `isEdit` is true:** We render the `<Client>` component, which spins up the heavy drag-and-drop sidebars for content creation.
* **If `isEdit` is false:** We return Puck's `<Render />` component. This acts as a lightweight, "Read-Only" version of the editor, displaying the live public website without any of the builder UI.

## 4. Front-End Pillars and HTTP Requests

**Q: What foundational front-end principles drive this ecosystem?**
**A:** The entire architecture is built upon the three pillars of front-end development:
1. **HTML (The Structure):** Defines what elements exist on the page (the skeleton).
2. **CSS (The Presentation):** Defines how the UI looks (the skin), which we streamlined by resetting Tailwind defaults to prevent styling conflicts with Puck.
3. **JavaScript (The Behavior):** Defines what the app does (the muscle). In our app, JavaScript powers the drag-and-drop mechanics, state management, and the compilation of the JSON representation.

**Q: How do HTTP requests and data persistence factor into the `onPublish` event?**
**A:** When a user clicks "Publish" in the Puck editor, an `onPublish` event handler is triggered inside our `<Client>` component.
In a production backend, this handler would execute an HTTP `POST` request to send the generated JSON representation to a server (via `fetch` or Axios), saving it to a database. For our prototype, we implemented a "fake backend" that intercepts this data and stores it in the browser's `localStorage`. This allows the data to persist between page reloads, mimicking a real server request without needing a complex backend infrastructure.
