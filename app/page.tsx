import { carregarDados } from '@/lib/data'
import { SiteNav } from '@/components/site-nav'
import { HeroCard, NoticeStrip } from '@/components/hero-card'
import { DisciplinasSection } from '@/components/disciplinas-section'
import { CargaSection } from '@/components/carga-section'
import { CombinacoesSection } from '@/components/combinacoes-section'
import { AchadosSection } from '@/components/achados-section'
import { ErrorState, SiteFooter } from '@/components/site-footer'

export default async function Page() {
  const resultado = await carregarDados()

  return (
    <div id="topo" className="mx-auto flex w-full max-w-[90rem] flex-col lg:flex-row lg:gap-6 lg:p-4">
      <SiteNav />
      <main className="flex min-w-0 flex-1 flex-col gap-10 px-4 py-5 lg:px-0 lg:py-0">
        {resultado.ok ? (
          <>
            <div className="flex flex-col gap-3">
              <HeroCard
                fonte={resultado.dados.fonte}
                populacao={resultado.dados.populacao}
                totalDisciplinas={resultado.dados.disciplinas.length}
              />
              <NoticeStrip avisos={resultado.dados.avisos} />
            </div>
            <DisciplinasSection disciplinas={resultado.dados.disciplinas} />
            <CargaSection curva={resultado.dados.curva_carga} />
            <CombinacoesSection pares={resultado.dados.pares} validacao={resultado.dados.validacao} />
            <AchadosSection achados={resultado.dados.achados} />
            <SiteFooter fonte={resultado.dados.fonte} avisos={resultado.dados.avisos} />
          </>
        ) : (
          <ErrorState mensagem={resultado.erro} />
        )}
      </main>
    </div>
  )
}
