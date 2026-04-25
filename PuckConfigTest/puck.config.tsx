import type { Config } from "@measured/puck";

type Props = {
  HeadingBlock: { title: string };
  HeroBlock: { headline: string; imageUrl: string };
  ProductCard: { productName: string; price: number; size: "Small" | "Medium" | "Large" };
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Hello World",
      },
      render: ({ title }) => (
        <div style={{ padding: "20px" }}>
          <h1 style={{ fontSize: "2rem", margin: 0, color: "#333" }}>{title}</h1>
        </div>
      ),
    },
    HeroBlock: {
      fields: {
        headline: { type: "text" },
        imageUrl: { type: "text" },
      },
      defaultProps: {
        headline: "Welcome to Our Store",
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      },
      render: ({ headline, imageUrl }) => (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            minHeight: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2 style={{ fontSize: "2.5rem", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            {headline}
          </h2>
        </div>
      ),
    },
    ProductCard: {
      fields: {
        productName: { type: "text" },
        price: { type: "number" },
        size: {
          type: "select",
          options: [
            { label: "Small", value: "Small" },
            { label: "Medium", value: "Medium" },
            { label: "Large", value: "Large" },
          ],
        },
      },
      defaultProps: {
        productName: "Basic T-Shirt",
        price: 19.99,
        size: "Medium",
      },
      render: ({ productName, price, size }) => (
        <div style={{ padding: "20px" }}>
          <div
            style={{
              border: "1px solid #eaeaea",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "300px",
              margin: "0 auto",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              backgroundColor: "white",
              color: "#333",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{productName}</h3>
            <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#0070f3" }}>
              ${price}
            </p>
            <p style={{ margin: "0 0 15px 0", fontSize: "0.9rem", color: "#666" }}>
              Size: {size}
            </p>
            <button
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ),
    },
  },
};
