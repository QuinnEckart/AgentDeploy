# DigitalOcean AgentDeploy — Prototype

Interactive prototype for **AgentDeploy**, DigitalOcean's repo-to-production infrastructure experience for AI-native builders.

## Live demo

**App Platform:** https://agentdeploy-prototype-bgdpl.ondigitalocean.app

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

## Deploy to App Platform (no local Docker)

Deployments run via **GitHub Actions** on push to `app-platform-deploy` or `main`:

1. GitHub Actions builds the container image on a remote runner
2. Image is pushed to DigitalOcean Container Registry
3. `digitalocean/app_action` deploys to App Platform by image digest

Required GitHub secret: `DIGITALOCEAN_ACCESS_TOKEN`

```bash
# Manual deploy trigger
gh workflow run deploy-app-platform.yml --ref app-platform-deploy
```

To switch to App Platform buildpacks (`npm run build` on DO infrastructure, no container at all), grant the DigitalOcean GitHub App access to this repository at [GitHub Settings → Applications](https://github.com/settings/installations), then change `.do/app.yaml` to the static site spec.

## Build

```bash
npm run build
```

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
