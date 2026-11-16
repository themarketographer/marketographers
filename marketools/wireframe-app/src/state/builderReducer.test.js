import { describe, it, expect } from 'vitest'
import { builderReducer } from './builderReducer'
import { initialState } from './initialState'
import { BLOCK_TYPES } from '../data/blockSchema'

const ids = (s) => s.canvas.blocks.map((b) => b.id)
const add = (s, type) => builderReducer(s, { type: 'BLOCK_ADD', blockType: type })

describe('builderReducer: bloques', () => {
  it('agrega, mueve, duplica y borra en el orden esperado', () => {
    let s = { ...initialState, canvas: { blocks: [] } }
    s = add(s, BLOCK_TYPES[0])
    s = add(s, BLOCK_TYPES[1])
    s = add(s, BLOCK_TYPES[2])
    const [a, b, c] = ids(s)
    expect(ids(s)).toEqual([a, b, c])

    s = builderReducer(s, { type: 'BLOCK_MOVE', blockId: c, toIndex: 0 })
    expect(ids(s)).toEqual([c, a, b])

    s = builderReducer(s, { type: 'BLOCK_DUPLICATE', blockId: a })
    expect(s.canvas.blocks).toHaveLength(4)
    expect(s.canvas.blocks[1].id).toBe(a)
    expect(s.canvas.blocks[2].type).toBe(s.canvas.blocks[1].type)
    expect(s.canvas.blocks[2].id).not.toBe(a)

    s = builderReducer(s, { type: 'BLOCK_REMOVE', blockId: a })
    expect(ids(s)).not.toContain(a)
    expect(s.canvas.blocks).toHaveLength(3)
  })

  it('una acción desconocida devuelve el mismo estado', () => {
    expect(builderReducer(initialState, { type: 'NO_EXISTE' })).toBe(initialState)
  })
})
