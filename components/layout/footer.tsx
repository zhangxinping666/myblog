'use client'

import * as React from 'react'
import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

import { siteConfig } from '@/lib/config/site'
import { footerNav } from '@/lib/config/navigation'
import { cn } from '@/lib/utils/cn'
import { Separator } from '@/components/ui/separator'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(
      'border-t bg-background',
      className
    )}>
      <div className="container grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Logo and description */}
        <div className="space-y-3">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-lg">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              {siteConfig.description}
            </p>
          </div>
        </div>

        {/* Main navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">导航</h4>
          <ul className="space-y-2 text-sm">
            {footerNav.main.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">社交媒体</h4>
          <ul className="space-y-2 text-sm">
            {footerNav.social.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                >
                  {item.title === 'GitHub' && <Github className="h-4 w-4" />}
                  {item.title === 'Twitter' && <Twitter className="h-4 w-4" />}
                  {item.title === 'LinkedIn' && <Linkedin className="h-4 w-4" />}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">法律信息</h4>
          <ul className="space-y-2 text-sm">
            {footerNav.legal.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator />

      {/* Bottom bar */}
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} {siteConfig.name}. 保留所有权利.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            href={siteConfig.links.email}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span className="sr-only">邮件</span>
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}