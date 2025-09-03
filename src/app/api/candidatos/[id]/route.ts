import { NextRequest, NextResponse } from 'next/server'
import { getCandidato, updateCandidato, deleteCandidato } from '@/lib/supabase'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const candidato = await getCandidato(id)
    return NextResponse.json(candidato)
  } catch {
    return NextResponse.json({ error: 'Candidato não encontrado' }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const candidato = await updateCandidato(id, body)
    return NextResponse.json(candidato)
  } catch (error) {
    console.error('Erro ao atualizar candidato:', error)
    return NextResponse.json({ error: 'Erro ao atualizar candidato' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteCandidato(id)
    return NextResponse.json({ message: 'Candidato deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar candidato:', error)
    return NextResponse.json({ error: 'Erro ao deletar candidato' }, { status: 500 })
  }
}