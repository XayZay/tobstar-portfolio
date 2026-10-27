import type { Scenario } from "./types";
import { makeStep } from "./scenarioUtils.ts";

export const scenario2: Scenario = {
  id: "private-database",
  title: "A private database",
  summary: "Private PostgreSQL access, recovery and a read replica, with connectivity shaped by subnet routes and security-group references.",
  provenance: { lab: "Amazon RDS lab (ShopEasy)", label: "Resources removed after the lab" },
  nodes: [
    { id: "laptop", role: "client", label: "CLIENT", service: "Laptop", explainer: { what: "A client outside the VPC.", why: "It demonstrates that the database endpoint is not publicly reachable.", security: "The private subnets have no public route and Public access is off." } },
    { id: "cloudshell", role: "client", label: "CLIENT", service: "CloudShell in VPC", explainer: { what: "A shell used as a database client from inside the VPC.", why: "Its security group is referenced by the database security group.", alternative: "An application host could use its own security group as the permitted source.", security: "The lab’s private subnets had no internet route; even a package install from CloudShell timed out." } },
    { id: "rds-sg", role: "gate", label: "GATE", service: "rds-sg :5432", gateRule: "Allow PostgreSQL port 5432 only from the CloudShell security group by group ID.", explainer: { what: "A security group attached to the database.", why: "It admits PostgreSQL traffic only from an explicitly referenced client group.", security: "There are no broad inbound source ranges in this rule." } },
    { id: "shop-db", role: "state", label: "STATE", service: "shop-db primary", explainer: { what: "A private, encrypted PostgreSQL RDS instance.", why: "It is the primary database used for the ShopEasy lab tables.", alternative: "A self-managed database on compute offers more operating-system control but requires managing the database host.", security: "Public access is off. The instance is in private subnets and has automated backups." } },
    { id: "snapshot", role: "storage", label: "STORAGE", service: "Manual snapshot", explainer: { what: "A manual RDS snapshot captured before deleting table rows.", why: "It supplies a restore point for the recovery exercise.", security: "A snapshot must be restored and checked to demonstrate recovery." } },
    { id: "restored-db", role: "state", label: "STATE", service: "Restored instance", explainer: { what: "A new private database instance restored from the snapshot.", why: "The restored row was checked after data was deleted from the original instance.", security: "The restore remains private and uses the database access rules." } },
    { id: "app-sg", role: "gate", label: "GATE", service: "app-sg", gateRule: "The read replica’s prefilled default security group was replaced with app-sg before creation.", explainer: { what: "The application security group assigned to the read replica.", why: "It replaces the broad console default as the replica’s intended client group.", security: "The console’s default security group was not accepted as the least-privilege choice." } },
    { id: "replica", role: "state", label: "STATE", service: "Read replica", explainer: { what: "A read replica created from the restored database instance.", why: "It provides a separate read target in the lab design.", security: "The replica uses app-sg; the laptop outside the VPC timed out against both database endpoints." } },
  ],
  edges: [
    { id: "cloudshell-rds-sg", from: "cloudshell", to: "rds-sg", kind: "data" },
    { id: "rds-sg-primary", from: "rds-sg", to: "shop-db", kind: "data" },
    { id: "laptop-primary", from: "laptop", to: "shop-db", kind: "data", label: "No route in; connection times out" },
    { id: "primary-snapshot", from: "shop-db", to: "snapshot", kind: "control" },
    { id: "snapshot-restored", from: "snapshot", to: "restored-db", kind: "control" },
    { id: "rds-sg-restored", from: "rds-sg", to: "restored-db", kind: "data" },
    { id: "restored-app-sg", from: "restored-db", to: "app-sg", kind: "control" },
    { id: "app-sg-replica", from: "app-sg", to: "replica", kind: "data" },
    { id: "cloudshell-replica", from: "cloudshell", to: "replica", kind: "data" },
    { id: "primary-replica", from: "shop-db", to: "replica", kind: "control", label: "Asynchronous replication (illustrative)" },
    { id: "laptop-replica", from: "laptop", to: "replica", kind: "data", label: "No route in; connection times out" },
  ],
  layout: {
    desktop: {
      laptop: { x: 10, y: 13 }, cloudshell: { x: 10, y: 48 }, "rds-sg": { x: 36, y: 48 }, "shop-db": { x: 62, y: 48 },
      snapshot: { x: 62, y: 13 }, "restored-db": { x: 86, y: 13 }, "app-sg": { x: 76, y: 70 }, replica: { x: 90, y: 70 },
    },
    mobile: {
      laptop: { x: 25, y: 8 }, cloudshell: { x: 25, y: 18 }, "rds-sg": { x: 50, y: 18 }, "shop-db": { x: 75, y: 18 },
      snapshot: { x: 25, y: 43 }, "restored-db": { x: 50, y: 43 }, "app-sg": { x: 25, y: 70 }, replica: { x: 75, y: 70 },
    },
  },
  flows: [
    {
      id: "allowed-query", title: "An allowed query from inside the VPC", basis: "performed",
      takeaway: "A security group can reference another security group as the allowed source.",
      steps: [
        makeStep("shell-query", "cloudshell-rds-sg", "CloudShell sends a query", "The client runs from inside the VPC using its CloudShell security group.", { log: { method: "SELECT", target: "shop-db", note: "Illustrative query" } }),
        makeStep("group-reference", "rds-sg-primary", "The source group matches", "rds-sg allows port 5432 only from the CloudShell group by group ID.", { log: { target: "rds-sg :5432", status: "allow", note: "Security-group reference" } }),
        makeStep("query-succeeds", "rds-sg-primary", "The query succeeds", "Table creation, inserts and selects were completed from the in-VPC client.", { log: { method: "SELECT", target: "shop-db", status: 200, note: "Performed in lab; illustrative status" } }),
      ],
    },
    {
      id: "blocked-outside", title: "Blocked from outside", basis: "performed",
      takeaway: "Private subnets, Public access off and a default-deny security group are independent layers.",
      steps: [
        makeStep("outside-attempt", "laptop-primary", "The laptop attempts to connect", "The client is outside the VPC and tries the database endpoint address.", { outcome: "error" }),
        makeStep("outside-timeout", "laptop-primary", "The connection times out", "No route reaches the private subnets, so the attempt times out rather than receiving a refusal message.", { outcome: "blocked", log: { target: "private database endpoint", status: "timeout", note: "No route in; no refusal message" } }),
      ],
    },
    {
      id: "snapshot-restore", title: "Snapshot, data loss, restore", basis: "performed",
      takeaway: "A backup matters once the restore has been tested and the recovered data checked.",
      steps: [
        makeStep("update-price", "rds-sg-primary", "A product price is updated", "A product row is changed before the snapshot is taken.", { log: { method: "UPDATE", target: "products", note: "Performed in lab" } }),
        makeStep("take-snapshot", "primary-snapshot", "A manual snapshot is taken", "The snapshot captures the database before the table rows are deleted."),
        makeStep("delete-products", "rds-sg-primary", "Product rows are deleted", "The products table is cleared on the primary instance.", { outcome: "error", log: { method: "DELETE", target: "products", note: "Performed in lab" } }),
        makeStep("empty-table", "rds-sg-primary", "A select returns no rows", "The empty result confirms the deleted data is no longer in the primary table.", { outcome: "error" }),
        makeStep("restore-snapshot", "snapshot-restored", "The snapshot is restored", "A new private database instance is created from the manual snapshot."),
        makeStep("verify-restored-row", "rds-sg-restored", "The earlier row is present", "CloudShell queries the restored instance and returns the pre-deletion product row.", { log: { method: "SELECT", target: "restored products", status: 200, note: "Performed in lab; illustrative status" } }),
      ],
    },
    {
      id: "replica-least-privilege", title: "A replica with least privilege", basis: "performed",
      takeaway: "Review prefilled access settings: the default group was replaced with app-sg before the replica was created.",
      steps: [
        makeStep("choose-app-sg", "restored-app-sg", "The replica uses app-sg", "The console’s prefilled default group is replaced before creation."),
        makeStep("create-replica", "app-sg-replica", "The replica is created", "The replica is attached to the application security group."),
        makeStep("shell-reaches-replica", "cloudshell-replica", "CloudShell can reach the replica", "The in-VPC CloudShell client connects to the replica.", { log: { target: "read replica", status: "connected", note: "Performed in lab" } }),
        makeStep("laptop-times-out", "laptop-replica", "The laptop still times out", "The outside laptop times out against both database endpoints.", { outcome: "blocked", log: { target: "primary and replica", status: "timeout", note: "Performed in lab" } }),
      ],
    },
    {
      id: "replica-reads", title: "Reads move to the replica", basis: "illustrative",
      takeaway: "A replica may take reads away from the primary, but replication behavior was not tested in the report.",
      steps: [
        makeStep("write-primary", "rds-sg-primary", "Writes go to the primary", "The write path remains on the primary database."),
        makeStep("replicate-changes", "primary-replica", "Changes replicate asynchronously", "This replication behavior is illustrative; the lab verified connectivity to the replica, not replication behavior.", { outcome: "retry", log: { target: "primary → replica", note: "Illustrative asynchronous replication" } }),
        makeStep("read-replica", "app-sg-replica", "Reads can use the replica", "A read path may use the replica while it catches up with the primary."),
      ],
    },
  ],
};
