import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BlogPage() {
  const blogPosts = [
    {
      title: "The Future of Decentralized Finance",
      excerpt: "Exploring the potential impact of DeFi on traditional financial systems...",
      date: "2023-05-15",
      author: "Alice Johnson",
    },
    {
      title: "Understanding NFTs: Beyond Digital Art",
      excerpt: "Delving into the various applications of Non-Fungible Tokens...",
      date: "2023-05-10",
      author: "Bob Smith",
    },
    {
      title: "Blockchain and Sustainability: A Green Revolution",
      excerpt: "How blockchain technology is being used to promote environmental sustainability...",
      date: "2023-05-05",
      author: "Charlie Brown",
    },
    {
      title: "The Rise of Web3: Reshaping the Internet",
      excerpt: "Exploring the decentralized web and its potential to transform online interactions...",
      date: "2023-04-30",
      author: "Diana Martinez",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">CryptoLearn Blog</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        {blogPosts.map((post, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {post.date} | By {post.author}
                </div>
                <Button asChild>
                  <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, "-")}`}>Read More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

