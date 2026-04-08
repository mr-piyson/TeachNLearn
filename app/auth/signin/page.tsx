import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/signin-form";
import Link from "next/link";
import { Shield } from "lucide-react";

export default async function SignInPage() {
  // const session = await auth.api.getSession({ headers: await headers() })

  // if (session) {
  //   redirect("/dashboard")
  // }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TeachNLearn Academy</span>
          </Link>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground mt-2">Sign in to continue your learning journey</p>
        </div>

        <SignInForm />

        <p className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
