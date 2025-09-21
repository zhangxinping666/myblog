import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

export interface AuthorCardProps {
  name: string
  bio?: string | undefined
  avatar?: string | undefined
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

export function AuthorCard({ name, bio, avatar, social }: AuthorCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          {avatar && (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
          )}
          <div>
            <h3 className="font-semibold">{name}</h3>
            {bio && <p className="text-sm text-muted-foreground">{bio}</p>}
          </div>
        </div>
      </CardHeader>
      {social && (
        <CardContent>
          <div className="flex gap-2">
            {social.twitter && (
              <Link href={social.twitter} className="text-sm text-muted-foreground hover:text-foreground">
                Twitter
              </Link>
            )}
            {social.github && (
              <Link href={social.github} className="text-sm text-muted-foreground hover:text-foreground">
                GitHub
              </Link>
            )}
            {social.linkedin && (
              <Link href={social.linkedin} className="text-sm text-muted-foreground hover:text-foreground">
                LinkedIn
              </Link>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default AuthorCard
