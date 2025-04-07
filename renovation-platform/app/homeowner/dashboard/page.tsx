import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, Plus, Search } from "lucide-react"
import Link from "next/link"

export default function HomeownerDashboardPage() {
  // Mock data for active projects
  const activeProjects = [
    {
      id: 1,
      name: "Kitchen Renovation",
      progress: 65,
      budget: {
        total: 25000,
        spent: 16250,
      },
      nextMilestone: "Cabinet Installation",
      dueDate: "Mar 15, 2025",
      contractor: "ABC Renovations",
      unreadMessages: 3,
      status: "Active",
      estimatedCosts: {
        demolition: 2000,
        construction: 15000,
        finishing: 8000,
        total: 25000,
      },
    },
    {
      id: 2,
      name: "Bathroom Remodel",
      progress: 30,
      budget: {
        total: 12000,
        spent: 3600,
      },
      nextMilestone: "Tile Installation",
      dueDate: "Apr 2, 2025",
      contractor: "Modern Bathrooms Inc.",
      unreadMessages: 0,
      status: "Active",
      estimatedCosts: {
        demolition: 1000,
        construction: 7000,
        finishing: 4000,
        total: 12000,
      },
    },
  ]

  const ProjectCard = ({ project }: { project: (typeof activeProjects)[0] }) => (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        {project.status && <CardDescription>{project.status}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p>Progress: {project.progress}%</p>
        <Progress value={project.progress} className="mt-2" />
        {project.estimatedCosts && (
          <div className="mt-4">
            <h4 className="font-medium">Estimated Costs:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Demolition: ${project.estimatedCosts.demolition.toLocaleString()}</li>
              <li>Construction: ${project.estimatedCosts.construction.toLocaleString()}</li>
              <li>Finishing: ${project.estimatedCosts.finishing.toLocaleString()}</li>
              <li className="font-medium">Total: ${project.estimatedCosts.total.toLocaleString()}</li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/homeowner/projects/${project.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homeowner Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John! Here's an overview of your renovation projects.</p>
        </div>
        <Button asChild>
          <Link href="/homeowner/create-project">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Budget</span>
                <span className="font-medium">$37,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">$19,850</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">$17,150</span>
              </div>
              <Progress value={53} className="h-2 mt-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/homeowner/budget">
                <DollarSign className="mr-2 h-4 w-4" /> View Budget Details
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Cabinet Installation</p>
                  <p className="text-xs text-muted-foreground">Mar 15, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Tile Installation</p>
                  <p className="text-xs text-muted-foreground">Apr 2, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Countertop Installation</p>
                  <p className="text-xs text-muted-foreground">Apr 10, 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/homeowner/calendar">
                <Calendar className="mr-2 h-4 w-4" /> View Full Timeline
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Start a New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ready to start your next renovation? Create a new project and find qualified contractors.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" asChild>
              <Link href="/homeowner/create-project">
                <Plus className="mr-2 h-4 w-4" /> Create New Project
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/homeowner/find-contractors">
                <Search className="mr-2 h-4 w-4" /> Find Contractors
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {activeProjects.length === 0 ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>No Active Projects</CardTitle>
                <CardDescription>You don't have any active renovation projects yet.</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <Link href="/homeowner/create-project">
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Project
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Projects</CardTitle>
              <CardDescription>
                View your completed renovation projects and access warranty information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You don't have any completed projects yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Draft Projects</CardTitle>
              <CardDescription>Continue working on your draft projects or delete them.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You don't have any draft projects.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

