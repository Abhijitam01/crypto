"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

const topLearners = [
  {
    id: 1,
    name: "Alex Johnson",
    score: 95,
    courses: 4,
    reward: "0.03 ETH + 10 GXP",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Maria Garcia",
    score: 92,
    courses: 3,
    reward: "0.02 ETH + 10 GXP",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "David Kim",
    score: 88,
    courses: 5,
    reward: "0.01 ETH + 10 GXP",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Sarah Williams",
    score: 85,
    courses: 2,
    reward: "5 GXP",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "James Brown",
    score: 82,
    courses: 3,
    reward: "5 GXP",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function Leaderboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
      <Card>
        <CardHeader>
          <CardTitle>Top Learners</CardTitle>
          <CardDescription>The highest performing students earn rewards from the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center md:items-end">
              {/* Second Place */}
              <div className="flex flex-col items-center order-2 md:order-1">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-silver">
                    <AvatarImage src={topLearners[1].avatar} alt={topLearners[1].name} />
                    <AvatarFallback>{topLearners[1].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-silver text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="font-medium">{topLearners[1].name}</p>
                  <p className="text-sm text-muted-foreground">{topLearners[1].score} points</p>
                  <Badge variant="outline" className="mt-1">
                    {topLearners[1].reward}
                  </Badge>
                </div>
              </div>

              {/* First Place */}
              <div className="flex flex-col items-center order-1 md:order-2">
                <div className="relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                  <Avatar className="h-24 w-24 border-4 border-yellow-500">
                    <AvatarImage src={topLearners[0].avatar} alt={topLearners[0].name} />
                    <AvatarFallback>{topLearners[0].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="font-medium">{topLearners[0].name}</p>
                  <p className="text-sm text-muted-foreground">{topLearners[0].score} points</p>
                  <Badge variant="outline" className="mt-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                    {topLearners[0].reward}
                  </Badge>
                </div>
              </div>

              {/* Third Place */}
              <div className="flex flex-col items-center order-3">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-amber-700">
                    <AvatarImage src={topLearners[2].avatar} alt={topLearners[2].name} />
                    <AvatarFallback>{topLearners[2].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="font-medium">{topLearners[2].name}</p>
                  <p className="text-sm text-muted-foreground">{topLearners[2].score} points</p>
                  <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 border-amber-200">
                    {topLearners[2].reward}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {topLearners.slice(3).map((learner, index) => (
                <div
                  key={learner.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-medium">
                      {index + 4}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={learner.avatar} alt={learner.name} />
                      <AvatarFallback>{learner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{learner.name}</p>
                      <p className="text-sm text-muted-foreground">{learner.courses} courses completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{learner.score} points</p>
                    <p className="text-sm text-muted-foreground">{learner.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

