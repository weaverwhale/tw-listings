export const IndustryTypesRoles = [
  "all",
  "art",
  "baby",
  "books",
  "shoes",
  "crafts",
  "clothing",
  "computers",
  "electronics",
  "collectibles",
  "pet_supplies",
  "home_garden",
  "sporting_goods",
  "toys_hobbies",
  "health_beauty",
  "office_products",
  "digital_products",
  "food_beverages",
  "car_truck_parts",
  "jewelry_watches",
  "fashion_accessories",
  "cellphones_accessories",
  "hair_braids",
  "other",
] as const;

export type IndustryTypes = typeof IndustryTypesRoles[number];
