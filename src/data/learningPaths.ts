import { Question } from "@/components/QuizComponent";

export interface SubModule {
  title: string;
  subtitle: string;
  points: string[];
  caseStudy?: {
    title: string;
    description: string;
  };
  complianceWarning?: string;
}

export interface PathData {
  id: "staff" | "management" | "board";
  title: string;
  tagline: string;
  iconName: "staff" | "management" | "board";
  timeEstimate: string;
  introduction: string;
  modules: SubModule[];
  quiz: Question[];
}

export const learningPaths: Record<"staff" | "management" | "board", PathData> = {
  staff: {
    id: "staff",
    title: "Credit Union Staff Learning Path",
    tagline: "Everyday AI Operations, Tools, Prompting, and Data Safety",
    iconName: "staff",
    timeEstimate: "20 Mins",
    introduction: "Welcome to the Staff Learning Path! As frontline staff, loan officers, or member service agents, you represent the human connection that credit unions are famous for. This path is designed to show you how Agentic AI can help you serve members faster, while keeping their data secure.",
    modules: [
      {
        title: "1. What is an AI Agent?",
        subtitle: "Understanding the difference between standard search engines, static chatbots, and autonomous agents.",
        points: [
          "Traditional Chatbots are tree-based: they follow rigid rules and cannot handle requests outside their script.",
          "Generative AI (like basic ChatGPT) responds to single inputs, but does not take actions automatically.",
          "Agentic AI is different: It can reason, form a multi-step plan, use tools (like searching a loan policy or querying a database), and reflect on its own work to solve complex tasks."
        ],
        caseStudy: {
          title: "Real-World Staff Scenario: The Auto Loan Policy Inquiry",
          description: "Instead of you scrolling through a 50-page PDF loan guide, an Agentic Assistant reads the policy, extracts the exact interest rate tier for a used hybrid car, and drafts a custom email reply in seconds."
        }
      },
      {
        title: "2. The Golden Rule of Member Privacy (PII)",
        subtitle: "How to safely interact with AI agents without exposing sensitive credit union and member data.",
        points: [
          "PII stands for Personally Identifiable Information. This includes member SSNs, account numbers, home addresses, dates of birth, and credit scores.",
          "NEVER paste a member's real PII into public AI search boxes or external tools. Once entered, that data can be indexed and exposed.",
          "Use safe placeholders when drafting messages. For example: Change 'John Smith who has account 12345' to 'Member A who has a standard checking account'."
        ],
        complianceWarning: "Under the Gramm-Leach-Bliley Act (GLBA) and NCUA rules, credit unions are legally required to protect member nonpublic personal information. A single leak of member data through an AI prompt can result in regulatory fines and loss of member trust."
      },
      {
        title: "3. Effective Prompting for Frontline Staff",
        subtitle: "How to write instructions to get accurate, compliant results from AI systems.",
        points: [
          "Give Context: Tell the AI who it is representing. Example: 'You are an empathetic Credit Union Member Service Rep...'",
          "Define the Output: Specify the format. Example: 'Draft a three-paragraph friendly response explaining why a check has a 2-day hold.'",
          "Set Constraints: Explicitly list what NOT to do. Example: 'Do not promise a waiver of the fee, but explain the process to request one.'"
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "How does an 'Agentic AI' system differ from a traditional search engine or simple chatbot?",
        options: [
          "It is autonomous, can use tools, make decisions, and reflect on its output to solve multi-step problems.",
          "It is simply faster at searching database keywords.",
          "It requires constant manual code modifications to answer new questions.",
          "It is unable to save context or remember user inputs."
        ],
        correctIndex: 0,
        explanation: "Agentic AI uses large language models to reason, construct plans, select and invoke external tools (like database lookups or calculators), and review its progress, making it highly autonomous compared to simple static chatbots."
      },
      {
        id: 2,
        question: "A member asks you to check if they qualify for a rate discount. You want to use a public AI assistant to write a professional email. What is the safest way to do this?",
        options: [
          "Paste the member's full name, credit score, and current loan balance so the AI writes a specific draft.",
          "Copy and paste the entire member database record into the AI prompt.",
          "Use general, anonymized terms (e.g. 'Member A, 5-year member, Tier 2 credit score') instead of actual personal details.",
          "Public AI tools are completely secure, so you can paste any data safely."
        ],
        correctIndex: 2,
        explanation: "To comply with data privacy laws (like GLBA) and protect member trust, you must never input Personally Identifiable Information (PII) into public AI models. Anonymizing details is the correct approach."
      },
      {
        id: 3,
        question: "What is an AI 'system prompt' or 'guardrail' in a credit union software application?",
        options: [
          "The loading animation displayed while the AI fetches a response.",
          "Hardcoded rules and boundary constraints that guide the agent's behavior to ensure safety and compliance.",
          "The speed of the network connection between the credit union and the AI server.",
          "The billing tier of the AI software subscription."
        ],
        correctIndex: 1,
        explanation: "System prompts and guardrails are the 'fences' built around an AI agent. They instruct it on what roles to assume, what information to restrict (like masking account numbers), and when to escalate to a human employee."
      }
    ]
  },
  management: {
    id: "management",
    title: "Credit Union Management Learning Path",
    tagline: "System Design, RAG, Automation, and Operational Oversight",
    iconName: "management",
    timeEstimate: "25 Mins",
    introduction: "Welcome to the Management Learning Path! As managers, team leaders, and operations executives, you are tasked with identifying efficiency gains. This path explains how agentic AI architectures are designed, and how to deploy them in compliance with financial regulations.",
    modules: [
      {
        title: "1. The Anatomy of an Enterprise Agent",
        subtitle: "How RAG, vector databases, and tools allow agents to operate on credit union data without model retraining.",
        points: [
          "Retrieval-Augmented Generation (RAG) is the gold standard for secure AI. Instead of teaching the model your policies, RAG searches your secure files first, copies the relevant text, and feeds it to the AI as a reference.",
          "Vector Databases act like index books, converting documents into mathematical vectors to quickly find conceptually matching information.",
          "Tool Integrations (APIs) allow agents to read core banking systems, call credit bureaus, or calculate debt-to-income (DTI) ratios."
        ],
        caseStudy: {
          title: "Real-World Management Case: Underwriting Assistant",
          description: "An underwriting agent automatically reviews an auto loan application, pulls the credit bureau score, searches the internal lending handbook for rate criteria, calculates the DTI, flags exceptions, and outputs a clean recommendation report for the human underwriter."
        }
      },
      {
        title: "2. Regulatory Compliance & Fair Lending (BSA/AML/NCUA)",
        subtitle: "Navigating safety, fairness, and explainability requirements in automated decisions.",
        points: [
          "Fair Lending regulations require that credit decisions be non-discriminatory. If an AI agent recommends declining a loan, the reasoning must be clear, explainable, and free of bias.",
          "Audit Trails: Every step the agent took (which policy it searched, what credit score it read, what calculation it performed) must be recorded in an immutable log for internal audits and NCUA examinations.",
          "Vendor Due Diligence: You must ensure that third-party AI systems encrypt data in transit and at rest, and adhere to strict SOC 2 type II security standards."
        ],
        complianceWarning: "The NCUA actively examines how credit unions handle automated and algorithmic tools. Management must be able to explain the inputs, variables, and boundaries of any AI model used in lending or risk scoring."
      },
      {
        title: "3. Human-in-the-Loop (HITL) Architecture",
        subtitle: "Designing AI workflows that combine agent efficiency with human judgment.",
        points: [
          "HITL is an architectural pattern where the AI does not have full autonomy. It conducts research, drafts recommendations, and waits for a human click before executing high-risk commands.",
          "High-Risk Triggers: Actions like executing wire transfers, changing interest rates, final loan approvals/denials, and sending official regulatory disclosures MUST require human approval.",
          "Human review acts as a secondary buffer, catching hallucinations, biases, or tool malfunctions before they affect members."
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Why is RAG (Retrieval-Augmented Generation) critical for a credit union's AI agent?",
        options: [
          "It completely replaces the need for using large language models.",
          "It allows the agent to safely search and reference private, up-to-date credit union policies without retraining the model.",
          "It speeds up the front-end rendering of the chatbot interface.",
          "It guarantees that the agent will never hallucinate or make mistakes."
        ],
        correctIndex: 1,
        explanation: "RAG searches secure, internal documents first, copies relevant context, and provides it to the LLM. This grounds the model in real credit union guidelines, providing accurate, up-to-date answers without needing expensive retraining."
      },
      {
        id: 2,
        question: "Under NCUA guidelines and Fair Lending rules, what is a key requirement when deploying an underwriting helper agent?",
        options: [
          "The decision-making logic of the agent must remain proprietary and secret.",
          "Lending recommendations must be explainable, bias-free, and backed by human oversight and audit trails.",
          "The agent must automatically approve a set quota of loan applications.",
          "The credit union should implement the tool without testing to gain an early market advantage."
        ],
        correctIndex: 1,
        explanation: "Financial regulators mandate that credit decisions be explainable and non-discriminatory. Having robust audit trails showing *why* a loan recommendation was made, alongside human verification, is essential to comply with Fair Lending guidelines."
      },
      {
        id: 3,
        question: "What does 'Human-in-the-Loop' (HITL) mean in agentic workflow design?",
        options: [
          "An architecture where the agent handles repetitive research and recommendations, but pauses for human approval before executing high-risk actions.",
          "A design where a human developer sits next to the database servers at all times.",
          "When credit union members are required to call support rather than using self-service options.",
          "The cycle of retraining models using code written solely by AI engines."
        ],
        correctIndex: 0,
        explanation: "Human-in-the-Loop (HITL) ensures high-risk commands (such as lending decisions or funds transfers) require explicit authorization by a credit union employee, balancing machine efficiency with human safety and accountability."
      }
    ]
  },
  board: {
    id: "board",
    title: "Credit Union Board Learning Path",
    tagline: "AI Strategy, Governance, NCUA Compliance, and Strategic Oversight",
    iconName: "board",
    timeEstimate: "15 Mins",
    introduction: "Welcome to the Board of Directors Learning Path! As board members, you bear the ultimate fiduciary responsibility for the safety and soundness of the credit union. This path outlines the strategic oversight, regulatory compliance, risk frameworks, and ROI evaluations necessary for Board oversight.",
    modules: [
      {
        title: "1. Board Fiduciary Duties & AI Governance",
        subtitle: "How the board provides strategic oversight and protects member assets in the AI era.",
        points: [
          "Establish an AI Policy: The board must review and approve policies that define acceptable use, risk tolerance, and compliance standards for AI tools.",
          "Strategic Alignment: AI initiatives should align with the credit union's mission—serving members, improving financial health, and maintaining security.",
          "Risk Appetite: The board defines the appetite for technological risk (e.g., pilot programs vs. full core integration)."
        ],
        caseStudy: {
          title: "Real-World Board Scenario: Vendor Due Diligence",
          description: "Instead of approving management's request for a third-party 'AI Debt Collections Agent' based on price alone, the Board requests a SOC 2 audit, a copy of the vendor's bias-mitigation audit, and verification of compliance with the Fair Debt Collection Practices Act (FDCPA)."
        }
      },
      {
        title: "2. The NCUA Regulatory Landscape",
        subtitle: "Key supervisory expectations for model risk management, cybersecurity, and vendor oversight.",
        points: [
          "NCUA Letter to Credit Unions 22-CU-05 (and related guides) highlights third-party vendor risk and cyber-resiliency as top exam priorities.",
          "Model Risk Management (MRM): Boards must verify that management is actively validation AI models for accuracy, drift, and performance.",
          "Consumer Protection: Regulators look at automated tools to ensure they don't lead to unfair, deceptive, or abusive acts or practices (UDAAP)."
        ],
        complianceWarning: "The NCUA's supervisory focus has shifted heavily toward cybersecurity and vendor risk management. The board is expected to demonstrate active oversight, meaning you must ask management critical questions about where member data is processed and how it is secured."
      },
      {
        title: "3. Strategic ROI & Risk Assessment",
        subtitle: "Balancing the competitive need to innovate with the obligation to protect capital.",
        points: [
          "Competitive Risk: Credit unions that delay AI integration risk losing younger members to tech-forward banks or fintechs.",
          "Capital Security: Implementation costs must be balanced against measurable operational gains (e.g., lower cost-to-serve, reduced fraud losses).",
          "Board-Level Reporting: Require quarterly dashboards showing AI performance, exception reports, compliance audit checks, and member feedback metrics."
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: "What is the primary fiduciary duty of a Credit Union Board member regarding AI deployment?",
        options: [
          "To allow management to implement any software without board involvement.",
          "To ensure the credit union has established a robust AI risk management framework, vendor oversight, and regulatory compliance alignment.",
          "To personally write the software prompts and system instructions.",
          "To advocate for the complete replacement of human staff with AI agents."
        ],
        correctIndex: 1,
        explanation: "Fiduciary duty requires directors to ensure that proper controls, policies, risk assessments, and vendor evaluations are in place to safeguard member assets, regulatory standing, and reputation."
      },
      {
        id: 2,
        question: "Which regulatory agency provides primary supervision and guidelines on risk management for credit union operations?",
        options: [
          "The FDIC (Federal Deposit Insurance Corporation).",
          "The SEC (Securities and Exchange Commission).",
          "The NCUA (National Credit Union Administration).",
          "The CFPB (Consumer Financial Protection Bureau) only."
        ],
        correctIndex: 2,
        explanation: "The NCUA (National Credit Union Administration) is the independent federal agency that regulates, charters, and supervises federal credit unions, outlining compliance and risk expectations."
      },
      {
        id: 3,
        question: "How should a Board evaluate the security risk of a third-party Agentic AI vendor?",
        options: [
          "Rely entirely on the vendor's marketing brochures.",
          "Verify the vendor's SOC 2 reports, data privacy policies, regulatory compliance records, and model testing logs through management.",
          "Deploy the tool first and assess the vendor's security only if a breach occurs.",
          "Assume that all AI cloud vendors have identical security standards."
        ],
        correctIndex: 1,
        explanation: "Fiduciary oversight requires rigorous vendor due diligence. Boards must request management to compile audit papers (SOC 2, ISO certifications), verify compliance with consumer lending laws, and evaluate data security before sign-off."
      }
    ]
  }
};
