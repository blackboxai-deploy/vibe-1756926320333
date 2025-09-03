import { NextRequest, NextResponse } from 'next/server'
import { getCandidatos, createCandidato } from '@/lib/supabase'

export async function GET() {
  try {
    const candidatos = await getCandidatos()
    return NextResponse.json(candidatos)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar candidatos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, email, linkedin_url, descricao } = body

    if (!nome || !email || !linkedin_url) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, email, linkedin_url' },
        { status: 400 }
      )
    }

    // Validar formato do LinkedIn URL
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
    if (!linkedinRegex.test(linkedin_url)) {
      return NextResponse.json(
        { error: 'URL do LinkedIn deve estar no formato: https://linkedin.com/in/username' },
        { status: 400 }
      )
    }

    const candidato = await createCandidato({
      nome,
      email,
      linkedin_url,
      descricao: descricao || ''
    })

    return NextResponse.json(candidato, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar candidato:', error)
    return NextResponse.json({ error: 'Erro ao criar candidato' }, { status: 500 })
  }
}