'use client'

import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Achado } from '@/lib/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, SectionShell } from './section-shell'

const componentes: Components = {
  p: ({ children }) => <p className="text-pretty leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  table: ({ children }) => (
    <div className="my-1 overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-[36rem] text-left text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  th: ({ children }) => <th className="px-3 py-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-t px-3 py-2 tabular-nums">{children}</td>,
}

function Texto({ conteudo }: { conteudo: string }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentes}>
        {conteudo}
      </ReactMarkdown>
    </div>
  )
}

function Bloco({ rotulo, conteudo }: { rotulo: string; conteudo: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold tracking-wide text-brand uppercase">{rotulo}</p>
      <Texto conteudo={conteudo} />
    </div>
  )
}

export function AchadosSection({ achados }: { achados: Achado[] }) {
  return (
    <SectionShell
      id="achados"
      titulo="Achados"
      descricao="Os quatro resultados principais da análise, cada um com o número, o que ele significa e até onde ele vale."
    >
      <Card className="py-2 md:py-3">
        <Accordion>
          {achados.map((a) => (
            <AccordionItem key={a.id} value={String(a.id)}>
              <AccordionTrigger className="items-center gap-3 py-4 text-base font-semibold hover:no-underline">
                <span className="text-pretty">{a.titulo}</span>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-5 pb-5">
                <Bloco rotulo="O número" conteudo={a.numero} />
                <Bloco rotulo="E daí?" conteudo={a.e_dai} />
                <Bloco rotulo="Limitação" conteudo={a.limitacao} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </SectionShell>
  )
}
