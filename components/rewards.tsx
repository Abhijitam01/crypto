"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/lib/web3-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, Trophy, Coins, ArrowRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock leaderboard data
const mockLeaderboard = [
  {
    rank: 1,
    address: "0x1234...5678",
    fullAddress: "0x1234567890abcdef1234567890abcdef12345678",
    score: 90,
    ethReward: 0.03,
    eduReward: 10,
    claimed: true,
  },
  {
    rank: 2,
    address: "0x2345...6789",
    fullAddress: "0x2345678901abcdef2345678901abcdef23456789",
    score: 85,
    ethReward: 0.02,
    eduReward: 10,
    claimed: false,
  },
  {
    rank: 3,
    address: "0x3456...7890",
    fullAddress: "0x3456789012abcdef3456789012abcdef34567890",
    score: 80,
    ethReward: 0.01,
    eduReward: 10,
    claimed: false,
  },
  {
    rank: 4,
    address: "0x4567...8901",
    fullAddress: "0x4567890123abcdef4567890123abcdef45678901",
    score: 75,
    ethReward: 0,
    eduReward: 0,
    claimed: false,
  },
  {
    rank: 5,
    address: "0x5678...9012",
    fullAddress: "0x5678901234abcdef5678901234abcdef56789012",
    score: 70,
    ethReward: 0,
    eduReward: 0,
    claimed: false,
  },
]

export function Rewards() {
  const { isConnected, address } = useWeb3()
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [rewardStats, setRewardStats] = useState({
    totalEthRewards: 0.06,
    totalEduRewards: 30,
    rewardsClaimed: 1,
    nextDistribution: "2 days",
  })

  // Find user's rank in the leaderboard
  useEffect(() => {
    if (isConnected && address) {
      const userEntry = leaderboard.find((entry) => entry.fullAddress.toLowerCase() === address.toLowerCase())
      if (userEntry) {
        setUserRank(userEntry.rank)
      } else {
        setUserRank(null)
      }
    }
  }, [isConnected, address, leaderboard])

  const claimReward = async () => {
    if (!isConnected || userRank === null || userRank > 3) return

    setIsLoading(true)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update leaderboard
    setLeaderboard((prev) => prev.map((entry) => (entry.rank === userRank ? { ...entry, claimed: true } : entry)))

    // Update stats
    setRewardStats((prev) => ({
      ...prev,
      rewardsClaimed: prev.rewardsClaimed + 1,
    }))

    setIsLoading(false)
  }

  const userCanClaim = userRank !== null && userRank <= 3 && !leaderboard[userRank - 1].claimed

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Excellence-Based Rewards</CardTitle>
          <CardDescription>Top performers receive ETH and EDU token rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userRank !== null ? (
            <Alert className={userRank <= 3 ? "border-green-200" : "border-orange-200"}>
              <Trophy className={`h-4 w-4 ${userRank <= 3 ? "text-green-500" : "text-orange-500"}`} />
              <AlertTitle>Your Ranking: #{userRank}</AlertTitle>
              <AlertDescription>
                {userRank <= 3 ? (
                  <>
                    Congratulations! You're eligible for a reward of {leaderboard[userRank - 1].ethReward} ETH and{" "}
                    {leaderboard[userRank - 1].eduReward} EDU tokens.
                    {leaderboard[userRank - 1].claimed ? " (Already claimed)" : ""}
                  </>
                ) : (
                  <>You're not currently eligible for rewards. The top 3 performers receive rewards.</>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertTitle>Not Ranked</AlertTitle>
              <AlertDescription>
                Complete the course to appear on the leaderboard and potentially earn rewards.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">ETH Reward</TableHead>
                  <TableHead className="text-right">EDU Reward</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => (
                  <TableRow key={entry.rank} className={userRank === entry.rank ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {entry.rank <= 3 && (
                          <Trophy
                            className={`h-4 w-4 mr-2 ${
                              entry.rank === 1
                                ? "text-yellow-500"
                                : entry.rank === 2
                                  ? "text-gray-400"
                                  : "text-amber-600"
                            }`}
                          />
                        )}
                        #{entry.rank}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">{entry.address.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        {entry.address}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{entry.score}%</TableCell>
                    <TableCell className="text-right">{entry.ethReward > 0 ? `${entry.ethReward} ETH` : "-"}</TableCell>
                    <TableCell className="text-right">{entry.eduReward > 0 ? `${entry.eduReward} EDU` : "-"}</TableCell>
                    <TableCell className="text-right">
                      {entry.rank <= 3 ? (
                        <Badge variant={entry.claimed ? "outline" : "default"}>
                          {entry.claimed ? "Claimed" : "Eligible"}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Eligible</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {userCanClaim && (
            <div className="flex justify-center mt-4">
              <Button onClick={claimReward} disabled={isLoading} className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                {isLoading ? "Processing..." : "Claim Your Reward"}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground flex items-center">
            <Coins className="h-4 w-4 mr-2" />
            Next distribution: {rewardStats.nextDistribution}
          </div>

          <Button variant="outline" size="sm" className="flex items-center gap-1">
            Next: Certificates <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reward Distribution Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Total ETH Rewards</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{rewardStats.totalEthRewards} ETH</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Total EDU Rewards</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{rewardStats.totalEduRewards} EDU</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Rewards Claimed</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{rewardStats.rewardsClaimed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Next Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{rewardStats.nextDistribution}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

