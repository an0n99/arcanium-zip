import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="mt-2 h-4 w-[400px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Filters sidebar skeleton */}
        <Card className="md:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-[100px]" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <div className="pt-4">
                <Skeleton className="h-4 w-full" />
                <div className="mt-2 flex items-center justify-between">
                  <Skeleton className="h-4 w-[50px]" />
                  <Skeleton className="h-4 w-[50px]" />
                </div>
              </div>
            </div>

            <Skeleton className="h-[1px] w-full" />

            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Projects list skeleton */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[150px]" />
          </div>

          <div className="grid gap-4">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Skeleton className="h-6 w-[250px]" />
                        <Skeleton className="mt-1 h-4 w-[150px]" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Skeleton className="h-6 w-[60px]" />
                          <Skeleton className="h-6 w-[80px]" />
                          <Skeleton className="h-6 w-[70px]" />
                          <Skeleton className="h-6 w-[90px]" />
                        </div>
                      </div>
                    </div>

                    <Skeleton className="my-4 h-[1px] w-full" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-[50px]" />
                        <Skeleton className="h-4 w-[60px]" />
                        <Skeleton className="h-4 w-[70px]" />
                      </div>
                      <Skeleton className="h-10 w-[150px]" />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

