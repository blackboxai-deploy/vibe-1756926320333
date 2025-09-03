interface AnalysisRequest {
  vagaDescricao: string
  vagaRequisitos: string
  candidatoDescricao: string
  candidatoLinkedinData?: Record<string, unknown>
}

interface AnalysisResult {
  score: number
  resultado: 'APTO' | 'NÃO APTO'
  relatorio_detalhado: string
}

export async function analyzeCandidate(data: AnalysisRequest): Promise<AnalysisResult> {
  const { vagaDescricao, vagaRequisitos, candidatoDescricao, candidatoLinkedinData } = data

  const systemPrompt = `Você é um especialista em Recursos Humanos com foco em análise de fit entre candidatos e vagas de emprego. 

Sua tarefa é analisar se um candidato tem o perfil adequado para uma vaga específica, considerando:
1. Compatibilidade de experiências profissionais
2. Alinhamento com requisitos técnicos 
3. Nível de senioridade adequado
4. Formação acadêmica relevante
5. Habilidades e competências

INSTRUÇÕES:
- Analise criteriosamente todos os aspectos
- Forneça um score de 0 a 100 (números inteiros apenas)
- Score >= 70 = APTO, Score < 70 = NÃO APTO
- Seja específico nos pontos fortes e fracos
- Justifique sua decisão com exemplos concretos

FORMATO DE RESPOSTA (JSON):
{
  "score": número_inteiro,
  "resultado": "APTO" ou "NÃO APTO",
  "relatorio_detalhado": "análise detalhada com pontos específicos"
}`

  const userPrompt = `ANÁLISE DE FIT CANDIDATO-VAGA

=== VAGA ===
Descrição: ${vagaDescricao}
Requisitos: ${vagaRequisitos}

=== CANDIDATO ===
Descrição: ${candidatoDescricao}
${candidatoLinkedinData ? `Dados LinkedIn: ${JSON.stringify(candidatoLinkedinData, null, 2)}` : ''}

Por favor, realize a análise de fit e responda no formato JSON especificado.`

  try {
    const response = await fetch(process.env.AI_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CustomerId': process.env.AI_CUSTOMER_ID!,
        'Authorization': process.env.AI_AUTHORIZATION!
      },
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-sonnet-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    const content = result.choices[0]?.message?.content

    if (!content) {
      throw new Error('Resposta vazia da API')
    }

    // Parse do JSON de resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Formato de resposta inválido')
    }

    const analysis = JSON.parse(jsonMatch[0])
    
    // Validação dos dados
    if (typeof analysis.score !== 'number' || 
        !['APTO', 'NÃO APTO'].includes(analysis.resultado) || 
        typeof analysis.relatorio_detalhado !== 'string') {
      throw new Error('Dados de análise inválidos')
    }

    return {
      score: Math.round(analysis.score),
      resultado: analysis.resultado,
      relatorio_detalhado: analysis.relatorio_detalhado
    }
  } catch (error) {
    console.error('Erro na análise de IA:', error)
    throw new Error('Falha na análise de IA: ' + error)
  }
}

export const defaultSystemPrompt = `Você é um especialista em Recursos Humanos com foco em análise de fit entre candidatos e vagas de emprego. 

Sua tarefa é analisar se um candidato tem o perfil adequado para uma vaga específica, considerando:
1. Compatibilidade de experiências profissionais
2. Alinhamento com requisitos técnicos 
3. Nível de senioridade adequado
4. Formação acadêmica relevante
5. Habilidades e competências

INSTRUÇÕES:
- Analise criteriosamente todos os aspectos
- Forneça um score de 0 a 100 (números inteiros apenas)
- Score >= 70 = APTO, Score < 70 = NÃO APTO
- Seja específico nos pontos fortes e fracos
- Justifique sua decisão com exemplos concretos

FORMATO DE RESPOSTA (JSON):
{
  "score": número_inteiro,
  "resultado": "APTO" ou "NÃO APTO",
  "relatorio_detalhado": "análise detalhada com pontos específicos"
}`