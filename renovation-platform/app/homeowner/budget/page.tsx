"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Plus,
  Download,
  Trash2,
  Edit,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Percent,
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

// Define types
type BudgetItem = {
  id: string
  name: string
  category: string
  estimatedCost: number
  actualCost: number | null
  quantity: number
  unit: string
  notes: string
  status: "planned" | "purchased" | "installed" | "cancelled"
  projectId: number
  projectName: string
  alternatives?: Alternative[]
}

type Alternative = {
  id: string
  name: string
  savingsAmount: number
  savingsPercentage: number
  description: string
  pros: string[]
  cons: string[]
}

type BudgetCategory = {
  name: string
  estimatedCost: number
  actualCost: number
  items: number
}

type Project = {
  id: number
  name: string
  totalBudget: number
}

export default function BudgetTrackerPage() {
  // State for budget items
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: "item-1",
      name: "Quartz Countertop",
      category: "Countertops",
      estimatedCost: 75.99,
      actualCost: 75.99,
      quantity: 30,
      unit: "sq ft",
      notes: "Calacatta Gold quartz from Stone Supply Co.",
      status: "purchased",
      projectId: 1,
      projectName: "Kitchen Renovation",
      alternatives: [
        {
          id: "alt-1-1",
          name: "Granite Countertop",
          savingsAmount: 300,
          savingsPercentage: 13,
          description: "Natural granite countertop in similar color pattern",
          pros: ["Natural stone", "Unique patterns", "Heat resistant"],
          cons: ["Requires sealing", "Can chip or crack", "Limited color options"],
        },
        {
          id: "alt-1-2",
          name: "Laminate Countertop",
          savingsAmount: 1500,
          savingsPercentage: 65,
          description: "High-quality laminate with quartz appearance",
          pros: ["Much more affordable", "Many design options", "Easy to install"],
          cons: ["Less durable", "Can be damaged by heat", "Lower resale value"],
        },
      ],
    },
    {
      id: "item-2",
      name: "Subway Tile",
      category: "Tile",
      estimatedCost: 5.99,
      actualCost: 6.5,
      quantity: 200,
      unit: "sq ft",
      notes: "White ceramic subway tile for backsplash",
      status: "installed",
      projectId: 1,
      projectName: "Kitchen Renovation",
      alternatives: [
        {
          id: "alt-2-1",
          name: "Ceramic Tile (Different Pattern)",
          savingsAmount: 100,
          savingsPercentage: 8,
          description: "Standard ceramic tile in different pattern",
          pros: ["Similar quality", "Different aesthetic", "Same durability"],
          cons: ["Still requires professional installation", "Limited color options"],
        },
      ],
    },
    {
      id: "item-3",
      name: "Shaker Cabinet Doors",
      category: "Cabinetry",
      estimatedCost: 89.99,
      actualCost: 89.99,
      quantity: 12,
      unit: "each",
      notes: "White shaker cabinet doors",
      status: "purchased",
      projectId: 1,
      projectName: "Kitchen Renovation",
      alternatives: [
        {
          id: "alt-3-1",
          name: "Flat Panel Cabinet Doors",
          savingsAmount: 240,
          savingsPercentage: 22,
          description: "Simple flat panel cabinet doors",
          pros: ["More affordable", "Modern look", "Easy to clean"],
          cons: ["Less detailed design", "May look too plain"],
        },
        {
          id: "alt-3-2",
          name: "Cabinet Refinishing",
          savingsAmount: 700,
          savingsPercentage: 65,
          description: "Refinish existing cabinets instead of replacing doors",
          pros: ["Significant cost savings", "Environmentally friendly", "Faster completion"],
          cons: ["Limited to current cabinet layout", "May not last as long as new cabinets"],
        },
      ],
    },
    {
      id: "item-4",
      name: "Hardwood Flooring",
      category: "Flooring",
      estimatedCost: 6.99,
      actualCost: null,
      quantity: 350,
      unit: "sq ft",
      notes: "Oak hardwood flooring",
      status: "planned",
      projectId: 3,
      projectName: "Living Room Renovation",
      alternatives: [
        {
          id: "alt-4-1",
          name: "Engineered Hardwood",
          savingsAmount: 700,
          savingsPercentage: 29,
          description: "Engineered hardwood with real wood veneer",
          pros: ["More stable than solid hardwood", "Less expensive", "Similar appearance"],
          cons: ["Cannot be refinished as many times", "May have shorter lifespan"],
        },
        {
          id: "alt-4-2",
          name: "Luxury Vinyl Plank",
          savingsAmount: 1400,
          savingsPercentage: 57,
          description: "High-quality vinyl plank with wood appearance",
          pros: ["Waterproof", "Very durable", "Easy installation", "Much more affordable"],
          cons: ["Not real wood", "May affect resale value", "Cannot be refinished"],
        },
      ],
    },
    {
      id: "item-5",
      name: "Bathroom Vanity",
      category: "Fixtures",
      estimatedCost: 499.99,
      actualCost: 549.99,
      quantity: 1,
      unit: "each",
      notes: "48-inch double sink vanity with marble top",
      status: "installed",
      projectId: 2,
      projectName: "Bathroom Remodel",
      alternatives: [
        {
          id: "alt-5-1",
          name: "Single Sink Vanity",
          savingsAmount: 150,
          savingsPercentage: 30,
          description: "36-inch single sink vanity with similar style",
          pros: ["More affordable", "Takes up less space", "Still provides storage"],
          cons: ["Only one sink", "Less counter space", "May be less convenient for shared bathroom"],
        },
      ],
    },
    {
      id: "item-6",
      name: "Kitchen Sink",
      category: "Fixtures",
      estimatedCost: 299.99,
      actualCost: 299.99,
      quantity: 1,
      unit: "each",
      notes: "Stainless steel undermount sink",
      status: "installed",
      projectId: 1,
      projectName: "Kitchen Renovation",
    },
    {
      id: "item-7",
      name: "Kitchen Faucet",
      category: "Fixtures",
      estimatedCost: 199.99,
      actualCost: 249.99,
      quantity: 1,
      unit: "each",
      notes: "Pull-down kitchen faucet in brushed nickel",
      status: "installed",
      projectId: 1,
      projectName: "Kitchen Renovation",
      alternatives: [
        {
          id: "alt-7-1",
          name: "Standard Kitchen Faucet",
          savingsAmount: 100,
          savingsPercentage: 50,
          description: "Standard kitchen faucet without pull-down feature",
          pros: ["More affordable", "Still functional", "Same finish options"],
          cons: ["Less convenient", "Fewer features", "May be less stylish"],
        },
      ],
    },
    {
      id: "item-8",
      name: "Shower System",
      category: "Fixtures",
      estimatedCost: 399.99,
      actualCost: null,
      quantity: 1,
      unit: "each",
      notes: "Rain shower head with handheld sprayer",
      status: "planned",
      projectId: 2,
      projectName: "Bathroom Remodel",
      alternatives: [
        {
          id: "alt-8-1",
          name: "Standard Shower Head",
          savingsAmount: 250,
          savingsPercentage: 63,
          description: "Standard shower head with adjustable spray patterns",
          pros: ["Much more affordable", "Easy installation", "Still functional"],
          cons: ["Less luxurious", "Fewer features", "Less modern appearance"],
        },
      ],
    },
  ])

  // State for projects
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Kitchen Renovation",
      totalBudget: 25000,
    },
    {
      id: 2,
      name: "Bathroom Remodel",
      totalBudget: 12000,
    },
    {
      id: 3,
      name: "Living Room Renovation",
      totalBudget: 8500,
    },
  ])

  // State for new budget item form
  const [newItem, setNewItem] = useState<Omit<BudgetItem, "id" | "alternatives">>({
    name: "",
    category: "",
    estimatedCost: 0,
    actualCost: null,
    quantity: 1,
    unit: "each",
    notes: "",
    status: "planned",
    projectId: 1,
    projectName: "Kitchen Renovation",
  })

  // State for editing an item
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // State for filters
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // State for budget optimization
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [selectedAlternatives, setSelectedAlternatives] = useState<Record<string, string>>({})
  const [potentialSavings, setPotentialSavings] = useState(0)

  // Calculate budget totals
  const calculateTotals = () => {
    const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost * item.quantity, 0)
    const totalActual = budgetItems.reduce((sum, item) => sum + (item.actualCost || 0) * item.quantity, 0)
    const totalRemaining = projects.reduce((sum, project) => sum + project.totalBudget, 0) - totalActual

    return { totalEstimated, totalActual, totalRemaining }
  }

  const { totalEstimated, totalActual, totalRemaining } = calculateTotals()

  // Calculate budget by category
  const calculateCategorySummary = () => {
    const categories: Record<string, BudgetCategory> = {}

    budgetItems.forEach((item) => {
      if (!categories[item.category]) {
        categories[item.category] = {
          name: item.category,
          estimatedCost: 0,
          actualCost: 0,
          items: 0,
        }
      }

      categories[item.category].estimatedCost += item.estimatedCost * item.quantity
      categories[item.category].actualCost += (item.actualCost || 0) * item.quantity
      categories[item.category].items += 1
    })

    return Object.values(categories).sort((a, b) => b.estimatedCost - a.estimatedCost)
  }

  const categorySummary = calculateCategorySummary()

  // Calculate budget by project
  const calculateProjectSummary = () => {
    const projectSummary: Record<
      number,
      {
        id: number
        name: string
        budget: number
        estimatedCost: number
        actualCost: number
        remaining: number
        percentUsed: number
      }
    > = {}

    projects.forEach((project) => {
      projectSummary[project.id] = {
        id: project.id,
        name: project.name,
        budget: project.totalBudget,
        estimatedCost: 0,
        actualCost: 0,
        remaining: project.totalBudget,
        percentUsed: 0,
      }
    })

    budgetItems.forEach((item) => {
      if (projectSummary[item.projectId]) {
        projectSummary[item.projectId].estimatedCost += item.estimatedCost * item.quantity
        projectSummary[item.projectId].actualCost += (item.actualCost || 0) * item.quantity
      }
    })

    // Calculate remaining and percent used
    Object.values(projectSummary).forEach((project) => {
      project.remaining = project.budget - project.actualCost
      project.percentUsed = (project.actualCost / project.budget) * 100
    })

    return Object.values(projectSummary)
  }

  const projectSummary = calculateProjectSummary()

  // Filter budget items
  const filteredItems = budgetItems
    .filter((item) => {
      // Filter by search term
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by category
      const matchesCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase()

      // Filter by project
      const matchesProject = projectFilter === "all" || item.projectId.toString() === projectFilter

      // Filter by status
      const matchesStatus = statusFilter === "all" || item.status === statusFilter

      return matchesSearch && matchesCategory && matchesProject && matchesStatus
    })
    .sort((a, b) => {
      // Sort items
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "category":
          return a.category.localeCompare(b.category)
        case "cost-high":
          return b.estimatedCost * b.quantity - a.estimatedCost * a.quantity
        case "cost-low":
          return a.estimatedCost * a.quantity - b.estimatedCost * a.quantity
        default:
          return 0
      }
    })

  // Get unique categories for filter
  const categories = Array.from(new Set(budgetItems.map((item) => item.category))).sort()

  // Handle adding a new budget item
  const handleAddItem = () => {
    // Find the project name
    const project = projects.find((p) => p.id === newItem.projectId)
    const projectName = project ? project.name : ""

    const newBudgetItem: BudgetItem = {
      id: `item-${Date.now()}`,
      ...newItem,
      projectName,
      alternatives: [],
    }

    setBudgetItems([...budgetItems, newBudgetItem])

    // Reset form
    setNewItem({
      name: "",
      category: "",
      estimatedCost: 0,
      actualCost: null,
      quantity: 1,
      unit: "each",
      notes: "",
      status: "planned",
      projectId: 1,
      projectName: "Kitchen Renovation",
    })

    toast({
      title: "Item added",
      description: `${newBudgetItem.name} has been added to your budget.`,
    })
  }

  // Handle updating a budget item
  const handleUpdateItem = () => {
    if (!editingItem) return

    const updatedItems = budgetItems.map((item) => (item.id === editingItem.id ? editingItem : item))

    setBudgetItems(updatedItems)
    setIsEditDialogOpen(false)
    setEditingItem(null)

    toast({
      title: "Item updated",
      description: `${editingItem.name} has been updated.`,
    })
  }

  // Handle deleting a budget item
  const handleDeleteItem = (id: string) => {
    const updatedItems = budgetItems.filter((item) => item.id !== id)
    setBudgetItems(updatedItems)

    toast({
      title: "Item deleted",
      description: "The budget item has been deleted.",
    })
  }

  // Calculate potential savings from alternatives
  useEffect(() => {
    let savings = 0

    Object.entries(selectedAlternatives).forEach(([itemId, alternativeId]) => {
      const item = budgetItems.find((i) => i.id === itemId)
      if (item && item.alternatives) {
        const alternative = item.alternatives.find((a) => a.id === alternativeId)
        if (alternative) {
          savings += alternative.savingsAmount
        }
      }
    })

    setPotentialSavings(savings)
  }, [selectedAlternatives, budgetItems])

  // Apply selected alternatives
  const applyAlternatives = () => {
    if (Object.keys(selectedAlternatives).length === 0) return

    const updatedItems = budgetItems.map((item) => {
      if (selectedAlternatives[item.id]) {
        const alternativeId = selectedAlternatives[item.id]
        const alternative = item.alternatives?.find((a) => a.id === alternativeId)

        if (alternative) {
          // Calculate new cost based on savings percentage
          const newCost = item.estimatedCost * (1 - alternative.savingsPercentage / 100)

          return {
            ...item,
            name: alternative.name,
            estimatedCost: Number.parseFloat(newCost.toFixed(2)),
            notes: `${item.notes} (Changed from ${item.name} to save costs)`,
            alternatives: [], // Remove alternatives once applied
          }
        }
      }

      return item
    })

    setBudgetItems(updatedItems)
    setSelectedAlternatives({})
    setShowAlternatives(false)

    toast({
      title: "Alternatives applied",
      description: `You've saved $${potentialSavings.toLocaleString()} by choosing alternative materials.`,
    })
  }

  // Get status badge
  const getStatusBadge = (status: BudgetItem["status"]) => {
    switch (status) {
      case "planned":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Planned</Badge>
      case "purchased":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Purchased</Badge>
        )
      case "installed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Installed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Tracker</h1>
          <p className="text-muted-foreground">Track and manage your renovation budget.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Budget Item</DialogTitle>
                <DialogDescription>Add a new item to your renovation budget.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g. Quartz Countertop"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value: string) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="Countertops">Countertops</SelectItem>
                        <SelectItem value="Cabinetry">Cabinetry</SelectItem>
                        <SelectItem value="Flooring">Flooring</SelectItem>
                        <SelectItem value="Tile">Tile</SelectItem>
                        <SelectItem value="Fixtures">Fixtures</SelectItem>
                        <SelectItem value="Appliances">Appliances</SelectItem>
                        <SelectItem value="Paint">Paint</SelectItem>
                        <SelectItem value="Lighting">Lighting</SelectItem>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Cost per Unit ($)</Label>
                    <Input
                      id="estimatedCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.estimatedCost}
                      onChange={(e) =>
                        setNewItem({ ...newItem, estimatedCost: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newItem.unit}
                      onValueChange={(value: string) => setNewItem({ ...newItem, unit: value })}
                    >
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="each">Each</SelectItem>
                        <SelectItem value="sq ft">Square Feet</SelectItem>
                        <SelectItem value="linear ft">Linear Feet</SelectItem>
                        <SelectItem value="gallon">Gallon</SelectItem>
                        <SelectItem value="set">Set</SelectItem>
                        <SelectItem value="hour">Hour</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="total">Total Cost</Label>
                    <span className="text-lg font-bold">${(newItem.estimatedCost * newItem.quantity).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select
                    value={newItem.projectId.toString()}
                    onValueChange={(value: string) => setNewItem({ ...newItem, projectId: Number.parseInt(value) })}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newItem.status}
                    onValueChange={(value: string) => setNewItem({ ...newItem, status: value as BudgetItem["status"] })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="purchased">Purchased</SelectItem>
                      <SelectItem value="installed">Installed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    placeholder="Add any additional details"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddItem}>
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Budget</CardTitle>
            <CardDescription>Combined budget for all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  ${projects.reduce((sum, p) => sum + p.totalBudget, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Across {projects.length} projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Spent vs. Remaining</CardTitle>
            <CardDescription>Current budget status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">${totalActual.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">${totalRemaining.toLocaleString()}</span>
              </div>
              <Progress value={(totalActual / (totalActual + totalRemaining)) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{((totalActual / (totalActual + totalRemaining)) * 100).toFixed(1)}% Spent</span>
                <span>{((totalRemaining / (totalActual + totalRemaining)) * 100).toFixed(1)}% Remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget Health</CardTitle>
            <CardDescription>Estimated vs. Actual costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated</span>
                <span className="font-medium">${totalEstimated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actual</span>
                <span className="font-medium">${totalActual.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                {totalActual > totalEstimated ? (
                  <>
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-500">Over Budget</p>
                      <p className="text-xs text-muted-foreground">
                        ${(totalActual - totalEstimated).toLocaleString()} (
                        {(((totalActual - totalEstimated) / totalEstimated) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-green-500">Under Budget</p>
                      <p className="text-xs text-muted-foreground">
                        ${(totalEstimated - totalActual).toLocaleString()} (
                        {(((totalEstimated - totalActual) / totalEstimated) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Budget Items</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="optimize">Budget Optimizer</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Budget Items</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search items..."
                      className="w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select value={categoryFilter} onValueChange={(value: string) => setCategoryFilter(value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={projectFilter} onValueChange={(value: string) => setProjectFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="purchased">Purchased</SelectItem>
                      <SelectItem value="installed">Installed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value: string) => setSortBy(value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="cost-high">Cost: High to Low</SelectItem>
                      <SelectItem value="cost-low">Cost: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-right">Est. Cost</TableHead>
                      <TableHead className="text-right">Actual Cost</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          No budget items found. Try adjusting your filters or add a new item.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item) => {
                        const estimatedTotal = item.estimatedCost * item.quantity
                        const actualTotal = item.actualCost ? item.actualCost * item.quantity : null

                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="font-medium">{item.name}</div>
                              {item.notes && (
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.notes}</div>
                              )}
                            </TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>
                              <Link
                                href={`/homeowner/projects/${item.projectId}`}
                                className="text-primary hover:underline"
                              >
                                {item.projectName}
                              </Link>
                            </TableCell>
                            <TableCell className="text-right">${item.estimatedCost.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              {item.actualCost ? `$${item.actualCost.toFixed(2)}` : "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantity} {item.unit}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${estimatedTotal.toFixed(2)}
                              {actualTotal && actualTotal !== estimatedTotal && (
                                <div
                                  className={`text-xs ${actualTotal > estimatedTotal ? "text-red-500" : "text-green-500"}`}
                                >
                                  {actualTotal > estimatedTotal ? "+" : ""}${(actualTotal - estimatedTotal).toFixed(2)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingItem(item)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete {item.name} from your budget.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredItems.length} of {budgetItems.length} items
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  Total: $
                  {filteredItems
                    .reduce((sum, item) => {
                      const cost = item.actualCost || item.estimatedCost
                      return sum + cost * item.quantity
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Budgets</CardTitle>
              <CardDescription>Budget allocation and spending by project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectSummary.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="text-sm">
                        <span className="font-medium">${project.actualCost.toFixed(2)}</span>
                        <span className="text-muted-foreground"> / ${project.budget.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress value={project.percentUsed} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Spent</p>
                        <p className="font-medium">${project.actualCost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="font-medium">${project.remaining.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">% Used</p>
                        <p className="font-medium">{project.percentUsed.toFixed(1)}%</p>
                      </div>
                    </div>

                    {project.percentUsed > 90 && (
                      <div className="flex items-center gap-2 p-2 bg-red-50 text-red-800 rounded-md text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Budget nearly depleted! Consider reviewing expenses.</span>
                      </div>
                    )}

                    {project.percentUsed > 100 && (
                      <div className="flex items-center gap-2 p-2 bg-red-100 text-red-800 rounded-md text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Over budget by ${(project.actualCost - project.budget).toFixed(2)}!</span>
                      </div>
                    )}

                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Distribution</CardTitle>
              <CardDescription>Visual breakdown of your budget allocation</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="flex items-center h-8 w-full rounded-full overflow-hidden">
                  {projectSummary.map((project, index) => {
                    const percentage = (project.budget / projects.reduce((sum, p) => sum + p.totalBudget, 0)) * 100
                    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"]
                    return (
                      <div
                        key={project.id}
                        className={`${colors[index % colors.length]} h-full`}
                        style={{ width: `${percentage}%` }}
                        title={`${project.name}: $${project.budget.toLocaleString()} (${percentage.toFixed(1)}%)`}
                      />
                    )
                  })}
                </div>

                <div className="mt-4 space-y-2">
                  {projectSummary.map((project, index) => {
                    const percentage = (project.budget / projects.reduce((sum, p) => sum + p.totalBudget, 0)) * 100
                    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"]
                    return (
                      <div key={project.id} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                        <span className="text-sm">{project.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                          ${project.budget.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Budget allocation by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categorySummary.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{category.name}</h3>
                      <div className="text-sm">
                        <span className="font-medium">${category.actualCost.toFixed(2)}</span>
                        <span className="text-muted-foreground"> / ${category.estimatedCost.toFixed(2)}</span>
                      </div>
                    </div>
                    <Progress value={(category.actualCost / category.estimatedCost) * 100} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Estimated</p>
                        <p className="font-medium">${category.estimatedCost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Actual</p>
                        <p className="font-medium">${category.actualCost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Items</p>
                        <p className="font-medium">{category.items}</p>
                      </div>
                    </div>

                    {category.actualCost > category.estimatedCost && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Over budget by ${(category.actualCost - category.estimatedCost).toFixed(2)}</span>
                      </div>
                    )}

                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Visual breakdown of your spending by category</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="flex items-center h-8 w-full rounded-full overflow-hidden">
                  {categorySummary.map((category, index) => {
                    const percentage = (category.actualCost / totalActual) * 100
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-yellow-500",
                      "bg-purple-500",
                      "bg-pink-500",
                      "bg-red-500",
                      "bg-indigo-500",
                      "bg-orange-500",
                    ]
                    return (
                      <div
                        key={category.name}
                        className={`${colors[index % colors.length]} h-full`}
                        style={{ width: `${percentage}%` }}
                        title={`${category.name}: $${category.actualCost.toFixed(2)} (${percentage.toFixed(1)}%)`}
                      />
                    )
                  })}
                </div>

                <div className="mt-4 space-y-2">
                  {categorySummary.map((category, index) => {
                    const percentage = (category.actualCost / totalActual) * 100
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-yellow-500",
                      "bg-purple-500",
                      "bg-pink-500",
                      "bg-red-500",
                      "bg-indigo-500",
                      "bg-orange-500",
                    ]
                    return (
                      <div key={category.name} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                        <span className="text-sm">{category.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                          ${category.actualCost.toFixed(2)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimize" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Budget Optimizer</CardTitle>
                  <CardDescription>Find ways to save money on your renovation</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-alternatives" className="text-sm">
                    Show Alternatives
                  </Label>
                  <Switch id="show-alternatives" checked={showAlternatives} onCheckedChange={setShowAlternatives} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showAlternatives ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-800 rounded-md">
                    <Lightbulb className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">
                      Select alternative materials to reduce your budget. We've identified potential savings of up to
                      <span className="font-bold">
                        {" "}
                        $
                        {budgetItems
                          .reduce((sum, item) => {
                            if (item.alternatives && item.alternatives.length > 0) {
                              const maxSavings = Math.max(...item.alternatives.map((a) => a.savingsAmount))
                              return sum + maxSavings
                            }
                            return sum
                          }, 0)
                          .toLocaleString()}
                      </span>{" "}
                      based on your current selections.
                    </p>
                  </div>

                  {potentialSavings > 0 && (
                    <div className="p-4 bg-green-50 text-green-800 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5" />
                        <h3 className="font-medium">Your Selected Savings</h3>
                      </div>
                      <p className="text-sm mb-4">
                        You've selected alternatives that could save you{" "}
                        <span className="font-bold">${potentialSavings.toLocaleString()}</span>.
                      </p>
                      <Button onClick={applyAlternatives}>Apply These Changes</Button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {budgetItems
                      .filter((item) => item.alternatives && item.alternatives.length > 0 && item.status === "planned")
                      .map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardHeader className="pb-2 bg-muted/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                <CardDescription>
                                  {item.category} • ${item.estimatedCost.toFixed(2)}/{item.unit} • Total: $
                                  {(item.estimatedCost * item.quantity).toFixed(2)}
                                </CardDescription>
                              </div>
                              <Badge>
                                {item.alternatives?.length} Alternative{item.alternatives?.length !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-4">
                              {item.alternatives?.map((alternative) => (
                                <div key={alternative.id} className="flex items-start gap-3">
                                  <Checkbox
                                    id={alternative.id}
                                    checked={selectedAlternatives[item.id] === alternative.id}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedAlternatives({
                                          ...selectedAlternatives,
                                          [item.id]: alternative.id,
                                        })
                                      } else {
                                        const newSelected = { ...selectedAlternatives }
                                        delete newSelected[item.id]
                                        setSelectedAlternatives(newSelected)
                                      }
                                    }}
                                  />
                                  <div className="flex-1 space-y-1">
                                    <Label
                                      htmlFor={alternative.id}
                                      className="font-medium cursor-pointer flex items-center gap-2"
                                    >
                                      {alternative.name}
                                      <Badge variant="outline" className="ml-2 text-green-600">
                                        Save ${alternative.savingsAmount.toLocaleString()}
                                      </Badge>
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{alternative.description}</p>

                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                      <div className="space-y-1">
                                        <p className="text-xs font-medium text-green-600">Pros</p>
                                        <ul className="text-xs space-y-1">
                                          {alternative.pros.map((pro, index) => (
                                            <li key={index} className="flex items-center gap-1">
                                              <CheckCircle className="h-3 w-3 text-green-500" />
                                              <span>{pro}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-xs font-medium text-red-600">Cons</p>
                                        <ul className="text-xs space-y-1">
                                          {alternative.cons.map((con, index) => (
                                            <li key={index} className="flex items-center gap-1">
                                              <AlertTriangle className="h-3 w-3 text-red-500" />
                                              <span>{con}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                    <div className="mt-2 pt-2 border-t flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                          New price: $
                                          {(item.estimatedCost * (1 - alternative.savingsPercentage / 100)).toFixed(2)}/
                                          {item.unit}
                                        </span>
                                      </div>
                                      <Badge variant="outline">
                                        <Percent className="h-3 w-3 mr-1" />
                                        {alternative.savingsPercentage}% cheaper
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  {budgetItems.filter(
                    (item) => item.alternatives && item.alternatives.length > 0 && item.status === "planned",
                  ).length === 0 && (
                    <div className="p-8 text-center border rounded-md">
                      <h3 className="text-lg font-medium mb-2">No Alternatives Available</h3>
                      <p className="text-muted-foreground mb-4">
                        There are no planned items with alternative options available.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-800 rounded-md">
                    <Lightbulb className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">
                      Our budget optimizer can help you find ways to save money on your renovation. Toggle "Show
                      Alternatives" to see cost-saving options for your materials.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Cost-Saving Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                              1
                            </div>
                            <div>
                              <h4 className="font-medium">Consider Alternative Materials</h4>
                              <p className="text-sm text-muted-foreground">
                                Look for less expensive alternatives that provide a similar look and function.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                              2
                            </div>
                            <div>
                              <h4 className="font-medium">Phase Your Project</h4>
                              <p className="text-sm text-muted-foreground">
                                Break your renovation into phases to spread out costs over time.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                              3
                            </div>
                            <div>
                              <h4 className="font-medium">DIY Where Possible</h4>
                              <p className="text-sm text-muted-foreground">
                                Consider doing some work yourself, like demolition or painting.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                              4
                            </div>
                            <div>
                              <h4 className="font-medium">Reuse and Refinish</h4>
                              <p className="text-sm text-muted-foreground">
                                Consider refinishing existing elements like cabinets instead of replacing them.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                              5
                            </div>
                            <div>
                              <h4 className="font-medium">Shop Sales and Clearance</h4>
                              <p className="text-sm text-muted-foreground">
                                Look for sales, clearance items, and floor models for significant savings.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Budget Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Top Expense Categories</h4>
                            <div className="space-y-2">
                              {categorySummary.slice(0, 3).map((category) => (
                                <div key={category.name} className="flex justify-between items-center">
                                  <span className="text-sm">{category.name}</span>
                                  <span className="text-sm font-medium">${category.actualCost.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium mb-2">Potential Savings</h4>
                            <div className="p-3 bg-green-50 rounded-md">
                              <p className="text-sm">
                                Based on our analysis, you could save up to{" "}
                                <span className="font-bold">
                                  $
                                  {budgetItems
                                    .reduce((sum, item) => {
                                      if (item.alternatives && item.alternatives.length > 0) {
                                        const maxSavings = Math.max(...item.alternatives.map((a) => a.savingsAmount))
                                        return sum + maxSavings
                                      }
                                      return sum
                                    }, 0)
                                    .toLocaleString()}
                                </span>{" "}
                                by choosing alternative materials.
                              </p>
                            </div>
                          </div>

                          <Button className="w-full" onClick={() => setShowAlternatives(true)}>
                            View Cost-Saving Alternatives
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Budget Item</DialogTitle>
            <DialogDescription>Update the details for this budget item.</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Item Name</Label>
                  <Input
                    id="edit-name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingItem.category}
                    onValueChange={(value: string) => setEditingItem({ ...editingItem, category: value })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="Countertops">Countertops</SelectItem>
                      <SelectItem value="Cabinetry">Cabinetry</SelectItem>
                      <SelectItem value="Flooring">Flooring</SelectItem>
                      <SelectItem value="Tile">Tile</SelectItem>
                      <SelectItem value="Fixtures">Fixtures</SelectItem>
                      <SelectItem value="Appliances">Appliances</SelectItem>
                      <SelectItem value="Paint">Paint</SelectItem>
                      <SelectItem value="Lighting">Lighting</SelectItem>
                      <SelectItem value="Hardware">Hardware</SelectItem>
                      <SelectItem value="Labor">Labor</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-estimatedCost">Estimated Cost ($)</Label>
                  <Input
                    id="edit-estimatedCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingItem.estimatedCost}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, estimatedCost: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-actualCost">Actual Cost ($)</Label>
                  <Input
                    id="edit-actualCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingItem.actualCost || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? null : Number.parseFloat(e.target.value)
                      setEditingItem({ ...editingItem, actualCost: value })
                    }}
                    placeholder="Enter when purchased"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="1"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: Number.parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Select
                    value={editingItem.unit}
                    onValueChange={(value: string) => setEditingItem({ ...editingItem, unit: value })}
                  >
                    <SelectTrigger id="edit-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="each">Each</SelectItem>
                      <SelectItem value="sq ft">Square Feet</SelectItem>
                      <SelectItem value="linear ft">Linear Feet</SelectItem>
                      <SelectItem value="gallon">Gallon</SelectItem>
                      <SelectItem value="set">Set</SelectItem>
                      <SelectItem value="hour">Hour</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingItem.status}
                    onValueChange={(value: string) =>
                      setEditingItem({ ...editingItem, status: value as BudgetItem["status"] })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="purchased">Purchased</SelectItem>
                      <SelectItem value="installed">Installed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-project">Project</Label>
                <Select
                  value={editingItem.projectId.toString()}
                  onValueChange={(value: string) => {
                    const projectId = Number.parseInt(value)
                    const project = projects.find((p) => p.id === projectId)
                    setEditingItem({
                      ...editingItem,
                      projectId,
                      projectName: project ? project.name : editingItem.projectName,
                    })
                  }}
                >
                  <SelectTrigger id="edit-project">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Input
                  id="edit-notes"
                  value={editingItem.notes}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-total">Total Cost</Label>
                  <div>
                    <span className="text-sm text-muted-foreground mr-2">Estimated:</span>
                    <span className="font-bold">${(editingItem.estimatedCost * editingItem.quantity).toFixed(2)}</span>

                    {editingItem.actualCost && (
                      <>
                        <span className="text-sm text-muted-foreground mx-2">Actual:</span>
                        <span className="font-bold">${(editingItem.actualCost * editingItem.quantity).toFixed(2)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingItem(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateItem}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

