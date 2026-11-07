import { FlaskConical } from 'lucide-react'
import { formatIntervalo, formatNum, formatPct, formatPp } from '@/lib/format'
import type { Pares, Validacao } from '@/lib/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, SectionShell } from './section-shell'

function Candidatos({ candidatos }: { candidatos: Pares['candidatos'] }) {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold tracking-tight">Candidatos a “par de risco”</h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Para cada par, a barra mostra quantos dos alunos que cursaram as duas disciplinas juntas
          estavam repetindo a segunda.
        </p>
      </div>
      <ul className="flex flex-col gap-4">
        {candidatos.map((c) => (
          <li key={`${c.disciplina}-${c.cursada_junto_com}`} className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className="text-pretty text-sm font-medium">
                {c.nome} <span className="text-muted-foreground">com</span> {c.nome_par}
              </p>
              <p className="text-sm font-bold">{formatPct(c.pct_repetindo_a_outra)}</p>
            </div>
            <div
              className="h-3 w-full overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={`${formatPct(c.pct_repetindo_a_outra)} repetindo ${c.nome_par}`}
            >
              <div
                className="h-full rounded-full bg-series-a"
                style={{ width: `${Math.min(c.pct_repetindo_a_outra, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNum(c.alunos_com_par)} alunos com o par · repetindo {c.nome_par} ·{' '}
              {formatNum(c.alunos_com_par_na_primeira_vez)} com as duas na primeira vez
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function Sobreviventes({
  sobreviventes,
  validacao,
}: {
  sobreviventes: Pares['sobreviventes']
  validacao: Validacao
}) {
  const { revisado } = validacao
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold tracking-tight">O que sobrou depois das checagens</h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Comparações com as duas disciplinas na primeira vez e pelo menos 100 alunos em cada grupo.
          “Diferença” é quanto a reprovação de quem cursou com o par ficou acima da de quem cursou sem ele.
        </p>
      </div>

      <div
        role="note"
        className="flex gap-3 rounded-2xl border bg-notice p-4 text-sm leading-relaxed text-notice-foreground"
      >
        <FlaskConical className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p>
          <strong className="font-semibold">Hipótese, não recomendação. </strong>
          Estes pares mostram uma associação que se manteve nos testes; não indicam que uma disciplina
          cause reprovação na outra nem servem como orientação de grade.
        </p>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {sobreviventes.map((s) => (
          <li key={`${s.disciplina}-${s.cursada_junto_com}`} className="flex flex-col gap-2 rounded-2xl border p-4">
            <p className="text-sm font-semibold text-pretty">
              {s.nome} <span className="font-normal text-muted-foreground">com</span> {s.nome_par}
            </p>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Diferença</dt>
                <dd className="font-bold">{formatPp(s.dif_pp, 1, true)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">IC 95%</dt>
                <dd>{formatIntervalo(s.ic, 1, ' pp')}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Alunos com / sem</dt>
                <dd>
                  {formatNum(s.alunos_com_par)} / {formatNum(s.alunos_sem_par)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Confirma na validação</dt>
                <dd>{formatPct(s.pct_confirma_na_validacao, 0)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Disciplina</TableHead>
              <TableHead>Cursada junto com</TableHead>
              <TableHead className="text-right">Alunos com / sem</TableHead>
              <TableHead className="text-right">Diferença</TableHead>
              <TableHead className="text-right">IC 95%</TableHead>
              <TableHead className="text-right">Confirma na validação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sobreviventes.map((s) => (
              <TableRow key={`${s.disciplina}-${s.cursada_junto_com}`}>
                <TableCell className="whitespace-normal font-medium">{s.nome}</TableCell>
                <TableCell className="whitespace-normal">{s.nome_par}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNum(s.alunos_com_par)} / {formatNum(s.alunos_sem_par)}
                </TableCell>
                <TableCell className="text-right font-bold tabular-nums">{formatPp(s.dif_pp, 1, true)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatIntervalo(s.ic, 1, ' pp')}</TableCell>
                <TableCell className="text-right tabular-nums">{formatPct(s.pct_confirma_na_validacao, 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
        Em {formatNum(revisado.divisoes)} divisões aleatórias dos alunos, o efeito médio dos pares finalistas
        foi de {formatPp(revisado.efeito_descoberta_pp)} na metade de descoberta e de{' '}
        {formatPp(revisado.efeito_validacao_pp)} na metade de validação (inflação de{' '}
        {formatPp(revisado.inflacao_pp)}). A validação mede essa inflação por seleção, mas não elimina
        confundimento.
      </p>
    </Card>
  )
}

export function CombinacoesSection({ pares, validacao }: { pares: Pares; validacao: Validacao }) {
  return (
    <SectionShell
      id="combinacoes"
      titulo="Cursar duas disciplinas juntas costuma significar estar atrasado"
      descricao="Na maioria dos pares que parecem reprovar mais quando cursados juntos, quem cursou as duas estava repetindo uma delas."
    >
      <div className="flex flex-col gap-4">
        <Candidatos candidatos={pares.candidatos} />
        <Sobreviventes sobreviventes={pares.sobreviventes} validacao={validacao} />
      </div>
    </SectionShell>
  )
}
