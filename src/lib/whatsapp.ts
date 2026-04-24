import type { Product } from "@/data/products";

export const WHATSAPP_NUMBER = "556684235499";

export type CartItem = { product: Product; quantity: number };

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function buildOrderMessage(items: CartItem[]) {
  const lines = ["*Olá! Quero reservar os seguintes produtos:*", ""];
  let total = 0;
  items.forEach(({ product, quantity }, i) => {
    const subtotal = product.price * quantity;
    total += subtotal;
    lines.push(
      `${i + 1}. *${product.name}*`,
      `   • Quantidade: ${quantity}`,
      `   • Valor unitário: ${formatBRL(product.price)}`,
      `   • Subtotal: ${formatBRL(subtotal)}`,
      ""
    );
  });
  lines.push(`*Total: ${formatBRL(total)}*`, "", "Aguardo confirmação para ajustar os detalhes. 🙌");
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
