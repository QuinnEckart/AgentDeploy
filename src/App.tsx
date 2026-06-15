import { useState, useCallback, useRef, useEffect } from 'react'
import { Layout } from './components/Layout'
import { ChatWindow } from './components/ChatWindow'
import { GitHubLinkButton } from './components/GitHubLinkButton'
import { FollowUpQuestions } from './components/FollowUpQuestions'
import { ArchitectureRecommendation } from './components/ArchitectureRecommendation'
import { DeployedSuccess } from './components/DeployedSuccess'
import { DeploymentConsole } from './components/DeploymentConsole'
import { FlowStepper } from './components/FlowStepper'
import { RepoConnectModal } from './components/RepoConnectModal'
import { DeployConfirmationModal } from './components/DeployConfirmationModal'
import { AnalysisSummary } from './components/AnalysisSummary'
import { ProvisioningProgress } from './components/ProvisioningProgress'
import {
  followUpQuestions,
  buildArchitecturePlan,
  day2Operations,
  detectedSignals,
  updatePlanRegion,
  updatePlanHA,
  togglePlanComponent,
} from './data/mockData'
import type { FlowStep, ChatMessage, ArchitecturePlan, MockRepo, ProvisioningStep } from './types'

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'agent',
  type: 'text',
  content:
    'Start by connecting your GitHub repository. AgentDeploy will analyze your codebase, ask 3 deployment questions, recommend a production architecture, and show estimated monthly cost before anything is provisioned.',
  timestamp: new Date(),
}

const APP_URL = 'insight-engine-nyc3.agentdeploy.ondigitalocean.app'

const PROVISIONING_STEPS: Omit<ProvisioningStep, 'status'>[] = [
  { id: 'tf', label: 'Terraform plan applied' },
  { id: 'db', label: 'Creating database' },
  { id: 'vpc', label: 'Configuring VPC' },
  { id: 'ssl', label: 'Issuing SSL certificate' },
  { id: 'health', label: 'Running health checks' },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getDeploymentStatus(step: FlowStep): 'draft' | 'provisioning' | 'live' | null {
  if (step === 'deploying') return 'provisioning'
  if (step === 'deployed' || step === 'console') return 'live'
  if (['summary', 'questions', 'analyzing', 'architecture'].includes(step)) return 'draft'
  return null
}

export default function App() {
  const [step, setStep] = useState<FlowStep>('welcome')
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isTyping, setIsTyping] = useState(false)
  const [repoName, setRepoName] = useState('')
  const [architecturePlan, setArchitecturePlan] = useState<ArchitecturePlan | null>(null)
  const [showConsole, setShowConsole] = useState(false)
  const [showRepoModal, setShowRepoModal] = useState(false)
  const [showDeployModal, setShowDeployModal] = useState(false)
  const [provisioningSteps, setProvisioningSteps] = useState<ProvisioningStep[]>([])
  const mainRef = useRef<HTMLDivElement>(null)

  const deploymentStatus = getDeploymentStatus(step)
  const shortName = repoName ? repoName.split('/')[1] : undefined

  useEffect(() => {
    mainRef.current?.focus()
  }, [step])

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: `${Date.now()}-${Math.random()}`, timestamp: new Date() },
    ])
  }, [])

  const agentSays = useCallback(
    async (content: string, pauseMs = 1200) => {
      setIsTyping(true)
      await delay(pauseMs)
      setIsTyping(false)
      addMessage({ role: 'agent', type: 'text', content })
    },
    [addMessage]
  )

  async function handleConnectRepo(repo: MockRepo) {
    setShowRepoModal(false)
    setRepoName(repo.fullName)
    addMessage({ role: 'user', type: 'text', content: `Connected ${repo.fullName}` })
    setStep('linking')
    setIsTyping(true)

    await delay(2000)
    setIsTyping(false)

    await agentSays(
      `Analysis complete for \`${repo.fullName}\`. Detected: Next.js 15, API routes, Prisma, background jobs, OpenAI SDK, object storage. Review the detected signals, then answer 3 questions so I can recommend the right production stack.`
    )

    setStep('summary')
  }

  function handleSummaryContinue() {
    setStep('questions')
    addMessage({
      role: 'agent',
      type: 'text',
      content: 'Answer these 3 questions about region, traffic, and availability. Your choices shape the recommended stack and cost estimate.',
    })
  }

  async function handleQuestionsComplete(answers: Record<string, string>) {
    const structured = followUpQuestions.map((q) => ({
      label: q.question.replace('?', ''),
      value: answers[q.id] ?? '',
    }))

    addMessage({ role: 'user', type: 'structured', content: '', structured })
    setStep('analyzing')
    setIsTyping(true)

    await delay(2500)
    setIsTyping(false)

    const plan = buildArchitecturePlan(repoName, answers)
    setArchitecturePlan(plan)

    await agentSays(
      `Here's your recommended stack for ${repoName}. ${plan.components.filter((c) => c.enabled !== false).length} DigitalOcean resources mapped with an estimated cost of $${plan.totalMonthlyCost}/mo. Review the plan — you can adjust region, HA, and optional components before deploying.`
    )

    setStep('architecture')
  }

  async function runProvisioning() {
    setShowDeployModal(false)
    addMessage({ role: 'user', type: 'text', content: 'Approved deployment plan' })
    setStep('deploying')

    const steps: ProvisioningStep[] = PROVISIONING_STEPS.map((s, i) => ({
      ...s,
      status: i === 0 ? 'active' : 'pending',
    }))
    setProvisioningSteps(steps)

    for (let i = 0; i < PROVISIONING_STEPS.length; i++) {
      await delay(1200)
      setProvisioningSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i + 1 ? 'complete' : idx === i + 1 ? 'active' : 'pending',
        }))
      )
    }

    await delay(800)
    setProvisioningSteps((prev) => prev.map((s) => ({ ...s, status: 'complete' as const })))

    await agentSays(
      `Your stack is live. All resources are healthy. Access your app at ${APP_URL} or open the Deployment Console for Day-2 operations.`
    )

    setStep('deployed')
  }

  function handlePlanUpdate(updater: (plan: ArchitecturePlan) => ArchitecturePlan) {
    setArchitecturePlan((prev) => (prev ? updater(prev) : prev))
  }

  const showChatSidebar = !['architecture', 'deployed', 'deploying', 'console'].includes(step) && !showConsole

  if (showConsole && architecturePlan) {
    return (
      <Layout
        currentView="console"
        deploymentStatus="live"
        deploymentName={shortName}
        onAgentDeployClick={() => setShowConsole(false)}
        onConsoleClick={() => setShowConsole(true)}
      >
        <PageHeader step="console" />
        <DeploymentConsole
          plan={architecturePlan}
          appUrl={APP_URL}
          day2Operations={day2Operations}
          onBackToDeploy={() => setShowConsole(false)}
        />
      </Layout>
    )
  }

  return (
    <Layout
      currentView="agentdeploy"
      deploymentStatus={deploymentStatus}
      deploymentName={shortName}
      onAgentDeployClick={() => setShowConsole(false)}
      onConsoleClick={() => architecturePlan && setShowConsole(true)}
    >
      <PageHeader step={step} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {showChatSidebar && (
          <div className="w-full lg:w-80 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-do-border bg-do-surface max-h-64 lg:max-h-none">
            <ChatWindow messages={messages} isTyping={isTyping} compact />
          </div>
        )}

        <div
          ref={mainRef}
          tabIndex={-1}
          className="flex-1 overflow-y-auto bg-do-surface outline-none"
          aria-label="Main content"
        >
          {step === 'welcome' && (
            <div className="flex items-center justify-center min-h-full p-8">
              <div className="max-w-lg text-center">
                <div className="w-16 h-16 rounded-2xl bg-do-blue/10 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-do-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">What you'll get</h2>
                <ol className="text-sm text-gray-500 text-left space-y-2 mb-8 max-w-xs mx-auto list-decimal list-inside">
                  <li>Architecture recommendation tied to your repo</li>
                  <li>Cost estimate before deploy</li>
                  <li>Terraform-backed provisioning</li>
                  <li>Deployment Console for Day-2 ops</li>
                </ol>
                <GitHubLinkButton onConnect={() => setShowRepoModal(true)} />
              </div>
            </div>
          )}

          {step === 'linking' && (
            <div className="flex items-center justify-center min-h-full p-8">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-do-blue/20 border-t-do-blue rounded-full animate-spin-slow mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-700">Analyzing repository…</p>
                <p className="text-xs text-gray-400 mt-1">Detecting frameworks, services, and dependencies</p>
              </div>
            </div>
          )}

          {step === 'summary' && (
            <div className="p-8">
              <AnalysisSummary repoName={repoName} signals={detectedSignals} onContinue={handleSummaryContinue} />
            </div>
          )}

          {step === 'questions' && (
            <div className="p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Configure your deployment</h2>
              <FollowUpQuestions questions={followUpQuestions} onComplete={handleQuestionsComplete} />
            </div>
          )}

          {step === 'analyzing' && (
            <div className="flex items-center justify-center min-h-full p-8">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-do-blue/20 border-t-do-blue rounded-full animate-spin-slow mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-700">Building architecture recommendation…</p>
                <p className="text-xs text-gray-400 mt-1">Mapping to DigitalOcean primitives and estimating cost</p>
              </div>
            </div>
          )}

          {step === 'architecture' && architecturePlan && (
            <div className="p-8">
              <ArchitectureRecommendation
                plan={architecturePlan}
                onDeploy={() => setShowDeployModal(true)}
                onRegionChange={(region) => handlePlanUpdate((p) => updatePlanRegion(p, region))}
                onHAChange={(ha) => handlePlanUpdate((p) => updatePlanHA(p, ha))}
                onToggleComponent={(id) => handlePlanUpdate((p) => togglePlanComponent(p, id))}
              />
            </div>
          )}

          {step === 'deploying' && (
            <div className="flex items-center justify-center min-h-full p-8">
              <ProvisioningProgress steps={provisioningSteps} />
            </div>
          )}

          {step === 'deployed' && architecturePlan && (
            <DeployedSuccess
              appUrl={APP_URL}
              resourceCount={architecturePlan.components.filter((c) => c.enabled !== false).length}
              onOpenConsole={() => setShowConsole(true)}
            />
          )}
        </div>
      </div>

      <RepoConnectModal
        open={showRepoModal}
        onClose={() => setShowRepoModal(false)}
        onConnect={handleConnectRepo}
      />

      {architecturePlan && (
        <DeployConfirmationModal
          open={showDeployModal}
          plan={architecturePlan}
          onClose={() => setShowDeployModal(false)}
          onConfirm={runProvisioning}
        />
      )}
    </Layout>
  )
}

function PageHeader({ step }: { step: FlowStep }) {
  if (step === 'console') return null

  return (
    <header className="px-6 lg:px-8 py-4 bg-white border-b border-do-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Deploy your repository to production</h1>
          <p className="text-sm text-gray-500">
            Connect GitHub, review a recommended DigitalOcean stack, and provision it with Terraform.
          </p>
        </div>
        <FlowStepper currentStep={step} />
      </div>
    </header>
  )
}
