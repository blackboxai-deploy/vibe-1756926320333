import { NextRequest, NextResponse } from 'next/server'
import { getVaga, getCandidato, createAnalise, getAnalises } from '@/lib/supabase'
import { analyzeCandidate } from '@/lib/ai-analysis'
import { extractLinkedInData } from '@/lib/linkedin-scraper'

export async function GET() {
  try {
    const analises = await getAnalises()
    return NextResponse.json(analises)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar análises' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vaga_id, candidato_id } = body

    if (!vaga_id || !candidato_id) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: vaga_id, candidato_id' },
        { status: 400 }
      )
    }

    // Buscar dados da vaga e candidato
    const [vaga, candidato] = await Promise.all([
      getVaga(vaga_id),
      getCandidato(candidato_id)
    ])

    // Extrair dados do LinkedIn (opcional)
    let linkedinData = null
    try {
      linkedinData = await extractLinkedInData(candidato.linkedin_url)
    } catch (error) {
      console.warn('Erro ao extrair dados do LinkedIn:', error)
      // Continua mesmo sem os dados do LinkedIn
    }

    // Realizar análise com IA
    const analysis = await analyzeCandidate({
      vagaDescricao: vaga.descricao,
      vagaRequisitos: vaga.requisitos,
      candidatoDescricao: candidato.descricao || '',
      candidatoLinkedinData: linkedinData || undefined
    })

    // Salvar análise no banco
    const analise = await createAnalise({
      vaga_id,
      candidato_id,
      score: analysis.score,
      resultado: analysis.resultado,
      relatorio_detalhado: analysis.relatorio_detalhado,
      linkedin_data: linkedinData || undefined
    })

    return NextResponse.json({
      ...analise,
      vaga: vaga,
      candidato: candidato
    }, { status: 201 })

  } catch (error) {
    console.error('Erro na análise:', error)
    return NextResponse.json(
      { error: `Erro ao realizar análise: ${error}` },
      { status: 500 }
    )
  }
}