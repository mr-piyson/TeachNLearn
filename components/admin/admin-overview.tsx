"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BookOpen, Users, FileText, Award, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

interface AdminOverviewProps {
  stats: {
    coursesCount: number;
    usersCount: number;
    enrollmentsCount: number;
    certificatesCount: number;
    activity: {
      label: string;
      enrollments: number;
      newCourses: number;
    }[];
  };
}

export default function AdminOverview({ stats }: AdminOverviewProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
            <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.coursesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="size-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.usersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% growth</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enrollments</CardTitle>
            <div className="size-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.enrollmentsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">84% completion rate</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
            <div className="size-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Award className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.certificatesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Issued globally</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Platform Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80 md:h-96 lg:h-112">
          <ChartContainer
            id="admin-activity"
            config={{
              newCourses: { label: "New Courses", color: "hsl(219, 90%, 55%)" },
              enrollments: { label: "Enrollments", color: "hsl(165, 72%, 45%)" },
            }}
            className="h-full w-full"
          >
            <AreaChart data={stats.activity} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fill-newCourses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-newCourses)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-newCourses)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fill-enrollments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-enrollments)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-enrollments)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="label"
                tick={{ fill: "currentColor", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fill: "currentColor", fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend verticalAlign="top" content={<ChartLegendContent />} wrapperStyle={{ paddingBottom: "20px" }} />
              <Area
                type="monotone"
                dataKey="newCourses"
                stroke="var(--color-newCourses)"
                fill="url(#fill-newCourses)"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="enrollments"
                stroke="var(--color-enrollments)"
                fill="url(#fill-enrollments)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
