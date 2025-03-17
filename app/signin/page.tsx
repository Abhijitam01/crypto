import SignInForm from "@/components/sign-in-form"

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Sign In</h1>
      <div className="max-w-md mx-auto">
        <SignInForm />
      </div>
    </div>
  )
}

