export type PhoneBrand = "Apple" | "Samsung" | "Xiaomi" | "Motorola";

export type PhoneModel = {
  id: string;
  brand: PhoneBrand;
  name: string;
};

export const phoneBrands: PhoneBrand[] = ["Apple", "Samsung", "Xiaomi", "Motorola"];

export const phoneModels: PhoneModel[] = [
  // Apple
  { id: "iphone-15-pro-max", brand: "Apple", name: "iPhone 15 Pro Max" },
  { id: "iphone-15-pro", brand: "Apple", name: "iPhone 15 Pro" },
  { id: "iphone-15", brand: "Apple", name: "iPhone 15" },
  { id: "iphone-14-pro", brand: "Apple", name: "iPhone 14 Pro" },
  { id: "iphone-14", brand: "Apple", name: "iPhone 14" },
  { id: "iphone-13", brand: "Apple", name: "iPhone 13" },
  { id: "iphone-12", brand: "Apple", name: "iPhone 12" },
  // Samsung
  { id: "galaxy-s24-ultra", brand: "Samsung", name: "Galaxy S24 Ultra" },
  { id: "galaxy-s24", brand: "Samsung", name: "Galaxy S24" },
  { id: "galaxy-s23", brand: "Samsung", name: "Galaxy S23" },
  { id: "galaxy-a55", brand: "Samsung", name: "Galaxy A55" },
  { id: "galaxy-a54", brand: "Samsung", name: "Galaxy A54" },
  { id: "galaxy-a34", brand: "Samsung", name: "Galaxy A34" },
  { id: "galaxy-a15", brand: "Samsung", name: "Galaxy A15" },
  // Xiaomi
  { id: "redmi-note-13-pro", brand: "Xiaomi", name: "Redmi Note 13 Pro" },
  { id: "redmi-note-13", brand: "Xiaomi", name: "Redmi Note 13" },
  { id: "redmi-note-12", brand: "Xiaomi", name: "Redmi Note 12" },
  { id: "poco-x6-pro", brand: "Xiaomi", name: "Poco X6 Pro" },
  { id: "xiaomi-14", brand: "Xiaomi", name: "Xiaomi 14" },
  // Motorola
  { id: "moto-g84", brand: "Motorola", name: "Moto G84" },
  { id: "moto-g54", brand: "Motorola", name: "Moto G54" },
  { id: "moto-g34", brand: "Motorola", name: "Moto G34" },
  { id: "edge-50-pro", brand: "Motorola", name: "Edge 50 Pro" },
  { id: "edge-40", brand: "Motorola", name: "Edge 40" },
];
