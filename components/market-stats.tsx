"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart"
import { AreaChart, BarChart, LineChart } from "recharts"
import { Area, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { TrendingUp, Users, Award, DollarSign } from "lucide-react"

const marketData = [
  { month: "Jan", users: 1200, courses: 120, certificates: 80, revenue: 15000 },
  { month: "Feb", users: 1900, courses: 140, certificates: 120, revenue: 22000 },
  { month: "Mar", users: 2800, courses: 170, certificates: 180, revenue: 34000 },
  { month: "Apr", users: 3500, courses: 190, certificates: 250, revenue: 42000 },
  { month: "May", users: 4100, courses: 210, certificates: 320, revenue: 50000 },
  { month: "Jun", users: 4800, courses: 230, certificates: 380, revenue: 62000 },
  { month: "Jul", users: 5500, courses: 250, certificates: 450, revenue: 78000 },
  { month: "Aug", users: 6300, courses: 280, certificates: 520, revenue: 92000 },
  { month: "Sep", users: 7100, courses: 310, certificates: 590, revenue: 105000 },
  { month: "Oct", users: 7800, courses: 340, certificates: 650, revenue: 120000 },
  { month: "Nov", users: 8500, courses: 370, certificates: 720, revenue: 135000 },
  { month: "Dec", users: 9200, courses: 400, certificates: 800, revenue: 150000 },
]

const marketSegments = [
  { name: "Corporate Training", value: 45 },
  { name: "Higher Education", value: 30 },
  { name: "K-12 Education", value: 15 },
  { name: "Professional Development", value: 10 },
]

const tokenomics = [
  { name: "Platform Development", value: 30 },
  { name: "Educator Rewards", value: 25 },
  { name: "Student Incentives", value: 20 },
  { name: "Liquidity Pool", value: 15 },
  { name: "Team & Advisors", value: 10 },
]

const marketSize = [
  { year: 2023, value: 350 },
  { year: 2024, value: 470 },
  { year: 2025, value: 630 },
  { year: 2026, value: 850 },
  { year: 2027, value: 1100 },
  { year: 2028, value: 1450 },
]

export default function MarketStats() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Market Statistics</h2>
      <p className="text-muted-foreground">Comprehensive data on the EdTech market and GradXP's growth trajectory</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Market Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$350B</div>
            <p className="text-xs text-muted-foreground">Global EdTech market in 2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16.5%</div>
            <p className="text-xs text-muted-foreground">CAGR 2023-2028</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blockchain EdTech</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12B</div>
            <p className="text-xs text-muted-foreground">Market size by 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2B</div>
            <p className="text-xs text-muted-foreground">Global learners by 2025</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="growth">Platform Growth</TabsTrigger>
          <TabsTrigger value="market">Market Size</TabsTrigger>
          <TabsTrigger value="segments">Market Segments</TabsTrigger>
          <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
        </TabsList>
        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth Metrics</CardTitle>
              <CardDescription>Monthly growth in users, courses, certificates, and revenue</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip />
                    <ChartLegend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--chart-1))"
                      name="Users"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="courses"
                      stroke="hsl(var(--chart-2))"
                      name="Courses"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="certificates"
                      stroke="hsl(var(--chart-3))"
                      name="Certificates"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-4))"
                      name="Revenue ($)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>EdTech Market Size Projection</CardTitle>
              <CardDescription>Global EdTech market size in billions USD (2023-2028)</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketSize}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      name="Market Size ($B)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Target Market Segments</CardTitle>
              <CardDescription>Breakdown of GradXP's target market by segment (%)</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketSegments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="value" fill="hsl(var(--chart-2))" name="Market Share (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tokenomics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GXP Token Allocation</CardTitle>
              <CardDescription>Distribution of GXP tokens by purpose (%)</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tokenomics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <ChartTooltip />
                    <Bar dataKey="value" fill="hsl(var(--chart-3))" name="Allocation (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Investment Opportunity</CardTitle>
          <CardDescription>Key metrics for potential investors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Valuation</h4>
              <p className="text-2xl font-bold">$28M</p>
              <p className="text-sm text-muted-foreground">Based on latest funding round</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Monthly Revenue</h4>
              <p className="text-2xl font-bold">$150K</p>
              <p className="text-sm text-muted-foreground">Growing at 12% month-over-month</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Customer Acquisition Cost</h4>
              <p className="text-2xl font-bold">$42</p>
              <p className="text-sm text-muted-foreground">Decreasing by 8% quarterly</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Lifetime Value</h4>
              <p className="text-2xl font-bold">$850</p>
              <p className="text-sm text-muted-foreground">LTV:CAC ratio of 20:1</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Burn Rate</h4>
              <p className="text-2xl font-bold">$180K/mo</p>
              <p className="text-sm text-muted-foreground">18 months runway at current pace</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Funding Target</h4>
              <p className="text-2xl font-bold">$5M</p>
              <p className="text-sm text-muted-foreground">Series A round opening Q2 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

