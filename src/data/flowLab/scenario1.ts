import type { Scenario, Step } from "./types";

const step = (
  id: string,
  edgeId: string,
  focus: string,
  narration: string,
  options: Partial<Pick<Step, "direction" | "outcome" | "latencyMs" | "nodeStates" | "log">> = {},
): Step => ({
  id,
  edgeId,
  direction: "forward",
  outcome: "ok",
  animMs: 620,
  latencyMs: 24,
  latencyBasis: "illustrative",
  focus,
  narration,
  ...options,
});

export const scenario1: Scenario = {
  id: "web-tier",
  title: "Web tier: load balancer, EC2 and a private bucket",
  summary: "A public entry point routes traffic to a private application path, while an instance role mediates access to private object storage.",
  provenance: {
    lab: "VPC Design & Load Balancing; EC2 Deployment & Application Hosting; S3 Bucket Deployment & Application Integration (TeSA Cloud Engineering track)",
    label: "Resources removed after the lab",
  },
  nodes: [
    {
      id: "visitor", role: "client", label: "CLIENT", service: "Visitor",
      explainer: { what: "A browser making a request to the application.", why: "It represents the public client entering through the load balancer.", alternative: "An application client or command-line request could use the same public entry point.", security: "The visitor cannot connect directly to the application port." },
    },
    {
      id: "igw", role: "edge", label: "EDGE", service: "Internet gateway",
      explainer: { what: "The VPC gateway between internet-routed traffic and public subnet resources.", why: "The public subnets route their default internet path through it.", alternative: "A private-only design would omit public internet ingress and use a different access path.", security: "The gateway provides routing; security groups still control which traffic is admitted." },
    },
    {
      id: "alb", role: "edge", label: "EDGE", service: "ALB :80",
      explainer: { what: "An application load balancer listening for HTTP on port 80.", why: "It is the single public application entry point and forwards to the target group on port 8080.", alternative: "A reverse proxy on a single instance could route requests, but would not provide the same managed target health routing.", security: "Its security group allows HTTP from the internet; the application security group accepts port 8080 only from the ALB security group." },
    },
    {
      id: "app-sg", role: "gate", label: "GATE", service: "app-sg",
      explainer: { what: "A security group attached to the application instance.", why: "It keeps the application listener behind the load balancer.", alternative: "A network ACL can add subnet-level rules, but it does not replace this instance-level source rule.", security: "Port 8080 is allowed only from the ALB security group. SSH is a fallback rule limited to one administrator address." },
      gateRule: "Allow TCP 8080 only when the source is the ALB security group. SSH is a fallback limited to one administrator address; it was not used for administration.",
    },
    {
      id: "ec2", role: "compute", label: "COMPUTE", service: "EC2 app :8080",
      explainer: { what: "An Ubuntu EC2 instance running the application on port 8080.", why: "The target group forwards application traffic to this instance.", alternative: "A managed container or serverless runtime could host an application with different operational tradeoffs.", security: "The app port is not open to arbitrary internet sources; the security group accepts it from the load balancer." },
    },
    {
      id: "instance-role", role: "gate", label: "GATE", service: "Instance role",
      explainer: { what: "An IAM role attached through the instance profile.", why: "It grants the application scoped S3 access without embedding long-lived credentials.", alternative: "Static access keys would require storage and rotation and were not used in this lab.", security: "The application receives temporary credentials from the instance role; the access policy is scoped to the lab bucket." },
      gateRule: "Allow the application’s read and write actions on the lab bucket through the instance role. No access keys are stored in the application.",
    },
    {
      id: "private-bucket", role: "storage", label: "STORAGE", service: "Private bucket",
      explainer: { what: "An S3 bucket with Block Public Access enabled.", why: "Media artifacts live separately from the instance disk and remain private.", alternative: "Instance-local storage is simpler but couples stored files to the lifetime of the compute instance.", security: "Objects are not public; the application reads and writes through the attached role." },
    },
    {
      id: "administrator", role: "control", label: "CONTROL", service: "Administrator",
      explainer: { what: "The administrator initiating an operations session.", why: "This lane shows the administrative access path separately from visitor traffic.", alternative: "The configured SSH rule is a constrained fallback and was not used for administration.", security: "Authorization is checked by IAM before Session Manager establishes the session." },
    },
    {
      id: "user-iam", role: "gate", label: "GATE", service: "IAM authorization",
      explainer: { what: "The IAM authorization check for starting a Session Manager session.", why: "It makes the administrator’s permission check visible before the managed session begins.", security: "Only an authorized principal can start the session." },
      gateRule: "The administrator must be authorized by IAM to start a Session Manager session.",
    },
    {
      id: "ssm", role: "control", label: "CONTROL", service: "Systems Manager",
      explainer: { what: "AWS Systems Manager Session Manager.", why: "It provides the lab’s administrative shell without opening an inbound management port.", alternative: "SSH was present only as a limited fallback rule.", security: "The instance agent connects outbound over HTTPS; session access is authorized through IAM." },
    },
  ],
  edges: [
    { id: "visitor-igw", from: "visitor", to: "igw", kind: "data" },
    { id: "igw-alb", from: "igw", to: "alb", kind: "data" },
    { id: "alb-app-sg", from: "alb", to: "app-sg", kind: "data" },
    { id: "app-sg-ec2", from: "app-sg", to: "ec2", kind: "data" },
    { id: "ec2-role", from: "ec2", to: "instance-role", kind: "control" },
    { id: "role-bucket", from: "instance-role", to: "private-bucket", kind: "data" },
    { id: "admin-ssm", from: "administrator", to: "ssm", kind: "control" },
    { id: "admin-iam", from: "administrator", to: "user-iam", kind: "control" },
    { id: "iam-ssm", from: "user-iam", to: "ssm", kind: "control" },
    { id: "ssm-ec2", from: "ssm", to: "ec2", kind: "control", label: "Session Manager channel" },
    { id: "ec2-ssm-agent", from: "ec2", to: "ssm", kind: "control", label: "Agent outbound HTTPS" },
  ],
  layout: {
    desktop: {
      visitor: { x: 10, y: 45 }, igw: { x: 28, y: 45 }, alb: { x: 46, y: 45 },
      "app-sg": { x: 64, y: 45 }, ec2: { x: 82, y: 45 },
      "instance-role": { x: 72, y: 75 }, "private-bucket": { x: 90, y: 75 },
      administrator: { x: 10, y: 86 }, "user-iam": { x: 28, y: 86 }, ssm: { x: 46, y: 86 },
    },
    mobile: {
      visitor: { x: 50, y: 8 }, igw: { x: 50, y: 17 }, alb: { x: 50, y: 26 },
      "app-sg": { x: 50, y: 35 }, ec2: { x: 50, y: 45 },
      "instance-role": { x: 50, y: 58 }, "private-bucket": { x: 50, y: 68 },
      administrator: { x: 25, y: 84 }, "user-iam": { x: 50, y: 84 }, ssm: { x: 75, y: 84 },
    },
  },
  flows: [
    {
      id: "request-through-alb", title: "A request through the load balancer", basis: "performed",
      takeaway: "The load balancer is the public entry point; the instance application port accepts traffic from the ALB security group.",
      steps: [
        step("request-enters", "visitor-igw", "The visitor sends a request", "The request enters the VPC through its internet gateway.", { log: { method: "GET", target: "/", note: "Illustrative request" } }),
        step("request-reaches-alb", "igw-alb", "The request reaches the ALB", "The application load balancer receives HTTP traffic on port 80."),
        step("alb-forwards", "alb-app-sg", "The ALB selects a healthy target", "The lab target was shown Healthy; the ALB forwards to the target group on port 8080."),
        step("security-group-allows", "app-sg-ec2", "The source rule matches", "The application security group admits port 8080 traffic from the ALB security group.", { log: { target: "app-sg :8080", status: "allow", note: "Source is the ALB security group" } }),
        step("app-responds", "app-sg-ec2", "The application returns its page", "The response leaves the application and follows the established request path back through the ALB.", { direction: "return" }),
        step("response-to-alb", "alb-app-sg", "The response returns through the ALB", "The load balancer relays the application response to the visitor.", { direction: "return" }),
        step("response-to-gateway", "igw-alb", "The response returns through the gateway", "The response follows the public route back toward the visitor.", { direction: "return" }),
        step("response-to-visitor", "visitor-igw", "The page reaches the visitor", "The request and response use the same public entry path.", { direction: "return", log: { method: "GET", target: "/", status: 200, note: "Illustrative status and timing" } }),
      ],
    },
    {
      id: "unhealthy-target", title: "A target fails its health check", basis: "illustrative",
      takeaway: "Health checks let the load balancer stop routing to an unhealthy target. The lab report does not specify a health-check path or interval.",
      steps: [
        step("health-check-error", "alb-app-sg", "The health check receives an error", "The report confirms the health-check port but not its path or interval, so neither is shown.", { outcome: "error", nodeStates: { ec2: "unhealthy" }, log: { target: "target health check", status: "error", note: "Illustrative behaviour; path and interval unspecified" } }),
        step("target-unhealthy", "alb-app-sg", "The target is marked unhealthy", "The ALB removes the unhealthy target from eligible request routing."),
        step("no-healthy-target", "igw-alb", "No healthy target remains", "A request arrives while the target is unhealthy and no healthy target is available.", { outcome: "error" }),
        step("service-unavailable", "visitor-igw", "The request receives 503", "The load balancer returns Service Unavailable while no healthy target remains.", { direction: "return", outcome: "error", log: { method: "GET", target: "/", status: 503, note: "Illustrative failure path" } }),
        step("target-fixed", "alb-app-sg", "The target is fixed and becomes healthy", "After the issue is corrected, the target returns to a healthy state.", { nodeStates: { ec2: "healthy" } }),
        step("traffic-resumes", "alb-app-sg", "Traffic resumes", "The ALB can route requests to the healthy target again."),
      ],
    },
    {
      id: "session-manager", title: "Admin access through Session Manager", basis: "performed",
      takeaway: "Administration used Session Manager and required no open inbound management port.",
      steps: [
        step("admin-authorized", "admin-iam", "IAM authorizes the administrator", "The administrator is authorized to start a Session Manager session.", { log: { target: "Session Manager", status: "allow", note: "Illustrative authorization result" } }),
        step("iam-starts-session", "iam-ssm", "The authorized request reaches Systems Manager", "After authorization, Systems Manager starts the managed session path."),
        step("session-to-instance", "ssm-ec2", "Systems Manager connects to the instance", "The Session Manager channel reaches the instance through its agent."),
        step("agent-outbound", "ec2-ssm-agent", "The agent connects outbound", "The agent initiates an outbound HTTPS connection; the instance does not need an inbound SSH session."),
        step("shell-session", "ssm-ec2", "The shell session opens", "The administrator receives a managed shell session on the instance.", { log: { target: "EC2 shell", status: "connected", note: "Session Manager path" } }),
      ],
    },
    {
      id: "private-upload", title: "A private upload through the instance role", basis: "performed",
      takeaway: "Block Public Access stays enabled; the application mediates object access using temporary role credentials.",
      steps: [
        step("upload-request", "visitor-igw", "The visitor uploads through the app", "The upload request enters through the public application path."),
        step("upload-reaches-alb", "igw-alb", "The request reaches the ALB", "The internet gateway routes the request to the load balancer."),
        step("alb-forwards-upload", "alb-app-sg", "The ALB forwards the upload", "The load balancer sends the request through the application security-group rule."),
        step("app-receives-upload", "app-sg-ec2", "The app receives the upload", "The application security group admits traffic from the ALB security group to port 8080."),
        step("role-credentials", "ec2-role", "The instance role supplies temporary credentials", "The application obtains short-lived role credentials from the instance; no access keys are stored."),
        step("role-allows-write", "role-bucket", "IAM allows the bucket write", "The attached role policy permits the application’s read and write actions on the lab bucket.", { log: { target: "private bucket", status: "allow", note: "Scoped role policy" } }),
        step("object-stored", "role-bucket", "The object is stored privately", "S3 stores the object while Block Public Access remains enabled."),
        step("app-lists-object", "role-bucket", "The app lists and reads the object", "The application uses its role to list the object and provide a working download path."),
        step("object-reaches-app", "role-bucket", "The object returns to the application", "The application reads the private object through its role.", { direction: "return" }),
        step("app-receives-object", "ec2-role", "The app receives the object", "The EC2 application now has the object to deliver to the visitor.", { direction: "return" }),
        step("download-to-security-group", "app-sg-ec2", "The download returns through the app path", "The application sends the response back through the established ALB path.", { direction: "return" }),
        step("download-to-alb", "alb-app-sg", "The download returns through the ALB", "The load balancer relays the application response.", { direction: "return" }),
        step("download-to-gateway", "igw-alb", "The download returns through the gateway", "The response follows the public route back to the visitor.", { direction: "return" }),
        step("download-response", "visitor-igw", "The app delivers the download", "The application returns the requested file through its public entry point; the bucket itself remains private.", { direction: "return", log: { method: "GET", target: "/download", status: 200, note: "Illustrative delivery" } }),
      ],
    },
  ],
};
