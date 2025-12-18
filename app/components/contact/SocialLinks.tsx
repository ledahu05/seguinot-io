// T065 & T066 & T067 & T068 & T069: SocialLinks component with LinkedIn, email, phone

'use client';

import { Mail, Phone, Linkedin, ExternalLink } from 'lucide-react';
import type { Contact } from '@/lib/schemas/cv.schema';

interface SocialLinksProps {
    contact: Contact;
}

interface ContactLink {
    href: string;
    icon: React.ReactNode;
    label: string;
    text: string;
    external?: boolean;
}

export function SocialLinks({ contact }: SocialLinksProps) {
    const links: ContactLink[] = [
        // T066: mailto: link for email
        {
            href: `mailto:${contact.email}`,
            icon: <Mail className='h-5 w-5' />,
            label: 'Email',
            text: contact.email
        },
        // T067: tel: link for phone
        {
            href: `tel:${contact.phone.replace(/\s/g, '')}`,
            icon: <Phone className='h-5 w-5' />,
            label: 'Phone',
            text: contact.phone
        },
        // T068: External link for LinkedIn (opens in new tab)
        {
            href: contact.linkedin,
            icon: <Linkedin className='h-5 w-5' />,
            label: 'LinkedIn',
            text: 'linkedin.com/in/christopheseguinot',
            external: true
        }
    ];

    return (
        <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Connect</h3>
            <ul className='space-y-3'>
                {links.map((link) => (
                    <li key={link.label}>
                        <a
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={
                                link.external
                                    ? 'noopener noreferrer'
                                    : undefined
                            }
                            className='group flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary'
                            aria-label={link.label}
                        >
                            <span className='flex-shrink-0 text-primary'>
                                {link.icon}
                            </span>
                            <span className='truncate'>{link.text}</span>
                            {link.external && (
                                <ExternalLink className='h-4 w-4 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100' />
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
