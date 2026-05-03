

CREATE SCHEMA public AUTHORIZATION neondb_owner;



CREATE TABLE public.verification (
	id text NOT NULL,
	identifier text NOT NULL,
	value text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT verification_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX verification_identifier_value_key ON public.verification USING btree (identifier, value);



CREATE TABLE public."user" (
	id text NOT NULL,
	"name" text NOT NULL,
	email text NOT NULL,
	"emailVerified" bool DEFAULT false NOT NULL,
	image text NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"role" text DEFAULT 'teacher'::text NULL,
	"teacherId" text NULL,
	CONSTRAINT user_pkey PRIMARY KEY (id),
	CONSTRAINT "user_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."user"(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);
CREATE INDEX "user_teacherId_idx" ON public."user" USING btree ("teacherId");



CREATE TABLE public."Course" (
	id text NOT NULL,
	title text NOT NULL,
	slug text NOT NULL,
	description text NOT NULL,
	thumbnail text NULL,
	difficulty text NOT NULL,
	duration int4 NOT NULL,
	"isPublished" bool DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"teacherId" text NULL,
	CONSTRAINT "Course_pkey" PRIMARY KEY (id),
	CONSTRAINT "Course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."user"(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Course_slug_key" ON public."Course" USING btree (slug);
CREATE INDEX "Course_teacherId_idx" ON public."Course" USING btree ("teacherId");






CREATE TABLE public."Module" (
	id text NOT NULL,
	"courseId" text NOT NULL,
	title text NOT NULL,
	description text NOT NULL,
	"order" int4 NOT NULL,
	"content" text DEFAULT ''::text NOT NULL,
	"codeExample" text NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "Module_pkey" PRIMARY KEY (id),
	CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Module_courseId_idx" ON public."Module" USING btree ("courseId");


CREATE TABLE public."Test" (
	id text NOT NULL,
	"courseId" text NOT NULL,
	title text NOT NULL,
	description text NOT NULL,
	"passingScore" int4 DEFAULT 70 NOT NULL,
	"timeLimit" int4 NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "Test_pkey" PRIMARY KEY (id),
	CONSTRAINT "Test_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON DELETE CASCADE ON UPDATE CASCADE
);




CREATE TABLE public."TestResult" (
	id text NOT NULL,
	"userId" text NOT NULL,
	"testId" text NOT NULL,
	score int4 NOT NULL,
	answers text NOT NULL,
	passed bool NOT NULL,
	"completedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "TestResult_pkey" PRIMARY KEY (id),
	CONSTRAINT "TestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "TestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "TestResult_testId_idx" ON public."TestResult" USING btree ("testId");
CREATE INDEX "TestResult_userId_idx" ON public."TestResult" USING btree ("userId");



CREATE TABLE public.account (
	id text NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text NULL,
	"refreshToken" text NULL,
	"idToken" text NULL,
	"accessTokenExpiresAt" timestamp(3) NULL,
	"refreshTokenExpiresAt" timestamp(3) NULL,
	"scope" text NULL,
	"password" text NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT account_pkey PRIMARY KEY (id),
	CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE public."session" (
	id text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"ipAddress" text NULL,
	"userAgent" text NULL,
	"userId" text NOT NULL,
	CONSTRAINT session_pkey PRIMARY KEY (id),
	CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX session_token_key ON public.session USING btree (token);



CREATE TABLE public."Certificate" (
	id text NOT NULL,
	"userId" text NOT NULL,
	"courseId" text NOT NULL,
	"certificateNumber" text NOT NULL,
	"issuedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Certificate_pkey" PRIMARY KEY (id),
	CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON public."Certificate" USING btree ("certificateNumber");
CREATE INDEX "Certificate_courseId_idx" ON public."Certificate" USING btree ("courseId");
CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON public."Certificate" USING btree ("userId", "courseId");
CREATE INDEX "Certificate_userId_idx" ON public."Certificate" USING btree ("userId");




CREATE TABLE public."Lesson" (
	id text NOT NULL,
	"moduleId" text NOT NULL,
	title text NOT NULL,
	"content" text NOT NULL,
	"videoUrl" text NULL,
	"codeExample" text NULL,
	"order" int4 NOT NULL,
	duration int4 NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "Lesson_pkey" PRIMARY KEY (id),
	CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."Module"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Lesson_moduleId_idx" ON public."Lesson" USING btree ("moduleId");



CREATE TABLE public."Progress" (
	id text NOT NULL,
	"userId" text NOT NULL,
	"lessonId" text NOT NULL,
	completed bool DEFAULT false NOT NULL,
	"completedAt" timestamp(3) NULL,
	"timeSpent" int4 DEFAULT 0 NOT NULL,
	CONSTRAINT "Progress_pkey" PRIMARY KEY (id),
	CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Progress_lessonId_idx" ON public."Progress" USING btree ("lessonId");
CREATE INDEX "Progress_userId_idx" ON public."Progress" USING btree ("userId");
CREATE UNIQUE INDEX "Progress_userId_lessonId_key" ON public."Progress" USING btree ("userId", "lessonId");



CREATE TABLE public."Question" (
	id text NOT NULL,
	"testId" text NOT NULL,
	question text NOT NULL,
	"type" text NOT NULL,
	"options" text NOT NULL,
	"correctAnswer" text NOT NULL,
	explanation text NULL,
	points int4 DEFAULT 1 NOT NULL,
	"order" int4 NOT NULL,
	CONSTRAINT "Question_pkey" PRIMARY KEY (id),
	CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Question_testId_idx" ON public."Question" USING btree ("testId");

CREATE TABLE public."Enrollment" (
	id text NOT NULL,
	"userId" text NOT NULL,
	"courseId" text NOT NULL,
	"enrolledAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"completedAt" timestamp(3) NULL,
	progress int4 DEFAULT 0 NOT NULL,
	CONSTRAINT "Enrollment_pkey" PRIMARY KEY (id),
	CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Enrollment_courseId_idx" ON public."Enrollment" USING btree ("courseId");
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON public."Enrollment" USING btree ("userId", "courseId");
CREATE INDEX "Enrollment_userId_idx" ON public."Enrollment" USING btree ("userId");
