import HeaderBlock from './HeaderBlock'
import HeroBlock from './HeroBlock'
import ProblemBlock from './ProblemBlock'
import ProcessBlock from './ProcessBlock'
import PromiseBlock from './PromiseBlock'
import PortfolioBlock from './PortfolioBlock'
import VslBlock from './VslBlock'
import TestimonialsBlock from './TestimonialsBlock'
import PricingBlock from './PricingBlock'
import FaqBlock from './FaqBlock'
import AboutBlock from './AboutBlock'
import FinalCtaBlock from './FinalCtaBlock'
import FooterBlock from './FooterBlock'
import TrustBarBlock from './TrustBarBlock'
import StatsBlock from './StatsBlock'
import GuaranteeBlock from './GuaranteeBlock'
import LeadMagnetBlock from './LeadMagnetBlock'

const REGISTRY = {
  header: HeaderBlock,
  hero: HeroBlock,
  problem: ProblemBlock,
  process: ProcessBlock,
  promise: PromiseBlock,
  portfolio: PortfolioBlock,
  vsl: VslBlock,
  testimonials: TestimonialsBlock,
  pricing: PricingBlock,
  faq: FaqBlock,
  about: AboutBlock,
  finalCta: FinalCtaBlock,
  footer: FooterBlock,
  trustBar: TrustBarBlock,
  stats: StatsBlock,
  guarantee: GuaranteeBlock,
  leadMagnet: LeadMagnetBlock,
}

export default function BlockRenderer({ block, previewMode }) {
  const Component = REGISTRY[block.type]
  if (!Component) return <div className="p-4 text-red-600">Tipo de bloque desconocido: {block.type}</div>
  return <Component props={block.props} variant={block.variant} previewMode={previewMode} />
}
