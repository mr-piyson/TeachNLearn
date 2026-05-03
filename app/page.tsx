"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  BookOpen,
  Code2,
  Award,
  Users,
  Globe,
  Zap,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  Play,
  TrendingUp,
  Clock,
  BarChart3,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { trpc } from "@/lib/trpc/client";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    desc: "Learn from practitioners with real-world experience across 50+ in-demand categories.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: Code2,
    title: "Hands-On Projects",
    desc: "Build a portfolio with projects designed to impress hiring managers.",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    desc: "Earn certificates recognised by top companies around the world.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Users,
    title: "Teach & Earn",
    desc: "Share your expertise and build passive income by publishing your own courses.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    icon: Globe,
    title: "Learn Anywhere",
    desc: "Mobile-first with offline access so you learn on your own schedule.",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    icon: Zap,
    title: "AI-Powered Paths",
    desc: "Personalised learning paths that adapt to your pace, goals and progress.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
];

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
function Marquee() {
  return (
    <div className="overflow-hidden border-y border-border bg-muted/30 py-3">
      <motion.div
        className="flex gap-2.5 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground transition-colors"
          >
            {cat}
          </Badge>
        ))}
      </motion.div>
    </div>
  );
}

const CATEGORIES = [
  "Development",
  "Design",
  "AI & ML",
  "Marketing",
  "Business",
  "Data Science",
  "DevOps",
  "Cybersecurity",
  "Photography",
  "Finance",
  "Writing",
  "Music",
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

// ─── BACKGROUND ANIMATION COMPONENT ──────────────────────────────────────────
function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Mesh */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-10%] opacity-30"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, #ddd6fe 0%, transparent 50%), radial-gradient(circle at 80% 70%, #bae6fd 0%, transparent 50%)",
          filter: "blur(80px)",
        }}
      />

      {/* Floating Orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -60, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: 300 + i * 50,
            height: 300 + i * 50,
            left: `${20 + i * 30}%`,
            top: `${10 + i * 20}%`,
            backgroundColor: i === 0 ? "#8b5cf6" : i === 1 ? "#0ea5e9" : "#f59e0b",
          }}
        />
      ))}
    </div>
  );
}

// ─── COUNTER ──────────────────────────────────────────────────────────────────
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = target / (1600 / 16);
    const t = setInterval(() => {
      n += step;
      if (n >= target) {
        setCount(target);
        clearInterval(t);
      } else setCount(Math.floor(n));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      animate={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0)",
        borderBottomColor: scrolled ? "rgba(215,215,215,0.8)" : "rgba(215,215,215,0)",
        backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
      }}
      style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-5 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.02 }}>
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-background" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              Teach<span className="text-muted-foreground font-normal">N</span>Learn
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="sm" className="text-sm rounded-lg px-4">
                Get Started
              </Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white/95 backdrop-blur border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-5 py-4 flex flex-col gap-3">
              {["Courses", "Teach", "Pricing", "Blog"].map((item) => (
                <a key={item} href="#" className="text-sm text-muted-foreground py-1">
                  {item}
                </a>
              ))}
              <Separator />
              <div className="flex gap-2 pt-1">
                <Link href="/auth/signin" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signin" className="flex-1">
                  <Button className="w-full" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });
  const activeUsers = trpc.public.activeUsers.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* NEW BACKGROUND ANIMATION */}
        <BackgroundAnimation />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        {/* Static Blobs (Preserved and updated with subtle movement) */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/70 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-100/60 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          className="relative z-10 container mx-auto px-5 max-w-5xl text-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <Badge
              variant="outline"
              className="mb-7 px-4 py-1.5 rounded-full text-xs font-medium border-border shadow-sm bg-white/80 backdrop-blur"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 inline-block animate-pulse" />
              {activeUsers.data}+ users already inside
              <ArrowRight className="h-3 w-3 ml-2 text-muted-foreground" />
            </Badge>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-5">
            {["The Place to", "Teach, Learn", "& Grow"].map((line, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" animate="show" custom={i + 1}>
                <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-bold tracking-tight leading-[1.05] text-foreground block">
                  {i === 1 ? (
                    <>
                      <span className="relative inline-block">
                        Teach
                        <motion.span
                          className="absolute bottom-1 left-0 right-0 h-0.75 bg-foreground rounded-full origin-left block"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </span>
                      , Learn
                    </>
                  ) : (
                    line
                  )}
                </h1>
              </motion.div>
            ))}
          </div>

          {/* Sub */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-9"
          >
            Join the world's most vibrant learning community. Master in-demand skills, share what you know, and unlock
            real career opportunities.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <Link href="/auth/signin">
              <Button
                size="lg"
                className="rounded-xl px-7 h-12 text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                Start Learning Free <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
            className="mt-14 flex items-center justify-center gap-6 flex-wrap"
          >
            <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">Developed By</span>
            {["Nouf Khalid Nasser Albusmait"].map((co) => (
              <span key={co} className="text-xs font-semibold text-muted-foreground/50 tracking-wider">
                {co}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint line */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <motion.div
            className="w-px h-10 bg-linear-to-b from-transparent via-border to-transparent mx-auto"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── FEATURES ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-5 max-w-7xl">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <Badge
              variant="secondary"
              className="mb-3 text-xs font-semibold uppercase tracking-widest rounded-full px-3 py-1"
            >
              Why TeachNLearn
            </Badge>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight text-foreground leading-tight">
              Everything you need to
              <br />
              <span className="text-muted-foreground font-normal">succeed, in one place</span>
            </h2>
          </motion.div>

          <div ref={featuresRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border border-border bg-white hover:border-foreground/15 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div
                      className={`w-10 h-10 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}
                    >
                      <f.icon className={`h-5 w-5 ${f.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 text-sm">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="py-24 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-5 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="text-5xl mb-5 inline-block"
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              🚀
            </motion.div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-foreground leading-tight mb-4">
              Your next chapter
              <br />
              starts today
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md mx-auto">
              Join a quarter million learners already transforming their careers. Your first course is on us — no credit
              card required.
            </p>
            <Link href="/auth/signin">
              <Button
                size="lg"
                className="rounded-xl px-8 h-12 text-sm font-semibold shadow-md hover:shadow-xl transition-shadow"
              >
                Start Learning Free — It's Free <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <p className="mt-4 text-xs text-muted-foreground/60">No credit card · Cancel anytime · Instant access</p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-white py-12">
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 text-background" />
                </div>
                <span className="text-sm font-bold tracking-tight text-foreground">TeachNLearn</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-50">
                Empowering educators and learners to connect, grow, and succeed together.
              </p>
            </div>
            {[
              { title: "Learn", links: ["Browse Courses", "My Dashboard", "Certificates"] },
              { title: "Teach", links: ["Become Instructor", "Course Builder", "Resources"] },
              { title: "Project", links: ["About", "Contribution", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">{col.title}</p>
                <div className="space-y-2.5">
                  {col.links.map((l) => (
                    <a
                      key={l}
                      href="#"
                      className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
            <p className="text-xs text-muted-foreground">© 2026 TeachNLearn Academy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
