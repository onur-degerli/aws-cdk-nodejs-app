# 🧩 AWS CDK Node.js App — Cloud-Native TypeScript Application

This project is a **TypeScript-based Node.js application** deployed on **AWS App Runner**,  
with infrastructure defined through the **AWS Cloud Development Kit (CDK)**.  
It integrates full CI/CD automation, linting, testing, and Docker support — a complete example of modern, production-ready cloud development.

---

## 🚀 Tech Stack Overview

| Layer                | Technology                       | Purpose                                     |
| -------------------- | -------------------------------- | ------------------------------------------- |
| **Language**         | TypeScript                       | Strong typing, ES2022 support               |
| **Runtime**          | Node.js 22                       | Modern and efficient server runtime         |
| **Infrastructure**   | AWS CDK (v2)                     | Infrastructure as Code (IaC)                |
| **Compute**          | AWS App Runner                   | Fully managed containerized deployment      |
| **Monitoring**       | Amazon CloudWatch + SNS + Lambda | Automated alerting and notifications        |
| **CI/CD**            | GitHub Actions                   | Continuous testing, linting, and deployment |
| **Testing**          | Jest                             | Unit and integration tests                  |
| **Linting**          | ESLint (v9 Flat Config)          | Code quality enforcement                    |
| **Hooks**            | Husky + lint-staged              | Pre-commit automation                       |
| **Containerization** | Docker & Docker Compose          | Local development and testing environment   |

---

## 🧰 Local Development

### 1️⃣ Install dependencies

```bash
npm ci
```

2️⃣ Run tests

```bash
npm test
```

3️⃣ Lint code

```bash
npm run lint
```

4️⃣ Fix lint issues automatically

```bash
npm run lint:fix
```

5️⃣ Build and start locally with Docker

```bash
docker-compose up -d
```

## 🧪 Testing & Code Quality

All tests are written in Jest and automatically executed before every commit and before deployment.

Example workflow:

1 - Run `npm test` locally

2 - Commit → Husky triggers ESLint + Jest checks

3 - Push → GitHub Actions runs full CI pipeline

If any test or lint rule fails, the commit or deployment is blocked.

## ☁️ Deployment with AWS CDK

Infrastructure is managed using AWS CDK (written in TypeScript).

Common commands:

```bash
npx cdk bootstrap
npm run synth
npm run diff
npm run deploy
```

The CDK stack provisions:

- AWS App Runner service

- CloudWatch alarms for CPU & memory utilization

- Slack integration via Lambda + SNS

- IAM roles, SQS queues, and policies

## ⚙️ Continuous Integration (GitHub Actions)

Automated pipeline (.github/workflows/deploy.yaml) includes:

| Step                    | Description                                 |
| ----------------------- | ------------------------------------------- |
| 🧩 **Install & Cache**  | Uses `npm ci` for clean dependency installs |
| 🧪 **Run Tests**        | Executes Jest test suite                    |
| 🧹 **Run ESLint**       | Enforces coding standards                   |
| ☁️ **CDK Synth & Diff** | Validates infrastructure templates          |
| 🚀 **Deploy**           | Deploys to AWS if all steps pass            |

Triggered manually (workflow_dispatch) or on pushes to main.

## 🧾 Useful Scripts

| Script                      | Description                             |
| --------------------------- | --------------------------------------- |
| `npm run build`             | Compile TypeScript                      |
| `npm start`                 | Start Node.js app                       |
| `npm test`                  | Run Jest tests                          |
| `npm run lint`              | Lint TypeScript files                   |
| `npm run lint:fix`          | Auto-fix lint issues                    |
| `docker-compose up -d`      | Start app via Docker                    |
| `docker-compose up --build` | Start app via Docker with a fresh build |
| `npx cdk synth`             | Generate CloudFormation template        |
| `npx cdk diff`              | Compare deployed vs local stack         |
| `npx cdk deploy`            | Deploy CDK stack to AWS                 |

## 🧩 Key Highlights

✅ Fully TypeScript-based (App + Infrastructure)
✅ Automated testing and linting with CI/CD gates
✅ Pre-commit hooks for code quality enforcement
✅ App Runner deployment with CDK-managed resources
✅ Docker-based local environment for consistent dev setups
✅ Scalable, production-ready AWS architecture

## 🏁 License

This project is licensed under the MIT License.
