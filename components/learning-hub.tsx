"use client"

import { useState } from "react"
import { useWeb3 } from "@/lib/web3-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, ArrowRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

// Demo quiz data
const quizData = {
  title: "Intro to Web3",
  description: "Learn the basics of Web3 technology and blockchain concepts",
  questions: [
    {
      id: 1,
      text: "What is an NFT?",
      options: [
        "A type of cryptocurrency",
        "A unique digital asset stored on a blockchain",
        "A decentralized exchange",
        "A smart contract platform",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      text: "What is the main benefit of yield farming?",
      options: [
        "Generating passive income from crypto assets",
        "Mining new cryptocurrencies",
        "Securing the blockchain network",
        "Reducing transaction fees",
      ],
      correctAnswer: 0,
    },
    {
      id: 3,
      text: "Which of these is NOT a feature of blockchain?",
      options: ["Decentralization", "Immutability", "Centralized control", "Transparency"],
      correctAnswer: 2,
    },
  ],
}

export function LearningHub() {
  const { isConnected } = useWeb3()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = Number.parseInt(value)
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    // Calculate score
    let correctCount = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === quizData.questions[index].correctAnswer) {
        correctCount++
      }
    })

    const finalScore = Math.round((correctCount / quizData.questions.length) * 100)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setScore(finalScore)
    setQuizSubmitted(true)
    setIsLoading(false)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setQuizSubmitted(false)
    setScore(0)
  }

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{quizData.title}</CardTitle>
              <CardDescription>{quizData.description}</CardDescription>
            </div>
            {!quizSubmitted && (
              <Badge variant="outline" className="ml-2">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </Badge>
            )}
          </div>
        </CardHeader>

        {!quizSubmitted ? (
          <>
            <CardContent className="space-y-4">
              {!isLoading ? (
                <>
                  <Progress value={progress} className="mb-4" />

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">{quizData.questions[currentQuestion].text}</h3>

                    <RadioGroup
                      value={selectedAnswers[currentQuestion]?.toString() || ""}
                      onValueChange={handleAnswerSelect}
                    >
                      {quizData.questions[currentQuestion].options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-center text-muted-foreground">Submitting your answers to the blockchain...</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0 || isLoading}>
                Previous
              </Button>

              <div className="flex gap-2">
                {currentQuestion < quizData.questions.length - 1 ? (
                  <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === undefined || isLoading}>
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      selectedAnswers.length !== quizData.questions.length ||
                      selectedAnswers.some((a) => a === undefined) ||
                      isLoading
                    }
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            </CardFooter>
          </>
        ) : (
          <>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center py-6">
                <div className={`text-6xl font-bold mb-4 ${score >= 70 ? "text-green-500" : "text-orange-500"}`}>
                  {score}%
                </div>

                <Badge variant={score >= 70 ? "default" : "secondary"} className="mb-4">
                  {score >= 70 ? "Passed" : "Try Again"}
                </Badge>

                <p className="text-center text-muted-foreground mb-4">
                  You answered {Math.round((score / 100) * quizData.questions.length)} out of{" "}
                  {quizData.questions.length} questions correctly.
                </p>

                {score >= 70 && (
                  <Alert className="mb-4">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Certificate Eligible</AlertTitle>
                    <AlertDescription>
                      Congratulations! You've qualified for an NFT certificate. Visit the Certificates tab to claim it.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
                  {quizData.questions.map((question, index) => {
                    const isCorrect = selectedAnswers[index] === question.correctAnswer
                    return (
                      <Card key={index} className={`border ${isCorrect ? "border-green-200" : "border-red-200"}`}>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium">Question {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm mb-2">{question.text}</p>
                          <div className="flex items-center text-xs">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${isCorrect ? "bg-green-500" : "bg-red-500"}`}
                            ></div>
                            <span className="text-muted-foreground">{isCorrect ? "Correct" : "Incorrect"}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetQuiz}>
                Retake Quiz
              </Button>

              <Button className="flex items-center gap-1" disabled={score < 70}>
                Next: Claim Rewards <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Courses</CardTitle>
          <CardDescription>Complete courses to earn rewards and certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Intro to Web3</CardTitle>
                <Badge className="mt-1">Active</Badge>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Learn the basics of Web3 technology and blockchain concepts
                </p>
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  <span>3 questions</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full" disabled={quizSubmitted}>
                  {quizSubmitted ? "Completed" : "Start Course"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="opacity-60">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">DeFi Fundamentals</CardTitle>
                <Badge variant="outline" className="mt-1">
                  Coming Soon
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Explore decentralized finance protocols and applications
                </p>
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  <span>5 questions</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardFooter>
            </Card>

            <Card className="opacity-60">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">NFT Masterclass</CardTitle>
                <Badge variant="outline" className="mt-1">
                  Coming Soon
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Master non-fungible tokens and digital collectibles
                </p>
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  <span>4 questions</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

