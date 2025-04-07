"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  DollarSign,
  Filter,
  MapPin,
  MoreHorizontal,
  User,
  CheckCircle,
  AlertCircle,
  Clock3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for active projects
const activeProjects = [
  {
    id: "PRJ-2023-001",
    title: "Kitchen Renovation",
    client: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
    },
    location: "123 Maple Street, Portland",
    budget: 28500,
    startDate: "2023-10-15",
    endDate: "2023-12-20",
    status: "in-progress",
    progress: 65,
    nextMilestone: "Cabinet Installation",
    nextPayment: {
      amount: 8500,
      date: "2023-11-25",
    },
    description: "Complete kitchen renovation including new cabinets, countertops, appliances, and flooring.",
    tags: ["Kitchen", "Renovation", "Residential"],
  },
  {
    id: "PRJ-2023-002",
    title: "Bathroom Remodel",
    client: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    location: "456 Oak Avenue, Seattle",
    budget: 15000,
    startDate: "2023-11-01",
    endDate: "2023-12-15",
    status: "in-progress",
    progress: 40,
    nextMilestone: "Tile Installation",
    nextPayment: {
      amount: 5000,
      date: "2023-11-20",
    },
    description: "Master bathroom remodel with new shower, vanity, and fixtures.",
    tags: ["Bathroom", "Remodel", "Residential"],
  },
  {
    id: "PRJ-2023-003",
    title: "Office Renovation",
    client: {
      name: "Westside Corp",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "WC",
    },
    location: "789 Pine Boulevard, San Francisco",
    budget: 75000,
    startDate: "2023-09-01",
    endDate: "2024-01-15",
    status: "in-progress",
    progress: 80,
    nextMilestone: "Final Inspection",
    nextPayment: {
      amount: 15000,
      date: "2023-12-01",
    },
    description:
      "Complete office renovation for a tech company, including new walls, flooring, lighting, and workstations.",
    tags: ["Office", "Commercial", "Renovation"],
  },
  {
    id: "PRJ-2023-004",
    title: "Deck Construction",
    client: {
      name: "Thomas Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TW",
    },
    location: "321 Cedar Lane, Denver",
    budget: 12000,
    startDate: "2023-10-20",
    endDate: "2023-11-30",
    status: "delayed",
    progress: 30,
    nextMilestone: "Railing Installation",
    nextPayment: {
      amount: 4000,
      date: "2023-11-15",
    },
    description: "Construction of a 400 sq ft composite deck with railings and built-in seating.",
    tags: ["Deck", "Outdoor", "Residential"],
  },
  {
    id: "PRJ-2023-005",
    title: "Retail Store Renovation",
    client: {
      name: "Fashion Forward",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "FF",
    },
    location: "555 Market Street, Chicago",
    budget: 95000,
    startDate: "2023-08-15",
    endDate: "2023-11-30",
    status: "completed",
    progress: 100,
    nextMilestone: "Project Completed",
    nextPayment: {
      amount: 20000,
      date: "2023-11-10",
    },
    description:
      "Complete renovation of a 2,000 sq ft retail space including new storefront, flooring, lighting, and fixtures.",
    tags: ["Retail", "Commercial", "Renovation"],
  },
]

// Status badge component
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "in-progress":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <Clock3 className="mr-1 h-3 w-3" /> In Progress
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="mr-1 h-3 w-3" /> Completed
        </Badge>
      )
    case "delayed":
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600">
          <AlertCircle className="mr-1 h-3 w-3" /> Delayed
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}

export default function ContractorProjects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Filter and sort projects
  const filteredProjects = activeProjects
    .filter((project) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          project.title.toLowerCase().includes(query) ||
          project.client.name.toLowerCase().includes(query) ||
          project.id.toLowerCase().includes(query) ||
          project.location.toLowerCase().includes(query)
        )
      }
      return true
    })
    .filter((project) => {
      // Apply status filter
      if (statusFilter === "all") return true
      return project.status === statusFilter
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "date":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        case "budget":
          return b.budget - a.budget
        case "progress":
          return b.progress - a.progress
        default:
          return 0
      }
    })

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Projects</h2>
          <p className="text-muted-foreground">Manage and track your ongoing renovation projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="delayed">Delayed</TabsTrigger>
          </TabsList>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[250px]"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="budget">Sort by Budget</SelectItem>
                <SelectItem value="progress">Sort by Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects
              .filter((project) => project.status === "in-progress")
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects
              .filter((project) => project.status === "completed")
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="delayed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects
              .filter((project) => project.status === "delayed")
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectCard({ project }: { project: any }) {
  const router = useRouter()

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => router.push(`/contractor/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription className="mt-1">{project.id}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Update status</DropdownMenuItem>
              <DropdownMenuItem>Schedule appointment</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Message client</DropdownMenuItem>
              <DropdownMenuItem>Generate invoice</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-2">
          <StatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-4 space-y-3">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={project.client.avatar} alt={project.client.name} />
                <AvatarFallback>{project.client.initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{project.client.name}</span>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate" title={project.location}>
              {project.location}
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">${project.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <span className="text-sm font-medium">Next Milestone:</span>
            <p className="text-sm text-muted-foreground">{project.nextMilestone}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Next Payment:</span>
            <p className="text-sm text-muted-foreground">
              ${project.nextPayment.amount.toLocaleString()} on{" "}
              {new Date(project.nextPayment.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

