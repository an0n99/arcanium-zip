"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Calendar,
  DollarSign,
  Filter,
  Home,
  MapPin,
  Sliders,
  Star,
  Clock,
  Briefcase,
  Building,
  Hammer,
  Paintbrush,
  Wrench,
  Lightbulb,
  Bookmark,
  BookmarkPlus,
  Calculator,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Mock data for project opportunities
const projectOpportunities = [
  {
    id: "OPP-2023-001",
    title: "Full Home Renovation",
    location: "Seattle, WA",
    budget: "50,000 - 75,000",
    budgetRange: [50000, 75000],
    postedDate: "2023-11-01",
    deadline: "2023-11-30",
    description:
      "Looking for a contractor to renovate our 3-bedroom, 2-bathroom home. Work includes kitchen and bathroom remodels, flooring replacement, and painting throughout.",
    homeowner: {
      name: "David Miller",
      rating: 4.8,
      projectsCompleted: 2,
    },
    projectType: "Renovation",
    propertyType: "Single Family Home",
    timeframe: "3-4 months",
    skills: ["Kitchen Remodel", "Bathroom Remodel", "Flooring", "Painting"],
    views: 45,
    proposals: 8,
    saved: false,
  },
  {
    id: "OPP-2023-002",
    title: "Kitchen Remodel",
    location: "Portland, OR",
    budget: "25,000 - 35,000",
    budgetRange: [25000, 35000],
    postedDate: "2023-11-05",
    deadline: "2023-11-25",
    description:
      "Need a contractor to remodel our kitchen. Project includes new cabinets, countertops, backsplash, and appliance installation.",
    homeowner: {
      name: "Jennifer Adams",
      rating: 4.5,
      projectsCompleted: 1,
    },
    projectType: "Remodel",
    propertyType: "Condominium",
    timeframe: "1-2 months",
    skills: ["Kitchen Remodel", "Cabinetry", "Countertops", "Appliance Installation"],
    views: 38,
    proposals: 6,
    saved: true,
  },
  {
    id: "OPP-2023-003",
    title: "Bathroom Renovation",
    location: "San Francisco, CA",
    budget: "15,000 - 25,000",
    budgetRange: [15000, 25000],
    postedDate: "2023-11-08",
    deadline: "2023-11-28",
    description:
      "Looking for a contractor to renovate two bathrooms. Work includes new vanities, showers, toilets, and tile work.",
    homeowner: {
      name: "Michael Chen",
      rating: 4.9,
      projectsCompleted: 3,
    },
    projectType: "Renovation",
    propertyType: "Townhouse",
    timeframe: "1-2 months",
    skills: ["Bathroom Renovation", "Plumbing", "Tile Work", "Fixture Installation"],
    views: 32,
    proposals: 5,
    saved: false,
  },
  {
    id: "OPP-2023-004",
    title: "Deck Construction",
    location: "Denver, CO",
    budget: "10,000 - 15,000",
    budgetRange: [10000, 15000],
    postedDate: "2023-11-10",
    deadline: "2023-12-05",
    description: "Need a contractor to build a 400 sq ft composite deck with railings and stairs.",
    homeowner: {
      name: "Sarah Johnson",
      rating: 4.7,
      projectsCompleted: 1,
    },
    projectType: "Construction",
    propertyType: "Single Family Home",
    timeframe: "2-3 weeks",
    skills: ["Deck Building", "Carpentry", "Outdoor Construction"],
    views: 25,
    proposals: 4,
    saved: false,
  },
  {
    id: "OPP-2023-005",
    title: "Basement Finishing",
    location: "Chicago, IL",
    budget: "30,000 - 45,000",
    budgetRange: [30000, 45000],
    postedDate: "2023-11-12",
    deadline: "2023-12-10",
    description:
      "Looking for a contractor to finish our 800 sq ft basement. Work includes framing, drywall, electrical, plumbing, flooring, and a bathroom installation.",
    homeowner: {
      name: "Robert Wilson",
      rating: 4.6,
      projectsCompleted: 2,
    },
    projectType: "Finishing",
    propertyType: "Single Family Home",
    timeframe: "2-3 months",
    skills: ["Basement Finishing", "Framing", "Drywall", "Electrical", "Plumbing"],
    views: 42,
    proposals: 7,
    saved: true,
  },
  {
    id: "OPP-2023-006",
    title: "Office Renovation",
    location: "Austin, TX",
    budget: "40,000 - 60,000",
    budgetRange: [40000, 60000],
    postedDate: "2023-11-15",
    deadline: "2023-12-15",
    description:
      "Need a contractor to renovate a 1,500 sq ft office space. Work includes demolition, new walls, flooring, ceiling, lighting, and HVAC modifications.",
    homeowner: {
      name: "Tech Innovations Inc.",
      rating: 4.8,
      projectsCompleted: 4,
    },
    projectType: "Commercial Renovation",
    propertyType: "Office Building",
    timeframe: "2-3 months",
    skills: ["Commercial Renovation", "Demolition", "Framing", "Flooring", "HVAC"],
    views: 50,
    proposals: 9,
    saved: false,
  },
  {
    id: "OPP-2023-007",
    title: "Exterior Painting",
    location: "Miami, FL",
    budget: "8,000 - 12,000",
    budgetRange: [8000, 12000],
    postedDate: "2023-11-18",
    deadline: "2023-12-18",
    description:
      "Looking for a contractor to paint the exterior of our 2-story, 2,500 sq ft home. Work includes pressure washing, prep, priming, and painting.",
    homeowner: {
      name: "Lisa Rodriguez",
      rating: 4.5,
      projectsCompleted: 1,
    },
    projectType: "Painting",
    propertyType: "Single Family Home",
    timeframe: "1-2 weeks",
    skills: ["Exterior Painting", "Pressure Washing", "Surface Preparation"],
    views: 28,
    proposals: 5,
    saved: false,
  },
  {
    id: "OPP-2023-008",
    title: "Roof Replacement",
    location: "Atlanta, GA",
    budget: "15,000 - 25,000",
    budgetRange: [15000, 25000],
    postedDate: "2023-11-20",
    deadline: "2023-12-20",
    description:
      "Need a contractor to replace the roof on our 2,200 sq ft home. Current roof is asphalt shingles and we want to replace with architectural shingles.",
    homeowner: {
      name: "James Thompson",
      rating: 4.7,
      projectsCompleted: 2,
    },
    projectType: "Roofing",
    propertyType: "Single Family Home",
    timeframe: "1 week",
    skills: ["Roofing", "Shingle Installation", "Roof Repair"],
    views: 35,
    proposals: 6,
    saved: false,
  },
]

// Project type icons
const projectTypeIcons: Record<string, any> = {
  Renovation: <Hammer className="h-4 w-4" />,
  Remodel: <Wrench className="h-4 w-4" />,
  Construction: <Building className="h-4 w-4" />,
  Finishing: <Paintbrush className="h-4 w-4" />,
  "Commercial Renovation": <Briefcase className="h-4 w-4" />,
  Painting: <Paintbrush className="h-4 w-4" />,
  Roofing: <Home className="h-4 w-4" />,
}

// Property type icons
const propertyTypeIcons: Record<string, any> = {
  "Single Family Home": <Home className="h-4 w-4" />,
  Condominium: <Building className="h-4 w-4" />,
  Townhouse: <Building className="h-4 w-4" />,
  "Office Building": <Briefcase className="h-4 w-4" />,
}

export default function FindOpportunities() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [projectType, setProjectType] = useState("all")
  const [budgetRange, setBudgetRange] = useState([0, 100000])
  const [savedProjects, setSavedProjects] = useState<string[]>(
    projectOpportunities.filter((p) => p.saved).map((p) => p.id),
  )
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false)
  const { toast } = useToast()
  const [viewingProject, setViewingProject] = useState<any>(null)

  // Filter projects
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filter projects
  const filteredProjects = projectOpportunities
    .filter((project) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          project.title.toLowerCase().includes(query) ||
          project.location.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.skills.some((skill) => skill.toLowerCase().includes(query))
        )
      }
      return true
    })
    .filter((project) => {
      // Apply project type filter
      if (projectType === "all") return true
      return project.projectType === projectType
    })
    .filter((project) => {
      // Apply budget range filter
      const [min, max] = budgetRange
      const [projectMin, projectMax] = project.budgetRange
      return projectMax >= min && projectMin <= max
    })

  // Toggle saved status
  const toggleSaved = (id: string) => {
    if (savedProjects.includes(id)) {
      setSavedProjects(savedProjects.filter((projectId) => projectId !== id))
      toast({
        title: "Project removed from saved",
        description: "The project has been removed from your saved list.",
      })
    } else {
      setSavedProjects([...savedProjects, id])
      toast({
        title: "Project saved",
        description: "The project has been added to your saved list.",
      })
    }
  }

  // Submit proposal
  const handleSubmitProposal = () => {
    setIsSubmittingProposal(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmittingProposal(false)
      setSelectedProject(null)
      toast({
        title: "Proposal submitted",
        description: "Your proposal has been submitted successfully.",
      })
    }, 1500)
  }

  const goToMaterialEstimator = (project: any) => {
    router.push(
      `/contractor/material-estimator?projectId=${project.id}&projectName=${encodeURIComponent(project.title)}&projectType=opportunities`,
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Find Opportunities</h2>
          <p className="text-muted-foreground">Discover new renovation projects that match your skills and expertise</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Sliders className="mr-2 h-4 w-4" />
            Advanced Search
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
              <Label>Project Type</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Project Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Project Types</SelectItem>
                  <SelectItem value="Renovation">Renovation</SelectItem>
                  <SelectItem value="Remodel">Remodel</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Finishing">Finishing</SelectItem>
                  <SelectItem value="Commercial Renovation">Commercial Renovation</SelectItem>
                  <SelectItem value="Painting">Painting</SelectItem>
                  <SelectItem value="Roofing">Roofing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Budget Range</Label>
              <div className="pt-4">
                <Slider
                  defaultValue={[0, 100000]}
                  max={100000}
                  step={5000}
                  value={budgetRange}
                  onValueChange={setBudgetRange}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm">${budgetRange[0].toLocaleString()}</span>
                  <span className="text-sm">${budgetRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Separator />

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="location">
                <AccordionTrigger>Location</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="location-seattle" />
                      <Label htmlFor="location-seattle">Seattle, WA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="location-portland" />
                      <Label htmlFor="location-portland">Portland, OR</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="location-sanfrancisco" />
                      <Label htmlFor="location-sanfrancisco">San Francisco, CA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="location-denver" />
                      <Label htmlFor="location-denver">Denver, CO</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="location-other" />
                      <Label htmlFor="location-other">Other</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="property-type">
                <AccordionTrigger>Property Type</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="property-single" />
                      <Label htmlFor="property-single">Single Family Home</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="property-condo" />
                      <Label htmlFor="property-condo">Condominium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="property-townhouse" />
                      <Label htmlFor="property-townhouse">Townhouse</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="property-commercial" />
                      <Label htmlFor="property-commercial">Commercial</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="skills">
                <AccordionTrigger>Required Skills</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-kitchen" />
                      <Label htmlFor="skill-kitchen">Kitchen Remodel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-bathroom" />
                      <Label htmlFor="skill-bathroom">Bathroom Renovation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-flooring" />
                      <Label htmlFor="skill-flooring">Flooring</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-painting" />
                      <Label htmlFor="skill-painting">Painting</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-electrical" />
                      <Label htmlFor="skill-electrical">Electrical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-plumbing" />
                      <Label htmlFor="skill-plumbing">Plumbing</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button className="w-full">Apply Filters</Button>
          </CardContent>
        </Card>

        {/* Projects list */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Tabs defaultValue="all" className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="mr-1 h-3 w-3" /> {project.location}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => toggleSaved(project.id)} className="h-8 w-8">
                      {savedProjects.includes(project.id) ? (
                        <Bookmark className="h-5 w-5 text-primary" fill="currentColor" />
                      ) : (
                        <BookmarkPlus className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Budget: ${project.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Posted: {new Date(project.postedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        {projectTypeIcons[project.projectType] || (
                          <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="ml-2 text-sm">{project.projectType}</span>
                      </div>
                      <div className="flex items-center">
                        {propertyTypeIcons[project.propertyType] || (
                          <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="ml-2 text-sm">{project.propertyType}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground line-clamp-4">{project.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.skills.map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">{project.homeowner.rating}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{project.views} views</div>
                      <div className="text-sm text-muted-foreground">{project.proposals} proposals</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setViewingProject(project)}>
                        View Details
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedProject(project)} className="gap-1">
                            Submit Proposal <ArrowRight className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Submit Proposal</DialogTitle>
                            <DialogDescription>
                              Create a proposal for {selectedProject?.title}. Be sure to include your pricing, timeline,
                              and approach.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="bid-amount">Bid Amount ($)</Label>
                              <Input id="bid-amount" type="number" placeholder="Enter your bid amount" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="timeline">Estimated Timeline</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timeline" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                                  <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                                  <SelectItem value="1-2-months">1-2 months</SelectItem>
                                  <SelectItem value="2-3-months">2-3 months</SelectItem>
                                  <SelectItem value="3-6-months">3-6 months</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="proposal">Proposal Details</Label>
                              <Textarea
                                id="proposal"
                                placeholder="Describe your approach, experience with similar projects, and why you're the right contractor for this job."
                                rows={6}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="attachments">Attachments</Label>
                              <Input id="attachments" type="file" multiple />
                              <p className="text-xs text-muted-foreground">
                                Upload relevant documents such as portfolio, licenses, or certifications.
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedProject(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSubmitProposal} disabled={isSubmittingProposal}>
                              {isSubmittingProposal ? "Submitting..." : "Submit Proposal"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredProjects.length === 0 && (
              <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <Lightbulb className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No projects found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setProjectType("all")
                      setBudgetRange([0, 100000])
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Project Details Dialog */}
      <Dialog open={!!viewingProject} onOpenChange={(open) => !open && setViewingProject(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{viewingProject?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3" /> {viewingProject?.location}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Budget</h3>
                <p>${viewingProject?.budget}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Timeline</h3>
                <p>{viewingProject?.timeframe}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Project Type</h3>
                <p>{viewingProject?.projectType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Property Type</h3>
                <p>{viewingProject?.propertyType}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm">{viewingProject?.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Required Skills</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {viewingProject?.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Homeowner</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-amber-500" />
                  <span>{viewingProject?.homeowner.rating}</span>
                </div>
                <span>•</span>
                <span>{viewingProject?.homeowner.projectsCompleted} projects completed</span>
              </div>
            </div>

            <div className="border rounded-md p-4 bg-muted/20">
              <h3 className="text-sm font-medium mb-2">Project Plans</h3>
              <p className="text-sm mb-2">
                This project has architectural plans available that can be used for material estimation.
              </p>
              <Button onClick={() => viewingProject && goToMaterialEstimator(viewingProject)}>
                <Calculator className="mr-2 h-4 w-4" />
                Generate Material Estimate
              </Button>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setViewingProject(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setSelectedProject(viewingProject)
                setViewingProject(null)
              }}
            >
              Submit Proposal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

