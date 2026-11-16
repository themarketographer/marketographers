import { describe, it, expect } from 'vitest'
import { parseRow } from './parseRow'

describe('parseRow', () => {
  it('separa por barra y recorta espacios', () => {
    expect(parseRow('Boda | Desde $500 | Incluye 2 horas', 3)).toEqual(['Boda', 'Desde $500', 'Incluye 2 horas'])
  })
  it('rellena con vacío si faltan partes', () => {
    expect(parseRow('Retrato | Desde $200', 3)).toEqual(['Retrato', 'Desde $200', ''])
  })
  it('recorta si sobran partes y tolera null', () => {
    expect(parseRow('a | b | c | d', 2)).toEqual(['a', 'b'])
    expect(parseRow(null, 2)).toEqual(['', ''])
  })
})
