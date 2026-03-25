import { useRuntimeConfig } from '#app'

export function useWhatsApp() {
  const config = useRuntimeConfig()

  function sendMessage(message: string): void {
    const number = config.public.whatsappNumber as string
    const encoded = encodeURIComponent(message)
    const url = `https://wa.me/${number}?text=${encoded}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return { sendMessage }
}
