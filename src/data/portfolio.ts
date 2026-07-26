// Portfolio content source of truth.
// Current content is inferred from the CV and GitHub repository list.
// Keep visual-theme decisions out of this file; this is durable profile data.
export const profile = {
  name: "Oluwatobiloba Oyeyemi",
  handle: "Tobi",
  headline: "Cloud Engineer & Network Engineer",
  location: "Lagos, Nigeria",
  email: "oluwatobilobaoyeyemi07@gmail.com",
  phone: "+234 802 838 5587",
  github: "https://github.com/XayZay",
  linkedin: "https://www.linkedin.com/in/oluwatobilobaoyeyemi",
  resumeUrl: "/documents/Oyeyemi_Oluwatobiloba_CV.pdf",
  company: "tobstar inc.",
  summary:
    "Computer Science student focused on cloud infrastructure, network engineering, and secure systems. I build and deploy cloud-backed tools, configure network environments, and document practical infrastructure work from lab to production.",
  availability:
    "Open to Cloud Engineer and Network Engineer roles, internships, and infrastructure-focused project work.",
};

export const education = [
  {
    school: "Covenant University",
    location: "Ota, Ogun State",
    degree: "B.Sc. Computer Science",
    start: "Sept 2022",
    end: "Expected Aug 2026",
  },
];

export const focusAreas = [
  {
    title: "Cloud Infrastructure",
    description:
      "AWS EC2, S3, IAM, Lambda, DynamoDB, VPC, Security Groups, CloudWatch, Docker, Nginx, and cloud deployment patterns.",
    icon: "cloud",
  },
  {
    title: "Network Engineering",
    description:
      "Network commissioning, switch and router configuration, firewall setup, structured cabling, Huawei and Cisco hardware, pfSense, and monitoring.",
    icon: "network",
  },
  {
    title: "Security-Aware Systems",
    description:
      "Cybersecurity labs, vulnerability assessment, penetration testing fundamentals, digital forensics, malware analysis, Kali Linux, and Metasploit.",
    icon: "shield",
  },
];

export const experienceHighlights = [
  "Networking Intern at Tolaram Africa Enterprise Ltd., supporting office network commissioning from scratch.",
  "Configured Huawei switches, access points, firewalls, and managed deployment through AUGIX MSP Net Portal.",
  "Assisted a Cisco-to-Huawei switch migration while maintaining firewall configuration and network security continuity.",
  "Deployed Snipe-IT for IT asset management and supported monitoring, troubleshooting, helpdesk operations, topology documentation, and incident logs.",
];

export const experience = [
  {
    company: "Tolaram Africa Enterprise Ltd.",
    role: "Networking Intern",
    location: "Lagos, Nigeria",
    start: "Mar 2025",
    end: "Sep 2025",
    highlights: [
      "Participated in end-to-end network commissioning of a new office, including structured cabling, switch configuration, access points, firewalls, and MSP portal deployment.",
      "Assisted a company-wide switch upgrade from legacy Cisco switches to newer Huawei hardware.",
      "Deployed and configured Snipe-IT for structured IT asset management across office hardware inventory.",
      "Supported day-to-day network monitoring, troubleshooting, helpdesk operations, network topology documentation, and incident logs.",
    ],
  },
];

export const projects = [
  {
    title: "X Telegram Bot Downloader",
    description:
      "Cloud video delivery system deployed on AWS EC2. The bot downloads X/Twitter videos at user-selected quality, stores files in a private S3 bucket, and serves them through Nginx with resumable HTTP range-request support.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=600&fit=crop",
    technologies: ["Python", "AWS EC2", "S3", "IAM", "FastAPI", "Docker", "Nginx", "SQLite", "yt-dlp"],
    github: "https://github.com/XayZay/x-telegram-bot-downloader",
    status: "Cloud Project",
  },
  {
    title: "Ghost Pay: Voice Payment Backend",
    description:
      "Voice-activated payment backend that transcribes audio with Whisper, parses payment intent with Gemini, routes payment through Kora checkout, and confirms transactions through WhatsApp.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&h=600&fit=crop",
    technologies: ["TypeScript", "Firebase Cloud Functions", "Firestore", "Whisper API", "Gemini", "Kora Payments", "WhatsApp API"],
    github: "https://github.com/XayZay/GhostPay_BackendClient",
    status: "Backend Cloud",
  },
  {
    title: "Ghost Pay: AWS Backend Client",
    description:
      "AWS-focused Ghost Pay backend/client implementation exploring TypeScript service orchestration and cloud-ready payment infrastructure patterns for the broader voice-payment system.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=600&fit=crop",
    technologies: ["TypeScript", "AWS", "Backend Services", "Payment Infrastructure"],
    github: "https://github.com/XayZay/GhostPay_Backend_AWS_Client",
    status: "AWS Backend",
  },
  {
    title: "pfSense Firewall Lab",
    description:
      "Multi-VM secure network lab with pfSense firewall rules across Windows 11, Windows Server 2022, and Kali Linux. Included Active Directory setup, domain joining, and group policy practice.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=600&fit=crop",
    technologies: ["pfSense", "Windows Server 2022", "Windows 11", "Kali Linux", "Active Directory", "VirtualBox"],
    github: null,
    status: "Network Lab",
  },
  {
    title: "Windows VM Penetration Test",
    description:
      "Controlled penetration testing lab against Windows 11 and Metasploitable 2, practicing vulnerability exploitation, privilege escalation, defense evasion, and post-exploitation techniques.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&h=600&fit=crop",
    technologies: ["Metasploit", "Kali Linux", "Windows 11", "Metasploitable 2", "VirtualBox"],
    github: null,
    status: "Security Lab",
  },
  {
    title: "File Converter CLI",
    description:
      "Offline Python command-line tool supporting 43 file conversions across documents, images, eBooks, data formats, and markup. Built with cross-platform dependency handling and a clean terminal UI.",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=900&h=600&fit=crop",
    technologies: ["Python", "Poppler", "LibreOffice", "WeasyPrint", "CLI"],
    github: "https://github.com/XayZay/file_converter",
    status: "Python Tooling",
  },
  {
    title: "Keylogger: Ethical Research Keystroke Monitor",
    description:
      "Lab-only ethical research project for studying keystroke monitoring and system activity capture in isolated environments, with the goal of understanding offensive techniques and improving defensive awareness.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&h=600&fit=crop",
    technologies: ["Python", "Security Research", "Lab Environment"],
    github: "https://github.com/XayZay/Keylogger",
    status: "Ethical Research",
  },
];

export const skillGroups = [
  {
    title: "Cloud & Infrastructure",
    skills: ["AWS EC2", "S3", "IAM", "Lambda", "DynamoDB", "VPC", "Security Groups", "CloudWatch", "Docker", "Nginx"],
  },
  {
    title: "Networking",
    skills: ["Network commissioning", "Switch/router configuration", "Firewall setup", "Huawei hardware", "Cisco hardware", "pfSense", "Structured cabling"],
  },
  {
    title: "Security",
    skills: ["Ethical hacking", "Penetration testing", "Vulnerability assessment", "Digital forensics", "Malware analysis", "Kali Linux", "Metasploit"],
  },
  {
    title: "Programming & Tools",
    skills: ["Python", "TypeScript", "PHP", "SQL", "FastAPI", "Firebase", "Wireshark", "Snipe-IT", "AUGIX MSP Net Portal", "VirtualBox", "VMware"],
  },
];

export const certifications = [
  { name: "CyberOps Associate", issuer: "Cisco NetAcad", status: "Completed" },
  { name: "Cybersecurity Essentials", issuer: "Cisco NetAcad", status: "Completed" },
  { name: "Ethical Hacking", issuer: "Cisco NetAcad", status: "Completed" },
  { name: "Ethical Hacking", issuer: "The Cyber Mentor / TCM Security", status: "Completed" },
  { name: "IT Essentials", issuer: "Cisco NetAcad", status: "Completed" },
  { name: "Microsoft Office Specialist: Office 2019", issuer: "Microsoft", status: "Completed" },
  { name: "Prompt Engineering for LLMs", issuer: "OBTranslate", status: "Completed" },
  { name: "AWS Solutions Architect Associate (SAA-C03)", issuer: "AWS", status: "In View" },
  { name: "CCNA", issuer: "Cisco", status: "In View" },
];

export const metrics = [
  { value: "2026", label: "Expected B.Sc. Computer Science graduation" },
  { value: "7", label: "Featured cloud, network, security, and tooling projects" },
  { value: "9", label: "Completed and in-view certifications" },
];
