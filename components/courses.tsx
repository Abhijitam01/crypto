"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, CheckCircle, Clock, DollarSign, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/components/ui/use-toast"
import { purchaseCourse } from "@/lib/contracts"

const courses = [
  {
    id: 1,
    title: "Blockchain Fundamentals",
    description: "Learn the core concepts of blockchain technology and distributed ledgers.",
    price: 0.05,
    duration: "2 hours",
    level: "Beginner",
    enrolled: 42,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Smart Contract Development",
    description: "Master the art of writing secure and efficient smart contracts.",
    price: 0.08,
    duration: "4 hours",
    level: "Intermediate",
    enrolled: 28,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "DeFi Principles",
    description: "Understand decentralized finance mechanisms and protocols.",
    price: 0.1,
    duration: "3 hours",
    level: "Advanced",
    enrolled: 15,
    image: "/placeholder.svg?height=200&width=300",
  },
]

const quizQuestions = [
  {
    question: "What is the main advantage of blockchain technology?",
    options: ["Centralized control", "Decentralized trust", "Unlimited storage", "Free transactions"],
    correctAnswer: 1,
  },
  {
    question: "Which consensus mechanism is more energy-efficient?",
    options: ["Proof of Work (PoW)", "Proof of Stake (PoS)", "Proof of Authority (PoA)", "Proof of Space (PoSpace)"],
    correctAnswer: 1,
  },
  {
    question: "What is a smart contract?",
    options: ["A legal document", "Self-executing code on blockchain", "A type of cryptocurrency", "A hardware wallet"],
    correctAnswer: 1,
  },
]

export default function Courses() {
  const { isConnected, signer } = useWallet()
  const { toast } = useToast()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [purchasedCourses, setPurchasedCourses] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [isPurchasing, setIsPurchasing] = useState(false)

  const handlePurchase = async (course) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase courses",
        variant: "destructive",
      })
      return
    }

    if (purchasedCourses.includes(course.id)) {
      return
    }

    setIsPurchasing(true)
    try {
      const success = await purchaseCourse(signer, course.id, course.price.toString())

      if (success) {
        setPurchasedCourses([...purchasedCourses, course.id])
        toast({
          title: "Course purchased",
          description: `You have successfully purchased ${course.title}`,
        })
      }
    } catch (error) {
      console.error("Error purchasing course:", error)
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleQuizSubmit = () => {
    let score = 0
    quizQuestions.forEach((q, index) => {
      if (Number.parseInt(quizAnswers[index]) === q.correctAnswer) {
        score++
      }
    })

    const percentage = Math.round((score / quizQuestions.length) * 100)
    setQuizScore(percentage)
    setQuizSubmitted(true)
  }

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: optionIndex,
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Courses</h2>

      {!isConnected && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>Connect your wallet to purchase courses and track your learning progress.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available Courses</TabsTrigger>
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-40 object-cover" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{course.title}</CardTitle>
                    <Badge>{course.level}</Badge>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.enrolled} enrolled</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-lg font-bold">
                    <DollarSign className="h-4 w-4" />
                    <span>{course.price} ETH</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handlePurchase(course)}
                    disabled={purchasedCourses.includes(course.id) || isPurchasing || !isConnected}
                  >
                    {isPurchasing
                      ? "Processing..."
                      : purchasedCourses.includes(course.id)
                        ? "Purchased"
                        : "Purchase Course"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="enrolled" className="space-y-4">
          {purchasedCourses.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Courses Yet</CardTitle>
                <CardDescription>
                  You haven't purchased any courses yet. Browse the available courses to get started.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((course) => purchasedCourses.includes(course.id))
                .map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{course.title}</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Enrolled
                        </Badge>
                      </div>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>25%</span>
                        </div>
                        <Progress value={25} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button className="flex-1">Continue Learning</Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            Take Quiz
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>{!quizSubmitted ? "Course Quiz" : "Quiz Results"}</DialogTitle>
                            <DialogDescription>
                              {!quizSubmitted
                                ? "Answer the following questions to test your knowledge."
                                : `You scored ${quizScore}% on the quiz.`}
                            </DialogDescription>
                          </DialogHeader>

                          {!quizSubmitted ? (
                            <div className="space-y-6 py-4">
                              {quizQuestions.map((q, qIndex) => (
                                <div key={qIndex} className="space-y-2">
                                  <h4 className="font-medium">
                                    Question {qIndex + 1}: {q.question}
                                  </h4>
                                  <RadioGroup
                                    value={quizAnswers[qIndex]?.toString()}
                                    onValueChange={(value) => handleAnswerChange(qIndex, Number.parseInt(value))}
                                  >
                                    {q.options.map((option, oIndex) => (
                                      <div key={oIndex} className="flex items-center space-x-2">
                                        <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                                        <Label htmlFor={`q${qIndex}-o${oIndex}`}>{option}</Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-4 flex flex-col items-center justify-center">
                              {quizScore >= 70 ? (
                                <>
                                  <div className="rounded-full bg-green-100 p-3 mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                  </div>
                                  <p className="text-center mb-4">
                                    Congratulations! You've passed the quiz and earned a certificate.
                                  </p>
                                  <div className="text-center space-y-1 mb-4">
                                    <p className="font-medium">Rewards earned:</p>
                                    <p>0.03 ETH</p>
                                    <p>10 GXP Points</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="text-center mb-4">
                                    You need to score at least 70% to pass the quiz and earn rewards.
                                  </p>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setQuizAnswers({})
                                      setQuizSubmitted(false)
                                    }}
                                  >
                                    Try Again
                                  </Button>
                                </>
                              )}
                            </div>
                          )}

                          <DialogFooter>
                            {!quizSubmitted && <Button onClick={handleQuizSubmit}>Submit Quiz</Button>}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

