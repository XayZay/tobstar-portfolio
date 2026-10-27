import type { Scenario } from "./types";
import { makeStep } from "./scenarioUtils.ts";

export const scenario3: Scenario = {
  id: "serverless-products-api",
  title: "A serverless products API",
  summary: "A Function URL invokes Lambda, which checks write requests, uses a scoped role for DynamoDB and emits request logs.",
  provenance: { lab: "Serverless Products API lab (ShopEasy)", label: "Resources removed after the lab" },
  nodes: [
    { id: "visitor", role: "client", label: "CLIENT", service: "Visitor", explainer: { what: "A caller of the products API.", why: "Reads are public by design in this lab; writes are checked in application code.", security: "The API key is checked by Lambda on write routes; it is not a user identity system." } },
    { id: "function-url", role: "edge", label: "EDGE", service: "Function URL", explainer: { what: "A Lambda Function URL with auth type NONE and CORS disabled.", why: "It provides the direct HTTP entry point without an API Gateway.", alternative: "API Gateway is a possible managed API front door, but it was not used in this lab.", security: "The URL itself is not the write authorization boundary; the handler checks the key." } },
    { id: "lambda", role: "compute", label: "COMPUTE", service: "Python Lambda", explainer: { what: "A Python Lambda function with no VPC attachment.", why: "It handles the API routes and connects to DynamoDB using its execution role.", alternative: "A container or instance could host the same application logic with different runtime management.", security: "The function uses an execution role; application key checks gate write routes." } },
    { id: "api-key", role: "gate", label: "GATE", service: "API-key check", gateRule: "Write routes compare a caller-supplied key with a value held in an environment variable. Reads do not require the key.", explainer: { what: "An API-key comparison performed inside the handler.", why: "The lab gated writes while intentionally leaving reads public.", alternative: "A managed identity and authorization layer would offer different controls; it was not part of this lab.", security: "The key is held in an environment variable and checked in code; it is not a substitute for user authentication." } },
    { id: "iam-role", role: "gate", label: "GATE", service: "Execution-role policy", gateRule: "The role allows GetItem, PutItem, DeleteItem and Scan on the single products table.", explainer: { what: "The Lambda execution role’s DynamoDB policy.", why: "Its four actions correspond to the routes implemented in the API.", security: "The policy names one table rather than granting access to all tables." } },
    { id: "products-table", role: "state", label: "STATE", service: "products-table", explainer: { what: "A DynamoDB table using product_id as its partition key and on-demand capacity.", why: "It stores the products managed by the API.", security: "The Lambda role is limited to the table and four actions used by the routes." } },
    { id: "cloudwatch", role: "storage", label: "STORAGE", service: "CloudWatch logs", explainer: { what: "The function’s CloudWatch log group.", why: "The lab produced one log line per request.", security: "Logs contain operational request details; no personal identifiers are shown in this diagram." } },
    { id: "waf-ghost", role: "edge", label: "EDGE", service: "Rate limit / WAF", ghost: { reason: "recorded as a limitation of this design" }, explainer: { what: "A rate limiter or web application firewall in front of the function.", why: "It could add request controls beyond the handler’s key check.", security: "This control was not built in the lab." } },
  ],
  edges: [
    { id: "visitor-url", from: "visitor", to: "function-url", kind: "data" },
    { id: "url-lambda", from: "function-url", to: "lambda", kind: "data" },
    { id: "lambda-api-key", from: "lambda", to: "api-key", kind: "control" },
    { id: "lambda-iam", from: "lambda", to: "iam-role", kind: "control" },
    { id: "iam-products", from: "iam-role", to: "products-table", kind: "data" },
    { id: "lambda-cloudwatch", from: "lambda", to: "cloudwatch", kind: "control" },
    { id: "waf-lambda", from: "waf-ghost", to: "lambda", kind: "data", ghost: true },
  ],
  layout: {
    desktop: {
      visitor: { x: 10, y: 43 }, "function-url": { x: 30, y: 43 }, lambda: { x: 50, y: 43 }, "api-key": { x: 50, y: 75 },
      "iam-role": { x: 70, y: 43 }, "products-table": { x: 90, y: 43 }, cloudwatch: { x: 70, y: 75 }, "waf-ghost": { x: 15, y: 85 },
    },
    mobile: {
      visitor: { x: 50, y: 8 }, "function-url": { x: 50, y: 19 }, lambda: { x: 50, y: 30 }, "api-key": { x: 25, y: 49 },
      "iam-role": { x: 75, y: 49 }, "products-table": { x: 75, y: 66 }, cloudwatch: { x: 25, y: 66 }, "waf-ghost": { x: 50, y: 87 },
    },
  },
  flows: [
    {
      id: "create-product", title: "Create a product", basis: "performed",
      takeaway: "The write route checks the key, then the IAM action for the single table permits the conditional PutItem.",
      steps: [
        makeStep("post-product", "visitor-url", "A create request arrives", "POST /products reaches the Function URL with a valid key.", { log: { method: "POST", target: "/products", note: "Illustrative request" } }),
        makeStep("invoke-lambda", "url-lambda", "The Function URL invokes Lambda", "The URL passes the request to the Python handler."),
        makeStep("check-valid-key", "lambda-api-key", "The key check passes", "The handler compares the supplied key with the configured value before touching the table."),
        makeStep("put-product", "iam-products", "The conditional write succeeds", "PutItem stores the product only if its ID does not already exist.", { log: { method: "PutItem", target: "products-table", status: 201, note: "Illustrative status" } }),
        makeStep("log-create", "lambda-cloudwatch", "The request is logged", "The function emits a request log line to CloudWatch."),
      ],
    },
    {
      id: "read-products", title: "Read products, no key needed", basis: "performed",
      takeaway: "Reads are public by design; the API key is checked only on write routes.",
      steps: [
        makeStep("get-products", "visitor-url", "A read request arrives", "GET /products reaches the Function URL without requiring a key."),
        makeStep("invoke-read", "url-lambda", "Lambda handles the read", "The Python handler routes the request to its read path."),
        makeStep("scan-products", "iam-products", "The function scans the table", "The execution role permits Scan on products-table.", { log: { method: "Scan", target: "products-table", status: 200, note: "Illustrative status" } }),
        makeStep("return-products", "visitor-url", "The response returns", "The API returns the products to the caller." , { direction: "return" }),
      ],
    },
    {
      id: "reject-before-db", title: "Rejected before touching the database", basis: "performed",
      takeaway: "The application rejects an invalid write key before making any DynamoDB call.",
      observedNotes: ["The rejected request took about 4 ms; a separate request that read the table took about 29 ms, based on the function log lines."],
      steps: [
        makeStep("invalid-write", "visitor-url", "A write request has no valid key", "A POST without a key, or a DELETE with a wrong key, reaches the handler.", { log: { method: "POST", target: "/products", note: "Illustrative request" } }),
        makeStep("reject-key", "lambda-api-key", "The key check rejects the request", "The handler returns 401 without calling DynamoDB.", { outcome: "blocked", latencyMs: 4, latencyBasis: "lab", log: { method: "POST", target: "/products", status: 401, note: "Observed in lab" } }),
        makeStep("no-db-call", "lambda-api-key", "The database is not touched", "The rejected write stops at the key check; this step makes the short-circuit explicit.", { outcome: "blocked" }),
        makeStep("reference-read", "iam-products", "A separate read request reaches the table", "For comparison, a separate request that read the table took about 29 ms in its function log line.", { latencyMs: 29, latencyBasis: "lab", log: { method: "GET", target: "/products", status: 200, note: "Observed in lab; separate comparison request" } }),
      ],
    },
    {
      id: "duplicate-create", title: "A duplicate create is refused", basis: "performed",
      takeaway: "The uniqueness condition lives inside the write, so concurrent requests cannot both create the same ID.",
      steps: [
        makeStep("duplicate-post", "visitor-url", "A create request uses an existing ID", "POST /products reaches the handler for an ID already in the table."),
        makeStep("duplicate-key-check", "lambda-api-key", "The key check passes", "The write request is authorized by the handler’s key check."),
        makeStep("condition-fails", "iam-products", "The conditional PutItem fails", "The condition that the ID must not exist prevents the duplicate write.", { outcome: "blocked", log: { method: "PutItem", target: "products-table", status: 409, note: "Illustrative status" } }),
      ],
    },
  ],
};
