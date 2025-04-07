"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Check, Download, FileText, Plus, Search, Send, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Add these imports at the top of the file
import { LineChart, Line } from "recharts"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Mock data for invoices
const initialInvoices = [
  {
    id: "INV-001",
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    client: "John Smith",
    clientId: "client-001",
    amount: 5000,
    status: "paid",
    issueDate: "2025-02-15T00:00:00",
    dueDate: "2025-02-25T00:00:00",
    paidDate: "2025-02-20T00:00:00",
    description: "Deposit payment for kitchen renovation project",
    items: [
      { description: "Design fee", amount: 1500 },
      { description: "Materials deposit", amount: 2500 },
      { description: "Labor deposit", amount: 1000 },
    ],
  },
  {
    id: "INV-002",
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    client: "John Smith",
    clientId: "client-001",
    amount: 7500,
    status: "paid",
    issueDate: "2025-03-01T00:00:00",
    dueDate: "2025-03-10T00:00:00",
    paidDate: "2025-03-08T00:00:00",
    description: "Progress payment 1 for kitchen renovation project",
    items: [
      { description: "Cabinet installation", amount: 4000 },
      { description: "Plumbing work", amount: 2000 },
      { description: "Electrical work", amount: 1500 },
    ],
  },
  {
    id: "INV-003",
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    client: "John Smith",
    clientId: "client-001",
    amount: 7500,
    status: "pending",
    issueDate: "2025-03-20T00:00:00",
    dueDate: "2025-03-30T00:00:00",
    paidDate: null,
    description: "Final payment for kitchen renovation project",
    items: [
      { description: "Countertop installation", amount: 3500 },
      { description: "Backsplash installation", amount: 1500 },
      { description: "Final finishing work", amount: 2500 },
    ],
  },
  {
    id: "INV-004",
    projectId: "project-002",
    projectName: "Bathroom Remodel",
    client: "Emily Johnson",
    clientId: "client-002",
    amount: 3000,
    status: "paid",
    issueDate: "2025-02-10T00:00:00",
    dueDate: "2025-02-20T00:00:00",
    paidDate: "2025-02-15T00:00:00",
    description: "Deposit payment for bathroom remodel project",
    items: [
      { description: "Design fee", amount: 800 },
      { description: "Materials deposit", amount: 1200 },
      { description: "Labor deposit", amount: 1000 },
    ],
  },
  {
    id: "INV-005",
    projectId: "project-002",
    projectName: "Bathroom Remodel",
    client: "Emily Johnson",
    clientId: "client-002",
    amount: 7000,
    status: "overdue",
    issueDate: "2025-03-05T00:00:00",
    dueDate: "2025-03-15T00:00:00",
    paidDate: null,
    description: "Final payment for bathroom remodel project",
    items: [
      { description: "Tile installation", amount: 2500 },
      { description: "Fixture installation", amount: 1500 },
      { description: "Vanity installation", amount: 2000 },
      { description: "Final finishing work", amount: 1000 },
    ],
  },
  {
    id: "INV-006",
    projectId: "project-003",
    projectName: "Basement Finishing",
    client: "Michael Brown",
    clientId: "client-003",
    amount: 4000,
    status: "paid",
    issueDate: "2025-03-01T00:00:00",
    dueDate: "2025-03-10T00:00:00",
    paidDate: "2025-03-05T00:00:00",
    description: "Deposit payment for basement finishing project",
    items: [
      { description: "Design fee", amount: 1000 },
      { description: "Materials deposit", amount: 2000 },
      { description: "Labor deposit", amount: 1000 },
    ],
  },
  {
    id: "INV-007",
    projectId: "project-004",
    projectName: "Deck Construction",
    client: "Sarah Wilson",
    clientId: "client-004",
    amount: 2500,
    status: "draft",
    issueDate: null,
    dueDate: null,
    paidDate: null,
    description: "Deposit payment for deck construction project",
    items: [
      { description: "Design fee", amount: 500 },
      { description: "Materials deposit", amount: 1500 },
      { description: "Labor deposit", amount: 500 },
    ],
  },
]

// Mock data for expenses
const initialExpenses = [
  {
    id: "EXP-001",
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    category: "Materials",
    vendor: "Home Depot",
    amount: 3200,
    date: "2025-02-18T00:00:00",
    description: "Cabinets and hardware",
    paymentMethod: "Credit Card",
    receiptUrl: "#",
  },
  {
    id: "EXP-002",
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    category: "Materials",
    vendor: "Stone World",
    amount: 2800,
    date: "2025-03-05T00:00:00",
    description: "Countertops",
    paymentMethod: "Check",
    receiptUrl: "#",
  },
  {
    id: "EXP-003",
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    category: "Labor",
    vendor: "Plumbing Pros",
    amount: 1200,
    date: "2025-03-10T00:00:00",
    description: "Subcontractor - plumbing work",
    paymentMethod: "Bank Transfer",
    receiptUrl: "#",
  },
  {
    id: "EXP-004",
    projectId: "project-002",
    projectName: "Bathroom Remodel",
    category: "Materials",
    vendor: "Tile Shop",
    amount: 1500,
    date: "2025-02-25T00:00:00",
    description: "Bathroom tiles and grout",
    paymentMethod: "Credit Card",
    receiptUrl: "#",
  },
  {
    id: "EXP-005",
    projectId: "project-002",
    projectName: "Bathroom Remodel",
    category: "Materials",
    vendor: "Fixture World",
    amount: 900,
    date: "2025-03-02T00:00:00",
    description: "Bathroom fixtures and hardware",
    paymentMethod: "Credit Card",
    receiptUrl: "#",
  },
  {
    id: "EXP-006",
    projectId: "project-003",
    projectName: "Basement Finishing",
    category: "Materials",
    vendor: "Lumber Supply",
    amount: 1800,
    date: "2025-03-08T00:00:00",
    description: "Framing materials",
    paymentMethod: "Check",
    receiptUrl: "#",
  },
  {
    id: "EXP-007",
    projectId: "project-003",
    projectName: "Basement Finishing",
    category: "Permits",
    vendor: "City Hall",
    amount: 350,
    date: "2025-03-01T00:00:00",
    description: "Building permits",
    paymentMethod: "Check",
    receiptUrl: "#",
  },
]

// Add this data after the other mock data constants
// Financial overview data
const yearlyFinancialData = {
  summary: {
    totalRevenue: 245000,
    totalExpenses: 178500,
    netProfit: 66500,
    profitMargin: 27.14,
  },
  expenses: {
    materials: 98000,
    labor: 56000,
    machinery: 12500,
    permits: 4500,
    subcontractors: 7500,
  },
  monthlyData: [
    { month: "Jan", revenue: 18000, expenses: 13200, materials: 7200, labor: 4000, machinery: 1000, other: 1000 },
    { month: "Feb", revenue: 16500, expenses: 12100, materials: 6600, labor: 3700, machinery: 800, other: 1000 },
    { month: "Mar", revenue: 19500, expenses: 14300, materials: 7800, labor: 4400, machinery: 1100, other: 1000 },
    { month: "Apr", revenue: 21000, expenses: 15400, materials: 8400, labor: 4700, machinery: 1200, other: 1100 },
    { month: "May", revenue: 23500, expenses: 17200, materials: 9400, labor: 5300, machinery: 1300, other: 1200 },
    { month: "Jun", revenue: 25000, expenses: 18300, materials: 10000, labor: 5600, machinery: 1400, other: 1300 },
    { month: "Jul", revenue: 22000, expenses: 16100, materials: 8800, labor: 4900, machinery: 1200, other: 1200 },
    { month: "Aug", revenue: 20500, expenses: 15000, materials: 8200, labor: 4600, machinery: 1100, other: 1100 },
    { month: "Sep", revenue: 19000, expenses: 13900, materials: 7600, labor: 4300, machinery: 1000, other: 1000 },
    { month: "Oct", revenue: 21500, expenses: 15700, materials: 8600, labor: 4800, machinery: 1200, other: 1100 },
    { month: "Nov", revenue: 18500, expenses: 13500, materials: 7400, labor: 4100, machinery: 1000, other: 1000 },
    { month: "Dec", revenue: 20000, expenses: 14600, materials: 8000, labor: 4500, machinery: 1100, other: 1000 },
  ],
}

// Status colors for badges
const statusColors = {
  paid: "bg-green-500",
  pending: "bg-blue-500",
  overdue: "bg-red-500",
  draft: "bg-gray-500",
}

// Monthly revenue data for chart
const monthlyRevenueData = [
  { name: "Jan", revenue: 12000 },
  { name: "Feb", revenue: 15000 },
  { name: "Mar", revenue: 20000 },
  { name: "Apr", revenue: 18000 },
  { name: "May", revenue: 22000 },
  { name: "Jun", revenue: 25000 },
]

// Payment status data for pie chart
const paymentStatusData = [
  { name: "Paid", value: 20000, color: "#22c55e" },
  { name: "Pending", value: 7500, color: "#3b82f6" },
  { name: "Overdue", value: 7000, color: "#ef4444" },
  { name: "Draft", value: 2500, color: "#6b7280" },
]

export default function ContractorPaymentsPage() {
  // Add these state variables inside the component function
  const [viewMode, setViewMode] = useState<"yearly" | "monthly">("yearly")
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date())
  const [date, setDate] = useState<Date | undefined>(new Date())

  const [invoices, setInvoices] = useState(initialInvoices)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newInvoice, setNewInvoice] = useState({
    projectId: "",
    projectName: "",
    client: "",
    clientId: "",
    amount: "",
    description: "",
    dueDate: "",
    items: [{ description: "", amount: "" }],
  })
  const [newExpense, setNewExpense] = useState({
    projectId: "",
    projectName: "",
    category: "",
    vendor: "",
    amount: "",
    date: "",
    description: "",
    paymentMethod: "",
  })
  const { toast } = useToast()

  // Filter invoices based on search query and status filter
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Get invoices for the current month
  const currentMonthInvoices = invoices.filter((invoice) => {
    if (!invoice.issueDate) return false
    const invoiceDate = parseISO(invoice.issueDate)
    return invoiceDate >= startOfMonth(currentMonth) && invoiceDate <= endOfMonth(currentMonth)
  })

  // Get expenses for the current month
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = parseISO(expense.date)
    return expenseDate >= startOfMonth(currentMonth) && expenseDate <= endOfMonth(currentMonth)
  })

  // Calculate total revenue, expenses, and profit for the current month
  const totalRevenue = currentMonthInvoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const profit = totalRevenue - totalExpenses

  // Handle invoice form input changes
  const handleInvoiceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setNewInvoice((prev) => ({ ...prev, [name]: value }))
  }

  // Handle invoice item changes
  const handleInvoiceItemChange = (index: number, field: string, value: string) => {
    setNewInvoice((prev) => {
      const updatedItems = [...prev.items]
      updatedItems[index] = { ...updatedItems[index], [field]: value }
      return { ...prev, items: updatedItems }
    })
  }

  // Add new invoice item
  const addInvoiceItem = () => {
    setNewInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", amount: "" }],
    }))
  }

  // Remove invoice item
  const removeInvoiceItem = (index: number) => {
    setNewInvoice((prev) => {
      const updatedItems = [...prev.items]
      updatedItems.splice(index, 1)
      return { ...prev, items: updatedItems }
    })
  }

  // Handle expense form input changes
  const handleExpenseInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setNewExpense((prev) => ({ ...prev, [name]: value }))
  }

  // Handle invoice submission
  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!newInvoice.projectName || !newInvoice.client || !newInvoice.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Calculate total amount from items
    const totalAmount = newInvoice.items.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0)

    // Create new invoice
    const invoiceId = `INV-${String(invoices.length + 1).padStart(3, "0")}`
    const createdInvoice = {
      id: invoiceId,
      projectId: newInvoice.projectId || `project-${invoices.length + 1}`,
      projectName: newInvoice.projectName,
      client: newInvoice.client,
      clientId: newInvoice.clientId || `client-${invoices.length + 1}`,
      amount: totalAmount,
      status: "draft",
      issueDate: new Date().toISOString(),
      dueDate: newInvoice.dueDate,
      paidDate: null,
      description: newInvoice.description,
      items: newInvoice.items.map((item) => ({
        description: item.description,
        amount: Number.parseFloat(item.amount) || 0,
      })),
    }

    // Add to invoices
    setInvoices((prev) => [...prev, createdInvoice])

    // Reset form and close dialog
    setNewInvoice({
      projectId: "",
      projectName: "",
      client: "",
      clientId: "",
      amount: "",
      description: "",
      dueDate: "",
      items: [{ description: "", amount: "" }],
    })
    setIsInvoiceDialogOpen(false)

    toast({
      title: "Invoice Created",
      description: `Invoice ${invoiceId} has been created as a draft.`,
    })
  }

  // Handle expense submission
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!newExpense.projectName || !newExpense.vendor || !newExpense.amount || !newExpense.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Create new expense
    const expenseId = `EXP-${String(expenses.length + 1).padStart(3, "0")}`
    const createdExpense = {
      id: expenseId,
      projectId: newExpense.projectId || `project-${expenses.length + 1}`,
      projectName: newExpense.projectName,
      category: newExpense.category || "Other",
      vendor: newExpense.vendor,
      amount: Number.parseFloat(newExpense.amount) || 0,
      date: newExpense.date,
      description: newExpense.description,
      paymentMethod: newExpense.paymentMethod || "Other",
      receiptUrl: "#",
    }

    // Add to expenses
    setExpenses((prev) => [...prev, createdExpense])

    // Reset form and close dialog
    setNewExpense({
      projectId: "",
      projectName: "",
      category: "",
      vendor: "",
      amount: "",
      date: "",
      description: "",
      paymentMethod: "",
    })
    setIsExpenseDialogOpen(false)

    toast({
      title: "Expense Recorded",
      description: `Expense ${expenseId} has been recorded.`,
    })
  }

  // Handle invoice status change
  const handleInvoiceStatusChange = (id: string, newStatus: string) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              status: newStatus,
              paidDate: newStatus === "paid" ? new Date().toISOString() : invoice.paidDate,
            }
          : invoice,
      ),
    )

    toast({
      title: `Invoice ${newStatus === "paid" ? "Marked as Paid" : "Status Updated"}`,
      description: `Invoice ${id} has been updated to ${newStatus}.`,
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return format(parseISO(dateString), "MMM d, yyyy")
  }

  // Add this function inside the component
  // Get data for the selected month
  const getSelectedMonthData = () => {
    if (!selectedMonth) return yearlyFinancialData.monthlyData[0]
    const monthIndex = selectedMonth.getMonth()
    return yearlyFinancialData.monthlyData[monthIndex]
  }

  // Get the selected month's name
  const getSelectedMonthName = () => {
    if (!selectedMonth) return "January"
    return format(selectedMonth, "MMMM")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage your invoices, payments, and expenses.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleInvoiceSubmit}>
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>
                    Create a new invoice for your client. Fill in all the required information.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="projectName">Project Name*</Label>
                      <Input
                        id="projectName"
                        name="projectName"
                        value={newInvoice.projectName}
                        onChange={handleInvoiceInputChange}
                        placeholder="Project name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="client">Client Name*</Label>
                      <Input
                        id="client"
                        name="client"
                        value={newInvoice.client}
                        onChange={handleInvoiceInputChange}
                        placeholder="Client name"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newInvoice.description}
                      onChange={handleInvoiceInputChange}
                      placeholder="Invoice description"
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date*</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={handleInvoiceInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Invoice Items*</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                        <Plus className="h-4 w-4 mr-1" /> Add Item
                      </Button>
                    </div>
                    {newInvoice.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-2 items-start">
                        <div className="grid gap-2">
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) => handleInvoiceItemChange(index, "description", e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => handleInvoiceItemChange(index, "amount", e.target.value)}
                            className="w-24"
                            required
                          />
                        </div>
                        {newInvoice.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInvoiceItem(index)}
                            className="mt-1"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <div className="text-sm font-medium">
                        Total:{" "}
                        {formatCurrency(
                          newInvoice.items.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Invoice</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Record Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleExpenseSubmit}>
                <DialogHeader>
                  <DialogTitle>Record New Expense</DialogTitle>
                  <DialogDescription>
                    Record a new expense for your project. Fill in all the required information.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expProjectName">Project Name*</Label>
                    <Input
                      id="expProjectName"
                      name="projectName"
                      value={newExpense.projectName}
                      onChange={handleExpenseInputChange}
                      placeholder="Project name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        name="category"
                        onValueChange={(value) =>
                          handleExpenseInputChange({ target: { name: "category", value } } as any)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Materials">Materials</SelectItem>
                          <SelectItem value="Labor">Labor</SelectItem>
                          <SelectItem value="Permits">Permits</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="vendor">Vendor/Supplier*</Label>
                      <Input
                        id="vendor"
                        name="vendor"
                        value={newExpense.vendor}
                        onChange={handleExpenseInputChange}
                        placeholder="Vendor name"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount*</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={newExpense.amount}
                        onChange={handleExpenseInputChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date*</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={newExpense.date}
                        onChange={handleExpenseInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      name="paymentMethod"
                      onValueChange={(value) =>
                        handleExpenseInputChange({ target: { name: "paymentMethod", value } } as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expDescription">Description</Label>
                    <Textarea
                      id="expDescription"
                      name="description"
                      value={newExpense.description}
                      onChange={handleExpenseInputChange}
                      placeholder="Expense description"
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Record Expense</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">for {format(currentMonth, "MMMM yyyy")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">for {format(currentMonth, "MMMM yyyy")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(profit)}
            </div>
            <p className="text-xs text-muted-foreground">for {format(currentMonth, "MMMM yyyy")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Your revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Distribution of invoice payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Invoices</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search invoices..."
                      className="pl-8 w-full sm:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>{invoice.projectName}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[invoice.status]} text-white`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedInvoice(invoice)
                                // In a real app, this would open a dialog to view the invoice
                                toast({
                                  title: "View Invoice",
                                  description: `Viewing invoice ${invoice.id}`,
                                })
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            {invoice.status === "draft" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleInvoiceStatusChange(invoice.id, "pending")}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            {invoice.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleInvoiceStatusChange(invoice.id, "paid")}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {invoice.status === "overdue" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleInvoiceStatusChange(invoice.id, "paid")}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // In a real app, this would download the invoice
                                toast({
                                  title: "Download Invoice",
                                  description: `Downloading invoice ${invoice.id}`,
                                })
                              }}
                            >
                              <Download className="h-4 w-4" />
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
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Expenses</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search expenses..." className="pl-8 w-full sm:w-[200px]" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="materials">Materials</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                      <SelectItem value="permits">Permits</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense ID</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No expenses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.id}</TableCell>
                        <TableCell>{expense.projectName}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.vendor}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // In a real app, this would show expense details
                                toast({
                                  title: "View Expense",
                                  description: `Viewing expense ${expense.id}`,
                                })
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // In a real app, this would download the receipt
                                toast({
                                  title: "Download Receipt",
                                  description: `Downloading receipt for expense ${expense.id}`,
                                })
                              }}
                            >
                              <Download className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>
      {/* Add this new section after the existing Tabs component */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex space-x-2">
            <Button variant={viewMode === "yearly" ? "default" : "outline"} onClick={() => setViewMode("yearly")}>
              Yearly
            </Button>
            <Button variant={viewMode === "monthly" ? "default" : "outline"} onClick={() => setViewMode("monthly")}>
              Monthly
            </Button>
          </div>

          {viewMode === "monthly" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedMonth ? format(selectedMonth, "MMMM yyyy") : <span>Pick a month</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={setSelectedMonth}
                  initialFocus
                  disabled={(date) => {
                    // Only allow selecting the first day of each month in the current year
                    return date.getDate() !== 1 || date.getFullYear() !== new Date().getFullYear()
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {viewMode === "yearly" ? (
          <>
            <div className="grid gap-6 md:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(yearlyFinancialData.summary.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">for {new Date().getFullYear()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(yearlyFinancialData.summary.totalExpenses)}</div>
                  <p className="text-xs text-muted-foreground">for {new Date().getFullYear()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {formatCurrency(yearlyFinancialData.summary.netProfit)}
                  </div>
                  <p className="text-xs text-muted-foreground">for {new Date().getFullYear()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{yearlyFinancialData.summary.profitMargin.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">for {new Date().getFullYear()}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Annual Revenue vs Expenses</CardTitle>
                  <CardDescription>Monthly breakdown for {new Date().getFullYear()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={yearlyFinancialData.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, ""]} />
                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" strokeWidth={2} />
                        <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>By category for {new Date().getFullYear()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Materials", value: yearlyFinancialData.expenses.materials, color: "#3b82f6" },
                            { name: "Labor", value: yearlyFinancialData.expenses.labor, color: "#22c55e" },
                            { name: "Machinery", value: yearlyFinancialData.expenses.machinery, color: "#eab308" },
                            { name: "Permits", value: yearlyFinancialData.expenses.permits, color: "#ec4899" },
                            {
                              name: "Subcontractors",
                              value: yearlyFinancialData.expenses.subcontractors,
                              color: "#8b5cf6",
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: "Materials", value: yearlyFinancialData.expenses.materials, color: "#3b82f6" },
                            { name: "Labor", value: yearlyFinancialData.expenses.labor, color: "#22c55e" },
                            { name: "Machinery", value: yearlyFinancialData.expenses.machinery, color: "#eab308" },
                            { name: "Permits", value: yearlyFinancialData.expenses.permits, color: "#ec4899" },
                            {
                              name: "Subcontractors",
                              value: yearlyFinancialData.expenses.subcontractors,
                              color: "#8b5cf6",
                            },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Expense Breakdown</CardTitle>
                <CardDescription>Detailed view of expenses by category for {new Date().getFullYear()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearlyFinancialData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, ""]} />
                      <Bar dataKey="materials" stackId="a" fill="#3b82f6" name="Materials" />
                      <Bar dataKey="labor" stackId="a" fill="#22c55e" name="Labor" />
                      <Bar dataKey="machinery" stackId="a" fill="#eab308" name="Machinery" />
                      <Bar dataKey="other" stackId="a" fill="#8b5cf6" name="Other" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(getSelectedMonthData().revenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    for {getSelectedMonthName()} {new Date().getFullYear()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(getSelectedMonthData().expenses)}</div>
                  <p className="text-xs text-muted-foreground">
                    for {getSelectedMonthName()} {new Date().getFullYear()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {formatCurrency(getSelectedMonthData().revenue - getSelectedMonthData().expenses)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    for {getSelectedMonthName()} {new Date().getFullYear()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(
                      ((getSelectedMonthData().revenue - getSelectedMonthData().expenses) /
                        getSelectedMonthData().revenue) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">
                    for {getSelectedMonthName()} {new Date().getFullYear()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Expense Breakdown</CardTitle>
                  <CardDescription>
                    By category for {getSelectedMonthName()} {new Date().getFullYear()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Materials", value: getSelectedMonthData().materials, color: "#3b82f6" },
                            { name: "Labor", value: getSelectedMonthData().labor, color: "#22c55e" },
                            { name: "Machinery", value: getSelectedMonthData().machinery, color: "#eab308" },
                            { name: "Other", value: getSelectedMonthData().other, color: "#8b5cf6" },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: "Materials", value: getSelectedMonthData().materials, color: "#3b82f6" },
                            { name: "Labor", value: getSelectedMonthData().labor, color: "#22c55e" },
                            { name: "Machinery", value: getSelectedMonthData().machinery, color: "#eab308" },
                            { name: "Other", value: getSelectedMonthData().other, color: "#8b5cf6" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Expense Log</CardTitle>
                  <CardDescription>Recent expenses for {getSelectedMonthName()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{format(new Date(2025, selectedMonth?.getMonth() || 0, 5), "MMM d")}</TableCell>
                        <TableCell>Materials</TableCell>
                        <TableCell>Lumber for framing</TableCell>
                        <TableCell className="text-right">{formatCurrency(1250)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{format(new Date(2025, selectedMonth?.getMonth() || 0, 8), "MMM d")}</TableCell>
                        <TableCell>Labor</TableCell>
                        <TableCell>Framing crew</TableCell>
                        <TableCell className="text-right">{formatCurrency(2200)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{format(new Date(2025, selectedMonth?.getMonth() || 0, 12), "MMM d")}</TableCell>
                        <TableCell>Materials</TableCell>
                        <TableCell>Electrical supplies</TableCell>
                        <TableCell className="text-right">{formatCurrency(850)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{format(new Date(2025, selectedMonth?.getMonth() || 0, 15), "MMM d")}</TableCell>
                        <TableCell>Machinery</TableCell>
                        <TableCell>Excavator rental</TableCell>
                        <TableCell className="text-right">{formatCurrency(600)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{format(new Date(2025, selectedMonth?.getMonth() || 0, 18), "MMM d")}</TableCell>
                        <TableCell>Other</TableCell>
                        <TableCell>Permit fees</TableCell>
                        <TableCell className="text-right">{formatCurrency(350)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Materials Cost Analysis</CardTitle>
                <CardDescription>
                  Breakdown of material costs for {getSelectedMonthName()} {new Date().getFullYear()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material Type</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Lumber (2x4)</TableCell>
                      <TableCell>Home Depot</TableCell>
                      <TableCell>250 pcs</TableCell>
                      <TableCell>{formatCurrency(3.5)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(875)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Plywood (4x8)</TableCell>
                      <TableCell>Lowe's</TableCell>
                      <TableCell>30 sheets</TableCell>
                      <TableCell>{formatCurrency(32)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(960)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Concrete Mix</TableCell>
                      <TableCell>Builder's Supply</TableCell>
                      <TableCell>15 bags</TableCell>
                      <TableCell>{formatCurrency(12)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(180)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Electrical Wire</TableCell>
                      <TableCell>Electrical Depot</TableCell>
                      <TableCell>500 ft</TableCell>
                      <TableCell>{formatCurrency(0.75)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(375)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Drywall (4x8)</TableCell>
                      <TableCell>Home Depot</TableCell>
                      <TableCell>40 sheets</TableCell>
                      <TableCell>{formatCurrency(12.5)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(500)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold" colSpan={4}>
                        Total Materials Cost
                      </TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(2890)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

