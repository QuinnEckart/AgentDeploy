import type {
  FollowUpQuestion,
  ArchitecturePlan,
  Day2Operation,
  DetectedSignal,
  MockRepo,
  InfraComponent,
} from '../types'

export const mockRepos: MockRepo[] = [
  { id: '1', fullName: 'acme-ai/insight-engine', framework: 'Next.js 15', lastUpdated: '2 hours ago' },
  { id: '2', fullName: 'acme-ai/data-pipeline', framework: 'Python / FastAPI', lastUpdated: '1 day ago' },
  { id: '3', fullName: 'acme-ai/vector-search-api', framework: 'Node.js', lastUpdated: '3 days ago' },
]

export const detectedSignals: DetectedSignal[] = [
  { label: 'Framework', value: 'Next.js 15 + Node.js API', confidence: 'high' },
  { label: 'Database ORM', value: 'Prisma → PostgreSQL', confidence: 'high' },
  { label: 'Background jobs', value: 'BullMQ worker queue', confidence: 'high' },
  { label: 'AI / Model calls', value: 'OpenAI SDK', confidence: 'high' },
  { label: 'Object storage', value: 'S3-compatible (AWS SDK)', confidence: 'medium' },
  { label: 'Vector search', value: 'pgvector extension signal', confidence: 'medium' },
  { label: 'Environment secrets', value: '12 env vars detected', confidence: 'high' },
]

export const followUpQuestions: FollowUpQuestion[] = [
  {
    id: 'region',
    question: 'Where should your app be deployed?',
    options: ['New York (NYC3)', 'San Francisco (SFO3)', 'Amsterdam (AMS3)', 'Singapore (SGP1)'],
  },
  {
    id: 'traffic',
    question: 'How much traffic do you expect in the first 90 days?',
    options: ['< 10K requests/day', '10K–100K requests/day', '100K–1M requests/day', '1M+ requests/day'],
  },
  {
    id: 'availability',
    question: 'What availability level do you need?',
    options: ['Single region, standard', 'Single region, high availability', 'Multi-region failover'],
  },
]

const REGIONS = ['New York (NYC3)', 'San Francisco (SFO3)', 'Amsterdam (AMS3)', 'Singapore (SGP1)']

function baseComponents(highAvailability: boolean): InfraComponent[] {
  return [
    {
      id: 'app-platform',
      name: 'App Platform',
      type: 'Runtime',
      description: 'Hosts the Next.js web service and API with auto-deploy from GitHub',
      status: 'recommended',
      monthlyCost: 24,
      icon: 'app',
      enabled: true,
    },
    {
      id: 'worker',
      name: 'Worker Service',
      type: 'Background Jobs',
      description: 'Processes async tasks, embeddings, and scheduled model inference calls',
      status: 'recommended',
      monthlyCost: 18,
      icon: 'worker',
      enabled: true,
    },
    {
      id: 'postgres',
      name: 'Managed PostgreSQL',
      type: 'Database',
      description: 'Primary persistence with pgvector extension for semantic search',
      status: 'recommended',
      monthlyCost: highAvailability ? 60 : 30,
      icon: 'database',
      enabled: true,
    },
    {
      id: 'spaces',
      name: 'Spaces Object Storage',
      type: 'Storage',
      description: 'Stores uploads, generated assets, and model output artifacts',
      status: 'recommended',
      monthlyCost: 5,
      icon: 'storage',
      enabled: true,
    },
    {
      id: 'lb',
      name: 'Load Balancer',
      type: 'Networking',
      description: 'Distributes traffic across App Platform instances with health checks',
      status: 'recommended',
      monthlyCost: 12,
      icon: 'network',
      optional: true,
      enabled: true,
    },
    {
      id: 'vpc',
      name: 'VPC + Firewall',
      type: 'Security',
      description: 'Private networking between services with restricted ingress rules',
      status: 'recommended',
      monthlyCost: 0,
      icon: 'security',
      enabled: true,
    },
    {
      id: 'observability',
      name: 'Observability Stack',
      type: 'Monitoring',
      description: 'Centralized logs, metrics, alerts, and deployment health dashboards',
      status: 'recommended',
      monthlyCost: highAvailability ? 28 : 15,
      icon: 'monitor',
      optional: true,
      enabled: true,
    },
    {
      id: 'secrets',
      name: 'Secrets Manager',
      type: 'Secrets',
      description: 'Stores API keys, database credentials, and model provider tokens',
      status: 'recommended',
      monthlyCost: 20,
      icon: 'secrets',
      enabled: true,
    },
  ]
}

export function calculateTotalCost(components: InfraComponent[]): number {
  return components
    .filter((c) => c.enabled !== false)
    .reduce((sum, c) => sum + c.monthlyCost, 0)
}

export function buildArchitecturePlan(
  repoName: string,
  answers: Record<string, string>
): ArchitecturePlan {
  const highAvailability = answers.availability?.includes('high availability') ?? false
  const traffic = answers.traffic ?? '10K–100K requests/day'
  const components = baseComponents(highAvailability)

  return {
    repoName,
    framework: 'Next.js 15 + Node.js API',
    region: answers.region ?? 'New York (NYC3)',
    estimatedTraffic: traffic,
    highAvailability,
    components,
    totalMonthlyCost: calculateTotalCost(components),
  }
}

export function updatePlanRegion(plan: ArchitecturePlan, region: string): ArchitecturePlan {
  return { ...plan, region }
}

export function updatePlanHA(plan: ArchitecturePlan, highAvailability: boolean): ArchitecturePlan {
  const components = plan.components.map((c) => {
    if (c.id === 'postgres') return { ...c, monthlyCost: highAvailability ? 60 : 30 }
    if (c.id === 'observability') return { ...c, monthlyCost: highAvailability ? 28 : 15 }
    return c
  })
  return {
    ...plan,
    highAvailability,
    components,
    totalMonthlyCost: calculateTotalCost(components),
  }
}

export function togglePlanComponent(plan: ArchitecturePlan, componentId: string): ArchitecturePlan {
  const components = plan.components.map((c) =>
    c.id === componentId && c.optional ? { ...c, enabled: !c.enabled } : c
  )
  return { ...plan, components, totalMonthlyCost: calculateTotalCost(components) }
}

export const regionOptions = REGIONS

export const day2Operations: Day2Operation[] = [
  {
    id: 'rotate-secrets',
    title: 'Rotate API credentials',
    description: 'Roll database passwords and third-party API keys without downtime',
    category: 'security',
    recommended: true,
  },
  {
    id: 'scale-workers',
    title: 'Scale worker instances',
    description: 'Increase background job throughput during peak inference load',
    category: 'scaling',
    recommended: true,
  },
  {
    id: 'enable-ha',
    title: 'Enable database HA',
    description: 'Add a standby node for automatic failover on Managed PostgreSQL',
    category: 'scaling',
    recommended: false,
  },
  {
    id: 'view-logs',
    title: 'Inspect application logs',
    description: 'Stream logs from App Platform, workers, and load balancer health checks',
    category: 'observability',
    recommended: true,
  },
  {
    id: 'cost-alerts',
    title: 'Set cost alerts',
    description: 'Get notified when monthly spend exceeds your budget threshold',
    category: 'observability',
    recommended: true,
  },
  {
    id: 'update-env',
    title: 'Update environment variables',
    description: 'Change runtime configuration and redeploy without touching Terraform',
    category: 'configuration',
    recommended: false,
  },
  {
    id: 'export-tf',
    title: 'Export Terraform plan',
    description: 'Download the underlying IaC for advanced customization or audit',
    category: 'configuration',
    recommended: false,
  },
  {
    id: 'reanalyze',
    title: 'Re-analyze repository',
    description: 'Detect new dependencies or services after significant code changes',
    category: 'configuration',
    recommended: true,
  },
]

export const mockTerraformPreview = `resource "digitalocean_app" "insight_engine" {
  spec {
    name   = "insight-engine"
    region = "nyc3"
    service {
      name               = "web"
      instance_count     = 1
      instance_size_slug = "basic-xxs"
      github {
        repo   = "acme-ai/insight-engine"
        branch = "main"
      }
    }
  }
}

resource "digitalocean_database_cluster" "postgres" {
  name       = "insight-engine-db"
  engine     = "pg"
  version    = "16"
  size       = "db-s-1vcpu-1gb"
  region     = "nyc3"
  node_count = 1
}`
