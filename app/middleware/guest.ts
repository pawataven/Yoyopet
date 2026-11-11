export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn.value) {
    return navigateTo(safeRedirectPath(to.query.redirect))
  }
})
