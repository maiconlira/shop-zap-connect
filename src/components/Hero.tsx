import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";
import { ArrowDown, MessageCircle } from "lucide-react";
import { whatsappLink, buildQuestionMessage } from "@/lib/whatsapp";

export const Hero = () => {
  return (
    <section id="topo" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Assistência técnica de celulares"
          width={1536}
          height={896}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>
      <div className="relative container py-24 md:py-36 text-primary-foreground">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary-foreground text-xs font-bold tracking-widest uppercase">
          SmartCell • Assistência & Acessórios
        </span>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black leading-tight max-w-3xl">
          Tudo que seu celular precisa,
          <span className="block bg-gradient-primary bg-clip-text text-transparent">
            em um só lugar.
          </span>
        </h1>
        <p className="mt-6 text-lg max-w-xl text-primary-foreground/85">
          Capinhas, películas, carregadores, fones e muito mais. Reserve pelo site
          e finalize a compra direto no WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="hero" size="lg">
            <a href="#produtos">
              Ver produtos
              <ArrowDown />
            </a>
          </Button>
          <Button asChild variant="whatsapp" size="lg">
            <a
              href={whatsappLink(buildQuestionMessage())}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle />
              Tirar dúvida
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
