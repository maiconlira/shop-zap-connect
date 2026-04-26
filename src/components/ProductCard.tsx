import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { whatsappLink, buildQuestionMessage } from "@/lib/whatsapp";

type Props = { product: Product };

export const ProductCard = ({ product }: Props) => {
  const { add } = useCart();

  const handleAdd = () => {
    add(product, 1);
    toast.success("Adicionado ao carrinho", { description: product.name });
  };

  return (
    <Card className="group overflow-hidden border-border/60 shadow-card hover:shadow-elegant transition-smooth flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground hover:bg-secondary">
          {product.category}
        </Badge>
      </div>
      <CardContent className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="text-2xl font-extrabold text-primary">
          {formatBRL(product.price)}
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
              href={whatsappLink(buildQuestionMessage(product.name))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
