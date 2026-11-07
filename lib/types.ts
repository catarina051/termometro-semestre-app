export type Intervalo = [number, number]

export interface Fonte {
  instituicao: string
  origem: string
  periodo: string
  nivel: string
  grupos_de_curso: string[]
}

export interface Populacao {
  linhas_analisadas: number
  linhas_calouros: number
  definicao_calouro: string
}

export interface Avisos {
  unidade: string
  causalidade: string
  etico: string
}

export interface EquivalenteCefet {
  codigo: string
  nome: string
  cursos: string
  cobertura: string
  correcao: string | null
}

export interface Disciplina {
  codigo: string
  nome: string
  tentativas_concluidas: number
  reprovacao_pct: number
  reprovacao_ic: Intervalo
  desistencia_pct: number
  desistencia_ic: Intervalo
  mapeamento_status: string
  cefet: EquivalenteCefet | null
}

export interface PontoCarga {
  disciplinas_no_semestre: string
  n: number
  taxa_pct: number
  ic: Intervalo
  taxa_padronizada_pct: number
}

export interface CurvaCarga {
  reprovacao: PontoCarga[]
  desistencia: PontoCarga[]
  nao_aprovacao: PontoCarga[]
}

export interface ParCandidato {
  disciplina: string
  nome: string
  cursada_junto_com: string
  nome_par: string
  alunos_com_par: number
  pct_repetindo_a_outra: number
  dif_mh_pp: number
  alunos_com_par_na_primeira_vez: number
}

export interface ParSobrevivente {
  disciplina: string
  nome: string
  cursada_junto_com: string
  nome_par: string
  alunos_com_par: number
  alunos_sem_par: number
  dif_pp: number
  ic: Intervalo
  odds_ratio_sem_carga: number
  or_ic: Intervalo
  p_regressao: number
  divisoes_escolhido: number
  pct_confirma_na_validacao: number
}

export interface Pares {
  candidatos: ParCandidato[]
  sobreviventes: ParSobrevivente[]
}

export interface ResultadoValidacao {
  divisoes: number
  efeito_descoberta_pp: number
  efeito_validacao_pp: number
  inflacao_pp: number
  pct_confirma: number
}

export interface Validacao {
  original: ResultadoValidacao
  revisado: ResultadoValidacao
}

export interface Achado {
  id: number
  titulo: string
  numero: string
  e_dai: string
  limitacao: string
}

export interface Termometro {
  versao?: number
  fonte: Fonte
  populacao: Populacao
  avisos: Avisos
  disciplinas: Disciplina[]
  curva_carga: CurvaCarga
  pares: Pares
  validacao: Validacao
  achados: Achado[]
}
