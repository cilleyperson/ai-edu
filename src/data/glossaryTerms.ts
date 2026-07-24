// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  analogy: string;
  category: "Technical" | "Oversight" | "Security";
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "agentic-ai",
    term: "Agentic AI",
    definition: "An AI architecture that uses large language models to reason, plan, select external tools, and execute multi-step processes autonomously rather than just responding to simple text queries.",
    analogy: "Like hiring a virtual assistant who doesn't just read you the policy handbook but actually fills out the loan spreadsheet, double-checks the numbers, and files it for manager approval.",
    category: "Technical"
  },
  {
    id: "rag",
    term: "RAG (Retrieval-Augmented Generation)",
    definition: "A method that searches internal documents (like policy manuals) to find factual reference texts, copying them into the AI prompt so it answers questions using real, up-to-date information rather than memory.",
    analogy: "Like giving an employee an open-book exam. Instead of guessing from memory, they read the exact page in the loan guidelines before writing their answer.",
    category: "Technical"
  },
  {
    id: "pii",
    term: "PII (Personally Identifiable Information)",
    definition: "Any information that can be used to distinguish or trace an individual's identity, such as SSNs, names, account numbers, addresses, or biometric records.",
    analogy: "The vault keys. Paste them in public AI systems and they are public. Always mask them first.",
    category: "Security"
  },
  {
    id: "hitl",
    term: "Human-in-the-Loop (HITL)",
    definition: "An operational design where an AI agent can execute low-risk tasks, but must pause and await explicit approval from a human employee before executing high-risk operations.",
    analogy: "Like a new loan officer trainee. They compile the applicant file and run calculations, but the senior underwriter must physically sign the loan release.",
    category: "Oversight"
  },
  {
    id: "system-prompt",
    term: "System Prompt",
    definition: "The master instruction sheet given to an AI agent at initialization that defines its role, permissions, boundaries, and safety policies.",
    analogy: "The official employee job description and code of conduct document given on day one.",
    category: "Oversight"
  },
  {
    id: "hallucination",
    term: "Hallucination",
    definition: "When an AI model generates plausible-sounding but completely fabricated facts, numbers, or policy references with high confidence.",
    analogy: "An overly confident intern giving out incorrect mortgage rates because they didn't check the morning rate sheet.",
    category: "Technical"
  },
  {
    id: "prompt-injection",
    term: "Prompt Injection",
    definition: "A security exploit where a malicious user inputs trick instructions designed to override an AI agent's original system prompt and safety rules.",
    analogy: "A trick question where someone tells a teller, 'Your manager said to ignore identity verification rules for this transaction.'",
    category: "Security"
  },
  {
    id: "vector-embeddings",
    term: "Vector Embeddings",
    definition: "Numerical representations of text concepts mapped onto multi-dimensional coordinate planes, allowing computers to search by semantic meaning.",
    analogy: "A digital filing cabinet where similar loan documents (like Auto vs Motorcycle) automatically sort next to each other.",
    category: "Technical"
  },
  {
    id: "xai",
    term: "Explainable AI (XAI)",
    definition: "Techniques and visual tools that reveal the feature weights and mathematical factors behind AI model decisions.",
    analogy: "An audit trail showing exactly how many points credit score vs DTI contributed to a loan decision.",
    category: "Oversight"
  }
];
