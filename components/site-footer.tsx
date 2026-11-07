import { Database, ExternalLink, TriangleAlert } from 'lucide-react'
import type { Avisos, Fonte } from '@/lib/types'

const REPO = 'https://github.com/catarina051/termometro-semestre'

function LinkRepo() {
  return (
    <a
      href={REPO}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 font-medium text-brand underline underline-offset-4"
    >
      github.com/catarina051/termometro-semestre
      <ExternalLink className="size-3.5" aria-hidden="true" />
    </a>
  )
}

export function SiteFooter({ fonte, avisos }: { fonte: Fonte; avisos: Avisos }) {
  return (
    <footer className="flex flex-col gap-4 rounded-3xl border bg-card p-5 text-sm leading-relaxed shadow-soft md:p-6">
      <div className="flex gap-3">
        <Database className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p>
          <span className="font-semibold">Fonte: </span>
          {fonte.instituicao}, {fonte.origem}. Período {fonte.periodo}, {fonte.nivel}, cursos de{' '}
          {fonte.grupos_de_curso.join(', ')}.
        </p>
      </div>
      <p>
        <span className="font-semibold">Código e dados: </span>
        <LinkRepo />
      </p>
      <p className="text-pretty text-muted-foreground">{avisos.etico}</p>
    </footer>
  )
}

export function ErrorState({ mensagem }: { mensagem: string }) {
  return (
    <div role="alert" className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-soft md:p-8">
      <span className="flex size-11 items-center justify-center rounded-full bg-notice text-notice-foreground">
        <TriangleAlert className="size-5" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-balance text-2xl font-bold tracking-tight">Os dados não carregaram</h1>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {mensagem} Para não mostrar números errados, a página fica sem gráficos até os dados reais
          voltarem a responder. Tente recarregar daqui a alguns minutos.
        </p>
      </div>
      <p className="text-sm">
        Os dados ficam em <LinkRepo />
      </p>
    </div>
  )
}
