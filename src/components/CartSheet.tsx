import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, Send } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CartSheet = () => {
  const { items, count, setQty, remove } = useCart();

  const handleReserve = () => {
    if (items.length === 0) return;
    const url = whatsappLink(buildOrderMessage(items));
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="relative" size="default">
          <ShoppingCart />
          <span className="hidden sm:inline">Carrinho</span>
          {count > 0 && (
            <span className="absolute -top-2 -right-2 h-6 min-w-6 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-soft">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Seu carrinho</SheetTitle>
          <SheetDescription>
            Revise os itens e clique em reservar para enviar pelo WhatsApp.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 my-4">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <ShoppingCart className="mx-auto h-12 w-12 opacity-30 mb-3" />
              Seu carrinho está vazio
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-3 p-3 rounded-lg border border-border bg-card"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-20 w-20 rounded-md object-cover bg-muted shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.category}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQty(product.id, quantity - 1)}
                        aria-label="Diminuir"
                      >
                        <Minus className="!size-3" />
                      </Button>
                      <span className="text-sm font-semibold w-6 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQty(product.id, quantity + 1)}
                        aria-label="Aumentar"
                      >
                        <Plus className="!size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive"
                        onClick={() => remove(product.id)}
                        aria-label="Remover"
                      >
                        <Trash2 className="!size-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>

        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Itens</span>
            <span className="text-2xl font-extrabold">{count}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Os valores e formas de pagamento serão confirmados pelo WhatsApp.
          </p>
          <Button
            variant="whatsapp"
            size="lg"
            className="w-full"
            disabled={items.length === 0}
            onClick={handleReserve}
          >
            <Send />
            Reservar pelo WhatsApp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
