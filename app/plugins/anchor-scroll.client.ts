import { defineNuxtPlugin } from '#app'
import { useRouter } from 'vue-router'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  const scrollToHash = (hash: string) => {
    if (!hash) return
    const id = hash.replace('#', '')

    const attempt = (tries = 0) => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (tries < 20) {
        setTimeout(() => attempt(tries + 1), 100)
      }
    }

    attempt()
  }

  // Após hydration completa
  nuxtApp.hook('app:suspense:resolve', () => {
    if (router.currentRoute.value.hash) {
      setTimeout(() => scrollToHash(router.currentRoute.value.hash), 100)
    }
  })

  router.afterEach((to) => {
    if (to.hash) {
      setTimeout(() => scrollToHash(to.hash), 100)
    }
  })
})
