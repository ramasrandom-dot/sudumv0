import { ButtonLink } from '@/components/ui'
import PageHero from './PageHero'

export default function NotFound() {
  return (
    <PageHero title="هذه الصفحة خارج المدار" lede="ربما نُقلت أو لم تعد موجودة. ابدئي من الرئيسية أو من صفحة البرنامج.">
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/" variant="light" size="lg">الرئيسية</ButtonLink>
        <ButtonLink to="/program" variant="outline-light" size="lg">البرنامج</ButtonLink>
      </div>
    </PageHero>
  )
}
