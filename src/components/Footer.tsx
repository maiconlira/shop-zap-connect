import logo from "@/assets/logo.png";
import { whatsappLink, buildQuestionMessage, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { MessageCircle, MapPin, Phone, Clock } from "lucide-react";

const ADDRESS = "Rua Paulo Rezer, 950-A, Centro, Porto dos Gaúchos - MT, 78560-000";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

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
        <ul className="space-y-3 text-sm text-secondary-foreground/80">
          <li className="flex items-start gap-2">
            <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <span>{formatPhone(WHATSAPP_NUMBER)}</span>
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary-foreground transition-smooth"
            >
              {ADDRESS}
            </a>
          </li>
          <li className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <span>Atendimento de segunda a sábado</span>
          </li>
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
      <div className="container py-4 text-xs text-secondary-foreground/60 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
        <span>© {new Date().getFullYear()} SmartCell Assistência Técnica. Todos os direitos reservados.</span>
        <span className="hidden sm:inline">·</span>
        <a href="/admin/login" className="hover:text-primary transition-smooth">Admin</a>
      </div>
    </div>
  </footer>
);
