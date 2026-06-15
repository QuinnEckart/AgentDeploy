export type FlowStep =
  | 'welcome'
  | 'linking'
  | 'summary'
  | 'questions'
  | 'analyzing'
  | 'architecture'
  | 'deploying'
  | 'deployed'
  | 'console'

export type StepperPhase = 'connect' | 'analyze' | 'configure' | 'review' | 'deploy' | 'operate'

export type ConsoleTab = 'overview' | 'infrastructure' | 'operations' | 'cost' | 'terraform'

export interface ChatMessage {
  id: string
  role: 'agent' | 'user' | 'system'
  type: 'text' | 'structured'
  content: string
  structured?: { label: string; value: string }[]
  timestamp: Date
}

export interface FollowUpQuestion {
  id: string
  question: string
  options: string[]
}

export interface InfraComponent {
  id: string
  name: string
  type: string
  description: string
  status: 'recommended' | 'provisioned' | 'healthy' | 'warning'
  monthlyCost: number
  icon: string
  optional?: boolean
  enabled?: boolean
}

export interface Day2Operation {
  id: string
  title: string
  description: string
  category: 'security' | 'scaling' | 'observability' | 'configuration'
  recommended: boolean
}

export interface ArchitecturePlan {
  repoName: string
  framework: string
  region: string
  components: InfraComponent[]
  totalMonthlyCost: number
  estimatedTraffic: string
  highAvailability: boolean
}

export interface DetectedSignal {
  label: string
  value: string
  confidence: 'high' | 'medium'
}

export interface MockRepo {
  id: string
  fullName: string
  framework: string
  lastUpdated: string
}

export type ProvisioningStep = {
  id: string
  label: string
  status: 'pending' | 'active' | 'complete'
}
