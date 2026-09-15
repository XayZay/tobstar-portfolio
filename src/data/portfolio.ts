/**
 * Portfolio content — single source of truth.
 *
 * CONTENT RULES (do not break these):
 * - Nothing here is invented. No metrics, no scale, no users, no uptime.
 * - Labs stay labs. Learning stays learning. "In view" certs are never
 *   presented as earned.
 * - TeSA Foundations is professional development facilitated by Univaciti.
 *   Univaciti is NOT an employer.
 * - Keep visual/theme decisions out of this file.
 */

export type ProjectTier = "flagship" | "featured" | "additional";

export interface CaseStudySection {
  label: string;
  body: string;
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  tier: ProjectTier;
  year: string;
  summary: string;
  /** Short lines shown under the project on the index page. */
  highlights: string[];
  stack: string[];
  github: string | null;
  /** Present only for projects with a full case-study page. */
  caseStudy?: {
    problem: string;
    approach: string;
    sections: CaseStudySection[];
    /** Layered architecture flow. Rendered as a diagram, not an image. */
    diagram?: {
      caption: string;
      layers: { label: string; nodes: string[] }[];
    };
    decisions: { question: string; answer: string }[];
    learned: string[];
    /** Framing note for security-sensitive work. */
    disclosure?: string;
  };
}

export const profile = {
  name: "Oyeyemi Oluwatobiloba",
  brand: "TOBSTAR",
  short: "Tobi",
  role: "Cloud / Infrastructure / Security",
  location: "Lagos, Nigeria",
  email: "oluwatobilobaoyeyemi07@gmail.com",
  github: "https://github.com/XayZay",
  linkedin: "https://www.linkedin.com/in/oluwatobilobaoyeyemi",
  resumeUrl: "/documents/Oyeyemi_Oluwatobiloba_CV.pdf",
  availability: "Open to junior engineering roles",
  /** Hero supporting copy. Specific, not aspirational filler. */
  positioning:
    "Networking and cybersecurity foundations, extending into cloud infrastructure and backend systems.",
  elaboration:
    "I started at the physical layer — cabling, switches, firewalls — and worked upward into the systems that run on top of them. Most of what I build has to run somewhere, so I spend my time on how it runs.",
} as const;

export const navItems = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Learning", href: "/#learning" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

/** Hero status strip. Factual, present-tense. */
export const currentFocus = {
  label: "Current focus",
  value: "Cloud engineering & infrastructure",
  detail: "AWS architecture, networking, deployment workflows, infrastructure security.",
} as const;

/* ---------------------------------------------------------------------------
   Projects, ordered by deliberate hierarchy. 01 is the flagship.
   --------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    slug: "x-telegram-bot",
    index: "01",
    title: "X Telegram Bot Downloader",
    subtitle: "Cloud-deployed video delivery system",
    category: "Cloud Infrastructure / Backend",
    tier: "flagship",
    year: "2025",
    summary:
      "A Telegram bot that downloads X/Twitter videos at a user-selected quality and delivers them through a backend running on AWS. The interesting part isn't the download — it's everything around it: where files live, who is allowed to read them, and how storage stays bounded without manual cleanup.",
    highlights: [
      "Deployed on AWS EC2 behind an Nginx reverse proxy",
      "Private S3 storage, reached through an IAM role rather than static keys",
      "Resumable delivery via HTTP range requests",
      "Per-user rate limiting, daily quotas, dedupe caching, automatic cleanup",
    ],
    stack: ["Python", "FastAPI", "AWS EC2", "S3", "IAM", "Docker", "Nginx", "SQLite", "yt-dlp"],
    github: "https://github.com/XayZay/x-telegram-bot-downloader",
    caseStudy: {
      problem:
        "Pulling a video off X and getting it into Telegram at a chosen quality sounds like a one-file script. It stops being one the moment more than one person uses it. Downloads are slow and can fail midway. Files accumulate. Storage costs money. And a naive build ends up with cloud credentials sitting in source code, which is the part that actually matters.",
      approach:
        "I treated it as a small piece of infrastructure rather than a bot. A FastAPI service does the work, Docker makes the deployment reproducible, Nginx sits in front of it, and the artifacts live in object storage instead of on the instance disk. The bot is the interface; the service and its storage are the system.",
      sections: [
        {
          label: "Compute",
          body: "The service runs on an AWS EC2 instance, containerised with Docker so the runtime, system-level dependencies and yt-dlp version are pinned together and the box can be rebuilt from scratch without hand-configuration drift.",
        },
        {
          label: "Storage",
          body: "Downloaded media goes to a private S3 bucket with no public access. Keeping the artifacts off the instance's local disk means the instance stays disposable — nothing of value is lost if it's replaced — and storage scales independently of the compute.",
        },
        {
          label: "Access",
          body: "The service reaches S3 through an IAM role attached to the instance, so the application receives temporary, rotated credentials from the instance metadata service. There is no access key in the repository, in an environment file, or in the image.",
        },
        {
          label: "Delivery",
          body: "Nginx terminates connections in front of the application and serves downloads with HTTP range-request support, so a transfer interrupted on a bad connection resumes from where it stopped rather than restarting.",
        },
        {
          label: "Control",
          body: "SQLite holds the operational state: per-user rate limits, daily quotas, and a dedupe cache keyed on the source video so a link two people request is fetched once. A cleanup routine expires stored objects so the bucket doesn't grow without bound.",
        },
      ],
      diagram: {
        caption: "Request path, from chat message to delivered file",
        layers: [
          { label: "Client", nodes: ["Telegram"] },
          { label: "Edge", nodes: ["Nginx", "TLS / range requests"] },
          { label: "Application", nodes: ["FastAPI", "yt-dlp", "Docker"] },
          { label: "State", nodes: ["SQLite", "quotas · dedupe"] },
          { label: "Storage", nodes: ["S3 (private)", "IAM role"] },
        ],
      },
      decisions: [
        {
          question: "Why a private bucket instead of public objects?",
          answer:
            "A public bucket would have been fewer steps. It also would have meant any leaked or guessed URL is permanently readable by anyone, and no way to revoke it. Private storage with mediated access keeps the decision about who reads a file with the application.",
        },
        {
          question: "Why an IAM role instead of access keys?",
          answer:
            "Static keys have to be stored somewhere, and the places they end up — a config file, an env var, a commit — are the places they leak from. An instance role hands the application short-lived credentials that rotate automatically and can be revoked by detaching the role.",
        },
        {
          question: "Why put Nginx in front of the application?",
          answer:
            "It separates connection handling from application logic. Nginx absorbs slow clients, terminates TLS, and handles range requests, which keeps the FastAPI workers free for actual work instead of being tied up on a slow transfer.",
        },
        {
          question: "Why keep state at all?",
          answer:
            "Without rate limits and quotas, one user can saturate the instance, and without a dedupe cache, the same popular video is downloaded repeatedly. Both are storage and bandwidth problems before they're user-experience problems.",
        },
      ],
      learned: [
        "Credential handling is an architecture decision, not a configuration detail — choosing role-based access shaped how the whole service was deployed.",
        "Treating the instance as disposable forces you to be honest about where state actually lives.",
        "Unbounded storage is a slow failure. Expiry has to be designed in, not added after the bucket gets large.",
      ],
    },
  },
  {
    slug: "ghost-pay",
    index: "02",
    title: "Ghost Pay",
    subtitle: "Voice-activated payment backend",
    category: "Backend / Cloud Functions / Payments",
    tier: "featured",
    year: "2025",
    summary:
      "A backend that turns a spoken instruction into a completed payment. Audio is transcribed, the intent is parsed, a checkout is created, and the result is confirmed back to the user over WhatsApp — with the verification steps that a money-moving path requires.",
    highlights: [
      "Audio → transcription → intent → checkout → confirmation",
      "JWT verification on authenticated routes",
      "Kora webhook signature validation before any state change",
      "Firestore rules enforcing merchant transaction isolation",
    ],
    stack: [
      "TypeScript",
      "Firebase Cloud Functions v2",
      "Firestore",
      "Whisper API",
      "Gemini",
      "Kora Payments",
      "WhatsApp API",
    ],
    github: "https://github.com/XayZay/GhostPay_BackendClient",
    caseStudy: {
      problem:
        "Voice is a forgiving interface for people and an unforgiving one for software. A spoken instruction arrives as audio, not structured data, and the thing it's asking for is a payment — which is exactly the category of operation where an ambiguous parse or an unverified callback is unacceptable.",
      approach:
        "I built it as a pipeline of narrow stages on Firebase Cloud Functions v2, each with one job and a defined output. Transcription is separate from interpretation, interpretation is separate from execution, and nothing touches transaction state until the payment provider's callback has been cryptographically verified.",
      sections: [
        {
          label: "Transcription",
          body: "Incoming audio is transcribed with the Whisper API, converting the spoken instruction into text before any attempt is made to understand what it's asking for.",
        },
        {
          label: "Intent",
          body: "The transcript is processed with Gemini to extract structured payment intent from natural phrasing, so the wording a person actually uses becomes fields the system can act on.",
        },
        {
          label: "Execution",
          body: "The resolved intent is routed to Kora to create a checkout. The application initiates the payment; it does not attempt to settle it internally.",
        },
        {
          label: "Confirmation",
          body: "Transaction outcomes are confirmed back to the user over the WhatsApp API, closing the loop in the same conversational medium the request started in.",
        },
        {
          label: "Trust boundaries",
          body: "Authenticated routes verify a JWT before doing work. Inbound Kora webhooks have their signature validated, so a forged callback cannot mark a transaction paid. Firestore security rules isolate each merchant's transactions so records can't be read across tenant boundaries.",
        },
      ],
      diagram: {
        caption: "Pipeline, from spoken instruction to confirmed transaction",
        layers: [
          { label: "Input", nodes: ["Audio"] },
          { label: "Understand", nodes: ["Whisper", "Gemini"] },
          { label: "Execute", nodes: ["Cloud Functions v2", "Kora checkout"] },
          { label: "Persist", nodes: ["Firestore", "rules · isolation"] },
          { label: "Confirm", nodes: ["WhatsApp"] },
        ],
      },
      decisions: [
        {
          question: "Why validate the webhook signature?",
          answer:
            "A webhook endpoint is a publicly reachable URL that mutates transaction state. Without signature validation, anyone who finds it can claim a payment succeeded. Verifying it is what makes the callback trustworthy enough to act on.",
        },
        {
          question: "Why separate transcription from intent parsing?",
          answer:
            "They fail differently. Bad audio is a transcription problem; an ambiguous instruction is an interpretation problem. Keeping them as distinct stages makes it possible to tell which one went wrong.",
        },
        {
          question: "Why enforce isolation in Firestore rules?",
          answer:
            "Rules are enforced at the data layer, so isolation holds even if a query elsewhere in the codebase is written carelessly. Access control belongs as close to the data as possible.",
        },
      ],
      learned: [
        "In a payment flow, the security work isn't a layer on top of the feature — it's most of the feature.",
        "Probabilistic components (transcription, intent parsing) need hard boundaries around them before they're allowed to trigger irreversible actions.",
      ],
    },
  },
  {
    slug: "pfsense-lab",
    index: "03",
    title: "pfSense Firewall Lab",
    subtitle: "Multi-VM segmented network",
    category: "Networking / Security",
    tier: "featured",
    year: "2024",
    summary:
      "A segmented virtual network built to practise the parts of network security that are hard to learn from reading: where to place a firewall, what a rule actually blocks, and how identity and policy propagate across domain-joined machines.",
    highlights: [
      "pfSense enforcing segmentation between isolated VM subnets",
      "Granular allow/deny rules written per segment",
      "Active Directory with domain-joined Windows clients",
      "Group policy and access-control concepts applied hands-on",
    ],
    stack: ["pfSense", "Windows Server 2022", "Windows 11", "Kali Linux", "VirtualBox"],
    github: null,
    caseStudy: {
      problem:
        "Firewall rules are simple to describe and easy to get subtly wrong. Reading about segmentation doesn't tell you what breaks when a rule is too narrow, or what's still reachable when it's too broad. I wanted an environment where I could be wrong safely and see it.",
      approach:
        "I built a multi-VM network in VirtualBox with pfSense as the gateway between segments, then placed a Windows Server 2022 domain controller, a Windows 11 client and a Kali Linux host into that topology so traffic between them had to cross rules I had written myself.",
      sections: [
        {
          label: "Segmentation",
          body: "pfSense sits between the network segments as the enforcement point, so traffic between zones is subject to explicit rules rather than passing by default.",
        },
        {
          label: "Policy",
          body: "Firewall rules were written per segment and tested by attempting the traffic they were meant to permit and deny, which is the only way to confirm a rule does what its description claims.",
        },
        {
          label: "Identity",
          body: "Windows Server 2022 runs Active Directory with the Windows 11 client joined to the domain, making identity a property of the network rather than of each individual machine.",
        },
        {
          label: "Access control",
          body: "Group policy was used to apply configuration and restrictions centrally, which is the same principle as cloud IAM — define the permission once, attach it to identities, rather than configuring each endpoint.",
        },
      ],
      diagram: {
        caption: "Lab topology",
        layers: [
          { label: "Gateway", nodes: ["pfSense"] },
          { label: "Segments", nodes: ["Server subnet", "Client subnet", "Test subnet"] },
          { label: "Hosts", nodes: ["Windows Server 2022", "Windows 11", "Kali Linux"] },
          { label: "Identity", nodes: ["Active Directory", "Group Policy"] },
        ],
      },
      decisions: [
        {
          question: "Why segment at all in a lab this small?",
          answer:
            "A flat network never demonstrates what a firewall rule is for. Segments create the boundaries that make the rules meaningful and the mistakes visible.",
        },
        {
          question: "Why bring Active Directory into a firewall lab?",
          answer:
            "Network access and identity aren't separate problems in practice. Domain-joining the client meant policy and identity had to work across the segmentation rather than alongside it.",
        },
      ],
      learned: [
        "The gap between a rule's intent and its effect only closes when you test both the traffic it should allow and the traffic it should stop.",
        "Group policy and cloud IAM are the same idea wearing different clothes: centralised permission, attached to identity.",
      ],
    },
  },
  {
    slug: "file-converter",
    index: "04",
    title: "File Converter",
    subtitle: "Offline universal conversion CLI",
    category: "Software Engineering / Tooling",
    tier: "featured",
    year: "2024",
    summary:
      "A pip-installable command-line tool that converts files entirely offline across 43 conversion paths — documents, images, ebooks, data and markup — without sending anything to a third-party service.",
    highlights: [
      "43 conversion paths across five file categories",
      "Fully offline — no upload, no external service",
      "Cross-platform handling of native dependencies",
      "Terminal progress output and smart output-path suggestions",
    ],
    stack: ["Python", "Poppler", "LibreOffice", "WeasyPrint", "CLI"],
    github: "https://github.com/XayZay/file_converter",
    caseStudy: {
      problem:
        "Most file conversion happens on a website, which means uploading the file to someone else's server. For anything sensitive that's the wrong trade, and it fails entirely without a connection. Doing it locally instead means confronting the awkward part: the tools that do the actual conversion are native binaries that install differently on every operating system.",
      approach:
        "I wrapped a set of proven conversion engines — Poppler, LibreOffice, WeasyPrint — behind one consistent command-line interface, and put the effort into dependency detection and error messaging so the tool behaves the same way regardless of platform.",
      sections: [
        {
          label: "Coverage",
          body: "43 conversion paths spanning documents, images, ebooks, data formats and markup, reachable through a single command rather than a different tool per format.",
        },
        {
          label: "Offline by design",
          body: "Every conversion runs locally. Nothing is uploaded, which makes the tool usable for files that shouldn't leave the machine and keeps it working with no network at all.",
        },
        {
          label: "Dependency handling",
          body: "The native dependencies exist at different paths and under different names across platforms. The tool detects what's present and reports what's missing in terms of the actual fix, rather than failing with a raw traceback.",
        },
        {
          label: "Interface",
          body: "Packaged for pip installation, with progress indication during long conversions and sensible inferred output paths so the common case needs no extra flags.",
        },
      ],
      decisions: [
        {
          question: "Why wrap existing engines instead of writing conversions?",
          answer:
            "Poppler and LibreOffice encode years of format edge cases. Reimplementing that would produce a worse result. The value here is the unified interface and the dependency handling, not the conversion itself.",
        },
        {
          question: "Why insist on offline?",
          answer:
            "It's the property that makes the tool different from a web converter. Once files leave the machine, the privacy question is out of the user's hands.",
        },
      ],
      learned: [
        "A CLI's real surface area is its error messages — an unhandled missing dependency is where most users would have given up.",
        "Cross-platform support is mostly the unglamorous work of not assuming where things are installed.",
      ],
    },
  },
  {
    slug: "windows-pentest-lab",
    index: "05",
    title: "Windows VM Penetration Test",
    subtitle: "Privilege escalation & defense evasion",
    category: "Offensive Security / Lab",
    tier: "featured",
    year: "2024",
    summary:
      "A controlled penetration testing exercise against intentionally vulnerable machines in an isolated virtual lab, working through exploitation, privilege escalation, post-exploitation and defense evasion.",
    highlights: [
      "Isolated VirtualBox lab against purpose-built vulnerable targets",
      "Vulnerability identification and exploitation with Metasploit",
      "Privilege escalation and post-exploitation workflow",
      "Defense evasion studied to understand what detection is up against",
    ],
    stack: ["Metasploit", "Kali Linux", "Windows 11", "Metasploitable 2", "VirtualBox"],
    github: null,
    caseStudy: {
      disclosure:
        "Conducted entirely in an isolated virtual lab against Metasploitable 2 and a Windows 11 VM I own, both intentionally vulnerable and configured for this purpose. No third-party system was involved at any point. This work is documented here for what it taught me about defending systems.",
      problem:
        "Defensive work is guesswork if you've never seen the offensive side execute. I wanted to understand the actual sequence an attacker follows after a foothold — not the summary of it, the steps.",
      approach:
        "I built a closed lab in VirtualBox with a Kali attacker and intentionally vulnerable targets, then worked through a full chain: enumeration, exploitation, escalation, and persistence, noting at each stage what would have generated a detectable signal.",
      sections: [
        {
          label: "Enumeration",
          body: "Service and vulnerability identification against the targets to establish what was actually exposed, which is where the majority of the useful work happens.",
        },
        {
          label: "Exploitation",
          body: "Known vulnerabilities exercised with Metasploit to obtain an initial foothold on the target system.",
        },
        {
          label: "Escalation",
          body: "Moving from initial access to higher privilege, which is the step that turns a limited foothold into meaningful control of the host.",
        },
        {
          label: "Post-exploitation",
          body: "Working through what access enables after the fact, and examining defense evasion techniques to understand the conditions detection has to operate under.",
        },
      ],
      decisions: [
        {
          question: "Why study evasion rather than just exploitation?",
          answer:
            "Detection is designed against an adversary who is actively trying not to be seen. Understanding how that's attempted is what makes defensive tooling choices informed rather than assumed.",
        },
      ],
      learned: [
        "Enumeration is the majority of the work; exploitation is comparatively short once you know what's there.",
        "Each offensive step leaves signals somewhere — knowing which ones makes logging and monitoring decisions concrete rather than generic.",
      ],
    },
  },
  {
    slug: "keylogger-research",
    index: "06",
    title: "Keystroke Monitor",
    subtitle: "Ethical research build",
    category: "Security Research / Lab",
    tier: "featured",
    year: "2024",
    summary:
      "A Python keystroke capture built and run in an isolated research environment to study how input monitoring works at a technical level, and what that implies for detecting it.",
    highlights: [
      "Built and executed only in an isolated lab environment",
      "Studied to understand the technique and its detection surface",
      "Framed around defensive countermeasures, not deployment",
    ],
    stack: ["Python", "Security research", "Isolated lab"],
    github: "https://github.com/XayZay/Keylogger",
    caseStudy: {
      disclosure:
        "Built and run exclusively on an isolated machine I control, as a technique study. It was never deployed to any system belonging to anyone else, and it isn't presented here as a tool — the point of the exercise was understanding what this class of software does so it can be recognised and defended against.",
      problem:
        "Input monitoring is one of the most common components of real malware, and it's frequently described in the abstract. I wanted to understand mechanically how it hooks into a system, because that's what determines how it can be detected.",
      approach:
        "I implemented a minimal keystroke capture in Python inside a contained environment, then examined it from the defender's perspective: what it touches, what traces it leaves, and where a monitoring tool would notice it.",
      sections: [
        {
          label: "Mechanism",
          body: "A minimal implementation, built to understand how keyboard input is intercepted at the operating-system level rather than to produce a capable tool.",
        },
        {
          label: "Containment",
          body: "Written and executed only within an isolated environment, with no capture of anyone else's input at any stage.",
        },
        {
          label: "Defensive reading",
          body: "Examined for its detection surface — the behaviours and artifacts that distinguish this class of software from legitimate input handling.",
        },
      ],
      decisions: [
        {
          question: "Why build it rather than read about it?",
          answer:
            "The detection-relevant details are in the implementation. Reading a description tells you it hooks the keyboard; building it tells you what that hook actually looks like from the outside.",
        },
      ],
      learned: [
        "The mechanism is straightforward, which is precisely why detection focuses on behaviour and persistence rather than the capture itself.",
      ],
    },
  },
];

/** Lower-priority work. Real, but deliberately not part of the main sequence. */
export const additionalWork = [
  {
    title: "Port-Aware Edge-Feature Enhanced GNN for Network Intrusion Detection",
    context: "Final year research · Covenant University",
    note: "Multi-class network intrusion detection using a graph neural network that incorporates port awareness and edge features.",
    stack: ["Python", "Graph neural networks", "Network intrusion detection"],
    github: null,
  },
  {
    title: "CrossRoute",
    context: "Interswitch × Enyata buildathon",
    note: "Next.js MVP foundation for escrow and cross-border payout routing, covering funding flows, milestone release logic and payout routing.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/XayZay/ENYATA_BUILDATHON",
  },
];

/* ---------------------------------------------------------------------------
   Experience — real, hands-on infrastructure work.
   --------------------------------------------------------------------------- */

export const experience = [
  {
    company: "Tolaram Africa Enterprise Ltd.",
    role: "Networking Intern",
    location: "Lagos, Nigeria",
    start: "Mar 2025",
    end: "Sep 2025",
    intro:
      "Worked on physical network infrastructure — commissioning, configuration, migration and day-to-day support across the corporate environment.",
    groups: [
      {
        label: "Commissioning",
        items: [
          "Participated in end-to-end commissioning of a new office network from scratch",
          "Structured cabling",
          "Access point deployment",
        ],
      },
      {
        label: "Configuration",
        items: [
          "Huawei switch configuration",
          "Firewall configuration",
          "Switch upgrade and migration from legacy Cisco equipment to Huawei",
        ],
      },
      {
        label: "Operations",
        items: [
          "Network monitoring and troubleshooting",
          "Network support and helpdesk",
          "Maintained incident logs",
          "Documented network topology",
        ],
      },
      {
        label: "Systems",
        items: [
          "Deployed and configured Snipe-IT for IT asset management",
          "Worked with the AUGIX MSP Net Portal",
        ],
      },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Learning & professional development. Explicitly NOT employment.
   --------------------------------------------------------------------------- */

export const learning = {
  program: {
    name: "TeSA Foundations",
    facilitator: "Facilitated by Univaciti, a Qucoon subsidiary",
    note: "Professional development programme",
    tracks: [
      { name: "Cloud Foundations", emphasis: true },
      { name: "Software Engineering Foundations", emphasis: false },
      { name: "Data Foundations", emphasis: false },
    ],
  },
  selfDirected: {
    label: "Currently learning",
    intro:
      "Self-directed study toward cloud engineering. Listed as study, not as experience.",
    groups: [
      {
        label: "AWS",
        items: ["EC2", "S3", "IAM", "VPC", "Security Groups", "Lambda", "DynamoDB", "CloudWatch"],
      },
      {
        label: "Cloud concepts",
        items: [
          "On-premises vs cloud",
          "IaaS / PaaS / SaaS",
          "Capacity planning",
          "Auto scaling",
          "Load balancing",
          "Availability & reliability",
          "RTO / RPO",
          "Well-Architected Framework",
        ],
      },
      {
        label: "Networking",
        items: [
          "CIDR",
          "Subnets",
          "Route tables",
          "Internet Gateway",
          "NAT",
          "Packet flow",
          "ARP",
          "MAC addressing",
        ],
      },
      {
        label: "Engineering",
        items: ["Linux", "Git", "GitHub", "Docker", "CI/CD", "Deployment workflows"],
      },
    ],
  },
} as const;

export const education = [
  {
    school: "Covenant University",
    location: "Ota, Ogun State",
    degree: "B.Sc. Computer Science",
    end: "Expected August 2026",
  },
] as const;

/* ---------------------------------------------------------------------------
   Skills. Categories, no proficiency bars, no percentages.
   --------------------------------------------------------------------------- */

export const skillGroups = [
  {
    label: "Cloud & Infrastructure",
    items: ["AWS EC2", "AWS S3", "IAM", "VPC", "Lambda", "DynamoDB", "CloudWatch", "Docker", "Nginx"],
  },
  {
    label: "Networking",
    items: [
      "Network commissioning",
      "Switch / router configuration",
      "Firewall setup",
      "Huawei",
      "Cisco",
      "pfSense",
      "Structured cabling",
    ],
  },
  {
    label: "Security",
    items: [
      "Ethical hacking",
      "Penetration testing",
      "Vulnerability assessment",
      "Digital forensics",
      "Malware analysis",
      "Kali Linux",
      "Metasploit",
    ],
  },
  {
    label: "Development",
    items: ["Python", "TypeScript", "PHP", "SQL", "FastAPI"],
  },
  {
    label: "Tools",
    items: ["Wireshark", "Snipe-IT", "AUGIX MSP Net Portal", "VirtualBox", "VMware", "Windows Server"],
  },
] as const;

/* ---------------------------------------------------------------------------
   Certifications. Earned and in-view are kept visually distinct.
   --------------------------------------------------------------------------- */

export const certifications = {
  earned: [
    { name: "CyberOps Associate", issuer: "Cisco NetAcad" },
    { name: "Cybersecurity Essentials", issuer: "Cisco NetAcad" },
    { name: "Ethical Hacking", issuer: "Cisco NetAcad" },
    { name: "IT Essentials", issuer: "Cisco NetAcad" },
    { name: "Ethical Hacking", issuer: "TCM Security" },
    { name: "Microsoft Office Specialist 2019", issuer: "Microsoft" },
    { name: "Prompt Engineering for LLMs", issuer: "OBTranslate" },
  ],
  inView: [
    { name: "AWS Solutions Architect Associate", issuer: "Amazon Web Services" },
    { name: "CCNA", issuer: "Cisco" },
  ],
} as const;

/* ---------------------------------------------------------------------------
   About — the trajectory, told as a progression.
   --------------------------------------------------------------------------- */

export const about = {
  paragraphs: [
    "I started with networks — the physical layer, where a cable either terminates correctly or nothing works. That taught me to think about systems from the bottom up, and it's still how I approach anything I build.",
    "Security came next, because understanding how a network is supposed to behave makes it obvious how much depends on that assumption holding. I spent time in controlled labs breaking things to see what that actually looks like.",
    "Then backend systems, which moved me from supporting infrastructure to building the things that run on it. That's where the two halves met: code that has to be deployed, reached, secured and kept running is a networking problem as much as a software one.",
    "Now I'm focused on cloud infrastructure — how compute, storage, networking and access control fit together, and why they're arranged the way they are. I'm not finished with that; I'm deliberately in the middle of it.",
  ],
  trajectory: [
    { stage: "Networking", state: "foundation" },
    { stage: "Cybersecurity", state: "foundation" },
    { stage: "Backend systems", state: "building" },
    { stage: "Cloud infrastructure", state: "current" },
  ],
} as const;

export const contact = {
  heading: "Open to the next problem.",
  body: "If you're building infrastructure, backend systems or security tooling, I'd like to hear about it. I'm looking for junior engineering roles where I can work on systems that actually run.",
  links: [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "GitHub", value: "github.com/XayZay", href: profile.github },
    { label: "LinkedIn", value: "in/oluwatobilobaoyeyemi", href: profile.linkedin },
  ],
} as const;
