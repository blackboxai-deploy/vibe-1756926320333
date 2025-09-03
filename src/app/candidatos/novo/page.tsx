'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import Link from "next/link"

export default function NovoCandidatoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    linkedin_url: '',
    descricao: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.linkedin_url.trim()) {
      newErrors.linkedin_url = 'URL do LinkedIn é obrigatória'
    } else if (!/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(formData.linkedin_url)) {
      newErrors.linkedin_url = 'URL do LinkedIn deve estar no formato: https://linkedin.com/in/username'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/candidatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/candidatos')
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (error) {
      alert('Erro ao criar candidato')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
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
              <p className="text-gray-600">Novo Candidato</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/candidatos">
                <Button variant="outline">Voltar para Candidatos</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Candidato</h1>
          <p className="text-gray-600">Preencha as informações do candidato para análise</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Candidato</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Ex: João Silva Santos"
                  className={errors.nome ? 'border-red-500' : ''}
                />
                {errors.nome && <p className="text-sm text-red-600">{errors.nome}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Ex: joao.silva@email.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL *</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/seu-username"
                  className={errors.linkedin_url ? 'border-red-500' : ''}
                />
                {errors.linkedin_url && <p className="text-sm text-red-600">{errors.linkedin_url}</p>}
                <p className="text-sm text-gray-500">
                  URL do perfil público do LinkedIn (será usado para extração de dados)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Resumo/Descrição do Candidato</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  placeholder="Descreva a experiência, habilidades principais, objetivos de carreira..."
                  rows={6}
                />
                <p className="text-sm text-gray-500">
                  Opcional: Informações adicionais que complementem o perfil LinkedIn
                </p>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-end space-x-4">
                  <Link href="/candidatos">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Candidato'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* LinkedIn Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Dicas sobre o LinkedIn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Formato correto da URL:</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <code className="text-sm text-green-600">https://linkedin.com/in/nome-usuario</code>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">O que será extraído:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Experiências profissionais</li>
                  <li>• Formação acadêmica</li>
                  <li>• Habilidades principais</li>
                  <li>• Headline profissional</li>
                  <li>• Resumo do perfil</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Importante:</h4>
                <p className="text-sm text-blue-700">
                  Certifique-se de que o perfil do LinkedIn está público e atualizado para uma melhor análise de fit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}