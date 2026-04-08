import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCourseContent() {
  console.log("Seeding course content...");

  // Authentication and Identity Management Course
  const authCourse = await prisma.course.findFirst({
    where: { slug: "auth-identity" },
  });

  if (authCourse) {
    const module1 = await prisma.module.create({
      data: {
        courseId: authCourse.id,
        title: "Introduction to Authentication",
        description: "Learn the fundamentals of authentication and identity management",
        order: 0,
      },
    });

    await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: "What is Authentication?",
        order: 0,
        duration: 15,
        content: `# What is Authentication?

Authentication is the process of verifying the identity of a user, device, or system. It answers the question: "Who are you?"

## Key Concepts

### Authentication vs Authorization
- **Authentication**: Verifying identity (who you are)
- **Authorization**: Verifying permissions (what you can do)

### Common Authentication Factors
1. **Something you know**: Password, PIN, security question
2. **Something you have**: Phone, security token, smart card
3. **Something you are**: Biometrics (fingerprint, face, iris)

## Why Authentication Matters

Without proper authentication:
- Unauthorized users can access sensitive data
- Attackers can impersonate legitimate users
- Systems become vulnerable to account takeover attacks

## Best Practices
- Use strong, unique passwords
- Implement multi-factor authentication (MFA)
- Never store passwords in plain text
- Use secure password hashing algorithms`,
        codeExample: `// Example: Basic password hashing with bcrypt
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}

// Usage
const password = "mySecurePassword123!";
const hash = await hashPassword(password);
console.log("Hashed:", hash);

const isValid = await verifyPassword(password, hash);
console.log("Valid:", isValid); // true`,
      },
    });

    await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: "Password Security Best Practices",
        order: 1,
        duration: 20,
        content: `# Password Security Best Practices

Passwords remain the most common authentication method, making their security critical.

## Password Requirements

### Minimum Standards
- At least 12 characters long
- Mix of uppercase, lowercase, numbers, and symbols
- No dictionary words or common patterns
- No personal information (names, birthdays)

### Password Strength Indicators
Implement real-time feedback to help users create strong passwords.

## Secure Password Storage

**NEVER** store passwords in plain text!

### Hashing Algorithms
Use modern, secure hashing algorithms:
- **bcrypt**: Adaptive, slow by design
- **Argon2**: Winner of Password Hashing Competition
- **scrypt**: Memory-hard function

### Avoid These
- MD5 (broken)
- SHA-1 (broken)
- Plain SHA-256 (too fast)

## Password Reset Security

1. Use time-limited tokens
2. Send reset links via email only
3. Invalidate old tokens after use
4. Require re-authentication for sensitive changes`,
        codeExample: `// Secure password validation
function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push("Password must be at least 12 characters");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letters");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letters");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain numbers");
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain special characters");
  }
  
  // Check against common passwords
  const commonPasswords = ["password123", "qwerty123", "admin123"];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Password is too common");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}`,
      },
    });

    const module2 = await prisma.module.create({
      data: {
        courseId: authCourse.id,
        title: "Multi-Factor Authentication",
        description: "Implement MFA to add an extra layer of security",
        order: 1,
      },
    });

    await prisma.lesson.create({
      data: {
        moduleId: module2.id,
        title: "Understanding MFA",
        order: 0,
        duration: 18,
        content: `# Multi-Factor Authentication (MFA)

MFA requires users to provide two or more verification factors to gain access.

## Why MFA?

Even if a password is compromised, MFA prevents unauthorized access.

### Statistics
- MFA blocks 99.9% of automated attacks (Microsoft)
- Accounts with MFA are significantly less likely to be compromised

## Types of MFA

### 1. SMS/Text Message
- Pros: Easy to implement, widely accessible
- Cons: Vulnerable to SIM swapping, interception

### 2. Authenticator Apps (TOTP)
- Pros: More secure than SMS, works offline
- Cons: Requires app installation
- Examples: Google Authenticator, Authy

### 3. Hardware Tokens
- Pros: Most secure, phishing-resistant
- Cons: Cost, can be lost
- Examples: YubiKey, Titan Security Key

### 4. Biometrics
- Pros: Convenient, hard to steal
- Cons: Privacy concerns, can't be changed if compromised

## Implementation Considerations

1. **Backup Methods**: Always provide backup authentication methods
2. **Recovery Process**: Secure account recovery for lost MFA devices
3. **User Experience**: Balance security with usability`,
        codeExample: `// TOTP (Time-based One-Time Password) implementation
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// Generate secret for new user
function generateMFASecret(userEmail: string) {
  const secret = speakeasy.generateSecret({
    name: \`TeachNLearn Academy (\${userEmail})\`,
    length: 32
  });
  
  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url
  };
}

// Generate QR code for user to scan
async function generateQRCode(otpauthUrl: string): Promise<string> {
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
  return qrCodeDataUrl;
}

// Verify TOTP token
function verifyMFAToken(token: string, secret: string): boolean {
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 2 time steps before/after
  });
  
  return verified;
}`,
      },
    });
  }

  console.log("Course content seeded successfully!");
}

seedCourseContent()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
