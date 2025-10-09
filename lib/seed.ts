import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create courses
  const courses = [
    {
      id: "course_1",
      title: "Authentication and Identity Management",
      slug: "auth-identity",
      description:
        "Learn secure authentication patterns, password management, MFA, and identity verification techniques with hands-on examples",
      difficulty: "beginner",
      duration: 180,
      isPublished: true,
    },
    {
      id: "course_2",
      title: "Authorization and Access Control",
      slug: "authorization-access",
      description: "Master RBAC, ABAC, OAuth 2.0, and secure access control implementations",
      difficulty: "intermediate",
      duration: 240,
      isPublished: true,
    },
    {
      id: "course_3",
      title: "Input and Output Handling (Injection Prevention)",
      slug: "input-output-security",
      description: "Prevent SQL injection, XSS, command injection, and other input-based attacks",
      difficulty: "beginner",
      duration: 200,
      isPublished: true,
    },
    {
      id: "course_4",
      title: "Data Protection and Cryptography",
      slug: "data-crypto",
      description: "Understand encryption, hashing, key management, and data protection strategies",
      difficulty: "intermediate",
      duration: 300,
      isPublished: true,
    },
    {
      id: "course_5",
      title: "Security Misconfiguration and Hardening",
      slug: "security-hardening",
      description: "Learn to identify and fix security misconfigurations in applications and infrastructure",
      difficulty: "intermediate",
      duration: 220,
      isPublished: true,
    },
    {
      id: "course_6",
      title: "API and Microservice Security",
      slug: "api-security",
      description: "Secure REST APIs, GraphQL, and microservice architectures",
      difficulty: "advanced",
      duration: 280,
      isPublished: true,
    },
    {
      id: "course_7",
      title: "Application and Architecture Design",
      slug: "secure-architecture",
      description: "Design secure application architectures and implement security by design principles",
      difficulty: "advanced",
      duration: 320,
      isPublished: true,
    },
    {
      id: "course_8",
      title: "Logging, Monitoring, and Incident Response",
      slug: "logging-monitoring",
      description: "Implement effective logging, monitoring, and incident response procedures",
      difficulty: "intermediate",
      duration: 260,
      isPublished: true,
    },
    {
      id: "course_9",
      title: "Security Testing and Assurance",
      slug: "security-testing",
      description: "Master penetration testing, security audits, and vulnerability assessments",
      difficulty: "advanced",
      duration: 340,
      isPublished: true,
    },
    {
      id: "course_10",
      title: "Common Attack Mitigation (Client-Side & Other)",
      slug: "attack-mitigation",
      description: "Defend against CSRF, clickjacking, and other common client-side attacks",
      difficulty: "beginner",
      duration: 190,
      isPublished: true,
    },
  ]

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {},
      create: course,
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
