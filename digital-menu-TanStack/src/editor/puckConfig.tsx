import type { Config } from "@measured/puck";

// Define the shape of our editable components' props
export type PuckProps = {
  HeadingBlock: { title: string };
  TextBlock: { text: string };
  ImageBlock: { url: string; alt: string };
  MenuItemBlock: { title: string; price: number; description: string };
};

// Define the shape of our root props (the page itself)
export type RootProps = {
  title: string;
};

// Puck uses a config object to define components and their fields.
// This tells the visual editor what properties can be changed.
export const config: Config<PuckProps, RootProps> = {
  root: {
    fields: {
      title: { type: "text" },
    },
    defaultProps: {
      title: "My Digital Menu",
    },
    // render: ({ children, title }) => (
    //   <div className="max-w-4xl mx-auto py-10 px-4">
    //     {title && <h1 className="text-5xl font-extrabold mb-10 text-center text-gray-900 dark:text-white">{title}</h1>}
    //     {children}
    //   </div>
    // ),
  },
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Menu Category",
      },
      render: ({ title }) => (
        <h2 className="text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-gray-100 border-b pb-2 dark:border-gray-700">
          {title}
        </h2>
      ),
    },
    TextBlock: {
      fields: {
        text: { type: "textarea" },
      },
      defaultProps: {
        text: "Add a description here...",
      },
      render: ({ text }) => (
        <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap text-lg">
          {text}
        </p>
      ),
    },
    ImageBlock: {
      fields: {
        url: { type: "text" },
        alt: { type: "text" },
      },
      defaultProps: {
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
        alt: "Delicious food",
      },
      render: ({ url, alt }) => (
        <div className="overflow-hidden rounded-2xl shadow-lg mb-8">
          <img
            src={url}
            alt={alt}
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      ),
    },
    MenuItemBlock: {
      fields: {
        title: { type: "text" },
        price: { type: "number" },
        description: { type: "textarea" },
      },
      defaultProps: {
        title: "Classic Cheeseburger",
        price: 12.99,
        description: "Juicy beef patty with melted cheddar, crisp lettuce, tomato, and our secret sauce.",
      },
      render: ({ title, price, description }) => (
        <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-2xl shadow-sm mb-4 bg-white dark:bg-gray-800 transition-all hover:shadow-md group">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
            <span className="text-lg font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">${price.toFixed(2)}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      ),
    },
  },
};
