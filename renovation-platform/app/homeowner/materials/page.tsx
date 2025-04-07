"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  ShoppingBag,
  Truck,
  Package,
  AlertTriangle,
  Plus,
  Download,
  Calendar,
  ExternalLink,
  FileText,
} from "lucide-react"
import Link from "next/link"

type Material = {
  id: string
  name: string
  category: string
  supplier: string
  price: number
  quantity: number
  unit: string
  totalCost: number
  status: "Delivered" | "Ordered" | "Pending" | "Cancelled"
  deliveryDate?: string
  projectId: number
  projectName: string
  image?: string
}

type Order = {
  id: string
  date: string
  supplier: string
  items: number
  total: number
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled"
  deliveryDate?: string
  trackingNumber?: string
  projectId: number
  projectName: string
}

type Supplier = {
  id: string
  name: string
  category: string
  contact: string
  phone: string
  email: string
  website: string
  address: string
}

export default function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")

  // Mock data for materials
  const materials: Material[] = [
    {
      id: "MAT-1001",
      name: "Quartz Countertop",
      category: "Countertops",
      supplier: "Stone Supply Co.",
      price: 75.99,
      quantity: 30,
      unit: "sq ft",
      totalCost: 2279.7,
      status: "Ordered",
      deliveryDate: "Mar 15, 2025",
      projectId: 1,
      projectName: "Kitchen Renovation",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "MAT-1002",
      name: "Subway Tile",
      category: "Tile",
      supplier: "Tile Warehouse",
      price: 5.99,
      quantity: 200,
      unit: "sq ft",
      totalCost: 1198.0,
      status: "Delivered",
      deliveryDate: "Mar 5, 2025",
      projectId: 2,
      projectName: "Bathroom Remodel",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "MAT-1003",
      name: "Shaker Cabinet Doors",
      category: "Cabinetry",
      supplier: "Cabinet World",
      price: 89.99,
      quantity: 12,
      unit: "each",
      totalCost: 1079.88,
      status: "Ordered",
      deliveryDate: "Mar 20, 2025",
      projectId: 1,
      projectName: "Kitchen Renovation",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "MAT-1004",
      name: "Hardwood Flooring",
      category: "Flooring",
      supplier: "Flooring Depot",
      price: 6.99,
      quantity: 350,
      unit: "sq ft",
      totalCost: 2446.5,
      status: "Pending",
      projectId: 3,
      projectName: "Living Room Renovation",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "MAT-1005",
      name: "Bathroom Vanity",
      category: "Fixtures",
      supplier: "Fixture Supply",
      price: 499.99,
      quantity: 1,
      unit: "each",
      totalCost: 499.99,
      status: "Delivered",
      deliveryDate: "Feb 28, 2025",
      projectId: 2,
      projectName: "Bathroom Remodel",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "MAT-1006",
      name: "Paint - Eggshell White",
      category: "Paint",
      supplier: "Paint Supply",
      price: 45.99,
      quantity: 5,
      unit: "gallon",
      totalCost: 229.95,
      status: "Delivered",
      deliveryDate: "Mar 2, 2025",
      projectId: 1,
      projectName: "Kitchen Renovation",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "MAT-1007",
      name: "Shower Door",
      category: "Fixtures",
      supplier: "Fixture Supply",
      price: 349.99,
      quantity: 1,
      unit: "each",
      totalCost: 349.99,
      status: "Ordered",
      deliveryDate: "Mar 18, 2025",
      projectId: 2,
      projectName: "Bathroom Remodel",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "MAT-1008",
      name: "Kitchen Sink",
      category: "Fixtures",
      supplier: "Fixture Supply",
      price: 299.99,
      quantity: 1,
      unit: "each",
      totalCost: 299.99,
      status: "Delivered",
      deliveryDate: "Feb 25, 2025",
      projectId: 1,
      projectName: "Kitchen Renovation",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  // Mock data for orders
  const orders: Order[] = [
    {
      id: "ORD-1001",
      date: "Feb 20, 2025",
      supplier: "Stone Supply Co.",
      items: 1,
      total: 2279.7,
      status: "Shipped",
      deliveryDate: "Mar 15, 2025",
      trackingNumber: "1Z999AA10123456784",
      projectId: 1,
      projectName: "Kitchen Renovation",
    },
    {
      id: "ORD-1002",
      date: "Feb 15, 2025",
      supplier: "Cabinet World",
      items: 1,
      total: 1079.88,
      status: "Shipped",
      deliveryDate: "Mar 20, 2025",
      trackingNumber: "1Z999AA10123456785",
      projectId: 1,
      projectName: "Kitchen Renovation",
    },
    {
      id: "ORD-1003",
      date: "Feb 10, 2025",
      supplier: "Tile Warehouse",
      items: 1,
      total: 1198.0,
      status: "Delivered",
      deliveryDate: "Mar 5, 2025",
      trackingNumber: "1Z999AA10123456786",
      projectId: 2,
      projectName: "Bathroom Remodel",
    },
    {
      id: "ORD-1004",
      date: "Feb 5, 2025",
      supplier: "Fixture Supply",
      items: 2,
      total: 849.98,
      status: "Delivered",
      deliveryDate: "Feb 28, 2025",
      trackingNumber: "1Z999AA10123456787",
      projectId: 2,
      projectName: "Bathroom Remodel",
    },
    {
      id: "ORD-1005",
      date: "Mar 1, 2025",
      supplier: "Flooring Depot",
      items: 1,
      total: 2446.5,
      status: "Processing",
      projectId: 3,
      projectName: "Living Room Renovation",
    },
    {
      id: "ORD-1006",
      date: "Feb 25, 2025",
      supplier: "Fixture Supply",
      items: 1,
      total: 349.99,
      status: "Shipped",
      deliveryDate: "Mar 18, 2025",
      trackingNumber: "1Z999AA10123456788",
      projectId: 2,
      projectName: "Bathroom Remodel",
    },
  ]

  // Mock data for suppliers
  const suppliers: Supplier[] = [
    {
      id: "SUP-1001",
      name: "Stone Supply Co.",
      category: "Countertops & Stone",
      contact: "John Smith",
      phone: "(555) 123-4567",
      email: "info@stonesupply.com",
      website: "www.stonesupply.com",
      address: "123 Stone Ave, New York, NY 10001",
    },
    {
      id: "SUP-1002",
      name: "Tile Warehouse",
      category: "Tile & Flooring",
      contact: "Sarah Johnson",
      phone: "(555) 234-5678",
      email: "info@tilewarehouse.com",
      website: "www.tilewarehouse.com",
      address: "456 Tile St, New York, NY 10002",
    },
    {
      id: "SUP-1003",
      name: "Cabinet World",
      category: "Cabinetry",
      contact: "Mike Wilson",
      phone: "(555) 345-6789",
      email: "info@cabinetworld.com",
      website: "www.cabinetworld.com",
      address: "789 Cabinet Rd, New York, NY 10003",
    },
    {
      id: "SUP-1004",
      name: "Flooring Depot",
      category: "Flooring",
      contact: "David Brown",
      phone: "(555) 456-7890",
      email: "info@flooringdepot.com",
      website: "www.flooringdepot.com",
      address: "321 Floor Blvd, New York, NY 10004",
    },
    {
      id: "SUP-1005",
      name: "Fixture Supply",
      category: "Fixtures & Appliances",
      contact: "Emily Davis",
      phone: "(555) 567-8901",
      email: "info@fixturesupply.com",
      website: "www.fixturesupply.com",
      address: "654 Fixture Ave, New York, NY 10005",
    },
    {
      id: "SUP-1006",
      name: "Paint Supply",
      category: "Paint & Finishes",
      contact: "Lisa Brown",
      phone: "(555) 678-9012",
      email: "info@paintsupply.com",
      website: "www.paintsupply.com",
      address: "987 Paint St, New York, NY 10006",
    },
  ]

  // Calculate total material costs
  const totalMaterialCost = materials.reduce((sum, material) => sum + material.totalCost, 0)

  // Calculate costs by project
  const projectCosts = materials.reduce(
    (acc, material) => {
      if (!acc[material.projectId]) {
        acc[material.projectId] = {
          id: material.projectId,
          name: material.projectName,
          cost: 0,
        }
      }
      acc[material.projectId].cost += material.totalCost
      return acc
    },
    {} as Record<number, { id: number; name: string; cost: number }>,
  )

  // Filter materials based on search and filters
  const filteredMaterials = materials.filter((material) => {
    // Filter by search term
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by category
    const matchesCategory = categoryFilter === "all" || material.category.toLowerCase() === categoryFilter.toLowerCase()

    // Filter by status
    const matchesStatus = statusFilter === "all" || material.status.toLowerCase() === statusFilter.toLowerCase()

    // Filter by project
    const matchesProject = projectFilter === "all" || material.projectId.toString() === projectFilter

    return matchesSearch && matchesCategory && matchesStatus && matchesProject
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(materials.map((material) => material.category)))

  // Get unique projects for filter
  const projects = Array.from(
    new Set(
      materials.map((material) => ({
        id: material.projectId,
        name: material.projectName,
      })),
    ),
  )

  // Remove duplicates from projects
  const uniqueProjects = projects.filter((project, index, self) => index === self.findIndex((p) => p.id === project.id))

  const getStatusBadge = (status: Material["status"] | Order["status"]) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Delivered</Badge>
      case "Shipped":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Shipped</Badge>
      case "Ordered":
      case "Processing":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">{status}</Badge>
      case "Pending":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Pending</Badge>
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materials</h1>
          <p className="text-muted-foreground">Track materials and supplies for your renovation projects.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Material
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Material Cost</CardTitle>
            <CardDescription>Combined cost of all materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">${totalMaterialCost.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Across {materials.length} items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Material Status</CardTitle>
            <CardDescription>Current status of your materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivered</span>
                <span className="font-medium">{materials.filter((m) => m.status === "Delivered").length} items</span>
              </div>
              <Progress
                value={(materials.filter((m) => m.status === "Delivered").length / materials.length) * 100}
                className="h-2 bg-muted"
              />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Ordered</span>
                <span className="font-medium">{materials.filter((m) => m.status === "Ordered").length} items</span>
              </div>
              <Progress
                value={(materials.filter((m) => m.status === "Ordered").length / materials.length) * 100}
                className="h-2 bg-muted"
              />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium">{materials.filter((m) => m.status === "Pending").length} items</span>
              </div>
              <Progress
                value={(materials.filter((m) => m.status === "Pending").length / materials.length) * 100}
                className="h-2 bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Deliveries</CardTitle>
            <CardDescription>Materials scheduled for delivery</CardDescription>
          </CardHeader>
          <CardContent>
            {materials.filter((m) => m.status === "Ordered" && m.deliveryDate).length > 0 ? (
              <div className="space-y-3">
                {materials
                  .filter((m) => m.status === "Ordered" && m.deliveryDate)
                  .sort((a, b) => new Date(a.deliveryDate!).getTime() - new Date(b.deliveryDate!).getTime())
                  .slice(0, 3)
                  .map((material) => (
                    <div key={material.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{material.name}</p>
                        <p className="text-xs text-muted-foreground">{material.deliveryDate}</p>
                      </div>
                      <Badge variant="outline">{material.supplier}</Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming deliveries scheduled.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Materials Inventory</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search materials..."
                      className="pl-10 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
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

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {uniqueProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
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
                      <TableHead className="w-[40px]">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">
                          No materials found. Try adjusting your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMaterials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {material.image ? (
                                <div className="h-10 w-10 rounded-md overflow-hidden border">
                                  <img
                                    src={material.image || "/placeholder.svg"}
                                    alt={material.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                  <Package className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <span className="font-medium">{material.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{material.category}</TableCell>
                          <TableCell>{material.supplier}</TableCell>
                          <TableCell>
                            <Link
                              href={`/homeowner/projects/${material.projectId}`}
                              className="text-primary hover:underline"
                            >
                              {material.projectName}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            ${material.price.toFixed(2)}/{material.unit}
                          </TableCell>
                          <TableCell className="text-center">
                            {material.quantity} {material.unit}
                          </TableCell>
                          <TableCell className="text-right font-medium">${material.totalCost.toFixed(2)}</TableCell>
                          <TableCell className="text-center">{getStatusBadge(material.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">
                  {materials.filter((m) => m.status === "Pending").length} items need to be ordered
                </span>
              </div>
              <Button variant="outline">
                <ShoppingBag className="mr-2 h-4 w-4" /> Place Order
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>Track your material orders and deliveries</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell>
                          <Link
                            href={`/homeowner/projects/${order.projectId}`}
                            className="text-primary hover:underline"
                          >
                            {order.projectName}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">{order.items}</TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.deliveryDate || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Order Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details: ORD-1001</CardTitle>
              <CardDescription>Stone Supply Co. - Feb 20, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-500" />
                      <p className="font-medium">Shipped</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Delivery Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium">Mar 15, 2025</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium">1Z999AA10123456784</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Order Items</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md overflow-hidden border">
                                <img
                                  src="/placeholder.svg?height=100&width=100"
                                  alt="Quartz Countertop"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">Quartz Countertop</p>
                                <p className="text-xs text-muted-foreground">Calacatta Gold</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">$75.99/sq ft</TableCell>
                          <TableCell className="text-center">30 sq ft</TableCell>
                          <TableCell className="text-right font-medium">$2,279.70</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-3">Shipping Information</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm">123 Main St</p>
                      <p className="text-sm">New York, NY 10001</p>
                      <p className="text-sm">United States</p>
                      <p className="text-sm mt-2">Phone: (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-3">Supplier Information</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="font-medium">Stone Supply Co.</p>
                      <p className="text-sm">123 Stone Ave</p>
                      <p className="text-sm">New York, NY 10001</p>
                      <p className="text-sm">United States</p>
                      <p className="text-sm mt-2">Contact: John Smith</p>
                      <p className="text-sm">Phone: (555) 123-4567</p>
                      <p className="text-sm">Email: info@stonesupply.com</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>$2,279.70</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>$2,279.70</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Download Invoice
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" /> Track Package
                </Button>
                <Button>Contact Supplier</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Suppliers Directory</CardTitle>
                  <CardDescription>Information about your material suppliers</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Supplier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="search" placeholder="Search suppliers..." className="pl-10" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="countertops">Countertops & Stone</SelectItem>
                      <SelectItem value="tile">Tile & Flooring</SelectItem>
                      <SelectItem value="cabinetry">Cabinetry</SelectItem>
                      <SelectItem value="fixtures">Fixtures & Appliances</SelectItem>
                      <SelectItem value="paint">Paint & Finishes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {suppliers.map((supplier) => (
                    <Card key={supplier.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        <CardDescription>{supplier.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Contact:</span> {supplier.contact}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span> {supplier.email}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span> {supplier.phone}
                          </p>
                          <p>
                            <span className="font-medium">Address:</span> {supplier.address}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          View Catalog
                        </Button>
                        <Button size="sm">Contact</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Material Cost Breakdown</CardTitle>
                  <CardDescription>Analyze your material costs by project and category</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Costs by Project</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead className="text-right">Material Cost</TableHead>
                          <TableHead className="text-right">% of Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.values(projectCosts).map((project) => (
                          <TableRow key={project.id}>
                            <TableCell>
                              <Link href={`/homeowner/projects/${project.id}`} className="text-primary hover:underline">
                                {project.name}
                              </Link>
                            </TableCell>
                            <TableCell className="text-right font-medium">${project.cost.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              {((project.cost / totalMaterialCost) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">${totalMaterialCost.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-bold">100%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Costs by Category</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Material Cost</TableHead>
                          <TableHead className="text-right">% of Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map((category) => {
                          const categoryCost = materials
                            .filter((m) => m.category === category)
                            .reduce((sum, m) => sum + m.totalCost, 0)

                          return (
                            <TableRow key={category}>
                              <TableCell>{category}</TableCell>
                              <TableCell className="text-right font-medium">${categoryCost.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                {((categoryCost / totalMaterialCost) * 100).toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          )
                        })}
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">${totalMaterialCost.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-bold">100%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Top 5 Most Expensive Materials</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {materials
                          .sort((a, b) => b.totalCost - a.totalCost)
                          .slice(0, 5)
                          .map((material) => (
                            <TableRow key={material.id}>
                              <TableCell className="font-medium">{material.name}</TableCell>
                              <TableCell>{material.category}</TableCell>
                              <TableCell>
                                <Link
                                  href={`/homeowner/projects/${material.projectId}`}
                                  className="text-primary hover:underline"
                                >
                                  {material.projectName}
                                </Link>
                              </TableCell>
                              <TableCell className="text-right">${material.totalCost.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
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

