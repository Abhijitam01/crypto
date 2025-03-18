"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, TrendingUp, Wallet } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

export default function Dashboard() {
  const { isConnected } = useWallet()
  const [totalPool, setTotalPool] = useState(10)
  const [yieldPool, setYieldPool] = useState(5)
  const [rewardPool, setRewardPool] = useState(5)
  const [yieldRate, setYieldRate] = useState(0.1)
  const [lastYield, setLastYield] = useState(new Date())
  const [timeToNextYield, setTimeToNextYield] = useState(60)
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "investment",
      message: "Investor funded 2.0 ETH",
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
    {
      id: 2,
      type: "yield",
      message: "Yield accrued +0.05 ETH",
      timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    },
    {
      id: 3,
      type: "purchase",
      message: "User purchased Blockchain Basics course",
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    },
    {
      id: 4,
      type: "reward",
      message: "Rewards distributed to top learners",
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const secondsSinceLastYield = Math.floor((now.getTime() - lastYield.getTime()) / 1000)

      if (secondsSinceLastYield >= 60) {
        // Simulate yield accrual every minute
        const newYield = yieldPool * 0.01 // 1% yield
        setYieldPool((prev) => +(prev + newYield).toFixed(2))
        setTotalPool((prev) => +(prev + newYield).toFixed(2))
        setLastYield(now)

        // Add new activity
        setActivities((prev) => [
          {
            id: Date.now(),
            type: "yield",
            message: `Yield accrued +${newYield.toFixed(2)} ETH`,
            timestamp: new Date(),
          },
          ...prev.slice(0, 9), // Keep only the last 10 activities
        ])
      }

      setTimeToNextYield(60 - (secondsSinceLastYield % 60))
    }, 1000)

    return () => clearInterval(timer)
  }, [yieldPool, lastYield])

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds} seconds ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "investment":
        return "bg-green-500"
      case "yield":
        return "bg-blue-500"
      case "purchase":
        return "bg-purple-500"
      case "reward":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Next yield in:</span>
          <span className="font-medium">{timeToNextYield}s</span>
        </div>
      </div>

      {!isConnected && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-800">
              <Wallet className="h-5 w-5" />
              <p>Connect your wallet to access all platform features and track your investments.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pool</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPool.toFixed(2)} ETH</div>
            <p className="text-xs text-muted-foreground">Combined investor funds and yield</p>
            <Progress className="mt-4" value={100} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yield Pool</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yieldPool.toFixed(2)} ETH</div>
            <p className="text-xs text-muted-foreground">Growing at {(yieldRate * 100).toFixed(1)}% per minute</p>
            <Progress className="mt-4" value={(yieldPool / totalPool) * 100} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reward Pool</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewardPool.toFixed(2)} ETH</div>
            <p className="text-xs text-muted-foreground">Available for top learners</p>
            <Progress className="mt-4" value={(rewardPool / totalPool) * 100} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Platform Activity</CardTitle>
          <CardDescription>Recent transactions and platform events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getActivityColor(activity.type)}`}></div>
                  <span>{activity.message}</span>
                </div>
                <span className="text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

