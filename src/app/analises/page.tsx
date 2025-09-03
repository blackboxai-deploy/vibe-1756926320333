'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface AnaliseComDados {
  id: string
  score: number
  resultado: 'APTO' | 'NÃO APTO'
  relatorio_detalhado: string
  created_at: string
  vaga: { titulo: string } | null
  candidato: { nome: string } | null
}

export default function AnalisesPage() {
  const [analises, setAnalises] = useState<AnaliseComDados[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalises()
  }, [])

  const fetchAnalises = async () => {
    try {
      const response = await fetch('/api/analise')
      const data = await response.json()
      setAnalises(data)
    } catch (error) {
      console.error('Erro ao buscar análises:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando análises...</p>
        </div>
      </div>
    )
  }

  const analisesAptas = analises.filter(a => a.resultado === 'APTO').length
  const analiseNaoAptas = analises.filter(a => a.resultado === 'NÃO APTO').length
  const scoreMedia = analises.length > 0 
    ? Math.round(analises.reduce((acc, a) => acc + a.score, 0) / analises.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                FitAnalyzer
              </Link>
              <p className="text-gray-600">Análises de Fit</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/vagas">
                <Button variant="outline">Vagas</Button>
              </Link>
              <Link href="/candidatos">
                <Button variant="outline">Candidatos</Button>
              </Link>
              <Link href="/analises/nova">
                <Button>Nova Análise</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Análises de Fit</h1>
          <p className="text-gray-600">Histórico de análises realizadas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analises.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Candidatos Aptos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{analisesAptas}</div>
              <div className="text-xs text-gray-500">
                {analises.length > 0 ? Math.round((analisesAptas / analises.length) * 100) : 0}% do total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Não Aptos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{analiseNaoAptas}</div>
              <div className="text-xs text-gray-500">
                {analises.length > 0 ? Math.round((analiseNaoAptas / analises.length) * 100) : 0}% do total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{scoreMedia}</div>
              <div className="text-xs text-gray-500">De 100 pontos</div>
            </CardContent>
          </Card>
        </div>

        {/* Análises List */}
        {analises.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma análise encontrada</h3>
              <p className="text-gray-600 mb-4">Comece realizando sua primeira análise de fit</p>
              <Link href="/analises/nova">
                <Button>Realizar Primeira Análise</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {analises.map((analise) => (
              <Card key={analise.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {analise.candidato?.nome || 'Candidato'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Vaga: {analise.vaga?.titulo || 'Não especificada'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {analise.relatorio_detalhado.substring(0, 200)}...
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {new Date(analise.created_at).toLocaleString('pt-BR')}
                        </div>
                        <Link href={`/analises/${analise.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Relatório
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <div className="text-3xl font-bold mb-2">
                        <span className={analise.score >= 70 ? 'text-green-600' : 'text-red-600'}>
                          {analise.score}
                        </span>
                        <span className="text-lg text-gray-500">/100</span>
                      </div>
                      <Badge 
                        variant={analise.resultado === 'APTO' ? 'default' : 'destructive'}
                        className={analise.resultado === 'APTO' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                        }
                      >
                        {analise.resultado}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}