import pnuWhite from '@/assets/brand/pnu-logo-white.svg'

export interface Partner {
  name: string
  logo: string
  /** width ÷ height of the logo file */
  ratio: number
  /** true when the file is a single-colour (white) mark that should be drawn in navy */
  tint?: boolean
}

/**
 * Real partners only. Add an entry here (name + logo file in src/assets/brand) when a
 * partner's logo arrives; the bar fills the remaining slots with «شعار شريك» placeholders.
 */
export const PARTNERS: Partner[] = [
  { name: 'جامعة الأميرة نورة بنت عبدالرحمن', logo: pnuWhite, ratio: 1080 / 357.6, tint: true },
]

/** The bar always shows at least this many items, padding with placeholders. */
export const PARTNER_SLOTS = 7
