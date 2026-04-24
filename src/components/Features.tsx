import { Wrench, Truck, ShieldCheck, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Wrench,
    title: "Assistência técnica",
    desc: "Equipe especializada em reparo de celulares com peças de qualidade.",
  },
  {
    icon: Truck,
    title: "Entrega rápida",
    desc: "Receba seus acessórios com agilidade e segurança em casa.",
  },
  {
    icon: ShieldCheck,
    title: "Produtos garantidos",
    desc: "Trabalhamos só com marcas confiáveis e oferecemos garantia.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento humano",
    desc: "Tire dúvidas direto no WhatsApp, sem robôs ou esperas.",
  },
];

export const Features = () => (
  <section id="sobre" className="bg-muted/40 border-y border-border">
    <div className="container py-16 md:py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-card rounded-xl p-6 shadow-card border border-border/60 hover:shadow-elegant transition-smooth"
          >
            <div className="h-12 w-12 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center mb-4 shadow-soft">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
