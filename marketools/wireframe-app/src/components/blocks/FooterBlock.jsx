export default function FooterBlock({ props }) {
  return (
    <div className="flex flex-col items-center gap-1 p-8 text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
      <p className="font-semibold">{props.logo}</p>
      <p>{props.socials}</p>
      <p>{props.links}</p>
    </div>
  )
}
