import logo from "@/assets/logo.png";
import { whatsappLink, buildQuestionMessage, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

const formatPhone = (n: string) => {
  // 55 66 84235499 -> +55 (66) 8423-5499
  const ddi = n.slice(0, 2);
  const ddd = n.slice(2, 4);
  const rest = n.slice(4);
  const mid = rest.length > 8 ? rest.slice(0, 5) : rest.slice(0, 4);
  const end = rest.length > 8 ? rest.slice(5) : rest.slice(4);
  return `+${ddi} (${ddd}) ${mid}-${end}`;
};

export const Footer = () => (
  <footer id="contato" className="bg-secondary text-secondary-foreground">
    <div className="container py-12 grid gap-8 md:grid-cols-3">
      <div>
        <img src={logo} alt="SmartCell" className="h-14 bg-background rounded-lg p-2 mb-4 inline-block" />
        <p className="text-sm text-secondary-foreground/70 max-w-xs">
          Assistência técnica e acessórios para o seu celular, com atendimento
          rápido e humano.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-3">Contato</h4>
        <ul className="space-y-2 text-sm text-secondary-foreground/80">
          <li>{formatPhone(WHATSAPP_NUMBER)}</li>
          <li>Atendimento de segunda a sábado</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-3">Fale com a gente</h4>
        <a
          href={whatsappLink(buildQuestionMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-whatsapp text-whatsapp-foreground font-semibold px-4 py-2.5 rounded-lg hover:bg-whatsapp/90 transition-smooth"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
    <div className="border-t border-secondary-foreground/10">
      <div className="container py-4 text-xs text-secondary-foreground/60 text-center">
        © {new Date().getFullYear()} SmartCell Assistência Técnica. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);
