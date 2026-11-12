const THAI_MOBILE_PATTERN = /^0[689]\d{8}$/

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function isValidThaiMobile(value: string) {
  return THAI_MOBILE_PATTERN.test(digitsOnly(value))
}

export function formatThaiMobile(value: string) {
  const digits = digitsOnly(value).slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function maskThaiMobile(value: string) {
  const digits = digitsOnly(value)
  return `${digits.slice(0, 2)}x-xxx-${digits.slice(6)}`
}
