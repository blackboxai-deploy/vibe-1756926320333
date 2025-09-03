'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation'
import Link from "next/link"
import { Vaga, Candidato } from '@/lib/supabase'

export default function NovaAnalisePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [candidatos, setCandidatos] = useState<Candidato[]>([])
  
  const [selectedVaga, setSelectedVaga] = useState('')
  const [selectedCandidato, setSelectedCandidato] = useState('')

  useEffect(() => {
    fetchData()
    
    // Pre-selecionar candidato se vier da URL
    const candidatoId = searchParams.get('candidato')
    if (candidatoId) {
      setSelectedCandidato(candidatoId)
    }
  }, [searchParams])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [vagasRes, candidatosRes] = await Promise.all([
        fetch('/api/vagas'),
        fetch('/api/candidatos')
      ])
      
      const [vagasData, candidatosData] = await Promise.all([
        vagasRes.json(),
        candidatosRes.json()
      ])
      
      // Filtrar apenas vagas ativas
      setVagas(vagasData.filter((v: Vaga) => v.status === 'ativa'))
      setCandidatos(candidatosData)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedVaga || !selectedCandidato) {
      alert('Selecione uma vaga e um candidato')
      return
    }

    setAnalyzing(true)
    
    try {
      const response = await fetch('/api/analise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vaga_id: selectedVaga,
          candidato_id: selectedCandidato
        })
      })

      if (response.ok) {
        const analise = await response.json()
        router.push(`/analises/${analise.id}`)
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (error) {
      alert('Erro ao realizar análise')
      console.error('Erro:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const vagaSelecionada = vagas.find(v => v.id === selectedVaga)
  const candidatoSelecionado = candidatos.find(c => c.id === selectedCandidato)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando dados...</p>
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
              <p className="text-gray-600">Nova Análise</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/analises">
                <Button variant="outline">Voltar para Análises</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Realizar Nova Análise</h1>
          <p className="text-gray-600">Selecione uma vaga e candidato para análise de fit</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seleção */}
          <Card>
            <CardHeader>
              <CardTitle>Seleção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Vaga *</Label>
                <Select value={selectedVaga} onValueChange={setSelectedVaga}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma vaga" />
                  </SelectTrigger>
                  <SelectContent>
                    {vagas.map((vaga) => (
                      <SelectItem key={vaga.id} value={vaga.id}>
                        {vaga.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {vagas.length === 0 && (
                  <p className="text-sm text-red-600">Nenhuma vaga ativa encontrada</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Candidato *</Label>
                <Select value={selectedCandidato} onValueChange={setSelectedCandidato}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um candidato" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidatos.map((candidato) => (
                      <SelectItem key={candidato.id} value={candidato.id}>
                        {candidato.nome} - {candidato.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {candidatos.length === 0 && (
                  <p className="text-sm text-red-600">Nenhum candidato encontrado</p>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!selectedVaga || !selectedCandidato || analyzing}
                  className="w-full"
                >
                  {analyzing ? 'Analisando...' : 'Realizar Análise'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <div className="space-y-6">
            {/* Vaga Preview */}
            {vagaSelecionada && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vaga Selecionada</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-2">{vagaSelecionada.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {vagaSelecionada.descricao}
                  </p>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Requisitos:</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {vagaSelecionada.requisitos}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Candidato Preview */}
            {candidatoSelecionado && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Candidato Selecionado</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-2">{candidatoSelecionado.nome}</h3>
                  <p className="text-sm text-gray-600 mb-3">{candidatoSelecionado.email}</p>
                  
                  {candidatoSelecionado.descricao && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {candidatoSelecionado.descricao}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">LinkedIn:</h4>
                    <a 
                      href={candidatoSelecionado.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Ver perfil
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Analyzing State */}
        {analyzing && (
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="text-center py-8">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Análise em Andamento</h3>
              <p className="text-blue-700 mb-4">
                Nossa IA está analisando o fit entre o candidato e a vaga...
              </p>
              <div className="text-sm text-blue-600">
                <p>• Extraindo dados do LinkedIn</p>
                <p>• Comparando perfil com requisitos</p>
                <p>• Gerando relatório detalhado</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        {!selectedVaga && !selectedCandidato && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/vagas/nova">
                  <Button variant="outline" className="w-full">
                    Criar Nova Vaga
                  </Button>
                </Link>
                <Link href="/candidatos/novo">
                  <Button variant="outline" className="w-full">
                    Cadastrar Candidato
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}