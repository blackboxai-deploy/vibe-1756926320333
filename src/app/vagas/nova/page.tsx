'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import Link from "next/link"

export default function NovaVagaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    responsabilidades: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/vagas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/vagas')
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (error) {
      alert('Erro ao criar vaga')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
              <p className="text-gray-600">Nova Vaga</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/vagas">
                <Button variant="outline">Voltar para Vagas</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Criar Nova Vaga</h1>
          <p className="text-gray-600">Preencha as informações da vaga para análise de candidatos</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Vaga</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título da Vaga *</Label>
                <Input
                  id="titulo"
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  placeholder="Ex: Desenvolvedor Full Stack Sênior"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição da Vaga *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  placeholder="Descreva a vaga, empresa, ambiente de trabalho, benefícios..."
                  rows={6}
                  required
                />
                <p className="text-sm text-gray-500">
                  Seja detalhado. Esta informação será usada para análise de fit.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requisitos">Requisitos *</Label>
                <Textarea
                  id="requisitos"
                  value={formData.requisitos}
                  onChange={(e) => handleChange('requisitos', e.target.value)}
                  placeholder="Liste os requisitos obrigatórios e desejáveis..."
                  rows={5}
                  required
                />
                <p className="text-sm text-gray-500">
                  Inclua tecnologias, experiência mínima, formação, habilidades específicas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsabilidades">Responsabilidades</Label>
                <Textarea
                  id="responsabilidades"
                  value={formData.responsabilidades}
                  onChange={(e) => handleChange('responsabilidades', e.target.value)}
                  placeholder="Descreva as principais responsabilidades do cargo..."
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  Opcional: Atividades que o candidato irá desempenhar no dia a dia.
                </p>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-end space-x-4">
                  <Link href="/vagas">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Vaga'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Dicas para uma boa descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Descrição da Vaga:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Contexto da empresa e do time</li>
                  <li>• Modalidade de trabalho (remoto/híbrido/presencial)</li>
                  <li>• Benefícios oferecidos</li>
                  <li>• Cultura organizacional</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Requisitos:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tecnologias específicas e versões</li>
                  <li>• Tempo mínimo de experiência</li>
                  <li>• Formação acadêmica</li>
                  <li>• Certificações desejadas</li>
                  <li>• Idiomas necessários</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}