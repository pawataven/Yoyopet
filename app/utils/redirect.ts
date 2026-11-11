// Only same-site paths: "//evil.com" and absolute URLs would turn the login redirect into an open redirect
export function safeRedirectPath(redirect: unknown, fallback = '/') {
  if (typeof redirect !== 'string') return fallback
  if (!redirect.startsWith('/') || redirect.startsWith('//') || redirect.startsWith('/\\')) return fallback
  return redirect
}
