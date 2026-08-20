import { renderEmphasis } from '../../utils/textEmphasis'

export default function ProblemBlock({ props }) {
  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h2>
      <p className="mx-auto mt-3 max-w-xl opacity-80" style={{ color: 'var(--color-text)' }}>
        {renderEmphasis(props.body)}
      </p>
    </div>
  )
}
