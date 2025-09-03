import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

// Mock client se não houver configurações reais
const shouldUseMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                     process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url_here'

export const supabase = shouldUseMock 
  ? null  // Will be handled in functions
  : createClient(supabaseUrl, supabaseKey)

// Types para as tabelas
export interface Vaga {
  id: string
  titulo: string
  descricao: string
  requisitos: string
  responsabilidades?: string
  status: 'ativa' | 'inativa'
  created_at: string
}

export interface Candidato {
  id: string
  nome: string
  email: string
  linkedin_url: string
  descricao?: string
  created_at: string
}

export interface Analise {
  id: string
  vaga_id: string
  candidato_id: string
  score: number
  resultado: 'APTO' | 'NÃO APTO'
  relatorio_detalhado: string
  linkedin_data?: Record<string, unknown>
  created_at: string
}

// Funções de banco de dados
export async function getVagas() {
  if (!supabase) {
    // Mock data for demo
    return [
      {
        id: '1',
        titulo: 'Desenvolvedor Full Stack Sênior',
        descricao: 'Vaga para desenvolvedor experiente em uma startup de tecnologia em crescimento.',
        requisitos: 'Mínimo 5 anos de experiência em desenvolvimento web. React, Node.js, TypeScript.',
        responsabilidades: 'Desenvolver e manter aplicações web complexas.',
        status: 'ativa' as const,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        titulo: 'Designer UX/UI Pleno',
        descricao: 'Buscamos um designer criativo para integrar nosso time de produto.',
        requisitos: 'Experiência mínima de 3 anos em UX/UI. Figma, Adobe XD.',
        responsabilidades: 'Criar wireframes, protótipos e interfaces.',
        status: 'ativa' as const,
        created_at: new Date().toISOString()
      }
    ]
  }
  
  const { data, error } = await supabase
    .from('vagas')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Vaga[]
}

export async function getVaga(id: string) {
  if (!supabase) {
    const vagas = await getVagas()
    const vaga = vagas.find(v => v.id === id)
    if (!vaga) throw new Error('Vaga não encontrada')
    return vaga
  }
  
  const { data, error } = await supabase
    .from('vagas')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Vaga
}

export async function createVaga(vaga: Omit<Vaga, 'id' | 'created_at'>) {
  if (!supabase) {
    // Mock creation
    const newVaga: Vaga = {
      ...vaga,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    }
    return newVaga
  }
  
  const { data, error } = await supabase
    .from('vagas')
    .insert(vaga)
    .select()
    .single()
  
  if (error) throw error
  return data as Vaga
}

export async function updateVaga(id: string, vaga: Partial<Vaga>) {
  if (!supabase) {
    const existingVaga = await getVaga(id)
    return { ...existingVaga, ...vaga }
  }
  
  const { data, error } = await supabase
    .from('vagas')
    .update(vaga)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Vaga
}

export async function deleteVaga(id: string) {
  if (!supabase) {
    return // Mock deletion
  }
  
  const { error } = await supabase
    .from('vagas')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getCandidatos() {
  if (!supabase) {
    return [
      {
        id: '1',
        nome: 'Ana Silva Costa',
        email: 'ana.silva@email.com',
        linkedin_url: 'https://linkedin.com/in/ana-silva-dev',
        descricao: 'Desenvolvedora Full Stack com 6 anos de experiência.',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        nome: 'Carlos Mendes',
        email: 'carlos.mendes@email.com',
        linkedin_url: 'https://linkedin.com/in/carlos-mendes-designer',
        descricao: 'Designer UX/UI com forte background em pesquisa de usuário.',
        created_at: new Date().toISOString()
      }
    ]
  }
  
  const { data, error } = await supabase
    .from('candidatos')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Candidato[]
}

export async function getCandidato(id: string) {
  const { data, error } = await supabase
    .from('candidatos')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Candidato
}

export async function createCandidato(candidato: Omit<Candidato, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('candidatos')
    .insert(candidato)
    .select()
    .single()
  
  if (error) throw error
  return data as Candidato
}

export async function updateCandidato(id: string, candidato: Partial<Candidato>) {
  const { data, error } = await supabase
    .from('candidatos')
    .update(candidato)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Candidato
}

export async function deleteCandidato(id: string) {
  const { error } = await supabase
    .from('candidatos')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getAnalises() {
  const { data, error } = await supabase
    .from('analises')
    .select(`
      *,
      vaga:vagas(titulo),
      candidato:candidatos(nome)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getAnalise(id: string) {
  const { data, error } = await supabase
    .from('analises')
    .select(`
      *,
      vaga:vagas(*),
      candidato:candidatos(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createAnalise(analise: Omit<Analise, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('analises')
    .insert(analise)
    .select()
    .single()
  
  if (error) throw error
  return data as Analise
}