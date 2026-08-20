export default function FooterBlock({ props }) {
  return (
    <div className="flex flex-col items-center gap-1 p-8 text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
      {props.logoImageUrl ? (
        <img src={props.logoImageUrl} alt={props.logo} className="mb-1 h-7 max-w-[120px] object-contain" />
      ) : (
        <p className="font-semibold">{props.logo}</p>
      )}
      <p>{props.socials}</p>
      <p>{props.links}</p>
    </div>
  )
}
