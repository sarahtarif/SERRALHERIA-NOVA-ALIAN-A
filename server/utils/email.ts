// Utilitário para envio de emails de segurança
import nodemailer from 'nodemailer'

interface SecurityAlertData {
  type: 'UNAUTHORIZED_ACCESS' | 'RATE_LIMIT_EXCEEDED' | 'MULTIPLE_FAILED_LOGINS' | 'SUSPICIOUS_ACTIVITY'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  userId?: string
  userEmail?: string
  userRole?: string
  ipAddress: string
  userAgent: string
  route?: string
  details: string
  timestamp: string
  metadata?: Record<string, any>
}

// Criar transporter do nodemailer
const createTransporter = () => {
  const config = useRuntimeConfig()
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.gmailEmail,
      pass: config.gmailAppPassword
    }
  })
}

// Enviar alerta de segurança por email
export const sendSecurityAlert = async (data: SecurityAlertData) => {
  try {
    const config = useRuntimeConfig()
    const transporter = createTransporter()
    
    // Definir emoji e cor baseado na severidade
    const severityConfig = {
      LOW: { emoji: '🟢', color: '#10b981', label: 'Baixa' },
      MEDIUM: { emoji: '🟡', color: '#f59e0b', label: 'Média' },
      HIGH: { emoji: '🟠', color: '#f97316', label: 'Alta' },
      CRITICAL: { emoji: '🔴', color: '#ef4444', label: 'Crítica' }
    }
    
    const severity = severityConfig[data.severity]
    
    // Definir título baseado no tipo
    const typeLabels = {
      UNAUTHORIZED_ACCESS: 'Tentativa de Acesso Não Autorizado',
      RATE_LIMIT_EXCEEDED: 'Limite de Requisições Excedido',
      MULTIPLE_FAILED_LOGINS: 'Múltiplas Tentativas de Login Falhas',
      SUSPICIOUS_ACTIVITY: 'Atividade Suspeita Detectada'
    }
    
    const typeLabel = typeLabels[data.type]
    
    // HTML do email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .severity-badge {
      display: inline-block;
      background-color: ${severity.color};
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 10px;
    }
    .content {
      padding: 30px 20px;
    }
    .alert-type {
      font-size: 20px;
      font-weight: 600;
      color: #1e3a8a;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .info-grid {
      display: grid;
      gap: 15px;
      margin: 20px 0;
    }
    .info-item {
      background-color: #f9fafb;
      padding: 12px 16px;
      border-radius: 6px;
      border-left: 3px solid #3b82f6;
    }
    .info-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 14px;
      color: #111827;
      font-weight: 500;
      word-break: break-all;
    }
    .details-box {
      background-color: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 6px;
      padding: 16px;
      margin: 20px 0;
    }
    .details-box p {
      margin: 0;
      color: #92400e;
      font-size: 14px;
    }
    .metadata {
      background-color: #f3f4f6;
      border-radius: 6px;
      padding: 16px;
      margin: 20px 0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #374151;
      overflow-x: auto;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .action-button {
      display: inline-block;
      background-color: #3b82f6;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .warning {
      background-color: #fef2f2;
      border: 1px solid #fca5a5;
      border-radius: 6px;
      padding: 16px;
      margin: 20px 0;
      color: #991b1b;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${severity.emoji} Alerta de Segurança</h1>
      <div class="severity-badge">Severidade: ${severity.label}</div>
    </div>
    
    <div class="content">
      <div class="alert-type">
        ${typeLabel}
      </div>
      
      <div class="details-box">
        <p><strong>Detalhes:</strong> ${data.details}</p>
      </div>
      
      <div class="info-grid">
        ${data.userEmail ? `
        <div class="info-item">
          <div class="info-label">Usuário</div>
          <div class="info-value">${data.userEmail}</div>
        </div>
        ` : ''}
        
        ${data.userRole ? `
        <div class="info-item">
          <div class="info-label">Role</div>
          <div class="info-value">${data.userRole}</div>
        </div>
        ` : ''}
        
        <div class="info-item">
          <div class="info-label">Endereço IP</div>
          <div class="info-value">${data.ipAddress}</div>
        </div>
        
        ${data.route ? `
        <div class="info-item">
          <div class="info-label">Rota Tentada</div>
          <div class="info-value">${data.route}</div>
        </div>
        ` : ''}
        
        <div class="info-item">
          <div class="info-label">User-Agent</div>
          <div class="info-value">${data.userAgent}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">Timestamp</div>
          <div class="info-value">${new Date(data.timestamp).toLocaleString('pt-BR', {
            dateStyle: 'full',
            timeStyle: 'long'
          })}</div>
        </div>
      </div>
      
      ${data.metadata && Object.keys(data.metadata).length > 0 ? `
      <div class="metadata">
        <strong>Metadata:</strong><br>
        ${JSON.stringify(data.metadata, null, 2)}
      </div>
      ` : ''}
      
      ${data.severity === 'HIGH' || data.severity === 'CRITICAL' ? `
      <div class="warning">
        <strong>⚠️ Ação Recomendada:</strong><br>
        Este é um alerta de alta prioridade. Recomenda-se investigação imediata e possível bloqueio do IP ${data.ipAddress}.
      </div>
      ` : ''}
      
      <center>
        <a href="https://novalianca.vercel.app/sys/mgmt/dashboard-v2" class="action-button">
          Acessar Painel Admin
        </a>
      </center>
    </div>
    
    <div class="footer">
      <p><strong>Nova Aliança - Sistema de Segurança</strong></p>
      <p>Este é um email automático. Não responda a esta mensagem.</p>
      <p>Para mais informações, acesse o painel administrativo.</p>
    </div>
  </div>
</body>
</html>
    `
    
    // Texto plano (fallback)
    const textContent = `
ALERTA DE SEGURANÇA - ${severity.label.toUpperCase()}

${typeLabel}

Detalhes: ${data.details}

Informações:
${data.userEmail ? `- Usuário: ${data.userEmail}` : ''}
${data.userRole ? `- Role: ${data.userRole}` : ''}
- IP: ${data.ipAddress}
${data.route ? `- Rota: ${data.route}` : ''}
- User-Agent: ${data.userAgent}
- Timestamp: ${new Date(data.timestamp).toLocaleString('pt-BR')}

${data.severity === 'HIGH' || data.severity === 'CRITICAL' ? 
  '\n⚠️ AÇÃO RECOMENDADA: Este é um alerta de alta prioridade. Investigação imediata recomendada.\n' : ''}

---
Nova Aliança - Sistema de Segurança
Este é um email automático.
    `
    
    // Enviar email
    const info = await transporter.sendMail({
      from: `"Nova Aliança Security" <${config.gmailEmail}>`,
      to: config.securityAlertEmail,
      subject: `${severity.emoji} [${severity.label}] ${typeLabel}`,
      text: textContent,
      html: htmlContent
    })
    
    console.log('[EMAIL] Alerta de segurança enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
    
  } catch (error) {
    console.error('[EMAIL] Erro ao enviar alerta:', error)
    return { success: false, error: error.message }
  }
}

// Enviar resumo diário de segurança
export const sendDailySecuritySummary = async (stats: {
  totalAccesses: number
  unauthorizedAttempts: number
  blockedIPs: number
  failedLogins: number
  date: string
}) => {
  try {
    const config = useRuntimeConfig()
    const transporter = createTransporter()
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .stat-card { background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #e5e7eb; }
    .stat-value { font-size: 32px; font-weight: bold; color: #1e3a8a; }
    .stat-label { font-size: 14px; color: #6b7280; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Resumo Diário de Segurança</h1>
    <p>${stats.date}</p>
  </div>
  
  <div style="padding: 20px;">
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.totalAccesses}</div>
        <div class="stat-label">Acessos Admin</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.unauthorizedAttempts}</div>
        <div class="stat-label">Tentativas Não Autorizadas</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.blockedIPs}</div>
        <div class="stat-label">IPs Bloqueados</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.failedLogins}</div>
        <div class="stat-label">Logins Falhos</div>
      </div>
    </div>
  </div>
</body>
</html>
    `
    
    await transporter.sendMail({
      from: `"Nova Aliança Security" <${config.gmailEmail}>`,
      to: config.securityAlertEmail,
      subject: `📊 Resumo Diário de Segurança - ${stats.date}`,
      html: htmlContent
    })
    
    console.log('[EMAIL] Resumo diário enviado')
    return { success: true }
    
  } catch (error) {
    console.error('[EMAIL] Erro ao enviar resumo:', error)
    return { success: false, error: error.message }
  }
}
