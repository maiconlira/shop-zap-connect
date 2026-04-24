import { whatsappLink, buildQuestionMessage } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export const FloatingWhatsApp = () => (
  <a
    href={whatsappLink(buildQuestionMessage())}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Tirar dúvida no WhatsApp"
    className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-whatsapp text-whatsapp-foreground shadow-elegant flex items-center justify-center hover:scale-110 transition-smooth animate-pulse"
  >
    <MessageCircle className="h-7 w-7" />
  </a>
);
