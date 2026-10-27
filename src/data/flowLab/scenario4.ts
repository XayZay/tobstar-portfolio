import type { Scenario } from "./types";
import { makeStep } from "./scenarioUtils.ts";

export const scenario4: Scenario = {
  id: "delivery-pipeline",
  title: "Infrastructure and delivery pipeline",
  summary: "Terraform built a training environment from a laptop; a GitHub Actions workflow validated and deployed site files over SSH.",
  provenance: { lab: "ShopEasy Infrastructure Deployment & CI/CD Automation lab", label: "Resources removed after the lab" },
  nodes: [
    { id: "developer", role: "control", label: "CONTROL", service: "Developer laptop", explainer: { what: "The operator’s workstation.", why: "Terraform was run from this laptop, and code was pushed to the repository from here.", security: "Terraform state and the .terraform directory were kept out of Git." } },
    { id: "terraform", role: "control", label: "CONTROL", service: "Terraform", explainer: { what: "Infrastructure-as-code tooling run from the laptop.", why: "It planned and applied the training environment in dependency order.", alternative: "Running Terraform from a pipeline was not built in this lab.", security: "State and the .terraform directory were excluded from the repository." } },
    { id: "vpc", role: "edge", label: "EDGE", service: "VPC / public subnet", explainer: { what: "The virtual network and public subnet created by Terraform.", why: "They provide the network placement for the training server.", security: "The environment was removed with terraform destroy at the end of the lab." } },
    { id: "web-sg", role: "gate", label: "GATE", service: "web-sg :80 / :22", gateRule: "The lab security group allowed HTTP on port 80 and SSH on port 22 from anywhere.", explainer: { what: "The server security group created by Terraform.", why: "It allowed web access and the SSH-based training deployment.", security: "SSH from anywhere with password authentication was a training-environment compromise; managed access was not built." } },
    { id: "ec2-nginx", role: "compute", label: "COMPUTE", service: "EC2 / Nginx", explainer: { what: "A small Ubuntu EC2 instance running Nginx.", why: "The workflow copied site files to the server and reloaded Nginx.", alternative: "A managed deployment target could remove direct host administration; it was not used here.", security: "Password SSH was open on port 22 from anywhere in the training environment." } },
    { id: "repository", role: "control", label: "CONTROL", service: "Git repository", explainer: { what: "The repository containing site files, Terraform and one workflow.", why: "A push to the main branch triggered the workflow.", security: "Terraform state and the .terraform directory were excluded from Git." } },
    { id: "repo-secrets", role: "gate", label: "GATE", service: "Repository secrets", gateRule: "The workflow read the host, user and password from GitHub Actions secrets.", explainer: { what: "Secrets configured in the repository for the deployment workflow.", why: "They supplied SSH connection values without storing them in the repository files.", security: "The lab used password-based SSH; key-based or managed host access was not built." } },
    { id: "actions", role: "control", label: "CONTROL", service: "GitHub Actions", explainer: { what: "The repository’s deployment workflow.", why: "It checked required files and JavaScript syntax before preparing the server, copying files and reloading Nginx.", security: "A validation failure stopped the later deployment steps." } },
    { id: "visitor", role: "client", label: "CLIENT", service: "Visitor", explainer: { what: "A browser viewing the training site.", why: "It confirms the deployed files were served by Nginx.", security: "The resources were torn down after the lab; this is not a live site." } },
    { id: "terraform-pipeline", role: "control", label: "CONTROL", service: "Terraform in pipeline", ghost: { reason: "infrastructure changes were applied from the laptop and only committed to Git" }, explainer: { what: "A pipeline stage that runs Terraform.", why: "It could connect infrastructure changes to the code review and deployment path.", security: "This stage was not built in the lab." } },
    { id: "managed-access", role: "control", label: "CONTROL", service: "Managed server access", ghost: { reason: "the lab used password SSH open on port 22 from anywhere in a training environment" }, explainer: { what: "A key-based or managed server-access method.", why: "It could replace the lab’s password SSH approach.", security: "This alternative was not built in the lab." } },
  ],
  edges: [
    { id: "laptop-terraform", from: "developer", to: "terraform", kind: "control" },
    { id: "terraform-vpc", from: "terraform", to: "vpc", kind: "control" },
    { id: "terraform-sg", from: "terraform", to: "web-sg", kind: "control" },
    { id: "sg-ec2", from: "web-sg", to: "ec2-nginx", kind: "data" },
    { id: "developer-repo", from: "developer", to: "repository", kind: "control" },
    { id: "repo-actions", from: "repository", to: "actions", kind: "control" },
    { id: "actions-secrets", from: "actions", to: "repo-secrets", kind: "control" },
    { id: "secrets-server", from: "repo-secrets", to: "ec2-nginx", kind: "control" },
    { id: "actions-server", from: "actions", to: "ec2-nginx", kind: "data", label: "SSH prepare / copy / reload" },
    { id: "server-visitor", from: "ec2-nginx", to: "visitor", kind: "data" },
    { id: "repo-terraform-ghost", from: "repository", to: "terraform-pipeline", kind: "control", ghost: true },
    { id: "managed-access-ghost", from: "managed-access", to: "ec2-nginx", kind: "control", ghost: true },
  ],
  layout: {
    desktop: {
      developer: { x: 10, y: 16 }, terraform: { x: 29, y: 16 }, vpc: { x: 48, y: 16 }, "web-sg": { x: 68, y: 43 }, "ec2-nginx": { x: 90, y: 43 },
      repository: { x: 10, y: 74 }, actions: { x: 48, y: 74 }, "repo-secrets": { x: 29, y: 74 }, visitor: { x: 90, y: 74 },
      "terraform-pipeline": { x: 68, y: 88 }, "managed-access": { x: 90, y: 88 },
    },
    mobile: {
      developer: { x: 25, y: 8 }, terraform: { x: 50, y: 8 }, vpc: { x: 75, y: 8 }, "web-sg": { x: 50, y: 21 }, "ec2-nginx": { x: 50, y: 35 },
      repository: { x: 25, y: 50 }, "repo-secrets": { x: 50, y: 50 }, actions: { x: 75, y: 50 }, visitor: { x: 50, y: 65 },
      "terraform-pipeline": { x: 25, y: 84 }, "managed-access": { x: 75, y: 84 },
    },
  },
  flows: [
    {
      id: "terraform-build", title: "Terraform builds the environment", basis: "performed",
      takeaway: "Infrastructure as code made the environment reviewable and repeatable; a second apply found no additional changes.",
      steps: [
        makeStep("terraform-plan", "laptop-terraform", "The plan lists nine resources", "terraform plan reports nine resources to add before the environment is created.", { log: { method: "terraform plan", status: "9 to add", note: "Performed in lab" } }),
        makeStep("terraform-apply-network", "terraform-vpc", "Terraform creates the network", "The VPC, public subnet, internet gateway and route-table resources are created in dependency order."),
        makeStep("terraform-apply-server", "terraform-sg", "Terraform creates the server", "The security group, EC2 instance and Elastic IP resources are created and associated."),
        makeStep("terraform-address", "terraform-vpc", "The server address is printed", "Terraform reports the public address of the created server; no literal address is shown."),
        makeStep("terraform-idempotent", "laptop-terraform", "A second apply reports no changes", "Running apply again reports zero changes.", { log: { method: "terraform apply", status: "0 changes", note: "Performed in lab" } }),
      ],
    },
    {
      id: "push-to-deploy", title: "Push to deploy", basis: "performed",
      takeaway: "The workflow validated first, then prepared the host, copied the site and reloaded Nginx without manual file copying.",
      observedNotes: ["The full workflow run took about 13 seconds. Per-step timings shown here are illustrative."],
      steps: [
        makeStep("commit-site-change", "developer-repo", "A site change is pushed", "A commit changes the promotion text from 10% to 20% off and is pushed to main."),
        makeStep("start-workflow", "repo-actions", "GitHub Actions starts", "The push triggers the repository workflow."),
        makeStep("validate-site", "repo-actions", "Validation passes", "The workflow checks required files and runs a JavaScript syntax check with Node."),
        makeStep("read-secrets", "actions-secrets", "The workflow reads its secrets", "The host, user and password are read from GitHub Actions secrets."),
        makeStep("prepare-server", "actions-server", "The server is prepared over SSH", "The workflow installs Nginx if missing and prepares the server for the site files."),
        makeStep("copy-files", "actions-server", "Site files are copied", "The workflow copies the changed files to the EC2 server."),
        makeStep("reload-nginx", "sg-ec2", "Nginx reloads the site", "The workflow reloads Nginx and the new banner appears for a visitor.", { log: { method: "workflow", target: "EC2 / Nginx", status: "success", note: "Illustrative status; observed total duration is shown separately" } }),
        makeStep("visitor-sees-change", "server-visitor", "The visitor sees the new banner", "The refreshed site serves the updated promotion text."),
      ],
    },
    {
      id: "ci-blocks-bad-commit", title: "CI blocks a bad commit", basis: "performed",
      takeaway: "Validation ran before deployment, so a syntax error stopped prepare, copy and reload and the previous site stayed in place.",
      steps: [
        makeStep("push-syntax-error", "developer-repo", "A deliberate syntax error is pushed", "The lab commit contains a JavaScript syntax error."),
        makeStep("workflow-validates", "repo-actions", "The workflow starts validation", "GitHub Actions checks the changed site before deployment."),
        makeStep("validation-fails", "repo-actions", "Validation fails", "The syntax check catches the error and marks the workflow step as failed.", { outcome: "error", log: { method: "syntax check", status: "failed", note: "Performed in lab" } }),
        makeStep("deployment-skipped", "actions-server", "Deployment steps are skipped", "Server preparation, file copy and Nginx reload do not run.", { outcome: "blocked" }),
        makeStep("previous-version-serves", "server-visitor", "The previous site keeps serving", "The failed workflow leaves the earlier site version in place."),
      ],
    },
  ],
};
