import type { ShippingAddress } from '~/types/address'

export function formatNumber(value: number) {
  return value.toLocaleString('th-TH')
}

// th-TH defaults to the Buddhist calendar (2569); the design shows Gregorian years (2026)
const thaiShortDateFormatter = new Intl.DateTimeFormat('th-TH-u-ca-gregory', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

export function formatThaiShortDate(isoDate: string) {
  return thaiShortDateFormatter.format(new Date(isoDate))
}

const thaiShortMonthFormatter = new Intl.DateTimeFormat('th-TH', { month: 'short' })

export function formatThaiShortMonth(isoDate: string) {
  return thaiShortMonthFormatter.format(new Date(isoDate))
}

const thaiMonthYearFormatter = new Intl.DateTimeFormat('th-TH-u-ca-gregory', { month: 'short', year: 'numeric' })

export function formatThaiMonthYear(isoDate: string) {
  return thaiMonthYearFormatter.format(new Date(isoDate))
}

const thaiDayMonthFormatter = new Intl.DateTimeFormat('th-TH-u-ca-gregory', { day: 'numeric', month: 'short' })

export function formatThaiDayMonth(isoDate: string) {
  return thaiDayMonthFormatter.format(new Date(isoDate))
}

export function formatThaiDateRange({ from, to }: { from: string, to: string }) {
  const isSameYear = from.slice(0, 4) === to.slice(0, 4)
  const fromLabel = isSameYear ? formatThaiDayMonth(from) : formatThaiShortDate(from)
  return `${fromLabel} – ${formatThaiShortDate(to)}`
}

const thaiDayFormatter = new Intl.DateTimeFormat('th-TH-u-ca-gregory', { day: 'numeric' })
const thaiShortMonthYearFormatter = new Intl.DateTimeFormat('th-TH-u-ca-gregory', { month: 'short', year: 'numeric' })
const thaiLongMonthYearFormatter = new Intl.DateTimeFormat('th-TH-u-ca-gregory', { month: 'long', year: 'numeric' })
const thaiLongDateFormatter = new Intl.DateTimeFormat('th-TH-u-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric' })

// Same month: "1–30 พ.ย. 2026" (short) or "1 – 30 พฤศจิกายน 2026" (long); otherwise both dates in full
export function formatThaiDateSpan(from: string, to: string, monthStyle: 'short' | 'long' = 'short') {
  const isSameMonth = from.slice(0, 7) === to.slice(0, 7)
  if (!isSameMonth) {
    return monthStyle === 'long'
      ? `${thaiLongDateFormatter.format(new Date(from))} – ${thaiLongDateFormatter.format(new Date(to))}`
      : formatThaiDateRange({ from, to })
  }
  const monthYearFormatter = monthStyle === 'long' ? thaiLongMonthYearFormatter : thaiShortMonthYearFormatter
  const days = `${thaiDayFormatter.format(new Date(from))}${monthStyle === 'long' ? ' – ' : '–'}${thaiDayFormatter.format(new Date(to))}`
  return `${days} ${monthYearFormatter.format(new Date(to))}`
}

export function formatThaiLongMonthYear(isoDate: string) {
  return thaiLongMonthYearFormatter.format(new Date(isoDate))
}

export function toLocalIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function daysUntilEndOf(isoDate: string, now = new Date()) {
  const endOfDay = new Date(`${isoDate}T23:59:59`)
  return Math.max(0, Math.ceil((endOfDay.getTime() - now.getTime()) / MS_PER_DAY))
}

export function formatPetAge(birthDate: string, now = new Date()) {
  const born = new Date(birthDate)
  const ageInMonths = (now.getFullYear() - born.getFullYear()) * 12 + (now.getMonth() - born.getMonth()) - (now.getDate() < born.getDate() ? 1 : 0)
  if (ageInMonths < 1) return 'แรกเกิด'
  if (ageInMonths < 12) return `${ageInMonths} เดือน`
  return `${Math.floor(ageInMonths / 12)} ปี`
}

export function formatRelativeTimeThai(isoDate: string, now = new Date()) {
  const elapsedMinutes = Math.max(0, Math.floor((now.getTime() - new Date(isoDate).getTime()) / 60000))
  if (elapsedMinutes < 1) return 'เมื่อสักครู่'
  if (elapsedMinutes < 60) return `${elapsedMinutes} นาที`
  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours} ชม.`
  const elapsedDays = Math.floor(elapsedHours / 24)
  if (elapsedDays === 1) return 'เมื่อวาน'
  if (elapsedDays < 7) return `${elapsedDays} วันก่อน`
  const elapsedWeeks = Math.floor(elapsedDays / 7)
  if (elapsedWeeks < 5) return `${elapsedWeeks} สัปดาห์`
  return formatThaiShortDate(isoDate)
}

const BANGKOK_PROVINCE = 'กรุงเทพมหานคร'

// Bangkok addresses use แขวง/เขต; every other province uses ต./อ./จ.
export function formatThaiAddress(address: ShippingAddress) {
  const isBangkok = address.province === BANGKOK_PROVINCE
  return [
    address.addressLine,
    isBangkok ? `แขวง${address.subdistrict}` : `ต.${address.subdistrict}`,
    isBangkok ? `เขต${address.district}` : `อ.${address.district}`,
    isBangkok ? 'กรุงเทพฯ' : `จ.${address.province}`,
    address.postalCode
  ].join(' ')
}
