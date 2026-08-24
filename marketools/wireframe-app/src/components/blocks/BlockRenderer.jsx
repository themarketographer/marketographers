import HeaderBlock from './HeaderBlock'
import HeroBlock from './HeroBlock'
import ProblemBlock from './ProblemBlock'
import ProcessBlock from './ProcessBlock'
import PromiseBlock from './PromiseBlock'
import PortfolioBlock from './PortfolioBlock'
import BeforeAfterBlock from './BeforeAfterBlock'
import VslBlock from './VslBlock'
import VideoBandaBlock from './VideoBandaBlock'
import TestimonialsBlock from './TestimonialsBlock'
import PricingBlock from './PricingBlock'
import FaqBlock from './FaqBlock'
import AboutBlock from './AboutBlock'
import ExclusividadBlock from './ExclusividadBlock'
import FinalCtaBlock from './FinalCtaBlock'
import FooterBlock from './FooterBlock'
import TrustBarBlock from './TrustBarBlock'
import StatsBlock from './StatsBlock'
import GuaranteeBlock from './GuaranteeBlock'
import GarantiasBlock from './GarantiasBlock'
import AddonsBlock from './AddonsBlock'
import ProximosPasosBlock from './ProximosPasosBlock'
import FormasPagoBlock from './FormasPagoBlock'
import LeadMagnetBlock from './LeadMagnetBlock'
import PullQuoteBlock from './PullQuoteBlock'
import EmbedBlock from './EmbedBlock'

const REGISTRY = {
  header: HeaderBlock,
  hero: HeroBlock,
  problem: ProblemBlock,
  process: ProcessBlock,
  promise: PromiseBlock,
  portfolio: PortfolioBlock,
  beforeAfter: BeforeAfterBlock,
  vsl: VslBlock,
  videoBanda: VideoBandaBlock,
  testimonials: TestimonialsBlock,
  pricing: PricingBlock,
  faq: FaqBlock,
  about: AboutBlock,
  exclusividad: ExclusividadBlock,
  finalCta: FinalCtaBlock,
  footer: FooterBlock,
  trustBar: TrustBarBlock,
  stats: StatsBlock,
  guarantee: GuaranteeBlock,
  garantias: GarantiasBlock,
  addons: AddonsBlock,
  proximosPasos: ProximosPasosBlock,
  formasPago: FormasPagoBlock,
  leadMagnet: LeadMagnetBlock,
  pullQuote: PullQuoteBlock,
  embed: EmbedBlock,
}

export default function BlockRenderer({ block, previewMode }) {
  const Component = REGISTRY[block.type]
  if (!Component) return <div className="p-4 text-red-600">Tipo de bloque desconocido: {block.type}</div>
  return <Component props={block.props} variant={block.variant} previewMode={previewMode} />
}
