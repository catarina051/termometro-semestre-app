'use client'

import { useEffect, useState } from 'react'
import { ChartBarBig, ChartLine, Layers, Lightbulb, Thermometer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

const ITENS = [
  { id: 'disciplinas', rotulo: 'Disciplinas', curto: 'Disciplinas', Icone: ChartBarBig },
  { id: 'carga', rotulo: 'Carga do semestre', curto: 'Carga', Icone: ChartLine },
  { id: 'combinacoes', rotulo: 'Combinações', curto: 'Combinações', Icone: Layers },
  { id: 'achados', rotulo: 'Achados', curto: 'Achados', Icone: Lightbulb },
] as const

function useSecaoAtiva() {
  const [ativa, setAtiva] = useState<string>(ITENS[0].id)

  useEffect(() => {
    const alvos = ITENS.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (alvos.length === 0) return
    const observer = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas.find((e) => e.isIntersecting)
        if (visivel) setAtiva(visivel.target.id)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    alvos.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return ativa
}

export function SiteNav() {
  const ativa = useSecaoAtiva()

  return (
    <>
      <aside className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-60 shrink-0 flex-col gap-8 rounded-3xl border bg-card p-5 shadow-soft lg:flex">
        <a href="#topo" className="flex items-center gap-2 rounded-full px-2 py-1">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Thermometer className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-brand">Termômetro</span>
        </a>
        <nav aria-label="Seções" className="flex flex-1 flex-col gap-1">
          {ITENS.map(({ id, rotulo, Icone }) => {
            const ativo = ativa === id
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={ativo ? 'location' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
                  ativo
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Icone className="size-4" aria-hidden="true" />
                {rotulo}
              </a>
            )
          })}
        </nav>
        <div className="flex items-center justify-between gap-2 px-2">
          <span className="text-xs text-muted-foreground">UFRN · 2015 a 2019</span>
          <ThemeToggle />
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b bg-card/95 shadow-soft backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-2 px-4 pt-3">
          <a href="#topo" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Thermometer className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-bold tracking-tight text-brand">Termômetro</span>
          </a>
          <ThemeToggle />
        </div>
        <nav aria-label="Seções" className="flex gap-1 overflow-x-auto px-3 py-2.5">
          {ITENS.map(({ id, curto }) => {
            const ativo = ativa === id
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={ativo ? 'location' : undefined}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  ativo
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {curto}
              </a>
            )
          })}
        </nav>
      </header>
    </>
  )
}
