"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, Search, UserPlus, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for subcontractors
const mockSubcontractors = [
  {
    id: "sub-001",
    name: "Mike Johnson",
    company: "Johnson Electrical Services",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MJ",
    specialty: "Electrician",
    rating: 4.8,
    completedProjects: 32,
    location: "Seattle, WA",
    hourlyRate: 75,
    availability: "Available",
    skills: ["Residential Wiring", "Commercial Electrical", "Lighting Installation", "Panel Upgrades"],
    certifications: ["Licensed Master Electrician", "OSHA Certified"],
    bio: "Over 15 years of experience in residential and commercial electrical work. Specializing in new construction, remodels, and electrical troubleshooting.",
  },
  {
    id: "sub-002",
    name: "Sarah Williams",
    company: "Williams Plumbing Co.",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
    specialty: "Plumber",
    rating: 4.9,
    completedProjects: 45,
    location: "Portland, OR",
    hourlyRate: 80,
    availability: "Available",
    skills: ["Pipe Installation", "Fixture Installation", "Water Heaters", "Drain Cleaning"],
    certifications: ["Master Plumber License", "Backflow Prevention Certification"],
    bio: "Family-owned plumbing business with 20+ years of experience. We handle everything from small repairs to complete plumbing systems for new construction.",
  },
  {
    id: "sub-003",
    name: "Carlos Rodriguez",
    company: "Rodriguez Carpentry",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CR",
    specialty: "Carpenter",
    rating: 4.7,
    completedProjects: 28,
    location: "San Francisco, CA",
    hourlyRate: 65,
    availability: "Booked until next month",
    skills: ["Framing", "Finish Carpentry", "Cabinet Installation", "Custom Woodwork"],
    certifications: ["Certified Carpenter", "OSHA Safety Training"],
    bio: "Skilled carpenter with attention to detail. Specializing in custom woodwork, cabinetry, and structural carpentry for residential projects.",
  },
  {
    id: "sub-004",
    name: "Lisa Chen",
    company: "Chen Painting & Drywall",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "LC",
    specialty: "Painter",
    rating: 4.6,
    completedProjects: 50,
    location: "Los Angeles, CA",
    hourlyRate: 55,
    availability: "Available",
    skills: ["Interior Painting", "Exterior Painting", "Drywall Repair", "Texture Application"],
    certifications: ["EPA Lead-Safe Certified", "Professional Painters Certification"],
    bio: "Professional painting services for residential and commercial properties. We pride ourselves on clean work, attention to detail, and timely completion.",
  },
  {
    id: "sub-005",
    name: "David Kim",
    company: "Kim HVAC Solutions",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DK",
    specialty: "HVAC Technician",
    rating: 4.9,
    completedProjects: 37,
    location: "Chicago, IL",
    hourlyRate: 85,
    availability: "Limited Availability",
    skills: ["HVAC Installation", "Heating Repair", "AC Repair", "Ventilation Systems"],
    certifications: ["HVAC License", "EPA 608 Certification", "NATE Certified"],
    bio: "Certified HVAC technician specializing in installation and repair of heating and cooling systems for residential and light commercial applications.",
  },
  {
    id: "sub-006",
    name: "Anna Martinez",
    company: "Martinez Tile & Stone",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AM",
    specialty: "Tile Installer",
    rating: 4.8,
    completedProjects: 42,
    location: "Denver, CO",
    hourlyRate: 70,
    availability: "Available",
    skills: ["Ceramic Tile", "Porcelain Tile", "Natural Stone", "Backsplashes", "Shower Installation"],
    certifications: ["Certified Tile Installer", "Natural Stone Institute Certification"],
    bio: "Specializing in custom tile and stone installation for kitchens, bathrooms, and other living spaces. Known for precision, creativity, and quality craftsmanship.",
  },
  {
    id: "sub-007",
    name: "James Wilson",
    company: "Wilson Roofing",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JW",
    specialty: "Roofer",
    rating: 4.7,
    completedProjects: 60,
    location: "Austin, TX",
    hourlyRate: 75,
    availability: "Available",
    skills: ["Asphalt Shingles", "Metal Roofing", "Roof Repair", "Roof Inspection"],
    certifications: ["Licensed Roofing Contractor", "GAF Certified Installer"],
    bio: "Experienced roofing contractor providing quality installation and repair services. We work with various roofing materials and prioritize safety and durability.",
  },
  {
    id: "sub-008",
    name: "Maria Garcia",
    company: "Garcia Landscaping",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MG",
    specialty: "Landscaper",
    rating: 4.6,
    completedProjects: 55,
    location: "Miami, FL",
    hourlyRate: 60,
    availability: "Available",
    skills: ["Landscape Design", "Hardscaping", "Irrigation Systems", "Plant Installation"],
    certifications: ["Certified Landscape Professional", "Irrigation Technician Certification"],
    bio: "Full-service landscaping company offering design, installation, and maintenance services. We create beautiful, sustainable outdoor spaces tailored to client needs.",
  },
]

// Mock data for active projects to invite subcontractors to
const activeProjects = [
  { id: "proj-001", name: "Modern Kitchen Renovation" },
  { id: "proj-002", name: "Master Bathroom Remodel" },
  { id: "proj-003", name: "Basement Finishing" },
  { id: "proj-004", name: "Deck Construction" },
]

export default function SubcontractorsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<any>(null)
  const [inviteProject, setInviteProject] = useState("")
  const [inviteMessage, setInviteMessage] = useState("")
  const [invitedSubcontractors, setInvitedSubcontractors] = useState<string[]>([])
  const [pendingSubcontractors, setPendingSubcontractors] = useState<string[]>(["sub-003", "sub-005"])

  // Filter subcontractors based on search and filters
  const filteredSubcontractors = mockSubcontractors.filter((sub) => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const nameMatch = sub.name.toLowerCase().includes(query)
      const companyMatch = sub.company.toLowerCase().includes(query)
      const specialtyMatch = sub.specialty.toLowerCase().includes(query)
      const locationMatch = sub.location.toLowerCase().includes(query)
      const skillsMatch = sub.skills.some((skill) => skill.toLowerCase().includes(query))

      if (!(nameMatch || companyMatch || specialtyMatch || locationMatch || skillsMatch)) {
        return false
      }
    }

    // Apply specialty filter
    if (specialtyFilter !== "all" && sub.specialty !== specialtyFilter) {
      return false
    }

    // Apply availability filter
    if (availabilityFilter === "available" && !sub.availability.includes("Available")) {
      return false
    }

    return true
  })

  // Handle inviting a subcontractor
  const handleInvite = () => {
    if (!inviteProject) {
      toast({
        title: "Please select a project",
        description: "You must select a project to invite the subcontractor to.",
        variant: "destructive",
      })
      return
    }

    // Add to invited list
    setInvitedSubcontractors([...invitedSubcontractors, selectedSubcontractor.id])

    // Reset form
    setInviteProject("")
    setInviteMessage("")

    // Show success message
    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${selectedSubcontractor.name} for the selected project.`,
    })

    // Close dialog by clearing selected subcontractor
    setSelectedSubcontractor(null)
  }

  // Get subcontractor status
  const getSubcontractorStatus = (id: string) => {
    if (invitedSubcontractors.includes(id)) return "invited"
    if (pendingSubcontractors.includes(id)) return "pending"
    return "available"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subcontractors</h2>
          <p className="text-muted-foreground">Find and manage skilled professionals for your projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/contractor/subcontractors/my-team")}>
            View My Team
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Subcontractor
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Filters sidebar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Electrician">Electrician</SelectItem>
                  <SelectItem value="Plumber">Plumber</SelectItem>
                  <SelectItem value="Carpenter">Carpenter</SelectItem>
                  <SelectItem value="Painter">Painter</SelectItem>
                  <SelectItem value="HVAC Technician">HVAC Technician</SelectItem>
                  <SelectItem value="Tile Installer">Tile Installer</SelectItem>
                  <SelectItem value="Roofer">Roofer</SelectItem>
                  <SelectItem value="Landscaper">Landscaper</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Availability</label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="available">Available Now</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Hourly Rate Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Min" />
                <Input type="number" placeholder="Max" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="City, State" />
            </div>

            <Button className="w-full">Apply Filters</Button>
          </CardContent>
        </Card>

        {/* Subcontractors list */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subcontractors..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="invited">Invited</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4">
            {filteredSubcontractors.length === 0 ? (
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
                    setAvailabilityFilter("all")
                  }}
                >
                  Reset Filters
                </Button>
              </Card>
            ) : (
              filteredSubcontractors.map((subcontractor) => {
                const status = getSubcontractorStatus(subcontractor.id)
                return (
                  <Card key={subcontractor.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
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
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="mr-1 h-3 w-3" />
                                {subcontractor.location}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant={status === "available" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedSubcontractor(subcontractor)}
                              disabled={status !== "available"}
                            >
                              {status === "invited" ? (
                                <>
                                  <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                  Invited
                                </>
                              ) : status === "pending" ? (
                                <>
                                  <Clock className="mr-1 h-4 w-4 text-amber-500" />
                                  Pending
                                </>
                              ) : (
                                "Invite"
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Invite Subcontractor</DialogTitle>
                              <DialogDescription>
                                Send an invitation to {selectedSubcontractor?.name} to join your project.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-medium">Select Project</label>
                                <Select value={inviteProject} onValueChange={setInviteProject}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a project" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {activeProjects.map((project) => (
                                      <SelectItem key={project.id} value={project.id}>
                                        {project.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-medium">Message (Optional)</label>
                                <Input
                                  placeholder="Add a personal message..."
                                  value={inviteMessage}
                                  onChange={(e) => setInviteMessage(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedSubcontractor(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleInvite}>Send Invitation</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium">{subcontractor.rating} Rating</span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({subcontractor.completedProjects} projects)
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium">${subcontractor.hourlyRate}/hr</span>
                            <span className="ml-2 text-sm text-muted-foreground">Typical rate</span>
                          </div>
                          <div className="flex items-center">
                            <span
                              className={`text-sm font-medium ${
                                subcontractor.availability.includes("Available") ? "text-green-600" : "text-amber-600"
                              }`}
                            >
                              {subcontractor.availability}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground line-clamp-3">{subcontractor.bio}</p>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {subcontractor.skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {subcontractor.skills.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{subcontractor.skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 px-6 py-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-wrap gap-2">
                          {subcontractor.certifications.map((cert) => (
                            <Badge key={cert} variant="outline" className="bg-background text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
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
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

