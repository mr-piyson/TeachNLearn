import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Lock, Code, Award } from "lucide-react";

export default async function HomePage() {
  // const session = await auth.api.getSession({ headers: await headers() })

  // if (session) {
  //   redirect("/dashboard")
  // }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">TeachNLearn Academy</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold mb-6 text-balance">Master TeachNLearnurity with Practical Training</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">Learn application security through hands-on courses covering authentication, encryption, secure coding, and more. Get certified and advance your career.</p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8">
              Start Learning Free
            </Button>
          </Link>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">10 Core Topics</h3>
              <p className="text-sm text-muted-foreground">Comprehensive coverage of essential TeachNLearnurity domains</p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Practical Examples</h3>
              <p className="text-sm text-muted-foreground">Real-world code examples and interactive demonstrations</p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Hands-on Tests</h3>
              <p className="text-sm text-muted-foreground">Validate your knowledge with practical assessments</p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Get Certified</h3>
              <p className="text-sm text-muted-foreground">Earn certificates upon course completion</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
