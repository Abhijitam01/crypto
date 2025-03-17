import SignUpForm from "@/components/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>
      <div className="max-w-md mx-auto">
        <SignUpForm />
      </div>
    </div>
  )
}

