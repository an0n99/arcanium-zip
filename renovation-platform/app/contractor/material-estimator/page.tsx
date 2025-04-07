"use client"

import { useState, useEffect } from "react"
import {
  Calculator,
  BarChart4,
  FileText,
  RefreshCcw,
  Building2,
  DollarSign,
  ShoppingBag,
  Truck,
  ArrowRight,
  Brain,
  Share2,
  Search,
  Save,
  Download,
  Undo2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

// Add these imports at the top if they're not already there
import { useSearchParams } from "next/navigation"

// Types
type ProjectSource = "active" | "bids" | "opportunities"
type MaterialCategory =
  | "lumber"
  | "finishing"
  | "concrete"
  | "plumbing"
  | "electrical"
  | "hvac"
  | "roofing"
  | "insulation"
  | "paint"
  | "fixtures"
  | "other"
type MaterialPriceSource = "local" | "national" | "online" | "preferred" | "historical"
type MaterialUnit =
  | "ft"
  | "sq ft"
  | "cu ft"
  | "board ft"
  | "piece"
  | "each"
  | "lb"
  | "gallon"
  | "roll"
  | "sheet"
  | "box"
  | "pallet"

interface MaterialEstimate {
  id: string
  name: string
  description: string
  category: MaterialCategory
  quantity: number
  unit: MaterialUnit
  prices: {
    source: MaterialPriceSource
    price: number
    supplier?: string
    availability?: "in-stock" | "low-stock" | "out-of-stock" | "pre-order" | "special-order"
    leadTime?: string
    notes?: string
  }[]
  alternativeOptions?: {
    id: string
    name: string
    price: number
    qualityDiff: "higher" | "similar" | "lower"
    notes: string
  }[]
  dimensions?: string
  specifications?: string
  selected: boolean
  adjustedQuantity?: number
}

interface Project {
  id: string
  name: string
  type: string
  status: string
  client: string
  source: ProjectSource
  plans?: {
    id: string
    name: string
    type: string
    url: string
  }[]
}

export default function MaterialEstimatorPage() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingProgress, setGeneratingProgress] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [materialEstimates, setMaterialEstimates] = useState<MaterialEstimate[]>([])
  const [selectedTab, setSelectedTab] = useState("estimate")
  const [priceSource, setPriceSource] = useState<MaterialPriceSource>("local")
  const [materialFilter, setMaterialFilter] = useState<MaterialCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnlySelected, setShowOnlySelected] = useState(false)
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [totalEstimate, setTotalEstimate] = useState({
    originalCost: 0,
    adjustedCost: 0,
    savings: 0,
    items: 0,
    weight: 0,
  })

  // Inside the MaterialEstimatorPage component, add this code near the top:
  const searchParams = useSearchParams()
  const projectIdFromUrl = searchParams.get("projectId")
  const projectNameFromUrl = searchParams.get("projectName")
  const projectTypeFromUrl = searchParams.get("projectType")

  // Mock data for projects
  const projects: Project[] = [
    {
      id: "prj-001",
      name: "Kitchen Renovation",
      type: "Renovation",
      status: "in-progress",
      client: "Sarah Johnson",
      source: "active",
      plans: [
        { id: "pln-001", name: "Kitchen Layout", type: "architectural", url: "/architectural-plans.pdf" },
        { id: "pln-002", name: "Plumbing Diagram", type: "plumbing", url: "/plumbing-diagram.pdf" },
      ],
    },
    {
      id: "prj-002",
      name: "Bathroom Remodel",
      type: "Remodel",
      status: "in-progress",
      client: "Michael Chen",
      source: "active",
      plans: [{ id: "pln-003", name: "Bathroom Layout", type: "architectural", url: "/bathroom-layout.pdf" }],
    },
    {
      id: "prj-003",
      name: "Basement Finishing",
      type: "Finishing",
      status: "accepted",
      client: "Michael Brown",
      source: "bids",
      plans: [
        { id: "pln-004", name: "Basement Layout", type: "architectural", url: "/basement-layout.pdf" },
        { id: "pln-005", name: "Electrical Plan", type: "electrical", url: "/electrical-plan.pdf" },
      ],
    },
    {
      id: "prj-004",
      name: "Home Office Conversion",
      type: "Conversion",
      status: "accepted",
      client: "David Lee",
      source: "bids",
      plans: [{ id: "pln-006", name: "Office Layout", type: "architectural", url: "/office-layout.pdf" }],
    },
    {
      id: "prj-005",
      name: "Full Home Renovation",
      type: "Renovation",
      status: "seeking bids",
      client: "David Miller",
      source: "opportunities",
      plans: [
        { id: "pln-007", name: "Home Layout", type: "architectural", url: "/home-layout.pdf" },
        { id: "pln-008", name: "Elevation Plans", type: "architectural", url: "/elevation-plans.pdf" },
      ],
    },
    {
      id: "prj-006",
      name: "Deck Construction",
      type: "Construction",
      status: "seeking bids",
      client: "Sarah Johnson",
      source: "opportunities",
      plans: [
        { id: "pln-009", name: "Deck Layout", type: "architectural", url: "/deck-layout.pdf" },
        { id: "pln-010", name: "Structural Details", type: "structural", url: "/structural-details.pdf" },
      ],
    },
  ]

  // Generate material estimates for the selected project
  const generateMaterialEstimates = async () => {
    if (!selectedProject) return

    setIsGenerating(true)
    setGeneratingProgress(0)
    setAnalysisComplete(false)

    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setGeneratingProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 300)

    // Simulate completion of analysis after 3 seconds
    setTimeout(() => {
      clearInterval(interval)
      setGeneratingProgress(100)

      // Generate mock material estimates based on the project type
      const generatedEstimates: MaterialEstimate[] = generateMockEstimates(selectedProject)

      setMaterialEstimates(generatedEstimates)
      calculateTotals(generatedEstimates)
      setAnalysisComplete(true)
      setIsGenerating(false)

      toast({
        title: "Material Estimation Complete",
        description: `AI analysis completed for ${selectedProject.name}`,
      })
    }, 3000)
  }

  // Generate mock estimates based on project type
  const generateMockEstimates = (project: Project): MaterialEstimate[] => {
    const mockEstimates: MaterialEstimate[] = []

    // Common materials for all projects
    mockEstimates.push({
      id: "mat-001",
      name: "Drywall Sheets (4x8)",
      description: 'Standard 1/2" thickness drywall sheets for interior walls',
      category: "finishing",
      quantity: Math.floor(Math.random() * 50) + 20,
      unit: "sheet",
      prices: [
        { source: "local", price: 12.98, supplier: "Home Supply Co.", availability: "in-stock", leadTime: "0 days" },
        { source: "national", price: 11.99, supplier: "BuildersMax", availability: "in-stock", leadTime: "2-3 days" },
        { source: "online", price: 10.99, supplier: "ConstructDirect", availability: "in-stock", leadTime: "3-5 days" },
        {
          source: "preferred",
          price: 11.5,
          supplier: "Contractor Supply Inc.",
          availability: "in-stock",
          leadTime: "1 day",
        },
      ],
      selected: true,
    })

    mockEstimates.push({
      id: "mat-002",
      name: "Wood Studs (2x4x8)",
      description: "Kiln-dried structural lumber for framing",
      category: "lumber",
      quantity: Math.floor(Math.random() * 100) + 50,
      unit: "piece",
      prices: [
        { source: "local", price: 5.78, supplier: "Home Supply Co.", availability: "in-stock", leadTime: "0 days" },
        { source: "national", price: 5.25, supplier: "BuildersMax", availability: "in-stock", leadTime: "2-3 days" },
        { source: "online", price: 5.15, supplier: "ConstructDirect", availability: "in-stock", leadTime: "3-5 days" },
        {
          source: "preferred",
          price: 5.0,
          supplier: "Contractor Supply Inc.",
          availability: "in-stock",
          leadTime: "1 day",
        },
      ],
      selected: true,
    })

    // Add project-specific materials
    if (project.type.includes("Kitchen") || project.name.includes("Kitchen")) {
      mockEstimates.push({
        id: "mat-kitchen-001",
        name: "Kitchen Cabinet Set",
        description: "Complete kitchen cabinet set with uppers and lowers",
        category: "fixtures",
        quantity: 1,
        unit: "set",
        prices: [
          {
            source: "local",
            price: 4250.0,
            supplier: "Cabinet Gallery",
            availability: "special-order",
            leadTime: "3-4 weeks",
          },
          {
            source: "national",
            price: 3950.0,
            supplier: "CabinetWorks",
            availability: "special-order",
            leadTime: "4-5 weeks",
          },
          {
            source: "online",
            price: 3650.0,
            supplier: "DirectCabinets",
            availability: "special-order",
            leadTime: "5-6 weeks",
          },
          {
            source: "preferred",
            price: 3850.0,
            supplier: "Elite Cabinets",
            availability: "special-order",
            leadTime: "3 weeks",
          },
        ],
        alternativeOptions: [
          {
            id: "alt-001",
            name: "Economy Cabinet Set",
            price: 2800.0,
            qualityDiff: "lower",
            notes: "Particle board construction, limited finishes",
          },
          {
            id: "alt-002",
            name: "Premium Cabinet Set",
            price: 5200.0,
            qualityDiff: "higher",
            notes: "Solid wood construction, custom finishes",
          },
        ],
        selected: true,
      })

      mockEstimates.push({
        id: "mat-kitchen-002",
        name: "Quartz Countertop",
        description: "Engineered stone countertop for kitchen",
        category: "finishing",
        quantity: 30,
        unit: "sq ft",
        prices: [
          {
            source: "local",
            price: 75.0,
            supplier: "Stone Works",
            availability: "special-order",
            leadTime: "2-3 weeks",
          },
          {
            source: "national",
            price: 68.5,
            supplier: "CountertopCity",
            availability: "special-order",
            leadTime: "3-4 weeks",
          },
          {
            source: "online",
            price: 65.0,
            supplier: "StoneToYou",
            availability: "special-order",
            leadTime: "3-4 weeks",
          },
          {
            source: "preferred",
            price: 70.0,
            supplier: "Premium Stone",
            availability: "special-order",
            leadTime: "2 weeks",
          },
        ],
        alternativeOptions: [
          {
            id: "alt-003",
            name: "Laminate Countertop",
            price: 25.0,
            qualityDiff: "lower",
            notes: "Less durable but more affordable",
          },
          {
            id: "alt-004",
            name: "Granite Countertop",
            price: 85.0,
            qualityDiff: "higher",
            notes: "Natural stone, unique patterns",
          },
        ],
        selected: true,
      })
    }

    if (project.type.includes("Bathroom") || project.name.includes("Bathroom")) {
      mockEstimates.push({
        id: "mat-bath-001",
        name: 'Bathroom Vanity (36")',
        description: "Pre-assembled bathroom vanity with sink",
        category: "fixtures",
        quantity: 1,
        unit: "each",
        prices: [
          { source: "local", price: 799.0, supplier: "Bath Emporium", availability: "in-stock", leadTime: "0 days" },
          { source: "national", price: 749.0, supplier: "BathWorks", availability: "in-stock", leadTime: "2-3 days" },
          { source: "online", price: 719.0, supplier: "BathDirect", availability: "in-stock", leadTime: "3-5 days" },
          { source: "preferred", price: 725.0, supplier: "Designer Bath", availability: "in-stock", leadTime: "1 day" },
        ],
        selected: true,
      })

      mockEstimates.push({
        id: "mat-bath-002",
        name: 'Ceramic Tile (12"x12")',
        description: "Glazed ceramic floor tiles",
        category: "finishing",
        quantity: 80,
        unit: "sq ft",
        prices: [
          { source: "local", price: 4.25, supplier: "Tile Shop", availability: "in-stock", leadTime: "0 days" },
          { source: "national", price: 3.89, supplier: "TileCity", availability: "in-stock", leadTime: "2-3 days" },
          { source: "online", price: 3.5, supplier: "DirectTile", availability: "in-stock", leadTime: "3-5 days" },
          { source: "preferred", price: 3.65, supplier: "Pro Tile", availability: "in-stock", leadTime: "1 day" },
        ],
        selected: true,
      })
    }

    if (project.type.includes("Deck") || project.name.includes("Deck")) {
      mockEstimates.push({
        id: "mat-deck-001",
        name: 'Pressure Treated Lumber (2"x6"x12\')',
        description: "Pressure treated for outdoor use",
        category: "lumber",
        quantity: 65,
        unit: "piece",
        prices: [
          { source: "local", price: 14.98, supplier: "Lumber Yard", availability: "in-stock", leadTime: "0 days" },
          { source: "national", price: 13.89, supplier: "BuildersMax", availability: "in-stock", leadTime: "2-3 days" },
          { source: "online", price: 13.25, supplier: "LumberDirect", availability: "in-stock", leadTime: "3-5 days" },
          {
            source: "preferred",
            price: 13.5,
            supplier: "Contractor Supply Inc.",
            availability: "in-stock",
            leadTime: "1 day",
          },
        ],
        selected: true,
      })

      mockEstimates.push({
        id: "mat-deck-002",
        name: "Concrete (60lb bags)",
        description: "General purpose concrete mix for footings",
        category: "concrete",
        quantity: 24,
        unit: "each",
        prices: [
          { source: "local", price: 6.25, supplier: "Home Supply Co.", availability: "in-stock", leadTime: "0 days" },
          { source: "national", price: 5.89, supplier: "BuildersMax", availability: "in-stock", leadTime: "2-3 days" },
          {
            source: "online",
            price: 5.75,
            supplier: "ConstructDirect",
            availability: "in-stock",
            leadTime: "3-5 days",
          },
          {
            source: "preferred",
            price: 5.5,
            supplier: "Contractor Supply Inc.",
            availability: "in-stock",
            leadTime: "1 day",
          },
        ],
        selected: true,
      })
    }

    // Add a few more materials for variety
    mockEstimates.push({
      id: "mat-003",
      name: "Interior Latex Paint",
      description: "Premium interior latex paint, various colors",
      category: "paint",
      quantity: Math.floor(Math.random() * 10) + 5,
      unit: "gallon",
      prices: [
        { source: "local", price: 38.99, supplier: "Paint Store", availability: "in-stock", leadTime: "0 days" },
        { source: "national", price: 35.99, supplier: "PaintCo", availability: "in-stock", leadTime: "2-3 days" },
        { source: "online", price: 32.99, supplier: "PaintDirect", availability: "in-stock", leadTime: "3-5 days" },
        { source: "preferred", price: 34.5, supplier: "Pro Paint", availability: "in-stock", leadTime: "1 day" },
      ],
      selected: true,
    })

    mockEstimates.push({
      id: "mat-004",
      name: "Electrical Wire (12/2 Romex)",
      description: "12 gauge electrical wire for general purpose circuits",
      category: "electrical",
      quantity: Math.floor(Math.random() * 300) + 100,
      unit: "ft",
      prices: [
        { source: "local", price: 0.89, supplier: "Electrical Supply", availability: "in-stock", leadTime: "0 days" },
        { source: "national", price: 0.81, supplier: "ElectroCity", availability: "in-stock", leadTime: "2-3 days" },
        { source: "online", price: 0.76, supplier: "WireDirect", availability: "in-stock", leadTime: "3-5 days" },
        { source: "preferred", price: 0.78, supplier: "Pro Electric", availability: "in-stock", leadTime: "1 day" },
      ],
      selected: true,
    })

    return mockEstimates
  }

  // Calculate total estimates
  const calculateTotals = (estimates: MaterialEstimate[]) => {
    let originalCost = 0
    let adjustedCost = 0
    let items = 0
    let weight = 0

    estimates.forEach((estimate) => {
      if (estimate.selected) {
        const bestPrice = Math.min(...estimate.prices.map((p) => p.price))
        items += 1

        // Use adjusted quantity if available, otherwise use original quantity
        const quantity = estimate.adjustedQuantity !== undefined ? estimate.adjustedQuantity : estimate.quantity

        originalCost += bestPrice * estimate.quantity
        adjustedCost += bestPrice * quantity

        // Simulate weight calculation
        const estimatedWeight = estimate.unit === "lb" ? quantity : quantity * (Math.random() * 5 + 1)
        weight += estimatedWeight
      }
    })

    setTotalEstimate({
      originalCost,
      adjustedCost,
      savings: originalCost - adjustedCost,
      items,
      weight: Number.parseFloat(weight.toFixed(2)),
    })
  }

  // Toggle selection of a material
  const toggleMaterialSelection = (id: string) => {
    const updatedEstimates = materialEstimates.map((est) => (est.id === id ? { ...est, selected: !est.selected } : est))
    setMaterialEstimates(updatedEstimates)
    calculateTotals(updatedEstimates)
  }

  // Adjust quantity of a material
  const adjustMaterialQuantity = (id: string, quantity: number) => {
    const updatedEstimates = materialEstimates.map((est) =>
      est.id === id ? { ...est, adjustedQuantity: quantity } : est,
    )
    setMaterialEstimates(updatedEstimates)
    calculateTotals(updatedEstimates)
  }

  // Filter materials based on category and search query
  const getFilteredMaterials = () => {
    return materialEstimates.filter((material) => {
      const matchesCategory = materialFilter === "all" || material.category === materialFilter
      const matchesSearch =
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSelected = !showOnlySelected || material.selected

      return matchesCategory && matchesSearch && matchesSelected
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setMaterialFilter("all")
    setSearchQuery("")
    setShowOnlySelected(false)
  }

  // Reset adjusted quantities
  const resetAdjustments = () => {
    const updatedEstimates = materialEstimates.map((est) => ({ ...est, adjustedQuantity: undefined }))
    setMaterialEstimates(updatedEstimates)
    calculateTotals(updatedEstimates)

    toast({
      title: "Adjustments Reset",
      description: "All quantity adjustments have been reset to original values.",
    })
  }

  // Export to CSV
  const exportToCSV = () => {
    toast({
      title: "Export Complete",
      description: "Material estimates have been exported to CSV.",
    })
  }

  // Save estimate
  const saveEstimate = () => {
    toast({
      title: "Estimate Saved",
      description: "Material estimates have been saved to your account.",
    })
  }

  // Share estimate
  const shareEstimate = () => {
    toast({
      title: "Sharing Options",
      description: "Share link has been copied to clipboard.",
    })
  }

  // Create purchase order
  const createPurchaseOrder = () => {
    toast({
      title: "Purchase Order Created",
      description: "A new purchase order has been created from this estimate.",
    })
  }

  // Add this useEffect to handle automatic project selection from URL parameters
  useEffect(() => {
    if (projectIdFromUrl && projectNameFromUrl) {
      // Find the project or create a temporary one based on URL parameters
      const projectFromUrl = projects.find((p) => p.id === projectIdFromUrl) || {
        id: projectIdFromUrl,
        name: decodeURIComponent(projectNameFromUrl),
        type: "Opportunity",
        status: "seeking bids",
        client: "Homeowner",
        source: (projectTypeFromUrl as ProjectSource) || "opportunities",
      }

      setSelectedProject(projectFromUrl)

      // Automatically generate estimate if coming from opportunities page
      if (projectTypeFromUrl === "opportunities") {
        setTimeout(() => {
          generateMaterialEstimates()
        }, 500)
      }
    }
  }, [projectIdFromUrl, projectNameFromUrl, projectTypeFromUrl])

  // Effect to update calculations when material estimates change
  useEffect(() => {
    if (materialEstimates.length > 0) {
      calculateTotals(materialEstimates)
    }
  }, [materialEstimates])

  // Filtered materials based on current filters
  const filteredMaterials = getFilteredMaterials()

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Material Estimator</h1>
          <p className="text-muted-foreground">AI-powered material estimation and pricing for your projects</p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={saveEstimate}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Estimate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={exportToCSV}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export as CSV</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={shareEstimate}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share Estimate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="default" onClick={createPurchaseOrder} disabled={!analysisComplete}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Create Purchase Order
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Selection</CardTitle>
          <CardDescription>Select a project to generate AI-powered material estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Select Project</label>
              <Select
                value={selectedProject?.id || ""}
                onValueChange={(value) => {
                  const project = projects.find((p) => p.id === value)
                  setSelectedProject(project || null)
                  // Reset material estimates when project changes
                  setMaterialEstimates([])
                  setAnalysisComplete(false)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Select a project</SelectItem>
                  <SelectItem value="header-1" disabled className="font-semibold">
                    Active Projects
                  </SelectItem>
                  {projects
                    .filter((project) => project.source === "active")
                    .map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  <SelectItem value="header-2" disabled className="font-semibold">
                    Bid Projects
                  </SelectItem>
                  {projects
                    .filter((project) => project.source === "bids")
                    .map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  <SelectItem value="header-3" disabled className="font-semibold">
                    Opportunities
                  </SelectItem>
                  {projects
                    .filter((project) => project.source === "opportunities")
                    .map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProject && (
              <Button className="shrink-0" onClick={generateMaterialEstimates} disabled={isGenerating}>
                {isGenerating ? (
                  <div className="flex items-center">
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Brain className="mr-2 h-4 w-4" />
                    Generate AI Estimate
                  </div>
                )}
              </Button>
            )}
          </div>

          {selectedProject && selectedProject.plans && selectedProject.plans.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Available Plans</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.plans.map((plan) => (
                  <Badge key={plan.id} variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {plan.name}
                    <span className="text-xs text-muted-foreground ml-1">({plan.type})</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing project plans...</span>
                <span>{Math.round(generatingProgress)}%</span>
              </div>
              <Progress value={generatingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Our AI is analyzing the project plans to generate accurate material estimates.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisComplete && (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="estimate">Material Estimate</TabsTrigger>
            <TabsTrigger value="pricing">Price Comparison</TabsTrigger>
            <TabsTrigger value="dashboard">Cost Dashboard</TabsTrigger>
            <TabsTrigger value="suppliers">Supplier Info</TabsTrigger>
          </TabsList>

          <TabsContent value="estimate" className="mt-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="flex-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Material Estimates</CardTitle>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={resetAdjustments} disabled={!isAdjusting}>
                              <Undo2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reset Adjustments</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Button variant="outline" size="sm" onClick={() => setIsAdjusting(!isAdjusting)}>
                        {isAdjusting ? "Done" : "Adjust Quantities"}
                      </Button>
                    </div>
                  </div>
                  <CardDescription>AI-generated material estimates based on project plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 mb-4 md:flex-row">
                    <div className="flex-1 flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Select
                        value={materialFilter}
                        onValueChange={(value) => setMaterialFilter(value as MaterialCategory | "all")}
                      >
                        <SelectTrigger className="min-w-[160px]">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="lumber">Lumber</SelectItem>
                          <SelectItem value="finishing">Finishing</SelectItem>
                          <SelectItem value="concrete">Concrete</SelectItem>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="hvac">HVAC</SelectItem>
                          <SelectItem value="roofing">Roofing</SelectItem>
                          <SelectItem value="insulation">Insulation</SelectItem>
                          <SelectItem value="paint">Paint</SelectItem>
                          <SelectItem value="fixtures">Fixtures</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center gap-2">
                        <label className="text-sm" htmlFor="show-selected">
                          Selected only
                        </label>
                        <Checkbox
                          id="show-selected"
                          checked={showOnlySelected}
                          onCheckedChange={(checked) => setShowOnlySelected(checked === true)}
                        />
                      </div>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={resetFilters}>
                              <RefreshCcw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reset Filters</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30px]"></TableHead>
                          <TableHead>Material</TableHead>
                          <TableHead className="hidden md:table-cell">Category</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit</TableHead>
                          <TableHead className="text-right">Est. Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMaterials.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                              No materials match your filter criteria
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMaterials.map((material) => {
                            // Find best price
                            const bestPrice = Math.min(...material.prices.map((p) => p.price))
                            const bestPriceSource = material.prices.find((p) => p.price === bestPrice)
                            const quantity =
                              material.adjustedQuantity !== undefined ? material.adjustedQuantity : material.quantity

                            return (
                              <TableRow key={material.id} className={!material.selected ? "opacity-60" : ""}>
                                <TableCell>
                                  <Checkbox
                                    checked={material.selected}
                                    onCheckedChange={() => toggleMaterialSelection(material.id)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{material.name}</div>
                                  <div className="text-xs text-muted-foreground">{material.description}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <Badge variant="secondary">{material.category}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  {isAdjusting ? (
                                    <Input
                                      type="number"
                                      min="0"
                                      className="w-16 text-right"
                                      value={quantity}
                                      onChange={(e) => {
                                        adjustMaterialQuantity(material.id, Number.parseInt(e.target.value || "0"))
                                      }}
                                    />
                                  ) : (
                                    <div className="flex items-center justify-end gap-1">
                                      {quantity}
                                      {material.adjustedQuantity !== undefined && (
                                        <Badge variant="outline" className="text-xs">
                                          {material.adjustedQuantity > material.quantity ? "+" : ""}
                                          {(
                                            ((material.adjustedQuantity - material.quantity) / material.quantity) *
                                            100
                                          ).toFixed(0)}
                                          %
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">{material.unit}</TableCell>
                                <TableCell className="text-right">
                                  <div className="font-medium">${bestPrice.toFixed(2)}</div>
                                  <div className="text-xs text-muted-foreground">{bestPriceSource?.source}</div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  ${(bestPrice * quantity).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="md:w-[350px] space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estimate Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Materials</span>
                          <span>{totalEstimate.items} items</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Weight</span>
                          <span>{totalEstimate.weight} lbs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Cost</span>
                          <span>${totalEstimate.originalCost.toFixed(2)}</span>
                        </div>
                        {totalEstimate.originalCost !== totalEstimate.adjustedCost && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Adjusted Cost</span>
                            <span>${totalEstimate.adjustedCost.toFixed(2)}</span>
                          </div>
                        )}
                        {totalEstimate.savings > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Savings</span>
                            <span>${totalEstimate.savings.toFixed(2)}</span>
                          </div>
                        )}
                        {totalEstimate.savings < 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Additional</span>
                            <span>${Math.abs(totalEstimate.savings).toFixed(2)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total Estimate</span>
                          <span>${totalEstimate.adjustedCost.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button className="w-full">
                          <Truck className="mr-2 h-4 w-4" /> Request Delivery Quote
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Optimization Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-blue-500 mt-1 shrink-0" />
                        <p>Ordering standard lumber lengths can reduce waste and lower costs by up to 15%.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <p>Bulk purchasing from preferred suppliers can qualify for additional 5-10% discount.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ShoppingBag className="h-4 w-4 text-amber-500 mt-1 shrink-0" />
                        <p>Alternate suppliers may offer better lead times on certain materials.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calculator className="h-4 w-4 text-purple-500 mt-1 shrink-0" />
                        <p>Adding a 10% contingency buffer is recommended for kitchen renovations.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Price Comparison</CardTitle>
                  <Select value={priceSource} onValueChange={(value) => setPriceSource(value as MaterialPriceSource)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select price source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Suppliers</SelectItem>
                      <SelectItem value="national">National Retailers</SelectItem>
                      <SelectItem value="online">Online Marketplaces</SelectItem>
                      <SelectItem value="preferred">Preferred Vendors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>Compare prices across different suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead className="hidden lg:table-cell">Category</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="hidden md:table-cell">Supplier</TableHead>
                        <TableHead className="hidden md:table-cell">Availability</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaterials
                        .filter((material) => material.selected)
                        .map((material) => {
                          const priceInfo = material.prices.find((p) => p.source === priceSource) || material.prices[0]
                          const quantity =
                            material.adjustedQuantity !== undefined ? material.adjustedQuantity : material.quantity

                          return (
                            <TableRow key={`${material.id}-${priceSource}`}>
                              <TableCell>
                                <div className="font-medium">{material.name}</div>
                                <div className="text-xs text-muted-foreground md:hidden">{material.category}</div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <Badge variant="secondary">{material.category}</Badge>
                              </TableCell>
                              <TableCell className="text-right">{quantity}</TableCell>
                              <TableCell className="text-right">{material.unit}</TableCell>
                              <TableCell className="text-right">${priceInfo.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right font-medium">
                                ${(priceInfo.price * quantity).toFixed(2)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{priceInfo.supplier || "Unknown"}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {priceInfo.availability && (
                                  <Badge
                                    variant="outline"
                                    className={
                                      priceInfo.availability === "in-stock"
                                        ? "text-green-500 border-green-200"
                                        : priceInfo.availability === "low-stock"
                                          ? "text-amber-500 border-amber-200"
                                          : priceInfo.availability === "out-of-stock"
                                            ? "text-red-500 border-red-200"
                                            : "text-blue-500 border-blue-200"
                                    }
                                  >
                                    {priceInfo.availability
                                      .split("-")
                                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                      .join(" ")}
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      <TableRow>
                        <TableCell colSpan={5} className="text-right font-bold">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          $
                          {filteredMaterials
                            .filter((material) => material.selected)
                            .reduce((sum, material) => {
                              const priceInfo =
                                material.prices.find((p) => p.source === priceSource) || material.prices[0]
                              const quantity =
                                material.adjustedQuantity !== undefined ? material.adjustedQuantity : material.quantity
                              return sum + priceInfo.price * quantity
                            }, 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell colSpan={2}></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alternative Material Options</CardTitle>
                <CardDescription>Explore alternative materials that may save costs or improve quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materialEstimates
                    .filter((material) => material.selected && material.alternativeOptions)
                    .map((material) => (
                      <Card key={`alt-${material.id}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{material.name}</CardTitle>
                          <CardDescription>
                            Original price: ${Math.min(...material.prices.map((p) => p.price)).toFixed(2)} per{" "}
                            {material.unit}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {material.alternativeOptions?.map((alt) => (
                              <div
                                key={alt.id}
                                className="border rounded-md p-3 flex flex-col lg:flex-row gap-3 lg:items-center"
                              >
                                <div className="lg:flex-1">
                                  <div className="font-medium">{alt.name}</div>
                                  <div className="text-sm text-muted-foreground">{alt.notes}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      alt.qualityDiff === "higher"
                                        ? "text-blue-500 border-blue-200"
                                        : alt.qualityDiff === "similar"
                                          ? "text-green-500 border-green-200"
                                          : "text-amber-500 border-amber-200"
                                    }
                                  >
                                    {alt.qualityDiff.charAt(0).toUpperCase() + alt.qualityDiff.slice(1)} Quality
                                  </Badge>
                                  <div className="font-medium whitespace-nowrap">
                                    ${alt.price.toFixed(2)} / {material.unit}
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Switch to this option <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEstimate.items}</div>
                  <p className="text-xs text-muted-foreground">
                    Across{" "}
                    {
                      Object.keys(
                        filteredMaterials.reduce(
                          (acc, material) => {
                            if (material.selected) acc[material.category] = true
                            return acc
                          },
                          {} as Record<string, boolean>,
                        ),
                      ).length
                    }{" "}
                    categories
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalEstimate.adjustedCost.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Best prices across all suppliers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Materials Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEstimate.weight} lbs</div>
                  <p className="text-xs text-muted-foreground">Estimated total weight</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Savings Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    $
                    {
                      // Calculate savings compared to highest prices
                      filteredMaterials
                        .filter((material) => material.selected)
                        .reduce((sum, material) => {
                          const highestPrice = Math.max(...material.prices.map((p) => p.price))
                          const lowestPrice = Math.min(...material.prices.map((p) => p.price))
                          const quantity =
                            material.adjustedQuantity !== undefined ? material.adjustedQuantity : material.quantity
                          return sum + (highestPrice - lowestPrice) * quantity
                        }, 0)
                        .toFixed(2)
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">Compared to highest market prices</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart4 className="h-16 w-16 mx-auto mb-2 text-muted-foreground/50" />
                      <p>Chart visualization would appear here</p>
                      <p className="text-sm">Showing relative costs across material categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Comparison by Supplier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500">L</Badge>
                          <span>Local Suppliers</span>
                        </div>
                        <span>
                          $
                          {filteredMaterials
                            .filter((material) => material.selected)
                            .reduce((sum, material) => {
                              const priceInfo = material.prices.find((p) => p.source === "local")
                              if (!priceInfo) return sum
                              const quantity =
                                material.adjustedQuantity !== undefined ? material.adjustedQuantity : material.quantity
                              return sum + priceInfo.price * quantity
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <Progress value={92} className="h-2 bg-blue-100" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500">N</Badge>
                          <span>National Retailers</span>
                        </div>
                        <span>
                          $
                          {filteredMaterials
                            .filter((material) => material.selected)
                            .reduce((sum, material) => {
                              const priceInfo = material.prices.find((p) => p.source === "national")
                              if (!priceInfo) return sum
                              const quantity =
                                material.adjustedQuantity !== undefined ? material.adjustedQuantity : material.quantity
                              return sum + priceInfo.price * quantity
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <Progress value={85} className="h-2 bg-green-100" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-500">O</Badge>
                          <span>Online Marketplaces</span>
                        </div>
                        <span>
                          $
                          {filteredMaterials
                            .filter((material) => material.selected)
                            .reduce((sum, material) => {
                              const priceInfo = material.prices.find((p) => p.source === "online")
                              if (!priceInfo) return sum
                              const quantity =
                                material.adjustedQuantity !== undefined ? material.adjustedQuantity : material.quantity
                              return sum + priceInfo.price * quantity
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <Progress value={78} className="h-2 bg-yellow-100" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500">P</Badge>
                          <span>Preferred Vendors</span>
                        </div>
                        <span>
                          $
                          {filteredMaterials
                            .filter((material) => material.selected)
                            .reduce((sum, material) => {
                              const priceInfo = material.prices.find((p) => p.source === "preferred")
                              if (!priceInfo) return sum
                              const quantity =
                                material.adjustedQuantity !== undefined ? material.adjustedQuantity : material.quantity
                              return sum + priceInfo.price * quantity
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <Progress value={80} className="h-2 bg-purple-100" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">B</Badge>
                          <span>Best Prices (Mixed)</span>
                        </div>
                        <span>${totalEstimate.adjustedCost.toFixed(2)}</span>
                      </div>
                      <Progress value={100} className="h-2 bg-green-100" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Suppliers</CardTitle>
                <CardDescription>Based on your material list and project location</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="local">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-blue-500">L</Badge>
                        Local Suppliers
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="border rounded-md p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Home Supply Co.</h3>
                              <p className="text-sm text-muted-foreground">123 Builder Ave, Seattle, WA</p>
                            </div>
                            <Badge variant="outline">3.2 miles away</Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Badge variant="secondary">Lumber</Badge>
                            <Badge variant="secondary">Drywall</Badge>
                            <Badge variant="secondary">Hardware</Badge>
                            <Badge variant="secondary">Paint</Badge>
                          </div>
                          <div className="text-sm pt-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Delivery time:</span>
                              <span>Same day / next day</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Pro discount:</span>
                              <span>Yes (10-15%)</span>
                            </div>
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button variant="outline" size="sm">
                              View Full Inventory
                            </Button>
                          </div>
                        </div>

                        <div className="border rounded-md p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Lumber Yard</h3>
                              <p className="text-sm text-muted-foreground">456 Industrial Way, Seattle, WA</p>
                            </div>
                            <Badge variant="outline">5.7 miles away</Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Badge variant="secondary">Lumber</Badge>
                            <Badge variant="secondary">Plywood</Badge>
                            <Badge variant="secondary">Trim</Badge>
                          </div>
                          <div className="text-sm pt-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Delivery time:</span>
                              <span>1-2 business days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Pro discount:</span>
                              <span>Yes (bulk orders)</span>
                            </div>
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button variant="outline" size="sm">
                              View Full Inventory
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="national">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-green-500">N</Badge>
                        National Retailers
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="border rounded-md p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">BuildersMax</h3>
                              <p className="text-sm text-muted-foreground">789 Retail Drive, Seattle, WA</p>
                            </div>
                            <Badge variant="outline">7.3 miles away</Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Badge variant="secondary">Full Selection</Badge>
                          </div>
                          <div className="text-sm pt-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Delivery time:</span>
                              <span>1-3 business days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Pro discount:</span>
                              <span>Yes (with account)</span>
                            </div>
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button variant="outline" size="sm">
                              View Full Inventory
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="online">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-yellow-500">O</Badge>
                        Online Marketplaces
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="border rounded-md p-4 space-y-2">
                          <div>
                            <h3 className="font-medium">ConstructDirect</h3>
                            <p className="text-sm text-muted-foreground">Online marketplace with nationwide shipping</p>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Badge variant="secondary">Full Selection</Badge>
                          </div>
                          <div className="text-sm pt-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Delivery time:</span>
                              <span>3-7 business days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Pro discount:</span>
                              <span>Yes (with business account)</span>
                            </div>
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button variant="outline" size="sm">
                              Visit Website
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="preferred">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-purple-500">P</Badge>
                        Preferred Vendors
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="border rounded-md p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Contractor Supply Inc.</h3>
                              <p className="text-sm text-muted-foreground">321 Wholesale Blvd, Seattle, WA</p>
                            </div>
                            <Badge variant="outline" className="bg-purple-100">
                              Preferred Partner
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Badge variant="secondary">Full Selection</Badge>
                          </div>
                          <div className="text-sm pt-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Delivery time:</span>
                              <span>1-2 business days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Pro discount:</span>
                              <span>Yes (15-20%)</span>
                            </div>
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button variant="outline" size="sm">
                              Place Order
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
                <CardDescription>Estimated shipping and delivery costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Standard Delivery</h3>
                        <p className="text-sm text-muted-foreground">3-5 business days</p>
                      </div>
                      <div className="text-xl font-bold">$150.00</div>
                    </div>
                    <div className="text-sm pt-1">
                      <p className="text-muted-foreground">Includes curbside drop-off of all materials.</p>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Express Delivery</h3>
                        <p className="text-sm text-muted-foreground">1-2 business days</p>
                      </div>
                      <div className="text-xl font-bold">$225.00</div>
                    </div>
                    <div className="text-sm pt-1">
                      <p className="text-muted-foreground">Includes curbside drop-off of all materials.</p>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Premium Delivery</h3>
                        <p className="text-sm text-muted-foreground">Scheduled date & time</p>
                      </div>
                      <div className="text-xl font-bold">$275.00</div>
                    </div>
                    <div className="text-sm pt-1">
                      <p className="text-muted-foreground">
                        Includes placement of materials in your desired location on the property.
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Self Pickup</h3>
                        <p className="text-sm text-muted-foreground">At your convenience</p>
                      </div>
                      <div className="text-xl font-bold">$0.00</div>
                    </div>
                    <div className="text-sm pt-1">
                      <p className="text-muted-foreground">
                        Pick up materials from suppliers yourself. Requires arranging multiple pickups.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Calculate Best Delivery Option</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

