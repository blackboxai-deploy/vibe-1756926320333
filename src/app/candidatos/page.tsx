'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Candidato } from '@/lib/supabase'

export default function CandidatosPage() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCandidatos()
  }, [])

  const fetchCandidatos = async () => {
    try {
      const response = await fetch('/api/candidatos')
      const data = await response.json()
      setCandidatos(data)
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando candidatos...</p>
        </div>
      </div>
    )
  }

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
              <p className="text-gray-600">Gerenciar Candidatos</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/vagas">
                <Button variant="outline">Vagas</Button>
              </Link>
              <Link href="/analises">
                <Button variant="outline">Análises</Button>
              </Link>
              <Link href="/candidatos/novo">
                <Button>Novo Candidato</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Candidatos</h1>
          <p className="text-gray-600">Gerencie os candidatos cadastrados</p>
        </div>

        {candidatos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum candidato encontrado</h3>
              <p className="text-gray-600 mb-4">Comece cadastrando o primeiro candidato</p>
              <Link href="/candidatos/novo">
                <Button>Cadastrar Primeiro Candidato</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidatos.map((candidato) => (
              <Card key={candidato.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{candidato.nome}</CardTitle>
                      <CardDescription className="mt-1">
                        {candidato.email}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Ativo
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {candidato.descricao && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {candidato.descricao}
                    </p>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">LinkedIn:</p>
                    <a 
                      href={candidato.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate block"
                    >
                      {candidato.linkedin_url.replace('https://linkedin.com/in/', '@')}
                    </a>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Cadastrado em {new Date(candidato.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/candidatos/${candidato.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Ver Perfil
                      </Button>
                    </Link>
                    <Link href={`/analises/nova?candidato=${candidato.id}`}>
                      <Button className="px-4">
                        Analisar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {candidatos.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{candidatos.length}</div>
                  <div className="text-sm text-gray-600">Total de Candidatos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {candidatos.filter(c => {
                      const weekAgo = new Date(Date.now() - 7*24*60*60*1000).toISOString()
                      return c.created_at > weekAgo
                    }).length}
                  </div>
                  <div className="text-sm text-gray-600">Novos (7 dias)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {candidatos.filter(c => c.linkedin_url).length}
                  </div>
                  <div className="text-sm text-gray-600">Com LinkedIn</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {candidatos.filter(c => c.descricao && c.descricao.length > 50).length}
                  </div>
                  <div className="text-sm text-gray-600">Perfil Completo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}