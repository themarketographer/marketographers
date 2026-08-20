export default function EmbedBlock({ props }) {
  return (
    <div className="p-10">
      {props.title && (
        <h2 className="mb-4 text-center text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          {props.title}
        </h2>
      )}
      <div
        className="mx-auto flex max-w-xl items-center justify-center border border-dashed text-sm opacity-60"
        style={{ height: props.heightHint, borderRadius: 'var(--radius)', borderColor: 'var(--color-text)', color: 'var(--color-text)' }}
      >
        [embed: {props.embedCode || 'sin código/URL todavía'}]
      </div>
    </div>
  )
}
