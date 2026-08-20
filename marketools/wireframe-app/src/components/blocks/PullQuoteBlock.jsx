import { renderEmphasis } from '../../utils/textEmphasis'

export default function PullQuoteBlock({ props }) {
  return (
    <div className="mx-auto max-w-xl p-10 text-center">
      <p className="text-2xl font-medium leading-snug" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        “{renderEmphasis(props.quote)}”
      </p>
      <p className="mt-4 text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>
        {props.author}
        {props.role && <span className="ml-1 font-normal opacity-70">— {props.role}</span>}
      </p>
    </div>
  )
}
