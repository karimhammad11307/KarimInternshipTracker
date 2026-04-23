import { type Config } from "@puckeditor/core";

// 1. We tell TypeScript that GridBlock expects a slot called 'myGrid'
type Props = {
  HeadingBlock: { title: string };
  GridBlock: { myGrid: React.ElementType };
  CardBlock: {
    title: string;
    description: string;
    padding: number;
    variant: string;
  },
  HeroBlock: {
    headline: string;
    backgroundImageUrl: string;
  }, 
  ImageBlock: {
    imageUrl: string;
    altText: string;
    imageSize: string;
  }
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Heading",
      },
      render: ({ title }) => (
        <div className="text-4xl font-bold p-4">
          <h1>{title}</h1>
        </div>
      ),
    },

    GridBlock: {
      // 2. We explicitly define the slot in the fields
      fields: {
        myGrid: {
          type: "slot",
        },
      },
      // 3. We destructure myGrid, rename it with a capital letter (MyGrid) 
      // so React knows it's a component, and render it!
      render: ({ myGrid: MyGrid }) => {
        return (
          <div>
            <MyGrid className="grid grid-cols-3 gap-4 p-4" />
          </div>
        );
      }
    },
    CardBlock: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        padding: {type: "number"},
        variant: {type: "select", options: [{label: "Outlined",value: "border rounded-md"},
          {label: "Floating", value: "shadow-md"}
        ]}
      },
      defaultProps:{
        title: "Title",
        description: "This is a description",
        padding: 16,
        variant: "border rounded-md"
      },
      render: ({ title, description, padding, variant }) => {
        return <div style={{padding}} className={`${variant}`}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      }
    },
    HeroBlock: {
      fields: {
        headline: {type: "text"},
        backgroundImageUrl: {type: "text"},
      },
      defaultProps: {
        headline: "This is a headline",
        backgroundImageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80", 
      },
      render: ({headline, backgroundImageUrl}) => {
        return (
          <div className="flex items-center justify-center min-h-100 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${backgroundImageUrl}')`,
            backgroundColor: "#1f2937"
          }}>
            <div className="bg-black/50 p-8 rounded-lg text-center backdrop-blur-sm" >
              <h1 className="text-white text-5xl font-extrabold">{headline}</h1>

            </div>
          </div>
        )
      }
    },
    ImageBlock:{
      fields: {
        imageUrl: {type: "text"},
        altText: {type: "text"},
        // UI Control
        imageSize: {
          type: "select",
          options: [
            {label: "small (25%)", value: "w-1/4"},
            {label: "medium (50%)", value: "w-1/2"},
            {label: "large (75%)", value: "w-3/4"},
            {label: "Full Width (100%)", value: "w-full"}
          ],
          
        }
      },
      defaultProps: {
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        altText: "A person coding on a laptop",
        imageSize: "w-full"
       
      },
      resolveData: async({props}) => {
        return{
          props: props,
          readOnly: {
            altText: true
          }
        }
      },
      render: ({imageUrl,altText, imageSize}) => {
        return(
          <div className="w-full justify-center p-4">
            <img 
              src={imageUrl}
              alt={altText}
              className={`${imageSize} h-auto rounded-lg shadow-md object-cover transition-all duration-300`}
            />
          </div>
        )
      }
    }
  },
};

export default config;