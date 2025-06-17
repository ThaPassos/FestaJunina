export function getMoedas(): number {
  const moedas = localStorage.getItem('moedas');
  return moedas ? parseInt(moedas, 10) : 0;
}

export function setMoedas(valor: number): void {
  localStorage.setItem('moedas', valor.toString());
}

export function addMoedas(qtd: number): void {
  const atual = getMoedas();
  setMoedas(atual + qtd);
}