import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Home, PenToolIcon as Tool } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-6xl text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Arcanium</h1>
          <p className="text-lg text-muted-foreground">Transform your home renovation experience</p>
        </div>

        <div className="grid gap-4 md:grid-cols-1">
          <Card className="border-primary/20 hover:border-primary transition-colors w-full">
            <CardHeader className="space-y-1">
              <div className="flex justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-center">For Homeowners</CardTitle>
              <CardDescription className="text-center">
                Find trusted contractors and manage your renovation projects
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Create projects, get matched with contractors, and track progress in real-time
              </p>
              <ul className="mt-4 text-sm text-left space-y-2">
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Create and manage renovation projects
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Find and compare local contractors
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Track budgets and manage payments
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/homeowner/dashboard">
                  Homeowner Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary/20 hover:border-primary transition-colors">
            <CardHeader className="space-y-1">
              <div className="flex justify-center">
                <Tool className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-center">For Contractors</CardTitle>
              <CardDescription className="text-center">Find projects and grow your business</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Bid on projects, manage your schedule, and get paid securely
              </p>
              <ul className="mt-4 text-sm text-left space-y-2">
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Find new projects in your area
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Create professional quotes
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Manage materials and track supplies
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contractor/dashboard">
                  Contractor Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            Not sure which one to choose? Learn more about how our platform works.
          </p>
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
            <Link href="https://arcaniums.com/">See How It Works</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

