# SecureShip – Node.js DevSecOps project

A hands-on sample REST API and integrated GitHub Actions security pipeline.

## Included

- Node.js + Express REST API and Jest/Supertest tests
- GitHub Actions workflow: build/test, SonarQube Cloud SAST, Gitleaks, Snyk SCA, Docker build, Trivy image scan, final security gate
- Dockerfile and Docker Compose for local container deployment
- Python vulnerability report summarizer and Bash Trivy helper
- Starter security policy

## 1. Run locally

Requirements: Node.js 20+, npm, Docker (optional).

```bash
npm install
npm run lint
npm test
```

Start the API:

```bash
# Linux/macOS/Git Bash
export API_KEY='replace-with-a-long-random-local-secret'
npm start
```

PowerShell:

```powershell
$env:API_KEY = "replace-with-a-long-random-local-secret"
npm start
```

Try:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/users
```

Create a user (use your locally configured key):

```bash
curl -X POST http://localhost:3000/api/users \
  -H 'content-type: application/json' \
  -H 'x-api-key: YOUR_LOCAL_API_KEY' \
  -d '{"name":"Meera Singh","email":"meera@example.com"}'
```

## 2. SonarQube Cloud setup

1. Create/sign in to a SonarQube Cloud account.
2. Import this GitHub repository and select the correct organization.
3. Create or identify the project key and organization key.
4. In GitHub repository: Settings → Secrets and variables → Actions.
5. Add secret `SONAR_TOKEN` with the token generated in SonarQube Cloud.
6. Add repository variable `SONAR_PROJECT_KEY`.
7. Add repository variable `SONAR_ORGANIZATION`.
8. Push a commit to `main` or open a pull request.

The workflow waits for the SonarQube Cloud Quality Gate. A failed gate fails the SAST job and final security gate.

Do not put tokens in YAML or commit them to Git.

## 3. Configure other security integrations

GitHub repository → Settings → Secrets and variables → Actions:

- `SONAR_TOKEN` (required for SonarQube Cloud)
- `SNYK_TOKEN` (required for Snyk dependency scan)

Repository variables:

- `SONAR_PROJECT_KEY`
- `SONAR_ORGANIZATION`

Gitleaks uses the GitHub token provided by Actions. Trivy scans the locally built Docker image.

For private repositories, verify the plan and feature availability for GitHub Advanced Security / CodeQL / secret scanning. Enable CodeQL and Dependabot separately if those features are available to the repository.

## 4. Run Docker locally

Build:

```bash
docker build -t secureship-nodejs:local .
```

Run:

```bash
docker run --rm -p 3000:3000 \
  -e API_KEY='replace-with-a-long-random-local-secret' \
  secureship-nodejs:local
```

Or use Compose:

```bash
# Set API_KEY in your shell first
docker compose up --build
```

## 5. Understand the workflow

`.github/workflows/devsecops.yml` is a single workflow with parallel security jobs after tests:

- `test`: lint and unit tests
- `sast`: SonarQube Cloud analysis and Quality Gate
- `secret-scan`: Gitleaks
- `dependency-scan`: Snyk Open Source
- `container-scan`: Docker build and Trivy scan
- `security-gate`: fails unless every required job succeeds

Configure branch protection on `main` and require the `Final security gate` check before merging. Also consider requiring the individual jobs if your repository's branch protection interface exposes them.

## 6. Important production hardening

This repository is a training baseline, not a production-ready identity or user-management service.

- Commit a reviewed `package-lock.json` and switch CI dependency installation from `npm install` to `npm ci` (the starter archive intentionally does not include a generated lockfile).
- Pin third-party GitHub Actions to verified full commit SHAs (the examples use readable version tags for learning).
- Set least-privilege job permissions and protect deployment environments.
- Use CODEOWNERS and branch protection.
- Avoid exposing secrets to workflows triggered by untrusted pull requests.
- Review scanner findings; document time-bound risk exceptions rather than suppressing findings blindly.
- For production authentication, replace the demo API-key middleware with a proper identity provider and authorization model.
- The in-memory data store resets when the process restarts.

## 7. Tool mapping for the job description

The runnable pipeline demonstrates SonarQube Cloud, Snyk, Gitleaks and Trivy. Cycode, Checkmarx, Veracode and Fortify are enterprise alternatives/integrations; use the relevant vendor's GitHub Action, CLI or API and credentials when your organization provides access. Do not configure multiple overlapping scanners without defining ownership, severity mapping and duplicate-finding handling.
