import type { Role } from "./types";

export interface HeroFrame {
  scenarioId: string;
  bindings: Partial<Record<Role, string>>;
  route: Role[];
  focusTitle: string;
  focusText: string;
}

/** Compact hero-only copy; the scenario modules are intentionally not imported here. */
export const heroFrames: HeroFrame[] = [
  {
    scenarioId: "web-tier",
    bindings: { client: "Visitor", edge: "ALB", compute: "EC2", storage: "Private S3" },
    route: ["client", "edge", "compute", "storage"],
    focusTitle: "Public application entry",
    focusText: "The ALB forwards to a healthy target; the app accesses a private bucket through its instance role.",
  },
  {
    scenarioId: "private-database",
    bindings: { client: "CloudShell", gate: "rds-sg", state: "PostgreSQL" },
    route: ["client", "gate", "state"],
    focusTitle: "Private database access",
    focusText: "CloudShell in the VPC reaches PostgreSQL through a security-group reference.",
  },
  {
    scenarioId: "serverless-products-api",
    bindings: { client: "Visitor", edge: "Function URL", compute: "Lambda", state: "DynamoDB", storage: "CloudWatch" },
    route: ["client", "edge", "compute", "state"],
    focusTitle: "Serverless products API",
    focusText: "A Function URL invokes Lambda, which reads and writes its DynamoDB table.",
  },
  {
    scenarioId: "delivery-pipeline",
    bindings: { control: "Developer", gate: "Repo secrets", compute: "EC2 / Nginx", client: "Visitor" },
    route: ["control", "gate", "compute", "client"],
    focusTitle: "Push to deploy",
    focusText: "GitHub Actions validates, then deploys site files to EC2 running Nginx.",
  },
  {
    scenarioId: "database-cutover",
    bindings: { control: "Administrator", compute: "Apache / PHP", state: "MariaDB → RDS" },
    route: ["control", "compute", "state"],
    focusTitle: "Database migration cutover",
    focusText: "A validated offline dump moved MariaDB data to private RDS before the app host changed.",
  },
];
