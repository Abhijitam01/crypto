// Mock data for instructor earnings
const mockEarnings = {
  totalStudents: 1500,
  totalRevenue: 25000,
  averageRating: 4.7,
  monthlyEarnings: [
    { month: "Jan", earnings: 2000 },
    { month: "Feb", earnings: 2200 },
    { month: "Mar", earnings: 2500 },
    { month: "Apr", earnings: 2800 },
    { month: "May", earnings: 3000 },
    { month: "Jun", earnings: 3200 },
  ],
}

export async function getInstructorEarnings() {
  // In a real implementation, this would fetch data from a backend service
  // For now, we'll return mock data
  return mockEarnings
}

export async function processPayment(amount: number, courseId: string, userId: string) {
  // In a real implementation, this would process a payment through a payment gateway
  console.log(`Processing payment of ${amount} for course ${courseId} by user ${userId}`)
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return { success: true, transactionId: `txn_${Date.now()}` }
}

export async function requestPayout(amount: number, instructorId: string) {
  // In a real implementation, this would initiate a payout to the instructor
  console.log(`Requesting payout of ${amount} for instructor ${instructorId}`)
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return { success: true, payoutId: `payout_${Date.now()}` }
}

