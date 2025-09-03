'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FitAnalyzer</h1>
              <p className="text-gray-600">Sistema de Análise de Fit de Candidatos</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/vagas">
                <Button variant="outline">Vagas</Button>
              </Link>
              <Link href="/candidatos">
                <Button variant="outline">Candidatos</Button>
              </Link>
              <Link href="/analises">
                <Button variant="outline">Análises</Button>
              </Link>
              <Link href="/configuracoes">
                <Button variant="outline">Configurações</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vagas</CardTitle>
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">8 ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidatos</CardTitle>
              <div className="w-4 h-4 bg-green-100 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">+23 esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Análises Realizadas</CardTitle>
              <div className="w-4 h-4 bg-purple-100 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
              <div className="w-4 h-4 bg-orange-100 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67%</div>
              <p className="text-xs text-muted-foreground">+5% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesse rapidamente as principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/vagas/nova">
                <Button className="w-full justify-start" variant="outline">
                  Cadastrar Nova Vaga
                </Button>
              </Link>
              <Link href="/candidatos/novo">
                <Button className="w-full justify-start" variant="outline">
                  Cadastrar Candidato
                </Button>
              </Link>
              <Link href="/analises/nova">
                <Button className="w-full justify-start">
                  Realizar Nova Análise
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Análises Recentes</CardTitle>
              <CardDescription>
                Últimas análises de fit realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-gray-600">Desenvolvedor Frontend</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">85%</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maria Santos</p>
                    <p className="text-sm text-gray-600">UX Designer</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">45%</span>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Carlos Oliveira</p>
                    <p className="text-sm text-gray-600">Backend Developer</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">92%</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Como Começar</CardTitle>
            <CardDescription>
              Siga estes passos para configurar seu sistema de análise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">1</div>
                <h3 className="font-medium mb-2">Configure o Banco</h3>
                <p className="text-sm text-gray-600">Setup das tabelas no Supabase</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">2</div>
                <h3 className="font-medium mb-2">Cadastre Vagas</h3>
                <p className="text-sm text-gray-600">Adicione as vagas disponíveis</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">3</div>
                <h3 className="font-medium mb-2">Analise Candidatos</h3>
                <p className="text-sm text-gray-600">Use a IA para análise de fit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}