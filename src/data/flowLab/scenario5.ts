import type { Scenario } from "./types";
import { makeStep } from "./scenarioUtils.ts";

export const scenario5: Scenario = {
  id: "database-cutover",
  title: "Database migration cutover",
  summary: "An offline database dump moved an application from a local MariaDB instance to a private, encrypted RDS database after validation.",
  provenance: { lab: "Migrating a Self-Managed Database on EC2 to Amazon RDS lab", label: "Resources removed after the lab" },
  nodes: [
    { id: "operator", role: "control", label: "CONTROL", service: "Administrator", explainer: { what: "The operator coordinating the migration and cutover.", why: "The lab procedure stopped the application before taking an offline dump.", security: "The exercise ran in a lab environment and was torn down afterward." } },
    { id: "app-server", role: "compute", label: "COMPUTE", service: "EC2 / Apache / PHP", explainer: { what: "The EC2 application server running Apache and PHP.", why: "The application initially used its local MariaDB database, then was repointed to RDS.", security: "Its security group is the only allowed source for the database security group on port 3306." } },
    { id: "local-db", role: "state", label: "STATE", service: "Local MariaDB 10.5", explainer: { what: "The self-managed database on the EC2 application server.", why: "It was the original system of record before the offline migration.", security: "Stopping it after cutover helped demonstrate that the app was using RDS independently." } },
    { id: "dump-file", role: "storage", label: "STORAGE", service: "Offline mysqldump", explainer: { what: "A single-transaction mysqldump file created while the app was stopped.", why: "It carries the database contents into the restore step.", security: "The dump is a data artifact; the lab does not publish it or expose it in the diagram." } },
    { id: "app-sg", role: "gate", label: "GATE", service: "Application SG", gateRule: "The database security group permits port 3306 only from the application security group.", explainer: { what: "The application server’s security group.", why: "It is the source identity permitted by the RDS database security group.", security: "The RDS rule uses a security-group reference rather than a public IP range." } },
    { id: "db-user", role: "gate", label: "GATE", service: "Application DB user", gateRule: "The app user is limited to SELECT, INSERT, UPDATE and DELETE on its own database.", explainer: { what: "A database user created for the application.", why: "It gives the application only the data operations it needs.", security: "Its grants are limited to its own database and the listed CRUD actions." } },
    { id: "rds-db", role: "state", label: "STATE", service: "Private RDS MariaDB 10.11", explainer: { what: "A private, encrypted, single-AZ RDS MariaDB instance with seven-day automated backups.", why: "It becomes the application’s managed database after the validated cutover.", security: "The RDS database security group allows port 3306 only from the application security group." } },
    { id: "cloudshell", role: "client", label: "CLIENT", service: "CloudShell", explainer: { what: "A client outside the application security group.", why: "It is used to demonstrate that the database port remains restricted to the app security group.", security: "The database security group refuses this connection on port 3306." } },
    { id: "rollback", role: "control", label: "CONTROL", service: "Rollback drill", ghost: { reason: "not performed" }, explainer: { what: "A tested procedure to return the application to the original database.", why: "A rollback drill would exercise the recovery path for a failed cutover.", security: "This drill was not performed in the lab." } },
    { id: "dms", role: "control", label: "CONTROL", service: "AWS DMS", ghost: { reason: "planned only" }, explainer: { what: "AWS Database Migration Service for an online migration.", why: "It could reduce downtime for a migration that needs ongoing replication.", security: "This path was planned only and was not built in the lab." } },
    { id: "multi-az", role: "state", label: "STATE", service: "Multi-AZ", ghost: { reason: "planned only" }, explainer: { what: "A Multi-AZ RDS deployment.", why: "It could add a standby for availability across availability zones.", security: "This deployment was planned only and was not built in the lab." } },
  ],
  edges: [
    { id: "operator-app", from: "operator", to: "app-server", kind: "control" },
    { id: "app-local-db", from: "app-server", to: "local-db", kind: "data" },
    { id: "local-dump", from: "local-db", to: "dump-file", kind: "data" },
    { id: "dump-rds", from: "dump-file", to: "rds-db", kind: "data" },
    { id: "app-db-user", from: "app-server", to: "db-user", kind: "control" },
    { id: "app-sg-rds", from: "app-sg", to: "rds-db", kind: "data" },
    { id: "app-rds", from: "app-server", to: "rds-db", kind: "data" },
    { id: "cloudshell-rds", from: "cloudshell", to: "rds-db", kind: "data", label: "Refused on 3306" },
    { id: "rollback-ghost", from: "rollback", to: "rds-db", kind: "control", ghost: true },
    { id: "dms-ghost", from: "dms", to: "rds-db", kind: "data", ghost: true },
    { id: "multi-az-ghost", from: "rds-db", to: "multi-az", kind: "control", ghost: true },
  ],
  layout: {
    desktop: {
      operator: { x: 10, y: 78 }, "app-server": { x: 28, y: 45 }, "local-db": { x: 50, y: 16 }, "dump-file": { x: 50, y: 45 },
      "app-sg": { x: 72, y: 45 }, "db-user": { x: 28, y: 78 }, "rds-db": { x: 90, y: 45 }, cloudshell: { x: 10, y: 16 },
      rollback: { x: 49, y: 86 }, dms: { x: 70, y: 86 }, "multi-az": { x: 90, y: 86 },
    },
    mobile: {
      operator: { x: 25, y: 8 }, cloudshell: { x: 75, y: 8 }, "local-db": { x: 25, y: 20 }, "app-server": { x: 50, y: 20 },
      "dump-file": { x: 75, y: 36 }, "app-sg": { x: 50, y: 50 }, "db-user": { x: 25, y: 50 }, "rds-db": { x: 75, y: 56 },
      rollback: { x: 25, y: 84 }, dms: { x: 50, y: 84 }, "multi-az": { x: 75, y: 84 },
    },
  },
  flows: [
    {
      id: "offline-migration", title: "Offline migration", basis: "performed",
      takeaway: "Stop the app, move and validate the data, change the database host and only then bring the app back up.",
      observedNotes: ["3 minutes 29 seconds of downtime, within a 15-minute allowance. Step timings shown here are illustrative."],
      steps: [
        makeStep("downtime-starts", "operator-app", "Downtime starts", "The application is taken out of service for the offline migration."),
        makeStep("stop-apache", "operator-app", "Apache stops", "Stopping Apache prevents application writes while the dump is taken."),
        makeStep("create-dump", "local-dump", "A single-transaction dump is created", "mysqldump exports the local MariaDB data while the app is stopped."),
        makeStep("restore-rds", "dump-rds", "The dump is restored into RDS", "The database contents are loaded into the private RDS MariaDB instance."),
        makeStep("create-app-user", "app-db-user", "The application user is created", "The RDS database receives an app user limited to its own database and CRUD operations."),
        makeStep("validate-migration", "app-rds", "The migrated data is validated", "Row counts and checksums are compared before allowing cutover."),
        makeStep("switch-host", "app-rds", "The application host is changed", "The application’s database host setting is repointed to RDS."),
        makeStep("start-apache", "app-rds", "Apache starts against RDS", "The application starts with the RDS host setting."),
        makeStep("downtime-ends", "app-rds", "Downtime ends", "The application is available after the migration sequence."),
      ],
    },
    {
      id: "validation-gate", title: "The validation gate", basis: "performed",
      takeaway: "Any mismatch means do not cut over.",
      steps: [
        makeStep("compare-counts", "app-rds", "Row counts match", "The row counts on the source and destination databases are compared."),
        makeStep("compare-checksums", "app-rds", "Checksums match", "Checksums are checked on both databases before cutover."),
        makeStep("compare-auto-increment", "app-rds", "Auto-increment counters match", "The counters are also checked before the application is pointed at RDS."),
        makeStep("validation-passes", "operator-app", "The validation gate passes", "Cutover proceeds only after the reported checks match.", { log: { target: "migration validation", status: "passed", note: "Performed in lab" } }),
      ],
    },
    {
      id: "prove-independence", title: "Proving independence", basis: "performed",
      takeaway: "Query the system of record directly to confirm the application no longer depends on the local database.",
      steps: [
        makeStep("stop-local-db", "app-local-db", "The local database is stopped", "The original local MariaDB instance is shut down after cutover."),
        makeStep("add-product", "app-rds", "A product is added through the app", "The application creates a new product while the local database is stopped."),
        makeStep("query-rds", "app-rds", "The row is found in RDS", "A direct query finds the new row in the RDS database.", { log: { method: "SELECT", target: "RDS products", status: 200, note: "Performed in lab; illustrative status" } }),
      ],
    },
    {
      id: "still-private", title: "Still private", basis: "performed",
      takeaway: "The database port admits the application security group, not arbitrary clients outside that group.",
      steps: [
        makeStep("cloudshell-attempt", "cloudshell-rds", "CloudShell attempts port 3306", "CloudShell is outside the application security group and attempts to connect to RDS."),
        makeStep("database-refuses", "cloudshell-rds", "The connection is refused", "The database security group refuses the connection on port 3306.", { outcome: "blocked", log: { target: "RDS :3306", status: "refused", note: "Performed in lab" } }),
      ],
    },
  ],
};
