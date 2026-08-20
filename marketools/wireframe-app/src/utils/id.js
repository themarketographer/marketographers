export function makeId(prefix = 'blk') {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}
