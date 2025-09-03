'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Vaga } from '@/lib/supabase'

export default function VagasPage() {
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVagas()
  }, [])

  const fetchVagas = async () => {
    try {
      const response = await fetch('/api/vagas')
      const data = await response.json()
      setVagas(data)
    } catch (error) {
      console.error('Erro ao buscar vagas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, novoStatus: 'ativa' | 'inativa') => {
    try {
      await fetch(`/api/vagas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      })
      fetchVagas()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando vagas...</p>
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
              <p className="text-gray-600">Gerenciar Vagas</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/candidatos">
                <Button variant="outline">Candidatos</Button>
              </Link>
              <Link href="/analises">
                <Button variant="outline">Análises</Button>
              </Link>
              <Link href="/vagas/nova">
                <Button>Nova Vaga</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Vagas</h1>
          <p className="text-gray-600">Gerencie as vagas disponíveis</p>
        </div>

        {vagas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-gray-600 mb-4">Comece criando sua primeira vaga</p>
              <Link href="/vagas/nova">
                <Button>Criar Primeira Vaga</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vagas.map((vaga) => (
              <Card key={vaga.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{vaga.titulo}</CardTitle>
                      <CardDescription className="mt-1">
                        Criada em {new Date(vaga.created_at).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={vaga.status === 'ativa' ? 'default' : 'secondary'}
                      className={vaga.status === 'ativa' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {vaga.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {vaga.descricao}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Principais Requisitos:</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {vaga.requisitos}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/vagas/${vaga.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Button
                      variant={vaga.status === 'ativa' ? 'destructive' : 'default'}
                      onClick={() => handleStatusChange(
                        vaga.id, 
                        vaga.status === 'ativa' ? 'inativa' : 'ativa'
                      )}
                      className="px-4"
                    >
                      {vaga.status === 'ativa' ? 'Desativar' : 'Ativar'}
                    </Button>
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