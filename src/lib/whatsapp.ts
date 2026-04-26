import type { Product } from "@/data/products";

export const WHATSAPP_NUMBER = "556684235499";

export type CartItem = { product: Product; quantity: number };

export function buildOrderMessage(items: CartItem[]) {
  const lines = ["*Olá! Quero reservar os seguintes produtos:*", ""];
  items.forEach(({ product, quantity }, i) => {
    lines.push(
      `${i + 1}. *${product.name}*`,
      `   • Quantidade: ${quantity}`,
      ""
    );
  });
  lines.push("Pode me confirmar valores, formas de pagamento e disponibilidade? 🙌");
  return lines.join("\n");
}

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildQuestionMessage(productName?: string) {
  return productName
    ? `Olá! Tenho uma dúvida sobre o produto *${productName}*. Pode me ajudar?`
    : "Olá! Tenho uma dúvida sobre os produtos da loja. Pode me ajudar?";
}
