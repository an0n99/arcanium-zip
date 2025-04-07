"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MessageSquare, ArrowLeft, Star, MapPin, Phone, Mail, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for team subcontractors
const mockTeamSubcontractors = [
  {
    id: "sub-001",
    name: "Mike Johnson",
    company: "Johnson Electrical Services",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MJ",
    specialty: "Electrician",
    rating: 4.8,
    location: "Seattle, WA",
    phone: "(206) 555-1234",
    email: "mike@johnsonelectrical.com",
    projects: [
      { id: "proj-001", name: "Modern Kitchen Renovation", status: "active" },
      { id: "proj-005", name: "Office Building Remodel", status: "completed" },
    ],
    totalProjects: 2,
    activeProjects: 1,
    completedProjects: 1,
    totalEarnings: 12500,
    availability: "Available",
    lastActive: "2025-03-10",
  },
  {
    id: "sub-002",
    name: "Sarah Williams",
    company: "Williams Plumbing Co.",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
    specialty: "Plumber",
    rating: 4.9,
    location: "Portland, OR",
    phone: "(503) 555-6789",
    email: "sarah@williamsplumbing.com",
    projects: [
      { id: "proj-001", name: "Modern Kitchen Renovation", status: "active" },
      { id: "proj-002", name: "Master Bathroom Remodel", status: "active" },
      { id: "proj-004", name: "Basement Finishing", status: "completed" },
    ],
    totalProjects: 3,
    activeProjects: 2,
    completedProjects: 1,
    totalEarnings: 18750,
    availability: "Limited Availability",
    lastActive: "2025-03-12",
  },
  {
    id: "sub-006",
    name: "Anna Martinez",
    company: "Martinez Tile & Stone",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AM",
    specialty: "Tile Installer",
    rating: 4.8,
    location: "Denver, CO",
    phone: "(720) 555-4321",
    email: "anna@martineztile.com",
    projects: [
      { id: "proj-002", name: "Master Bathroom Remodel", status: "active" },
      { id: "proj-003", name: "Luxury Condo Renovation", status: "completed" },
    ],
    totalProjects: 2,
    activeProjects: 1,
    completedProjects: 1,
    totalEarnings: 9800,
    availability: "Available",
    lastActive: "2025-03-11",
  },
  {
    id: "sub-007",
    name: "James Wilson",
    company: "Wilson Roofing",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JW",
    specialty: "Roofer",
    rating: 4.7,
    location: "Austin, TX",
    phone: "(512) 555-8765",
    email: "james@wilsonroofing.com",
    projects: [{ id: "proj-006", name: "Residential Roof Replacement", status: "completed" }],
    totalProjects: 1,
    activeProjects: 0,
    completedProjects: 1,
    totalEarnings: 8500,
    availability: "Available",
    lastActive: "2025-02-28",
  },
  {
    id: "sub-004",
    name: "Lisa Chen",
    company: "Chen Painting & Drywall",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "LC",
    specialty: "Painter",
    rating: 4.6,
    location: "Los Angeles, CA",
    phone: "(213) 555-9876",
    email: "lisa@chenpainting.com",
    projects: [{ id: "proj-001", name: "Modern Kitchen Renovation", status: "pending" }],
    totalProjects: 1,
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
    availability: "Available",
    lastActive: "2025-03-09",
  },
]

export default function MyTeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [teamSubcontractors, setTeamSubcontractors] = useState(mockTeamSubcontractors)
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  // Filter subcontractors based on search and filters
  const filteredSubcontractors = teamSubcontractors.filter((sub) => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const nameMatch = sub.name.toLowerCase().includes(query)
      const companyMatch = sub.company.toLowerCase().includes(query)
      const specialtyMatch = sub.specialty.toLowerCase().includes(query)
      const locationMatch = sub.location.toLowerCase().includes(query)

      if (!(nameMatch || companyMatch || specialtyMatch || locationMatch)) {
        return false
      }
    }

    // Apply specialty filter
    if (specialtyFilter !== "all" && sub.specialty !== specialtyFilter) {
      return false
    }

    // Apply status filter
    if (statusFilter === "active" && sub.activeProjects === 0) {
      return false
    } else if (statusFilter === "pending" && !sub.projects.some((p) => p.status === "pending")) {
      return false
    }

    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Team</h1>
          <p className="text-muted-foreground">Manage your subcontractor team across all projects</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subcontractors..."
              className="pl-8 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="Electrician">Electrician</SelectItem>
              <SelectItem value="Plumber">Plumber</SelectItem>
              <SelectItem value="Carpenter">Carpenter</SelectItem>
              <SelectItem value="Painter">Painter</SelectItem>
              <SelectItem value="Tile Installer">Tile Installer</SelectItem>
              <SelectItem value="Roofer">Roofer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" className="w-auto">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                All
              </TabsTrigger>
              <TabsTrigger value="active" onClick={() => setStatusFilter("active")}>
                Active
              </TabsTrigger>
              <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>
                Pending
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubcontractors.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3">
              <Card className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No subcontractors found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setSpecialtyFilter("all")
                    setStatusFilter("all")
                  }}
                >
                  Reset Filters
                </Button>
              </Card>
            </div>
          ) : (
            filteredSubcontractors.map((subcontractor) => (
              <Card key={subcontractor.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={subcontractor.avatar} />
                      <AvatarFallback>{subcontractor.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{subcontractor.name}</CardTitle>
                      <CardDescription>{subcontractor.company}</CardDescription>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline">{subcontractor.specialty}</Badge>
                        {subcontractor.activeProjects > 0 && <Badge>Active</Badge>}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">{subcontractor.rating} Rating</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{subcontractor.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{subcontractor.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{subcontractor.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last active: {subcontractor.lastActive}</span>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-2xl font-bold">{subcontractor.totalProjects}</p>
                      <p className="text-xs text-muted-foreground">Total Projects</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{subcontractor.activeProjects}</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${(subcontractor.totalEarnings / 1000).toFixed(1)}k</p>
                      <p className="text-xs text-muted-foreground">Total Paid</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 px-6 py-3">
                  <div className="flex items-center justify-between w-full">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Message
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/contractor/subcontractors/${subcontractor.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Team Subcontractors</CardTitle>
            <CardDescription>All subcontractors across your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubcontractors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No subcontractors found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubcontractors.map((subcontractor) => (
                    <TableRow key={subcontractor.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={subcontractor.avatar} />
                            <AvatarFallback>{subcontractor.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{subcontractor.name}</p>
                            <p className="text-xs text-muted-foreground">{subcontractor.company}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subcontractor.specialty}</Badge>
                      </TableCell>
                      <TableCell>{subcontractor.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{subcontractor.activeProjects}</span>
                          <span className="text-xs text-muted-foreground">active</span>
                          <span className="mx-1 text-muted-foreground">/</span>
                          <span className="font-medium">{subcontractor.totalProjects}</span>
                          <span className="text-xs text-muted-foreground">total</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 text-amber-500 fill-amber-500" />
                          <span>{subcontractor.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            subcontractor.availability.includes("Available") ? "text-green-600" : "text-amber-600"
                          }
                        >
                          {subcontractor.availability}
                        </span>
                      </TableCell>
                      <TableCell>${subcontractor.totalEarnings.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/contractor/subcontractors/${subcontractor.id}`)}
                          >
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

