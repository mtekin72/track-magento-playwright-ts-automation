export const testData = {
  categories: {
    Men: {
      Tops: ["Jackets", "Hoodies & Sweatshirts", "Tees", "Tanks"],
      Bottoms: ["Pants", "Shorts"],
    },
    Women: {
      Tops: ["Jackets", "Hoodies & Sweatshirts", "Tees", "Bras & Tanks"],
      Bottoms: ["Pants", "Shorts"],
    },
    Gear: {
      Bags: [],
      "Fitness Equipment": [],
      Watches: [],
    },
  },

  sampleTests: {
    scenario1: {
      menuPath: ["Men", "Tops", "Jackets"],
      size: "XS",
      color: "Blue",
      quantity: 1,
      product: "Proteus Fitness Jackshirt",

    },
    scenario2: {
      menuPath: ["Women", "Tops", "Jackets"],
      size: "XS",
      color: "Blue",
      quantity: 2,
      product: "Olivia 1/4 Zip Light Jacket",
    },
    scenario3: {
      menuPath: ["Gear", "Bags"],
      filter: {
        option: "Activity",
        activity: "Yoga",
      },
      quantity: 1,
    },
    scenario4: {
      menuPath: ["Women", "Bottoms", "Pants"],
      shoppingOptions: ["Style", "Capri"],
      size: "28",
      color: "Blue",
      quantity: 1,
      discountCode: "20poff",
    },
  
  scenario5: {
    menuPath: ["Men", "Bottoms", "Shorts"],
    shoppingOptions: ["Style", "Tights"],
    size: "33",
    color: "Red",
    quantity: 2,
    discountCode: "20poff",
  },

  shipping: {
    country: "Netherlands",
    postcode: "1011AB",
    discountCode: "20poff",
}
}
}