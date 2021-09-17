import { formatMoney } from 'accounting';

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function formatPercent(percent: number) {
  return `${formatMoney(percent, '', 1, ',', '.').replace(/\.00$/g, '')}%`;
}

export function formatCurrency(value: number) {
  return formatMoney(value, '$', 2, ',', '.').replace(/\.00$/g, '')
}

export function formatNumber(value: number) {
  return formatMoney(value, '', 2, ',', '.').replace(/\.00$/g, '')
}
