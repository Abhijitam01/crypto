import { render, screen } from "@testing-library/react"
import Header from "@/components/header"

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock("@/context/web3-context", () => ({
  useWeb3: () => ({
    address: null,
    connect: jest.fn(),
    disconnect: jest.fn(),
    isConnecting: false,
  }),
}))

describe("Header", () => {
  it("renders logo and navigation links", () => {
    render(<Header />)

    expect(screen.getByText("CryptoLearn")).toBeInTheDocument()
    expect(screen.getByText("Courses")).toBeInTheDocument()
    expect(screen.getByText("Instructors")).toBeInTheDocument()
    expect(screen.getByText("About")).toBeInTheDocument()
  })

  it("displays connect wallet button when not connected", () => {
    render(<Header />)

    expect(screen.getByText("Connect Wallet")).toBeInTheDocument()
  })
})

