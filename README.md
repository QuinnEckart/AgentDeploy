# DigitalOcean AgentDeploy — Prototype

Interactive prototype for **AgentDeploy**, DigitalOcean's repo-to-production infrastructure experience for AI-native builders.

## User Flow

1. **Connect** — Select a GitHub repository via connect modal
2. **Analyze** — Review detected signals from codebase analysis
3. **Configure** — Answer 3 deployment questions (region, traffic, availability)
4. **Review** — Full-width architecture plan with editable region, HA, optional components, diagram, and pricing
5. **Deploy** — Confirmation modal → step-by-step provisioning progress
6. **Operate** — Live URL + Deployment Console with tabs (Overview, Infrastructure, Day-2 Ops, Cost, Terraform)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
