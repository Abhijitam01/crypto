import BecomeEducatorForm from "@/components/become-educator-form"

export default function BecomeEducatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Become an Educator</h1>
      <div className="max-w-2xl mx-auto">
        <p className="mb-6 text-lg">
          Share your Web3 and blockchain expertise with our community. Fill out the form below to apply as an educator
          on our platform.
        </p>
        <BecomeEducatorForm />
      </div>
    </div>
  )
}

