import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FitAnalyzer - Análise de Fit de Candidatos',
  description: 'Sistema inteligente para análise de compatibilidade entre candidatos e vagas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}