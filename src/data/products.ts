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
};

export const products: Product[] = [
  {
    id: "capinha-silicone",
    name: "Capinha Silicone Premium",
    price: 39.9,
    category: "Capinhas",
    description: "Capa em silicone com toque aveludado, proteção total contra quedas e arranhões.",
    image: capinha,
  },
  {
    id: "pelicula-vidro",
    name: "Película de Vidro 3D",
    price: 24.9,
    category: "Películas",
    description: "Película de vidro temperado com cobertura total, alta dureza e instalação fácil.",
    image: pelicula,
  },
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

export const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];
