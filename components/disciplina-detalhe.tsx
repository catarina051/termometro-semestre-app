'use client'

import { useState } from 'react'
import { LoaderCircle, MousePointerClick, Sparkles, TriangleAlert, X } from 'lucide-react'
import { formatIntervalo, formatNum, formatPct } from '@/lib/format'
import type { Disciplina } from '@/lib/types'
import { Card } from './section-shell'

type EstadoExplicacao =
  | { tipo: 'ocioso' }
  | { tipo: 'carregando' }
  | { tipo: 'pronto'; texto: string }
  | { tipo: 'erro'; mensagem: string }

function camposPlanos(d: Disciplina) {
  return Object.fromEntries(
    Object.entries(d).filter(
      ([, valor]) => valor === null || typeof valor !== 'object' || Array.isArray(valor),
    ).filter(([chave]) => chave !== 'cefet'),
  )
}

function extrairTexto(corpo: unknown): string | null {
  if (typeof corpo === 'string') return corpo
  if (corpo && typeof corpo === 'object') {
    const o = corpo as Record<string, unknown>
    for (const chave of ['explicacao', 'texto', 'resposta', 'text', 'message', 'content']) {
      if (typeof o[chave] === 'string') return o[chave] as string
    }
  }
  return null
}

function Metrica({
  rotulo,
  valor,
  detalhe,
  marcador,
}: {
  rotulo: string
  valor: string
  detalhe?: string
  marcador?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-muted p-3">
      <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {marcador}
        {rotulo}
      </dt>
      <dd className="text-2xl font-bold tracking-tight">{valor}</dd>
      {detalhe ? <dd className="text-xs text-muted-foreground">{detalhe}</dd> : null}
    </div>
  )
}

export function DisciplinaDetalhe({
  disciplina,
  aoFechar,
}: {
  disciplina: Disciplina | null
  aoFechar: () => void
}) {
  const [explicacao, setExplicacao] = useState<EstadoExplicacao>({ tipo: 'ocioso' })

  if (!disciplina) {
    return (
      <Card className="flex flex-col items-start gap-3 border-dashed">
        <MousePointerClick className="size-5 text-muted-foreground" aria-hidden="true" />
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Clique numa barra do gráfico ou escolha uma disciplina na lista para ver os números completos.
        </p>
      </Card>
    )
  }

  async function explicar(d: Disciplina) {
    setExplicacao({ tipo: 'carregando' })
    try {
      const res = await fetch('/api/explicar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topico: 'disciplina', numeros: camposPlanos(d) }),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      const tipo = res.headers.get('content-type') ?? ''
      const texto = tipo.includes('application/json')
        ? extrairTexto(await res.json())
        : await res.text()
      if (!texto || !texto.trim()) throw new Error('resposta vazia')
      setExplicacao({ tipo: 'pronto', texto: texto.trim() })
    } catch {
      setExplicacao({
        tipo: 'erro',
        mensagem: 'Não foi possível gerar a explicação agora. Os números acima continuam valendo.',
      })
    }
  }

  const { cefet } = disciplina

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-wide text-brand">{disciplina.codigo}</p>
          <h3 className="text-balance text-xl font-bold tracking-tight">{disciplina.nome}</h3>
          <p className="text-sm text-muted-foreground">
            {formatNum(disciplina.tentativas_concluidas)} tentativas concluídas
          </p>
        </div>
        <button
          type="button"
          onClick={aoFechar}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          aria-label="Fechar detalhes da disciplina"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-2">
        <Metrica
          rotulo="Reprovação"
          valor={formatPct(disciplina.reprovacao_pct, 2)}
          detalhe={`IC 95%: ${formatIntervalo(disciplina.reprovacao_ic, 2, '%')}`}
          marcador={<span className="h-2.5 w-4 rounded-full bg-series-a" aria-hidden="true" />}
        />
        <Metrica
          rotulo="Desistência"
          valor={formatPct(disciplina.desistencia_pct, 2)}
          detalhe={`IC 95%: ${formatIntervalo(disciplina.desistencia_ic, 2, '%')}`}
          marcador={
            <svg width="10" height="10" aria-hidden="true">
              <path d="M 5 0 L 10 5 L 5 10 L 0 5 Z" className="fill-series-b" />
            </svg>
          }
        />
      </dl>

      {cefet ? (
        <div className="flex flex-col gap-1 rounded-2xl border p-3 text-sm leading-relaxed">
          <p>
            <span className="font-semibold">Equivalente no CEFET-MG: </span>
            {cefet.nome} ({cefet.codigo})
          </p>
          <p className="text-muted-foreground">
            Cobertura {cefet.cobertura} · {cefet.cursos}
          </p>
          {cefet.correcao ? <p className="text-muted-foreground">{cefet.correcao}</p> : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => explicar(disciplina)}
          disabled={explicacao.tipo === 'carregando'}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-70"
        >
          {explicacao.tipo === 'carregando' ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="size-4" aria-hidden="true" />
          )}
          Explicar em linguagem simples
        </button>

        <div aria-live="polite" className="text-sm leading-relaxed">
          {explicacao.tipo === 'carregando' ? (
            <p className="text-muted-foreground">Preparando a explicação…</p>
          ) : null}
          {explicacao.tipo === 'pronto' ? (
            <div className="whitespace-pre-line rounded-2xl bg-accent p-4 text-accent-foreground">
              {explicacao.texto}
            </div>
          ) : null}
          {explicacao.tipo === 'erro' ? (
            <p className="flex gap-2 rounded-2xl border border-destructive/40 p-3 text-destructive" role="alert">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {explicacao.mensagem}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
