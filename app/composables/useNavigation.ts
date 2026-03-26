import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app'

export function useNavigation() {
  const router = useRouter()
  const config = useRuntimeConfig()

  function scrollToSection(id: string): void {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function goHome(): void {
    if (router.currentRoute.value.path !== '/') {
      router.push('/').then(() => {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150)
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function goSobre(): void {
    if (router.currentRoute.value.path !== '/') {
      router.push('/sobre')
    } else {
      scrollToSection('sobre')
    }
  }

  function goProjetos(): void {
    if (router.currentRoute.value.path !== '/') {
      router.push('/').then(() => setTimeout(() => scrollToSection('projetos'), 200))
    } else {
      scrollToSection('projetos')
    }
  }

  function goServicos(): void {
    if (router.currentRoute.value.path !== '/') {
      router.push('/').then(() => setTimeout(() => scrollToSection('services-grid'), 200))
    } else {
      scrollToSection('services-grid')
    }
  }

  function goOrcamento(): void {
    const numero = config.public.whatsappNumber as string
    const msg = encodeURIComponent('Olá, gostaria de solicitar um orçamento.')
    window.open('https://wa.me/' + numero + '?text=' + msg, '_blank')
  }

  function goCliente(): void {
    router.push('/login')
  }

  return {
    scrollToSection,
    goHome,
    goSobre,
    goProjetos,
    goServicos,
    goOrcamento,
    goCliente,
  }
}
