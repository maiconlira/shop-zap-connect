import capinha from "@/assets/produto-capinha.jpg";
import pelicula from "@/assets/produto-pelicula.jpg";
import carregador from "@/assets/produto-carregador.jpg";
import caixaSom from "@/assets/produto-caixa-som.jpg";
import fone from "@/assets/produto-fone.jpg";
import cabo from "@/assets/produto-cabo.jpg";
import suporte from "@/assets/produto-suporte.jpg";
import powerbank from "@/assets/produto-powerbank.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  /** IDs de modelos compatíveis. Vazio/undefined = produto universal. */
  compatibility?: string[];
};

// Helper: gera variações de capinha/película para uma lista de modelos
const makeCase = (modelId: string, modelName: string): Product => ({
  id: `capinha-${modelId}`,
  name: `Capinha Silicone — ${modelName}`,
  price: 39.9,
  category: "Capinhas",
  description: `Capa em silicone com toque aveludado, recortes precisos para ${modelName}.`,
  image: capinha,
  compatibility: [modelId],
});

const makeFilm = (modelId: string, modelName: string): Product => ({
  id: `pelicula-${modelId}`,
  name: `Película de Vidro 3D — ${modelName}`,
  price: 24.9,
  category: "Películas",
  description: `Película de vidro temperado com cobertura total para ${modelName}.`,
  image: pelicula,
  compatibility: [modelId],
});

// Modelos com cobertura específica de capinha + película
const specificModels: Array<[string, string]> = [
  ["iphone-15-pro-max", "iPhone 15 Pro Max"],
  ["iphone-15-pro", "iPhone 15 Pro"],
  ["iphone-15", "iPhone 15"],
  ["iphone-14-pro", "iPhone 14 Pro"],
  ["iphone-14", "iPhone 14"],
  ["iphone-13", "iPhone 13"],
  ["iphone-12", "iPhone 12"],
  ["galaxy-s24-ultra", "Galaxy S24 Ultra"],
  ["galaxy-s24", "Galaxy S24"],
  ["galaxy-s23", "Galaxy S23"],
  ["galaxy-a55", "Galaxy A55"],
  ["galaxy-a54", "Galaxy A54"],
  ["galaxy-a34", "Galaxy A34"],
  ["galaxy-a15", "Galaxy A15"],
  ["redmi-note-13-pro", "Redmi Note 13 Pro"],
  ["redmi-note-13", "Redmi Note 13"],
  ["redmi-note-12", "Redmi Note 12"],
  ["poco-x6-pro", "Poco X6 Pro"],
  ["xiaomi-14", "Xiaomi 14"],
  ["moto-g84", "Moto G84"],
  ["moto-g54", "Moto G54"],
  ["moto-g34", "Moto G34"],
  ["edge-50-pro", "Edge 50 Pro"],
  ["edge-40", "Edge 40"],
];

const specificProducts: Product[] = specificModels.flatMap(([id, name]) => [
  makeCase(id, name),
  makeFilm(id, name),
]);

const universalProducts: Product[] = [
  {
    id: "carregador-turbo",
    name: "Carregador Turbo 25W",
    price: 79.9,
    category: "Carregadores",
    description: "Carregador rápido USB-C de 25W, compatível com todos os celulares modernos.",
    image: carregador,
  },
  {
    id: "caixa-som-bluetooth",
    name: "Caixa de Som Bluetooth",
    price: 189.9,
    category: "Áudio",
    description: "Som potente com graves marcantes, à prova d'água e bateria de até 12 horas.",
    image: caixaSom,
  },
  {
    id: "fone-tws",
    name: "Fone Bluetooth TWS",
    price: 149.9,
    category: "Áudio",
    description: "Fone sem fio com cancelamento de ruído e estojo de carregamento.",
    image: fone,
  },
  {
    id: "cabo-usbc",
    name: "Cabo USB-C Trançado 2m",
    price: 34.9,
    category: "Cabos",
    description: "Cabo reforçado com nylon trançado, suporta carga rápida e transferência de dados.",
    image: cabo,
  },
  {
    id: "suporte-mesa",
    name: "Suporte de Mesa Ajustável",
    price: 59.9,
    category: "Acessórios",
    description: "Suporte em alumínio com ângulo ajustável, ideal para vídeos e chamadas.",
    image: suporte,
  },
  {
    id: "powerbank-10000",
    name: "Power Bank 10.000mAh",
    price: 119.9,
    category: "Carregadores",
    description: "Bateria portátil com carga rápida e display de carga, leve e compacta.",
    image: powerbank,
  },
];

export const products: Product[] = [...specificProducts, ...universalProducts];

export const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];
