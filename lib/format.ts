const cache = new Map<number, Intl.NumberFormat>()

function formatter(casas: number) {
  let f = cache.get(casas)
  if (!f) {
    f = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas,
    })
    cache.set(casas, f)
  }
  return f
}

export function formatNum(valor: number, casas = 0) {
  return formatter(casas).format(valor)
}

export function formatPct(valor: number, casas = 1) {
  return `${formatNum(valor, casas)}%`
}

export function formatPp(valor: number, casas = 1, comSinal = false) {
  const texto = formatNum(valor, casas)
  return `${comSinal && valor > 0 ? '+' : ''}${texto} pp`
}

export function formatIntervalo(
  [inferior, superior]: [number, number],
  casas = 1,
  sufixo = '',
) {
  return `${formatNum(inferior, casas)}${sufixo} a ${formatNum(superior, casas)}${sufixo}`
}
