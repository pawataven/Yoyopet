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
