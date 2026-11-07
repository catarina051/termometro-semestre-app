import type { Termometro } from './types'

export const DADOS_URL =
  'https://raw.githubusercontent.com/catarina051/termometro-semestre/main/dados/termometro.json'

export type ResultadoDados =
  | { ok: true; dados: Termometro }
  | { ok: false; erro: string }

function formatoValido(d: unknown): d is Termometro {
  if (!d || typeof d !== 'object') return false
  const t = d as Partial<Termometro>
  return Boolean(
    t.fonte &&
      t.populacao &&
      typeof t.populacao.linhas_analisadas === 'number' &&
      t.avisos &&
      Array.isArray(t.disciplinas) &&
      t.curva_carga &&
      Array.isArray(t.curva_carga.reprovacao) &&
      Array.isArray(t.curva_carga.desistencia) &&
      Array.isArray(t.curva_carga.nao_aprovacao) &&
      t.pares &&
      Array.isArray(t.pares.candidatos) &&
      Array.isArray(t.pares.sobreviventes) &&
      t.validacao &&
      Array.isArray(t.achados),
  )
}

export async function carregarDados(): Promise<ResultadoDados> {
  try {
    const res = await fetch(DADOS_URL, { next: { revalidate: 3600 } })
    if (!res.ok) {
      return { ok: false, erro: `O servidor de dados respondeu com status ${res.status}.` }
    }
    const json: unknown = await res.json()
    if (!formatoValido(json)) {
      return { ok: false, erro: 'O arquivo de dados chegou num formato inesperado.' }
    }
    return { ok: true, dados: json }
  } catch {
    return { ok: false, erro: 'Não foi possível conectar ao repositório de dados.' }
  }
}
