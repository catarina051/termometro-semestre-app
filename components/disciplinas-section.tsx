'use client'

import { useMemo, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { formatPct } from '@/lib/format'
import type { Disciplina } from '@/lib/types'
import { Card, SectionShell } from './section-shell'
import { DisciplinaDetalhe } from './disciplina-detalhe'

const ALTURA_LINHA = 56

interface FormaProps {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: Disciplina
}

function criarForma(selecionada: string | null, aoSelecionar: (codigo: string) => void) {
  return function Forma({ x = 0, y = 0, width = 0, payload }: FormaProps) {
    if (!payload || payload.reprovacao_pct <= 0) return null
    const pxPorPonto = width / payload.reprovacao_pct
    const escala = (v: number) => x + v * pxPorPonto
    const ativa = selecionada === payload.codigo

    const yNome = y + 14
    const yBarra = y + 21
    const alturaBarra = 12
    const yCentroBarra = yBarra + alturaBarra / 2
    const yDesist = y + 44

    const [rLo, rHi] = payload.reprovacao_ic
    const [dLo, dHi] = payload.desistencia_ic
    const xDesist = escala(payload.desistencia_pct)

    return (
      <g
        className="cursor-pointer"
        onClick={() => aoSelecionar(payload.codigo)}
        aria-hidden="true"
      >
        <rect x={x} y={y + 2} width="100%" height={ALTURA_LINHA - 4} fill="transparent" />
        <text
          x={x}
          y={yNome}
          className={ativa ? 'fill-brand' : 'fill-foreground'}
          fontSize={12.5}
          fontWeight={ativa ? 700 : 500}
        >
          {payload.nome}
        </text>
        <rect
          x={x}
          y={yBarra}
          width={width}
          height={alturaBarra}
          rx={6}
          className="fill-series-a"
          opacity={selecionada && !ativa ? 0.45 : 1}
        />
        {(['stroke-card', 'stroke-foreground'] as const).map((cor, i) => (
          <g key={cor} className={cor} strokeWidth={i === 0 ? 4 : 1.5} strokeLinecap="round">
            <line x1={escala(rLo)} x2={escala(rHi)} y1={yCentroBarra} y2={yCentroBarra} />
            <line x1={escala(rLo)} x2={escala(rLo)} y1={yBarra - 3} y2={yBarra + alturaBarra + 3} />
            <line x1={escala(rHi)} x2={escala(rHi)} y1={yBarra - 3} y2={yBarra + alturaBarra + 3} />
          </g>
        ))}
        <text x={escala(rHi) + 6} y={yCentroBarra + 4} className="fill-foreground" fontSize={12} fontWeight={700}>
          {formatPct(payload.reprovacao_pct)}
        </text>

        <g className="stroke-series-b" strokeWidth={1.5}>
          <line x1={escala(dLo)} x2={escala(dHi)} y1={yDesist} y2={yDesist} />
        </g>
        <path
          d={`M ${xDesist} ${yDesist - 5} L ${xDesist + 5} ${yDesist} L ${xDesist} ${yDesist + 5} L ${xDesist - 5} ${yDesist} Z`}
          className="fill-series-b stroke-card"
          strokeWidth={1}
        />
        <text x={escala(dHi) + 8} y={yDesist + 4} className="fill-muted-foreground" fontSize={11}>
          {formatPct(payload.desistencia_pct)}
        </text>
      </g>
    )
  }
}

function Legenda() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground" aria-label="Legenda do gráfico">
      <li className="flex items-center gap-2">
        <span className="h-3 w-6 rounded-full bg-series-a" aria-hidden="true" />
        Reprovação (barra)
      </li>
      <li className="flex items-center gap-2">
        <svg width="24" height="12" aria-hidden="true" className="stroke-foreground">
          <line x1="2" x2="22" y1="6" y2="6" strokeWidth="1.5" />
          <line x1="2" x2="2" y1="1" y2="11" strokeWidth="1.5" />
          <line x1="22" x2="22" y1="1" y2="11" strokeWidth="1.5" />
        </svg>
        Intervalo de confiança de 95%
      </li>
      <li className="flex items-center gap-2">
        <svg width="24" height="12" aria-hidden="true">
          <line x1="1" x2="23" y1="6" y2="6" strokeWidth="1.5" className="stroke-series-b" />
          <path d="M 12 1 L 17 6 L 12 11 L 7 6 Z" className="fill-series-b" />
        </svg>
        Desistência (losango, com IC 95%)
      </li>
    </ul>
  )
}

export function DisciplinasSection({ disciplinas }: { disciplinas: Disciplina[] }) {
  const ordenadas = useMemo(
    () => [...disciplinas].sort((a, b) => b.reprovacao_pct - a.reprovacao_pct),
    [disciplinas],
  )
  const [selecionada, setSelecionada] = useState<string | null>(null)
  const atual = ordenadas.find((d) => d.codigo === selecionada) ?? null
  const Forma = useMemo(() => criarForma(selecionada, setSelecionada), [selecionada])

  return (
    <SectionShell
      id="disciplinas"
      titulo="Disciplinas"
      descricao="Percentual de tentativas concluídas que terminaram em reprovação, da maior para a menor, com o percentual de desistência logo abaixo de cada barra. Clique numa disciplina para ver os números dela."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="flex flex-col gap-4">
          <Legenda />
          <div style={{ height: ordenadas.length * ALTURA_LINHA + 8 }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ordenadas}
                layout="vertical"
                margin={{ top: 0, right: 56, bottom: 0, left: 0 }}
                barCategoryGap={0}
                accessibilityLayer={false}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="codigo" hide />
                <Bar dataKey="reprovacao_pct" shape={<Forma />} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Ou escolha pela lista
            <select
              value={selecionada ?? ''}
              onChange={(e) => setSelecionada(e.target.value || null)}
              className="h-11 w-full rounded-full border border-input bg-background px-4 text-sm text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <option value="">Selecione uma disciplina</option>
              {ordenadas.map((d) => (
                <option key={d.codigo} value={d.codigo}>
                  {d.nome} ({d.codigo})
                </option>
              ))}
            </select>
          </label>
        </Card>
        <div className="xl:sticky xl:top-4 xl:self-start">
          <DisciplinaDetalhe key={atual?.codigo ?? 'vazio'} disciplina={atual} aoFechar={() => setSelecionada(null)} />
        </div>
      </div>
    </SectionShell>
  )
}
