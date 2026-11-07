import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SectionShell({
  id,
  titulo,
  descricao,
  children,
}: {
  id: string
  titulo: string
  descricao?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="flex flex-col gap-4">
      <header className="flex flex-col gap-1 px-1">
        <h2 id={`${id}-titulo`} className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
          {titulo}
        </h2>
        {descricao ? (
          <p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">{descricao}</p>
        ) : null}
      </header>
      {children}
    </section>
  )
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-3xl border bg-card p-4 text-card-foreground shadow-soft md:p-6', className)}>
      {children}
    </div>
  )
}
