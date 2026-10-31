import type { ReactNode } from 'react';
import { MessageCircle } from 'lucide-react';

const defaultMessage = 'Hello CapitalSense, I would like to discuss my mutual fund goals or portfolio.';

export const whatsappUrl = `https://wa.me/918850405723?text=${encodeURIComponent(defaultMessage)}`;

export function WhatsAppCta({
  children = 'Chat on WhatsApp',
  className = 'button primary',
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with CapitalSense on WhatsApp Business"
    >
      <MessageCircle size={17} aria-hidden="true" />
      {children}
    </a>
  );
}
