import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  // Mock data for a specific project
  const project = {
    id: params.id,
    name: "Kitchen Renovation",
    progress: 65,
    status: "In Progress",
    budget: {
      total: 25000,
      spent: 16250,
      remaining: 8750,
    },
    timeline: {
      start: "Jan 15, 2025",
      end: "Apr 30, 2025",
      currentPhase: "Cabinet Installation",
    },
    contractor: {
      name: "ABC Renovations",
      rating: 4.8,
      phone: "(555) 123-4567",
      email: "contact@abcrenovations.com",
    },
    milestones: [
      { name: "Design Approval", status: "completed", date: "Jan 20, 2025" },
      { name: "Demolition", status: "completed", date: "Feb 5, 2025" },
      { name: "Plumbing & Electrical", status: "completed", date: "Feb 20, 2025" },
      { name: "Cabinet Installation", status: "in-progress", date: "Mar 15, 2025" },
      { name: "Countertop Installation", status: "pending", date: "Mar 30, 2025" },
      { name: "Backsplash & Finishing", status: "pending", date: "Apr 15, 2025" },
      { name: "Final Inspection", status: "pending", date: "Apr 25, 2025" },
    ],
    recentUpdates: [
      { date: "Mar 5, 2025", message: "Cabinets delivered to site", author: "John (Contractor)" },
      { date: "Mar 3, 2025", message: "Electrical inspection passed", author: "Sarah (Inspector)" },
      { date: "Feb 28, 2025", message: "Plumbing fixtures installed", author: "John (Contractor)" },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <Badge variant="outline" className="ml-2">
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={project.progress} className="h-2 w-40" />
            <span className="text-sm font-medium">{project.progress}% Complete</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/messages?project=${project.id}`}>
              <MessageSquare className="mr-2 h-4 w-4" /> Messages
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/payments?project=${project.id}`}>
              <DollarSign className="mr-2 h-4 w-4" /> Payments
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Budget</span>
                <span className="font-medium">${project.budget.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">${project.budget.spent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">${project.budget.remaining.toLocaleString()}</span>
              </div>
              <Progress value={(project.budget.spent / project.budget.total) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium">{project.timeline.start}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Date</span>
                <span className="font-medium">{project.timeline.end}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Phase</span>
                <span className="font-medium">{project.timeline.currentPhase}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/calendar">
                  <Calendar className="mr-2 h-4 w-4" /> View Full Timeline
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contractor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>ABC</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{project.contractor.name}</p>
                <p className="text-sm text-muted-foreground">Rating: {project.contractor.rating}/5</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span>{project.contractor.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="truncate max-w-[150px]">{project.contractor.email}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <MessageSquare className="mr-2 h-4 w-4" /> Contact Contractor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="milestones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="updates">Recent Updates</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
              <CardDescription>Track the progress of your project through these key milestones.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 ${
                        milestone.status === "completed"
                          ? "text-green-500"
                          : milestone.status === "in-progress"
                            ? "text-blue-500"
                            : "text-muted-foreground"
                      }`}
                    >
                      {milestone.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : milestone.status === "in-progress" ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4
                          className={`font-medium ${
                            milestone.status === "completed"
                              ? "text-muted-foreground"
                              : milestone.status === "in-progress"
                                ? "text-blue-500"
                                : ""
                          }`}
                        >
                          {milestone.name}
                        </h4>
                        <span className="text-sm text-muted-foreground">{milestone.date}</span>
                      </div>
                      {milestone.status === "in-progress" && (
                        <p className="text-sm text-muted-foreground mt-1">Currently in progress</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates">
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Latest updates and progress reports from your project.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.recentUpdates.map((update, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{update.author}</span>
                      <span className="text-sm text-muted-foreground">{update.date}</span>
                    </div>
                    <p className="text-sm">{update.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>Access all documents related to your renovation project.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link href="#">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Project Contract</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link href="#">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Design Plans</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link href="#">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Permits</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link href="#">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Warranty Information</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Materials</CardTitle>
              <CardDescription>Track materials for your project and their delivery status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Materials List</h3>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/materials">
                      <ShoppingBag className="mr-2 h-4 w-4" /> View All Materials
                    </Link>
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-md bg-muted">
                    <div>
                      <p className="font-medium">Kitchen Cabinets</p>
                      <p className="text-sm text-muted-foreground">Shaker Style, White</p>
                    </div>
                    <Badge>Delivered</Badge>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-md bg-muted">
                    <div>
                      <p className="font-medium">Quartz Countertops</p>
                      <p className="text-sm text-muted-foreground">Calacatta Gold</p>
                    </div>
                    <Badge variant="outline">Ordered</Badge>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-md bg-muted">
                    <div>
                      <p className="font-medium">Backsplash Tile</p>
                      <p className="text-sm text-muted-foreground">Subway Tile, White</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-md bg-muted">
                    <div>
                      <p className="font-medium">Sink & Faucet</p>
                      <p className="text-sm text-muted-foreground">Farmhouse Sink, Brushed Nickel Faucet</p>
                    </div>
                    <Badge>Delivered</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

