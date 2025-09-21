import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ReadingProgress } from '@/components/features/toc'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ReadingProgress />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}