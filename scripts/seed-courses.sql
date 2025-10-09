-- Seed initial cybersecurity courses
-- Note: This is a reference. Actual seeding will be done via Prisma seed script

INSERT INTO Course (id, title, slug, description, difficulty, duration, isPublished) VALUES
('course_1', 'Authentication and Identity Management', 'auth-identity', 'Learn secure authentication patterns, password management, MFA, and identity verification techniques', 'beginner', 180, 1),
('course_2', 'Authorization and Access Control', 'authorization-access', 'Master RBAC, ABAC, OAuth 2.0, and secure access control implementations', 'intermediate', 240, 1),
('course_3', 'Input and Output Handling', 'input-output-security', 'Prevent SQL injection, XSS, command injection, and other input-based attacks', 'beginner', 200, 1),
('course_4', 'Data Protection and Cryptography', 'data-crypto', 'Understand encryption, hashing, key management, and data protection strategies', 'intermediate', 300, 1),
('course_5', 'Security Misconfiguration and Hardening', 'security-hardening', 'Learn to identify and fix security misconfigurations in applications and infrastructure', 'intermediate', 220, 1),
('course_6', 'API and Microservice Security', 'api-security', 'Secure REST APIs, GraphQL, and microservice architectures', 'advanced', 280, 1),
('course_7', 'Application and Architecture Design', 'secure-architecture', 'Design secure application architectures and implement security by design principles', 'advanced', 320, 1),
('course_8', 'Logging, Monitoring, and Incident Response', 'logging-monitoring', 'Implement effective logging, monitoring, and incident response procedures', 'intermediate', 260, 1),
('course_9', 'Security Testing and Assurance', 'security-testing', 'Master penetration testing, security audits, and vulnerability assessments', 'advanced', 340, 1),
('course_10', 'Common Attack Mitigation', 'attack-mitigation', 'Defend against CSRF, clickjacking, and other common client-side attacks', 'beginner', 190, 1);
