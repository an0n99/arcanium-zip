import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Clock, DollarSign, FileText, MessageSquare, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ContractorDashboardPage() {
  // Mock data for active projects
  const activeProjects = [
    {
      id: 1,
      name: "Kitchen Renovation",
      client: "John Doe",
      progress: 65,
      budget: {
        total: 25000,
        received: 16250,
        pending: 8750,
      },
      nextMilestone: "Cabinet Installation",
      dueDate: "Mar 15, 2025",
      unreadMessages: 3,
    },
    {
      id: 2,
      name: "Bathroom Remodel",
      client: "Sarah Johnson",
      progress: 30,
      budget: {
        total: 12000,
        received: 3600,
        pending: 8400,
      },
      nextMilestone: "Tile Installation",
      dueDate: "Apr 2, 2025",
      unreadMessages: 0,
    },
  ]

  // Mock data for pending bids
  const pendingBids = [
    {
      id: 1,
      projectName: "Living Room Renovation",
      client: "Michael Smith",
      bidAmount: 18500,
      submittedDate: "Mar 1, 2025",
      status: "Under Review",
    },
    {
      id: 2,
      projectName: "Basement Finishing",
      client: "Emily Wilson",
      bidAmount: 32000,
      submittedDate: "Feb 28, 2025",
      status: "Under Review",
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contractor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, ABC Contractors! Here's an overview of your business.</p>
        </div>
        <Button asChild>
          <Link href="/contractor/quote-generator">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Quote
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">This Month</span>
                <span className="font-medium">$12,450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending Payments</span>
                <span className="font-medium">$17,150</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending Bids</span>
                <span className="font-medium">$50,500</span>
              </div>
              <Progress value={65} className="h-2 mt-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/contractor/payments">
                <DollarSign className="mr-2 h-4 w-4" /> View Financial Details
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Cabinet Installation - John Doe</p>
                  <p className="text-xs text-muted-foreground">Mar 15, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Tile Installation - Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Apr 2, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Initial Consultation - Robert Brown</p>
                  <p className="text-xs text-muted-foreground">Mar 10, 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/contractor/schedule">
                <Calendar className="mr-2 h-4 w-4" /> View Full Schedule
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">New Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Find new projects in your area that match your skills and availability.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/contractor/opportunities">
                <PlusCircle className="mr-2 h-4 w-4" /> Find Projects
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="bids">Pending Bids</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {activeProjects.length === 0 ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>No Active Projects</CardTitle>
                <CardDescription>You don't have any active projects yet.</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <Link href="/contractor/opportunities">
                    <PlusCircle className="mr-2 h-4 w-4" /> Find Projects
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
                      <div>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>Client: {project.client}</CardDescription>
                      </div>
                      <span className="text-sm font-medium text-primary">{project.progress}% Complete</span>
                    </div>
                    <Progress value={project.progress} className="h-2 mt-2" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <DollarSign className="mr-1 h-4 w-4" /> Budget
                        </span>
                        <span className="font-medium">${project.budget.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <DollarSign className="mr-1 h-4 w-4" /> Received
                        </span>
                        <span className="font-medium">${project.budget.received.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-4 w-4" /> Next Milestone
                        </span>
                        <span className="font-medium">{project.nextMilestone}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-4 w-4" /> Due Date
                        </span>
                        <span className="font-medium">{project.dueDate}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/contractor/messages?project=${project.id}`}>
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
                      <Link href={`/contractor/projects/${project.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="bids" className="space-y-4">
          {pendingBids.length === 0 ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>No Pending Bids</CardTitle>
                <CardDescription>You don't have any pending bids at the moment.</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <Link href="/contractor/opportunities">
                    <PlusCircle className="mr-2 h-4 w-4" /> Find Projects to Bid
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingBids.map((bid) => (
                <Card key={bid.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{bid.projectName}</CardTitle>
                        <CardDescription>Client: {bid.client}</CardDescription>
                      </div>
                      <Badge>{bid.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Bid Amount</span>
                        <span className="font-medium">${bid.bidAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Submitted</span>
                        <span className="font-medium">{bid.submittedDate}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/contractor/bids/${bid.id}`}>
                        <FileText className="mr-2 h-4 w-4" /> View Bid Details
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href={`/contractor/messages?client=${bid.client}`}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Contact Client
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
              <CardDescription>View your completed projects and client reviews.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You don't have any completed projects yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

