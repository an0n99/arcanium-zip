"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DollarSign,
  CreditCard,
  Download,
  Plus,
  Shield,
  Search,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react"
import Link from "next/link"

type Project = {
  id: number
  name: string
  contractor: string
  totalBudget: number
  paidAmount: number
  remainingAmount: number
  nextPaymentDate?: string
  nextPaymentAmount?: number
}

type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  status: "completed" | "pending" | "failed"
  type: "payment" | "deposit" | "refund" | "release"
  projectId?: number
  contractor?: string
}

type PaymentMethod = {
  id: string
  type: "credit" | "bank"
  name: string
  last4: string
  expiryDate?: string
  isDefault: boolean
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionFilter, setTransactionFilter] = useState("all")

  // Mock data for projects
  const projects: Project[] = [
    {
      id: 1,
      name: "Kitchen Renovation",
      contractor: "ABC Renovations",
      totalBudget: 25000,
      paidAmount: 16250,
      remainingAmount: 8750,
      nextPaymentDate: "Mar 20, 2025",
      nextPaymentAmount: 5000,
    },
    {
      id: 2,
      name: "Bathroom Remodel",
      contractor: "Modern Bathrooms Inc.",
      totalBudget: 12000,
      paidAmount: 3600,
      remainingAmount: 8400,
      nextPaymentDate: "Mar 25, 2025",
      nextPaymentAmount: 4000,
    },
    {
      id: 3,
      name: "Living Room Renovation",
      contractor: "Elite Carpentry",
      totalBudget: 8500,
      paidAmount: 0,
      remainingAmount: 8500,
    },
  ]

  // Mock data for transactions
  const transactions: Transaction[] = [
    {
      id: "TRX-1001",
      date: "Mar 5, 2025",
      description: "Milestone Payment: Plumbing & Electrical",
      amount: 5000,
      status: "completed",
      type: "payment",
      projectId: 1,
      contractor: "ABC Renovations",
    },
    {
      id: "TRX-1002",
      date: "Mar 1, 2025",
      description: "Milestone Payment: Demolition",
      amount: 3500,
      status: "completed",
      type: "payment",
      projectId: 1,
      contractor: "ABC Renovations",
    },
    {
      id: "TRX-1003",
      date: "Feb 20, 2025",
      description: "Initial Deposit",
      amount: 7750,
      status: "completed",
      type: "deposit",
      projectId: 1,
      contractor: "ABC Renovations",
    },
    {
      id: "TRX-1004",
      date: "Mar 10, 2025",
      description: "Initial Deposit",
      amount: 3600,
      status: "completed",
      type: "deposit",
      projectId: 2,
      contractor: "Modern Bathrooms Inc.",
    },
    {
      id: "TRX-1005",
      date: "Mar 20, 2025",
      description: "Milestone Payment: Cabinet Installation",
      amount: 5000,
      status: "pending",
      type: "payment",
      projectId: 1,
      contractor: "ABC Renovations",
    },
    {
      id: "TRX-1006",
      date: "Mar 25, 2025",
      description: "Milestone Payment: Plumbing Rough-In",
      amount: 4000,
      status: "pending",
      type: "payment",
      projectId: 2,
      contractor: "Modern Bathrooms Inc.",
    },
  ]

  // Mock data for payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: "PM-1001",
      type: "credit",
      name: "Visa ending in 4242",
      last4: "4242",
      expiryDate: "05/27",
      isDefault: true,
    },
    {
      id: "PM-1002",
      type: "bank",
      name: "Chase Checking Account",
      last4: "9876",
      isDefault: false,
    },
  ]

  // Calculate escrow balance
  const escrowBalance =
    transactions.filter((t) => t.status === "completed" && t.type === "deposit").reduce((sum, t) => sum + t.amount, 0) -
    transactions.filter((t) => t.status === "completed" && t.type === "payment").reduce((sum, t) => sum + t.amount, 0)

  // Filter transactions based on search and filter
  const filteredTransactions = transactions
    .filter((transaction) => {
      // Filter by search term
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.contractor && transaction.contractor.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filter by type
      const matchesType = transactionFilter === "all" || transaction.type === transactionFilter

      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  // Get upcoming payments
  const upcomingPayments = transactions
    .filter((t) => t.status === "pending")
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Failed</Badge>
      default:
        return null
    }
  }

  const getTypeIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "payment":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "deposit":
        return <ArrowDownRight className="h-4 w-4 text-green-500" />
      case "refund":
        return <ArrowDownRight className="h-4 w-4 text-blue-500" />
      case "release":
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments & Escrow</h1>
          <p className="text-muted-foreground">Manage payments and track your renovation budget.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Payment Method
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Escrow Balance</CardTitle>
            <CardDescription>Funds held in escrow for your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">${escrowBalance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Protected by RenovateEase Escrow</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Budget</CardTitle>
            <CardDescription>Combined budget for all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Budget</span>
                <span className="font-medium">
                  ${projects.reduce((sum, p) => sum + p.totalBudget, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid to Date</span>
                <span className="font-medium">
                  ${projects.reduce((sum, p) => sum + p.paidAmount, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">
                  ${projects.reduce((sum, p) => sum + p.remainingAmount, 0).toLocaleString()}
                </span>
              </div>
              <Progress
                value={
                  (projects.reduce((sum, p) => sum + p.paidAmount, 0) /
                    projects.reduce((sum, p) => sum + p.totalBudget, 0)) *
                  100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Payments</CardTitle>
            <CardDescription>Scheduled payments for your projects</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingPayments.length > 0 ? (
              <div className="space-y-3">
                {upcomingPayments.slice(0, 2).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{payment.description}</p>
                      <p className="text-xs text-muted-foreground">{payment.date}</p>
                    </div>
                    <p className="font-medium">${payment.amount.toLocaleString()}</p>
                  </div>
                ))}
                {upcomingPayments.length > 2 && (
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href="#upcoming">View all {upcomingPayments.length} upcoming payments</Link>
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming payments scheduled.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Project Payments</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>Contractor: {project.contractor}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      ${project.paidAmount.toLocaleString()} / ${project.totalBudget.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Progress value={(project.paidAmount / project.totalBudget) * 100} className="h-2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                      <p className="text-lg font-bold">${project.totalBudget.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Paid to Date</p>
                      <p className="text-lg font-bold">${project.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                      <p className="text-lg font-bold">${project.remainingAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {project.nextPaymentDate && (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Next Payment Due</p>
                          <p className="text-sm text-muted-foreground">{project.nextPaymentDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${project.nextPaymentAmount?.toLocaleString()}</p>
                        <Button size="sm" className="mt-1">
                          Make Payment
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions
                            .filter((t) => t.projectId === project.id)
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 3)
                            .map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell className="text-right">${transaction.amount.toLocaleString()}</TableCell>
                                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/homeowner/projects/${project.id}`}>View Project Details</Link>
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Payment Schedule
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Transaction History</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-10 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select defaultValue={transactionFilter} onValueChange={setTransactionFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="payment">Payments</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="refund">Refunds</SelectItem>
                      <SelectItem value="release">Releases</SelectItem>
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
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No transactions found. Try adjusting your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => {
                        const project = projects.find((p) => p.id === transaction.projectId)
                        return (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.id}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                              {project ? (
                                <Link
                                  href={`/homeowner/projects/${project.id}`}
                                  className="text-primary hover:underline"
                                >
                                  {project.name}
                                </Link>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {getTypeIcon(transaction.type)}
                                <span className="capitalize">{transaction.type}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${transaction.amount.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods for project payments</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {method.type === "credit" ? (
                        <CreditCard className="h-8 w-8 text-primary" />
                      ) : (
                        <DollarSign className="h-8 w-8 text-primary" />
                      )}
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {method.type === "credit" ? `Expires ${method.expiryDate}` : "Bank Account"}
                          {method.isDefault && <span className="ml-2 text-primary">Default</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                <Shield className="inline-block h-4 w-4 mr-1" /> Your payment information is securely stored and
                processed.
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Escrow Account</CardTitle>
              <CardDescription>Information about your RenovateEase Escrow account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <h3 className="font-medium">How Escrow Works</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    RenovateEase Escrow holds your funds securely until project milestones are completed and approved.
                    This protects both you and your contractor throughout the renovation process.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                    <p className="text-lg font-bold">${escrowBalance.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Pending Releases</p>
                    <p className="text-lg font-bold">
                      ${upcomingPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Deposits</p>
                    <p className="text-lg font-bold">
                      $
                      {transactions
                        .filter((t) => t.type === "deposit" && t.status === "completed")
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions
                        .filter((t) => t.type === "deposit" || t.type === "release")
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5)
                        .map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {getTypeIcon(transaction.type)}
                                <span className="capitalize">{transaction.type}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${transaction.amount.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

