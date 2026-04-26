import capinhaPadrao from "@/assets/produto-capinha.jpg";
import capinhaPreta from "@/assets/capinha-preta.jpg";
import capinhaTransparente from "@/assets/capinha-transparente.jpg";
import capinhaAzul from "@/assets/capinha-azul.jpg";
import capinhaVermelha from "@/assets/capinha-vermelha.jpg";
import capinhaRosa from "@/assets/capinha-rosa.jpg";
import capinhaArmor from "@/assets/capinha-armor.jpg";
import peliculaVidro from "@/assets/produto-pelicula.jpg";
import peliculaPrivacidade from "@/assets/pelicula-privacidade.jpg";
import peliculaFosca from "@/assets/pelicula-fosca.jpg";
import carregador from "@/assets/produto-carregador.jpg";
import caixaSom from "@/assets/produto-caixa-som.jpg";
import fone from "@/assets/produto-fone.jpg";
import cabo from "@/assets/produto-cabo.jpg";
import suporte from "@/assets/produto-suporte.jpg";
import powerbank from "@/assets/produto-powerbank.jpg";
import garrafa from "@/assets/produto-garrafa.jpg";
import garrafaSport from "@/assets/produto-garrafa-sport.jpg";
import copo from "@/assets/produto-copo.jpg";
import copoTermico from "@/assets/produto-copo-termico.jpg";
import foneOver from "@/assets/produto-fone-over.jpg";
import caixaSom2 from "@/assets/produto-caixa-som-2.jpg";
import foneTwsBranco from "@/assets/produto-fone-tws-branco.jpg";
import foneGamer from "@/assets/produto-fone-gamer.jpg";
import foneSport from "@/assets/produto-fone-sport.jpg";
import caixaMini from "@/assets/produto-caixa-mini.jpg";
import caixaParty from "@/assets/produto-caixa-party.jpg";
import caixaAprovaDagua from "@/assets/produto-caixa-aprova-dagua.jpg";
import copoStanley from "@/assets/produto-copo-stanley.jpg";
import copoVidro from "@/assets/produto-copo-vidro.jpg";
import caneca from "@/assets/produto-caneca.jpg";
import squeeze from "@/assets/produto-squeeze.jpg";
import garrafaBambu from "@/assets/produto-garrafa-bambu.jpg";
import garrafaKids from "@/assets/produto-garrafa-kids.jpg";

// Variações visuais — alternadas entre os modelos para diversificar a galeria
const caseVariants = [
  { img: capinhaPreta, label: "Preta", finish: "silicone preto fosco" },
  { img: capinhaTransparente, label: "Transparente", finish: "silicone transparente com bordas reforçadas" },
  { img: capinhaAzul, label: "Azul Marinho", finish: "silicone azul marinho aveludado" },
  { img: capinhaVermelha, label: "Vermelha", finish: "silicone vermelho premium" },
  { img: capinhaRosa, label: "Rosa", finish: "silicone rosa pastel" },
  { img: capinhaArmor, label: "Armor Carbon", finish: "armor antichoque com fibra de carbono" },
  { img: capinhaPadrao, label: "Clássica", finish: "silicone com toque aveludado" },
] as const;

const filmVariants = [
  { img: peliculaVidro, label: "Vidro 3D", desc: "Película de vidro temperado 3D com cobertura total" },
  { img: peliculaPrivacidade, label: "Privacidade", desc: "Película de vidro com filtro de privacidade" },
  { img: peliculaFosca, label: "Fosca Anti-Reflexo", desc: "Película fosca anti-reflexo com toque suave" },
] as const;

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
const makeCase = (modelId: string, modelName: string, index: number): Product => {
  const variant = caseVariants[index % caseVariants.length];
  return {
    id: `capinha-${modelId}`,
    name: `Capinha ${variant.label} — ${modelName}`,
    price: 39.9,
    category: "Capinhas",
    description: `Capa em ${variant.finish}, com recortes precisos para ${modelName}.`,
    image: variant.img,
    compatibility: [modelId],
  };
};

const makeFilm = (modelId: string, modelName: string, index: number): Product => {
  const variant = filmVariants[index % filmVariants.length];
  return {
    id: `pelicula-${modelId}`,
    name: `Película ${variant.label} — ${modelName}`,
    price: 24.9,
    category: "Películas",
    description: `${variant.desc} para ${modelName}.`,
    image: variant.img,
    compatibility: [modelId],
  };
};

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

const specificProducts: Product[] = specificModels.flatMap(([id, name], i) => [
  makeCase(id, name, i),
  makeFilm(id, name, i),
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
  {
    id: "fone-over-ear",
    name: "Headphone Bluetooth Over-Ear",
    price: 249.9,
    category: "Áudio",
    description: "Fone over-ear com som premium, almofadas confortáveis e bateria de longa duração.",
    image: foneOver,
  },
  {
    id: "caixa-som-portatil",
    name: "Caixa de Som Portátil 360º",
    price: 219.9,
    category: "Áudio",
    description: "Som imersivo 360º, à prova d'água e bateria para o dia todo.",
    image: caixaSom2,
  },
  {
    id: "garrafa-termica-preta",
    name: "Garrafa Térmica Inox 750ml",
    price: 89.9,
    category: "Garrafas",
    description: "Garrafa em aço inox com isolamento térmico, mantém a temperatura por até 12h.",
    image: garrafa,
  },
  {
    id: "garrafa-sport",
    name: "Garrafa Sport com Alça 1L",
    price: 69.9,
    category: "Garrafas",
    description: "Garrafa esportiva resistente com alça e bico prático para o dia a dia.",
    image: garrafaSport,
  },
  {
    id: "copo-tumbler",
    name: "Copo Tumbler com Canudo 600ml",
    price: 49.9,
    category: "Copos",
    description: "Copo reutilizável com tampa e canudo, ideal para sucos, água e drinks gelados.",
    image: copo,
  },
  {
    id: "copo-termico-viagem",
    name: "Copo Térmico de Viagem 450ml",
    price: 79.9,
    category: "Copos",
    description: "Copo térmico elegante, perfeito para café e bebidas quentes em qualquer lugar.",
    image: copoTermico,
  },
  // === Fones extras ===
  {
    id: "fone-tws-branco",
    name: "Fone Bluetooth TWS Branco",
    price: 159.9,
    category: "Áudio",
    description: "Fone sem fio TWS com design clean, microfone embutido e estojo de carregamento rápido.",
    image: foneTwsBranco,
  },
  {
    id: "fone-gamer-rgb",
    name: "Headphone Gamer RGB",
    price: 219.9,
    category: "Áudio",
    description: "Headset gamer com iluminação RGB, microfone retrátil e som surround imersivo.",
    image: foneGamer,
  },
  {
    id: "fone-sport-neckband",
    name: "Fone Bluetooth Sport Neckband",
    price: 129.9,
    category: "Áudio",
    description: "Fone esportivo com arco flexível, resistente ao suor e bateria de longa duração.",
    image: foneSport,
  },
  // === Caixas de Som extras ===
  {
    id: "caixa-mini-bluetooth",
    name: "Mini Caixa Bluetooth Compacta",
    price: 99.9,
    category: "Áudio",
    description: "Caixa de som mini portátil com som potente, ideal para levar para qualquer lugar.",
    image: caixaMini,
  },
  {
    id: "caixa-party-led",
    name: "Caixa de Som Party LED",
    price: 399.9,
    category: "Áudio",
    description: "Caixa amplificada para festas, com luzes LED, alça e bateria de longa duração.",
    image: caixaParty,
  },
  {
    id: "caixa-aprova-dagua",
    name: "Caixa de Som À Prova D'água",
    price: 179.9,
    category: "Áudio",
    description: "Caixa robusta IPX7 à prova d'água, perfeita para piscina, praia e aventuras.",
    image: caixaAprovaDagua,
  },
  // === Copos extras ===
  {
    id: "copo-stanley-style",
    name: "Copo Térmico com Alça 1L",
    price: 129.9,
    category: "Copos",
    description: "Copo térmico de inox com alça, mantém gelado por horas — estilo Stanley.",
    image: copoStanley,
  },
  {
    id: "copo-vidro-bambu",
    name: "Copo de Vidro com Tampa Bambu",
    price: 39.9,
    category: "Copos",
    description: "Copo de vidro com tampa de bambu e canudo ecológico, design minimalista.",
    image: copoVidro,
  },
  {
    id: "caneca-ceramica",
    name: "Caneca de Cerâmica Moderna",
    price: 29.9,
    category: "Copos",
    description: "Caneca de cerâmica preto e branco com design moderno, ideal para café e chá.",
    image: caneca,
  },
  // === Garrafas extras ===
  {
    id: "squeeze-sport",
    name: "Squeeze Sport 700ml",
    price: 34.9,
    category: "Garrafas",
    description: "Squeeze esportivo com bico prático e alça, leve e resistente para academia.",
    image: squeeze,
  },
  {
    id: "garrafa-bambu-premium",
    name: "Garrafa Premium Tampa Bambu 500ml",
    price: 99.9,
    category: "Garrafas",
    description: "Garrafa térmica em inox com tampa de bambu, design elegante e sustentável.",
    image: garrafaBambu,
  },
  {
    id: "garrafa-kids",
    name: "Garrafa Infantil com Alça 500ml",
    price: 49.9,
    category: "Garrafas",
    description: "Garrafa colorida para crianças, com bico de segurança e alça para transporte.",
    image: garrafaKids,
  },
];

export const products: Product[] = [...specificProducts, ...universalProducts];

export const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];
