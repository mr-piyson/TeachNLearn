import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedTests() {
  console.log("Seeding tests...")

  const authCourse = await prisma.course.findFirst({
    where: { slug: "auth-identity" },
  })

  if (authCourse) {
    const test = await prisma.test.create({
      data: {
        courseId: authCourse.id,
        title: "Authentication and Identity Management - Final Assessment",
        description: "Test your knowledge of authentication concepts, password security, and MFA",
        passingScore: 70,
        timeLimit: 30,
      },
    })

    const questions = [
      {
        question: "What is the primary purpose of authentication?",
        options: JSON.stringify([
          "To verify what a user can access",
          "To verify the identity of a user",
          "To encrypt user data",
          "To monitor user activity",
        ]),
        correctAnswer: "To verify the identity of a user",
        explanation:
          "Authentication is the process of verifying identity (who you are), while authorization determines what you can access.",
        points: 1,
        order: 0,
      },
      {
        question: "Which password hashing algorithm is recommended for modern applications?",
        options: JSON.stringify(["MD5", "SHA-1", "bcrypt", "Base64"]),
        correctAnswer: "bcrypt",
        explanation:
          "bcrypt is a secure, adaptive hashing algorithm designed specifically for passwords. MD5 and SHA-1 are broken, and Base64 is encoding, not hashing.",
        points: 1,
        order: 1,
      },
      {
        question: "What does MFA stand for?",
        options: JSON.stringify([
          "Multiple Factor Authentication",
          "Multi-Factor Authentication",
          "Managed File Access",
          "Master File Authentication",
        ]),
        correctAnswer: "Multi-Factor Authentication",
        explanation: "MFA stands for Multi-Factor Authentication, requiring two or more verification factors.",
        points: 1,
        order: 2,
      },
      {
        question: "Which of the following is NOT a recommended password requirement?",
        options: JSON.stringify([
          "At least 12 characters long",
          "Mix of uppercase and lowercase",
          "Must be changed every 30 days",
          "Include numbers and symbols",
        ]),
        correctAnswer: "Must be changed every 30 days",
        explanation:
          "Forced frequent password changes are no longer recommended as they often lead to weaker passwords. Focus on length and complexity instead.",
        points: 1,
        order: 3,
      },
      {
        question: "What is the most secure type of MFA?",
        options: JSON.stringify([
          "SMS text message",
          "Email verification",
          "Hardware security key",
          "Security questions",
        ]),
        correctAnswer: "Hardware security key",
        explanation:
          "Hardware security keys (like YubiKey) are the most secure MFA method as they are phishing-resistant and cannot be intercepted.",
        points: 1,
        order: 4,
      },
      {
        question: "Why should passwords never be stored in plain text?",
        options: JSON.stringify([
          "It takes up too much storage space",
          "It makes the database slower",
          "If the database is compromised, all passwords are exposed",
          "It violates copyright laws",
        ]),
        correctAnswer: "If the database is compromised, all passwords are exposed",
        explanation:
          "Storing passwords in plain text means that if an attacker gains access to the database, they can immediately see all user passwords.",
        points: 1,
        order: 5,
      },
      {
        question: "What is a salt in password hashing?",
        options: JSON.stringify([
          "A type of encryption algorithm",
          "Random data added to passwords before hashing",
          "A backup password",
          "A password strength indicator",
        ]),
        correctAnswer: "Random data added to passwords before hashing",
        explanation:
          "A salt is random data added to each password before hashing to ensure that identical passwords produce different hashes.",
        points: 1,
        order: 6,
      },
      {
        question: "Which authentication factor is 'something you are'?",
        options: JSON.stringify(["Password", "Security token", "Fingerprint", "PIN code"]),
        correctAnswer: "Fingerprint",
        explanation:
          "Biometric factors like fingerprints, facial recognition, or iris scans represent 'something you are'.",
        points: 1,
        order: 7,
      },
      {
        question: "What is the main vulnerability of SMS-based MFA?",
        options: JSON.stringify([
          "It requires internet connection",
          "It's too expensive",
          "It's vulnerable to SIM swapping attacks",
          "It only works on smartphones",
        ]),
        correctAnswer: "It's vulnerable to SIM swapping attacks",
        explanation:
          "SMS-based MFA can be compromised through SIM swapping, where attackers convince carriers to transfer a phone number to their device.",
        points: 1,
        order: 8,
      },
      {
        question: "What should be included in a secure password reset process?",
        options: JSON.stringify([
          "Send the password via email",
          "Use time-limited reset tokens",
          "Allow unlimited reset attempts",
          "Display security questions publicly",
        ]),
        correctAnswer: "Use time-limited reset tokens",
        explanation:
          "Secure password reset should use time-limited tokens sent via email, never send passwords directly, and limit reset attempts.",
        points: 1,
        order: 9,
      },
    ]

    for (const q of questions) {
      await prisma.question.create({
        data: {
          testId: test.id,
          question: q.question,
          type: "multiple-choice",
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
          order: q.order,
        },
      })
    }
  }

  console.log("Tests seeded successfully!")
}

seedTests()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
