import { NextRequest, NextResponse } from 'next/server'
import { getVaga, updateVaga, deleteVaga } from '@/lib/supabase'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const vaga = await getVaga(id)
    return NextResponse.json(vaga)
  } catch {
    return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const vaga = await updateVaga(id, body)
    return NextResponse.json(vaga)
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error)
    return NextResponse.json({ error: 'Erro ao atualizar vaga' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteVaga(id)
    return NextResponse.json({ message: 'Vaga deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar vaga:', error)
    return NextResponse.json({ error: 'Erro ao deletar vaga' }, { status: 500 })
  }
}