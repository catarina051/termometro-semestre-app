'use client'

import { useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatIntervalo, formatNum, formatPct } from '@/lib/format'
import type { CurvaCarga, PontoCarga } from '@/lib/types'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, SectionShell } from './section-shell'

type Serie = keyof CurvaCarga

const SERIES: { valor: Serie; rotulo: string; descricao: string }[] = [
  {
    valor: 'reprovacao',
    rotulo: 'Reprovação',
    descricao: 'Percentual de reprovação entre as tentativas concluídas, por número de disciplinas no semestre.',
  },
  {
    valor: 'desistencia',
    rotulo: 'Desistência',
    descricao: 'Percentual de trancamento ou desistência formal sobre todas as matrículas, por número de disciplinas no semestre.',
  },
  {
    valor: 'nao_aprovacao',
    rotulo: 'Reprovação ou desistência',
    descricao: 'Percentual de reprovação ou desistência sobre todas as matrículas, por número de disciplinas no semestre.',
  },
]

function Dica({ active, payload }: { active?: boolean; payload?: { payload: PontoCarga }[] }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="flex flex-col gap-0.5 rounded-2xl border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-soft">
      <p className="font-semibold">{p.disciplinas_no_semestre} disciplina(s) no semestre</p>
      <p>
        Taxa: <strong>{formatPct(p.taxa_pct)}</strong>
      </p>
      <p className="text-muted-foreground">IC 95%: {formatIntervalo(p.ic, 1, '%')}</p>
      <p className="text-muted-foreground">{formatNum(p.n)} matrículas</p>
    </div>
  )
}

export function CargaSection({ curva }: { curva: CurvaCarga }) {
  const [serie, setSerie] = useState<Serie>('reprovacao')
  const atual = SERIES.find((s) => s.valor === serie) ?? SERIES[0]
  const dados = curva[serie]

  return (
    <SectionShell
      id="carga"
      titulo="Carga do semestre"
      descricao="Como as taxas variam conforme o número de disciplinas que o aluno cursou no mesmo semestre."
    >
      <Card className="flex flex-col gap-4">
        <Tabs value={serie} onValueChange={(v) => setSerie(v as Serie)}>
          <TabsList className="h-auto! w-full flex-wrap justify-start gap-1 rounded-full bg-muted p-1 sm:w-fit">
            {SERIES.map((s) => (
              <TabsTrigger
                key={s.valor}
                value={s.valor}
                className="h-9 flex-none rounded-full px-4 data-active:bg-primary! data-active:text-primary-foreground! data-active:shadow-soft"
              >
                {s.rotulo}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{atual.descricao}</p>

        <div className="h-72 w-full md:h-80" role="img" aria-label={`Gráfico de linha: ${atual.descricao}`}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dados} margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
              <CartesianGrid vertical={false} className="stroke-border" strokeDasharray="3 3" />
              <XAxis
                dataKey="disciplinas_no_semestre"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip content={<Dica />} cursor={{ stroke: 'var(--border)' }} />
              <Area
                dataKey="ic"
                stroke="none"
                fill="var(--series-a)"
                fillOpacity={0.18}
                isAnimationActive={false}
                activeDot={false}
              />
              <Line
                dataKey="taxa_pct"
                stroke="var(--series-a)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'var(--card)', stroke: 'var(--series-a)', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="-mt-2 text-center text-xs text-muted-foreground">Disciplinas cursadas no semestre</p>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground" aria-label="Legenda do gráfico">
          <li className="flex items-center gap-2">
            <svg width="24" height="12" aria-hidden="true">
              <line x1="0" x2="24" y1="6" y2="6" strokeWidth="2.5" className="stroke-series-a" />
              <circle cx="12" cy="6" r="3.5" strokeWidth="2" className="fill-card stroke-series-a" />
            </svg>
            Taxa observada
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-6 rounded-sm bg-series-a/20" aria-hidden="true" />
            Intervalo de confiança de 95%
          </li>
        </ul>

        <p className="rounded-2xl bg-muted p-4 text-pretty text-sm leading-relaxed">
          Quem cursa 1 ou 2 disciplinas no semestre costuma ser aluno irregular. Por isso, a curva não
          diz que cursar mais disciplinas reprova menos: cada ponto reúne perfis diferentes de aluno.
        </p>
      </Card>
    </SectionShell>
  )
}
