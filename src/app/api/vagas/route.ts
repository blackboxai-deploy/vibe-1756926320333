import { NextRequest, NextResponse } from 'next/server'
import { getVagas, createVaga } from '@/lib/supabase'

export async function GET() {
  try {
    const vagas = await getVagas()
    return NextResponse.json(vagas)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar vagas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titulo, descricao, requisitos, responsabilidades } = body

    if (!titulo || !descricao || !requisitos) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: titulo, descricao, requisitos' },
        { status: 400 }
      )
    }

    const vaga = await createVaga({
      titulo,
      descricao,
      requisitos,
      responsabilidades: responsabilidades || '',
      status: 'ativa'
    })

    return NextResponse.json(vaga, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar vaga:', error)
    return NextResponse.json({ error: 'Erro ao criar vaga' }, { status: 500 })
  }
}