import type { Config } from "@puckeditor/core";
import { Flame } from "lucide-react";
import { DropZone } from "@puckeditor/core"; // Required for nested layouts

// defining TS shape of our props avoiding editor crash
type Props = {
    TwoColumnGrid: {}; // holding drop zones
    CategoryHeading: {
        title: string;
        customNote?: string;
    }
    MenuItem: {
        dishName: string;
        description: string;
        price: number;
        isDiscounted: boolean;
        discountPrice?: number;
    };
    SpicyWarning: { isSpicy: boolean };
    LiveSpecial: {
        specialId: string;
        livePrice?: number;
        title?: string
    };
};

// export Puck Config Object
export const config: Config<Props> = {
    // categories , organizing side bars
    categories: {
        layout: { components: ["TwoColumnGrid"], title: "Layouts" },
        menu: {
            components:
                ["CategoryHeading",
                    "MenuItem",
                    "SpicyWarning",
                    "LiveSpecial"
                ],
            title: "Menu Blocks"
        },
    },
    components: {
        // multi column layout - DropZones
        TwoColumnGrid: {
            render: () => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full my-6">
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded bg-gray-50">
                        {/* DropZone 1: Puck acts like React 'children' here */}
                        <DropZone zone="left-column" />
                    </div>
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded bg-gray-50">
                        {/* DropZone 2: A separate isolated bucket for blocks */}
                        <DropZone zone="right-column" />
                    </div>
                </div>
            ),
        },

        CategoryHeading: {
            fields: {
                title: { type: "text" },
                customNote: {
                    type: "custom",
                    render: ({ value, onChange }) => (
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500">Chef's Note (Simulated Rich Text)</span>
                            <textarea
                                className="border p-2 rounded text-sm w-full"
                                value={value}
                                onChange={(e) => onChange(e.currentTarget.value)}
                                placeholder="Type a rich text note here..."
                            />
                        </div>
                    )
                }
            },
            defaultProps: { title: "Main Courses", customNote: "" },
            render: ({ title, customNote }) => (
                <div className="mt-8 mb-4">
                    <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-orange-500 pb-2">{title}</h2>
                    {customNote && <p className="text-sm italic text-gray-500 mt-2">{customNote}</p>}
                </div>
            ),
        },
        // dynamic fields
        MenuItem: {
            resolveFields: async (data, { fields }) => {
                let dynamicFields: any = {
                    dishName: { type: "text" },
                    description: { type: "textarea" },
                    price: { type: "number" },
                    isDiscounted: {
                        type: "radio",
                        options: [{
                            label: "Yes", value: true
                        }, {
                            label: "No", value: false
                        }]
                    },
                }
                if (data.props.isDiscounted) {
                    dynamicFields.discountPrice = { type: "number", label: "New Discounted Price" };
                }
                return dynamicFields;
            },
            defaultProps: {
                dishName: "Ribeye",
                description: "12oz grass fed beef",
                price: 350,
                isDiscounted: false
            },
            render: ({ dishName, description, price, isDiscounted, discountPrice }) => (
                <div className="flex justify-between items-start py-4 border-b border-gray-100">
                    <div className="max-w-2xl">
                        <h3 className="text-xl font-semibold text-gray-900">{dishName}</h3>
                        <p className="text-gray-500 mt-1">{description}</p>
                    </div>
                    <div className="text-right">
                        {/* If discounted, strike through the old price and show the new red price */}
                        {isDiscounted && discountPrice ? (
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400 line-through">${price}</span>
                                <span className="text-lg font-bold text-red-600">${discountPrice}</span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-orange-600">${price}</span>
                        )}
                    </div>
                </div>
            ),
        },
        // dynamic props 
        LiveSpecial: {
            fields: {
                specialId: {
                    type: "select",
                    options: [{
                        label: "Chef's catch", value: "fish-1"
                    }, {
                        label: "truffle special", value: "truffle-1"
                    }]
                }
            },
            defaultProps: {
                specialId: "fish-1"
            },
            //resolved data intercepts the component right before it renders.
            // this is where you would normally run an await fetch api / database
            resolveData: async ({ props }) => {
                //backend database simualation
                const fakeDatabase: Record<string, { title: string; livePrice: number }> = {
                    "fish-1": { title: "Wild Alaskan Salmon", livePrice: 45.00 },
                    "truffle-1": { title: "Black Truffle Risotto", livePrice: 65.00 }
                };
                const fetchedData = fakeDatabase[props.specialId] || { title: "Unknown Special", livePrice: 0 };
                // merge fetched database back into props array
                return {
                    props: {
                        ...props, title: fetchedData.title, livePrice: fetchedData.livePrice
                    }
                };
            },
            render: ({ title, livePrice }) => (
                <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-400 shadow-sm">
                    <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest bg-yellow-200 px-2 py-1 rounded">Live Market Price</span>
                    <h3 className="text-2xl font-bold mt-3 text-gray-900">{title}</h3>
                    <p className="text-3xl font-black text-gray-800 mt-1">${livePrice}</p>
                </div>
            )
        },
        SpicyWarning: {
            fields: {
                isSpicy: {
                    type: "radio",
                    options: [{
                        label: "yes", value: true
                    },
                    { label: "No", value: false }
                    ]
                }
            },
            defaultProps: { isSpicy: true },
            render: ({ isSpicy }) => {
                if (!isSpicy) return <></>
                return (
                    <div className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-md text-sm font-bold mt-2">
                        <Flame size={16} /> Contains Spice
                    </div>
                )
            }
        }

    }

}