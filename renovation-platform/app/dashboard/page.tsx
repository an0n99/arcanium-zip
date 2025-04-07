import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, Clock, DollarSign, Home, MessageSquare, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
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
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your renovation projects.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create-project">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
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
                  <Link href="/dashboard/create-project">
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Project
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      <span className="text-sm font-medium text-primary">{project.progress}% Complete</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <DollarSign className="mr-1 h-4 w-4" /> Budget
                        </span>
                        <span className="font-medium">
                          ${project.budget.spent.toLocaleString()} / ${project.budget.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-4 w-4" /> Next Milestone
                        </span>
                        <span className="font-medium">{project.nextMilestone}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-4 w-4" /> Due Date
                        </span>
                        <span className="font-medium">{project.dueDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Home className="mr-1 h-4 w-4" /> Contractor
                        </span>
                        <span className="font-medium">{project.contractor}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/messages?project=${project.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                        {project.unreadMessages > 0 && (
                          <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-1.5">
                            {project.unreadMessages}
                          </span>
                        )}
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
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

