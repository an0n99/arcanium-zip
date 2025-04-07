import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function MaterialEstimatorLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[150px] mb-2" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[80px] mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[120px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-[80px] mb-1" />
                <Skeleton className="h-3 w-[150px]" />
              </CardContent>
            </Card>
          ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[150px] mb-2" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex-1">
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[50px]" />
            </div>

            <div className="border rounded-md">
              <div className="p-4 border-b">
                <Skeleton className="h-6 w-full" />
              </div>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="p-4 border-b">
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  )
}

