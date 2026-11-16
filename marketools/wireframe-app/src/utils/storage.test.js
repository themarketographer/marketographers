import { describe, it, expect, beforeEach } from 'vitest'
import { saveProgress, loadProgress } from './storage'
import { BLOCK_TYPES } from '../data/blockSchema'

const KEY = 'marketools-wireframe-progress-v1'

beforeEach(() => {
  const mem = new Map()
  globalThis.localStorage = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k),
  }
})

describe('storage', () => {
  it('lo que se guarda se recupera igual', () => {
    const state = { wizard: { step: 2 }, canvas: { blocks: [{ id: 'x', type: BLOCK_TYPES[0] }] }, theme: { accent: '#fff' } }
    expect(saveProgress(state)).toBe(true)
    const back = loadProgress()
    expect(back.wizard).toEqual(state.wizard)
    expect(back.canvas).toEqual(state.canvas)
    expect(back.theme).toEqual(state.theme)
  })

  it('una versión distinta o un texto que no es JSON devuelve null sin lanzar error', () => {
    localStorage.setItem(KEY, JSON.stringify({ version: 2, canvas: { blocks: [] } }))
    expect(loadProgress()).toBeNull()
    localStorage.setItem(KEY, 'esto no es json {')
    expect(loadProgress()).toBeNull()
  })
})
