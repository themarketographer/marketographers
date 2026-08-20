export default function VideoBandaBlock({ props }) {
  return (
    <div className="p-10 text-center">
      <div
        className="mx-auto flex aspect-video max-w-2xl items-center justify-center text-sm opacity-70"
        style={{ background: 'var(--color-primary)', color: 'var(--color-bg)', borderRadius: 'var(--radius)' }}
      >
        [video: {props.clip}]
      </div>
      {props.caption && (
        <p className="mt-3 text-sm opacity-60" style={{ color: 'var(--color-text)' }}>
          {props.caption}
        </p>
      )}
    </div>
  )
}
