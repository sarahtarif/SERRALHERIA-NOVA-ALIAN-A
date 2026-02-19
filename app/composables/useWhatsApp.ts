export const useWhatsApp = () => {
  const config = useRuntimeConfig()
  const whatsappNumber = config.public.whatsappNumber as string

  const sendMessage = (message: string) => {
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(url, '_blank')
  }

  const createServiceMessage = (params: {
    service: string
    neighborhood?: string
    gateType?: string
    preferredTime?: string
    name?: string
  }) => {
    let message = `Olá! Gostaria de solicitar um orçamento para:\n\n`
    message += `Serviço: ${params.service}\n`
    
    if (params.name) message += `Nome: ${params.name}\n`
    if (params.neighborhood) message += `Bairro: ${params.neighborhood}\n`
    if (params.gateType) message += `Tipo de portão: ${params.gateType}\n`
    if (params.preferredTime) message += `Melhor horário: ${params.preferredTime}\n`
    
    message += `\nAguardo retorno. Obrigado!`
    
    return message
  }

  return {
    sendMessage,
    createServiceMessage,
    whatsappNumber
  }
}
