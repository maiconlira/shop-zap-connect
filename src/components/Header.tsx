import logo from "@/assets/logo.png";
import { CartSheet } from "./CartSheet";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-20 gap-4">
        <a href="#topo" className="flex items-center gap-2 shrink-0">
          <img
            src={logo}
            alt="SmartCell Assistência Técnica"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a href="#produtos" className="hover:text-primary transition-smooth">Produtos</a>
          <a href="#sobre" className="hover:text-primary transition-smooth">Sobre</a>
          <a href="#contato" className="hover:text-primary transition-smooth">Contato</a>
        </nav>
        <CartSheet />
      </div>
    </header>
  );
};
