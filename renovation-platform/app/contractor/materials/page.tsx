"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, ShoppingBag, Truck, AlertTriangle } from "lucide-react"
import { useState } from "react"

type Material = {
  id: string
  name: string
  category: string
  supplier: string
  price: number
  unit: string
  stock: number
  status: "In Stock" | "Low Stock" | "Out of Stock" | "On Order"
  project?: string
}

type Order = {
  id: string
  date: string
  supplier: string
  items: number
  total: number
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled"
  eta?: string
}

export default function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for materials
  const materials: Material[] = [
    {
      id: "1",
      name: "Quartz Countertop",
      category: "Countertops",
      supplier: "Stone Supply Co.",
      price: 75.99,
      unit: "sq ft",
      stock: 0,
      status: "On Order",
      project: "Kitchen Renovation",
    },
    {
      id: "2",
      name: "Subway Tile",
      category: "Tile",
      supplier: "Tile Warehouse",
      price: 5.99,
      unit: "sq ft",
      stock: 120,
      status: "In Stock",
      project: "Bathroom Remodel",
    },
    {
      id: "3",
      name: "Shaker Cabinet Doors",
      category: "Cabinetry",
      supplier: "Cabinet World",
      price: 89.99,
      unit: "each",
      stock: 8,
      status: "Low Stock",
      project: "Kitchen Renovation",
    },
    {
      id: "4",
      name: "Hardwood Flooring",
      category: "Flooring",
      supplier: "Flooring Depot",
      price: 6.99,
      unit: "sq ft",
      stock: 350,
      status: "In Stock",
    },
    {
      id: "5",
      name: "Bathroom Vanity",
      category: "Fixtures",
      supplier: "Fixture Supply",
      price: 499.99,
      unit: "each",
      stock: 2,
      status: "Low Stock",
      project: "Bathroom Remodel",
    },
    {
      id: "6",
      name: "Paint - Eggshell White",
      category: "Paint",
      supplier: "Paint Supply",
      price: 45.99,
      unit: "gallon",
      stock: 0,
      status: "Out of Stock",
    },
  ]

  // Mock data for orders
  const orders: Order[] = [
    {
      id: "ORD-1234",
      date: "Mar 1, 2025",
      supplier: "Stone Supply Co.",
      items: 1,
      total: 2279.7,
      status: "Shipped",
      eta: "Mar 10, 2025",
    },
    {
      id: "ORD-1235",
      date: "Feb 28, 2025",
      supplier: "Cabinet World",
      items: 3,
      total: 1499.85,
      status: "Pending",
    },
    {
      id: "ORD-1236",
      date: "Feb 25, 2025",
      supplier: "Paint Supply",
      items: 5,
      total: 229.95,
      status: "Delivered",
    },
  ]

  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: Material["status"]) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Out of Stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "On Order":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return ""
    }
  }

  const getOrderStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materials & Supplies</h1>
          <p className="text-muted-foreground">Manage your inventory and track orders for all your projects.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="#" download="materials-inventory.csv">
              Export CSV
            </a>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Material
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Materials Inventory</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search materials..."
                      className="pl-8 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="countertops">Countertops</SelectItem>
                      <SelectItem value="tile">Tile</SelectItem>
                      <SelectItem value="cabinetry">Cabinetry</SelectItem>
                      <SelectItem value="flooring">Flooring</SelectItem>
                      <SelectItem value="fixtures">Fixtures</SelectItem>
                      <SelectItem value="paint">Paint</SelectItem>
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
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">{material.name}</TableCell>
                        <TableCell>{material.category}</TableCell>
                        <TableCell>{material.supplier}</TableCell>
                        <TableCell className="text-right">
                          ${material.price.toFixed(2)}/{material.unit}
                        </TableCell>
                        <TableCell className="text-center">{material.stock}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={getStatusColor(material.status)}>{material.status}</Badge>
                        </TableCell>
                        <TableCell>{material.project || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            {material.status === "Out of Stock" || material.status === "Low Stock" ? "Order" : "Edit"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">3 items are low or out of stock</span>
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
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>Track your material orders and deliveries.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell className="text-center">{order.items}</TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={getOrderStatusColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{order.eta || "-"}</TableCell>
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
            <CardFooter>
              <Button>
                <Truck className="mr-2 h-4 w-4" /> New Order
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suppliers Directory</CardTitle>
              <CardDescription>Manage your supplier contacts and information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search suppliers..." className="pl-8" />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Supplier
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Stone Supply Co.</CardTitle>
                      <CardDescription>Countertops & Stone Materials</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Contact:</span> John Smith
                        </p>
                        <p>
                          <span className="font-medium">Email:</span> john@stonesupply.com
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span> (555) 123-4567
                        </p>
                        <p>
                          <span className="font-medium">Address:</span> 123 Stone Ave, New York, NY 10001
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Catalog
                      </Button>
                      <Button size="sm">Place Order</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Tile Warehouse</CardTitle>
                      <CardDescription>Tiles & Flooring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Contact:</span> Sarah Johnson
                        </p>
                        <p>
                          <span className="font-medium">Email:</span> sarah@tilewarehouse.com
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span> (555) 234-5678
                        </p>
                        <p>
                          <span className="font-medium">Address:</span> 456 Tile St, New York, NY 10002
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Catalog
                      </Button>
                      <Button size="sm">Place Order</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Cabinet World</CardTitle>
                      <CardDescription>Cabinetry & Storage Solutions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Contact:</span> Mike Wilson
                        </p>
                        <p>
                          <span className="font-medium">Email:</span> mike@cabinetworld.com
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span> (555) 345-6789
                        </p>
                        <p>
                          <span className="font-medium">Address:</span> 789 Cabinet Rd, New York, NY 10003
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Catalog
                      </Button>
                      <Button size="sm">Place Order</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Paint Supply</CardTitle>
                      <CardDescription>Paints & Finishes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Contact:</span> Lisa Brown
                        </p>
                        <p>
                          <span className="font-medium">Email:</span> lisa@paintsupply.com
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span> (555) 456-7890
                        </p>
                        <p>
                          <span className="font-medium">Address:</span> 101 Paint Blvd, New York, NY 10004
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Catalog
                      </Button>
                      <Button size="sm">Place Order</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

