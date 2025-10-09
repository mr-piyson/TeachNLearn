"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Clock, Award, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Question {
  id: string
  question: string
  type: string
  options: string
  correctAnswer: string
  explanation?: string | null
  points: number
  order: number
}

interface Test {
  id: string
  title: string
  description: string
  passingScore: number
  timeLimit: number | null
  questions: Question[]
}

interface TestResult {
  id: string
  score: number
  passed: boolean
  completedAt: Date
}

interface TestInterfaceProps {
  course: {
    id: string
    title: string
    slug: string
  }
  test: Test
  previousResults: TestResult[]
  userId: string
}

export default function TestInterface({ course, test, previousResults }: TestInterfaceProps) {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ score: number; passed: boolean; feedback: any[] } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const bestResult =
    previousResults.length > 0
      ? previousResults.reduce((best, current) => (current.score > best.score ? current : best))
      : null

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      const response = await fetch("/api/tests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test.id,
          answers,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
        setSubmitted(true)
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to submit test:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const answeredCount = Object.keys(answers).length
  const progressPercentage = (answeredCount / test.questions.length) * 100

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link href={`/courses/${course.slug}/learn`}>
              <Button variant="ghost">← Back to Course</Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{test.title}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Questions</p>
                    <p className="text-2xl font-bold">{test.questions.length}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time Limit</p>
                    <p className="text-2xl font-bold">{test.timeLimit ? `${test.timeLimit} min` : "No limit"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Passing Score</p>
                    <p className="text-2xl font-bold">{test.passingScore}%</p>
                  </div>
                </div>

                {bestResult && (
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    {bestResult.passed ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Best Score</p>
                      <p className="text-2xl font-bold">{bestResult.score}%</p>
                    </div>
                  </div>
                )}
              </div>

              {previousResults.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have attempted this test {previousResults.length} time(s). You can retake it to improve your
                    score.
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={() => setStarted(true)} size="lg" className="w-full">
                {previousResults.length > 0 ? "Retake Test" : "Start Test"}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Test Results</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Card className={result.passed ? "border-primary" : "border-destructive"}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {result.passed ? (
                  <CheckCircle className="h-16 w-16 text-primary" />
                ) : (
                  <XCircle className="h-16 w-16 text-destructive" />
                )}
              </div>
              <CardTitle className="text-3xl">{result.passed ? "Congratulations!" : "Keep Learning"}</CardTitle>
              <CardDescription>
                {result.passed
                  ? "You passed the test! You can now claim your certificate."
                  : "You didn't pass this time, but you can try again."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">{result.score}%</p>
                <p className="text-muted-foreground">Passing score: {test.passingScore}%</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Review Your Answers</h3>
                {result.feedback.map((item: any, index: number) => (
                  <Card key={index} className={item.correct ? "border-primary/50" : "border-destructive/50"}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">Question {index + 1}</CardTitle>
                        {item.correct ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <CardDescription>{item.question}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Your answer:</p>
                        <p className={item.correct ? "text-primary" : "text-destructive"}>{item.userAnswer}</p>
                      </div>
                      {!item.correct && (
                        <div>
                          <p className="text-sm font-medium">Correct answer:</p>
                          <p className="text-primary">{item.correctAnswer}</p>
                        </div>
                      )}
                      {item.explanation && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-sm text-muted-foreground">{item.explanation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4">
                {result.passed ? (
                  <Link href={`/courses/${course.slug}/certificate`} className="flex-1">
                    <Button size="lg" className="w-full">
                      <Award className="h-5 w-5 mr-2" />
                      Get Certificate
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" onClick={() => window.location.reload()} className="flex-1">
                    Try Again
                  </Button>
                )}
                <Link href="/dashboard" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full bg-transparent">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const question = test.questions[currentQuestion]
  const options = JSON.parse(question.options)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{test.title}</h1>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {test.questions.length}
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progressPercentage} />
            <p className="text-xs text-muted-foreground mt-2">
              {answeredCount} of {test.questions.length} questions answered
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
            <CardDescription className="text-base text-foreground mt-4">{question.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              <div className="space-y-3">
                {options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-transparent"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestion === test.questions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={answeredCount < test.questions.length || submitting}>
                {submitting ? "Submitting..." : "Submit Test"}
              </Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
