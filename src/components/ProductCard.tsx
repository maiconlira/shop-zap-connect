import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useProducts, type ManagedProduct } from "@/hooks/useProducts";
import { toast } from "sonner";
import { whatsappLink, buildQuestionMessage } from "@/lib/whatsapp";

type Props = { product: Product };

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ProductCard = ({ product }: Props) => {
  const { add } = useCart();
  const { products, effectivePrice } = useProducts();

  // Pega o produto gerenciado para saber se está em promoção
  const managed = (products.find((p) => p.id === product.id) ?? product) as ManagedProduct;
  const isPromo = Boolean(managed.promo);
  const finalPrice = isPromo ? effectivePrice(managed) : managed.price;
  const hasDiscount = isPromo && managed.discount && managed.discount > 0;

  const handleAdd = () => {
    add({ ...managed, price: finalPrice }, 1);
    toast.success("Adicionado ao carrinho", { description: managed.name });
  };

  return (
    <Card className="group overflow-hidden border-border/60 shadow-card hover:shadow-elegant transition-smooth flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={managed.image}
          alt={managed.name}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground hover:bg-secondary">
          {managed.category}
        </Badge>
        {isPromo && managed.promoTag && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground hover:bg-primary">
            {managed.promoTag}
          </Badge>
        )}
      </div>
      <CardContent className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-tight">{managed.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {managed.description}
          </p>
        </div>

        {isPromo ? (
          <>
            <div className="flex items-baseline gap-2">
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(managed.price)}
                </span>
              )}
              <span className="text-xl font-extrabold text-primary">
                {formatPrice(finalPrice)}
              </span>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Button onClick={handleAdd} variant="hero" size="default">
                <ShoppingCart />
                Adicionar
              </Button>
              <Button
                asChild
                variant="outline"
                size="icon"
                aria-label="Tirar dúvida sobre este produto"
                title="Tirar dúvida no WhatsApp"
              >
                <a
                  href={whatsappLink(buildQuestionMessage(managed.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle />
                </a>
              </Button>
            </div>
          </>
        ) : (
          <Button asChild variant="hero" size="default" className="w-full">
            <a
              href={whatsappLink(buildQuestionMessage(managed.name))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle />
              Consultar no WhatsApp
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
