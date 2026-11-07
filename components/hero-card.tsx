import { Info } from 'lucide-react'
import { formatNum } from '@/lib/format'
import type { Avisos, Fonte, Populacao } from '@/lib/types'

function listar(itens: string[]) {
  if (itens.length <= 1) return itens.join('')
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}

export function HeroCard({
  fonte,
  populacao,
  totalDisciplinas,
}: {
  fonte: Fonte
  populacao: Populacao
  totalDisciplinas: number
}) {
  return (
    <section
      aria-labelledby="titulo-destaque"
      className="flex flex-col gap-6 rounded-3xl bg-primary p-6 text-primary-foreground shadow-soft md:p-8"
    >
      <div className="flex flex-col gap-1">
        <h1 id="titulo-destaque" className="text-balance text-xl font-bold tracking-tight md:text-2xl">
          Termômetro do Semestre
        </h1>
        <p className="text-sm font-medium opacity-90">Matrículas analisadas</p>
      </div>
      <p className="text-5xl font-bold tracking-tight md:text-7xl">
        {formatNum(populacao.linhas_analisadas)}
      </p>
      <p className="max-w-2xl text-pretty text-base leading-relaxed md:text-lg">
        Tentativas de matrícula nas {totalDisciplinas} disciplinas mais cursadas do ciclo básico de{' '}
        {listar(fonte.grupos_de_curso)} da {fonte.instituicao}, de {fonte.periodo}, na{' '}
        {fonte.nivel}. Destas, {formatNum(populacao.linhas_calouros)} são de calouros ({populacao.definicao_calouro}).
      </p>
    </section>
  )
}

export function NoticeStrip({ avisos }: { avisos: Avisos }) {
  return (
    <aside
      aria-label="Como ler estes números"
      className="flex gap-3 rounded-3xl border bg-notice p-4 text-notice-foreground md:p-5"
    >
      <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="flex flex-col gap-1 text-sm leading-relaxed">
        <p>
          <strong className="font-semibold">Unidade: </strong>
          {avisos.unidade}
        </p>
        <p>
          <strong className="font-semibold">Causalidade: </strong>
          {avisos.causalidade}
        </p>
      </div>
    </aside>
  )
}
