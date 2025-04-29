"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  ListTodo,
  Loader2,
  PieChart,
  Star,
  TimerOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { type Task, getTasksByStatus } from "@/lib/task-service";
import Link from "next/link";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import TaskButton from "@/components/dashboard/task-button";

export default function DashboardOverviewPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    highPriority: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const allTasks = await getTasksByStatus("all");
        setTasks(allTasks);

        const completed = allTasks.filter(
          (task) => task.status === "completed"
        ).length;
        const inProgress = allTasks.filter(
          (task) => task.status === "in-progress"
        ).length;
        const highPriority = allTasks.filter(
          (task) => task.priority === "high"
        ).length;

        const overdue = allTasks.filter((task) => {
          if (task.status === "completed" || !task.dueDate) return false;
          return new Date(task.dueDate) < new Date();
        }).length;

        setStats({
          total: allTasks.length,
          completed,
          inProgress,
          overdue,
          highPriority,
        });
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [router]);

  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  const highPriorityTasks = tasks
    .filter((task) => task.priority === "high" && task.status !== "completed")
    .slice(0, 3);

  const priorityClasses = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  const priorityBorderClasses = {
    high: "border-red-500",
    medium: "border-yellow-500",
    low: "border-green-500",
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your tasks and progress."
      >
        <TaskButton mode="create" />
      </DashboardHeader>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
                <ListTodo className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.inProgress} in progress
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {completionPercentage}% completion rate
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <TimerOff className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overdue}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.overdue > 0
                    ? "Requires attention"
                    : "All tasks on schedule"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  High Priority
                </CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.highPriority}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.highPriority > 0
                    ? `${Math.round(
                        (stats.highPriority / stats.total) * 100
                      )}% of total tasks`
                    : "No high priority tasks"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Progress</CardTitle>
            <CardDescription>Your overall task completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">Progress</div>
                </div>
                <div className="text-sm font-medium">
                  {completionPercentage}%
                </div>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {stats.total}
                </div>
                <div>Total</div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {stats.completed}
                </div>
                <div>Completed</div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {stats.inProgress}
                </div>
                <div>In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="col-span-4"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Task Distribution</CardTitle>
              <CardDescription>
                Breakdown of your tasks by status and priority
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="flex h-[200px] items-center justify-center">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <PieChart className="h-20 w-20 text-blue-500" />
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-xs">In Progress</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-xs">Completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <BarChart3 className="h-20 w-20 text-purple-500" />
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div className="flex items-center justify-end gap-1">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="text-xs">High</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <span className="text-xs">Medium</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-xs">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="col-span-4 md:col-span-3"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Tasks due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks
                  .filter((task) => {
                    if (task.status === "completed" || !task.dueDate)
                      return false;
                    const dueDate = new Date(task.dueDate);
                    const today = new Date();
                    const inNextWeek = new Date();
                    inNextWeek.setDate(today.getDate() + 7);
                    return dueDate >= today && dueDate <= inNextWeek;
                  })
                  .slice(0, 3)
                  .map((task) => (
                    <div key={task.id} className="flex items-center gap-4">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Due {new Date(task.dueDate!).toLocaleDateString()}
                        </p>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          priorityClasses[task.priority]
                        }`}
                      >
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </div>
                    </div>
                  ))}
                {tasks.filter((task) => {
                  if (task.status === "completed" || !task.dueDate)
                    return false;
                  const dueDate = new Date(task.dueDate);
                  const today = new Date();
                  const inNextWeek = new Date();
                  inNextWeek.setDate(today.getDate() + 7);
                  return dueDate >= today && dueDate <= inNextWeek;
                }).length === 0 && (
                  <div className="flex flex-col items-center justify-center h-24 text-gray-500">
                    <Clock className="h-8 w-8 mb-2" />
                    <p className="text-sm">No upcoming deadlines</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Recent Tasks</TabsTrigger>
            <TabsTrigger value="priority">High Priority</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recently Updated Tasks</CardTitle>
                <CardDescription>
                  Your most recently modified tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTasks.length > 0 ? (
                    recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-4">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <div
                            className={`h-5 w-5 rounded-full border-2 ${
                              priorityBorderClasses[task.priority]
                            }`}
                          />
                        )}
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              task.status === "completed"
                                ? "line-through text-gray-500"
                                : ""
                            }`}
                          >
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Updated{" "}
                            {new Date(task.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard?task=${task.id}`}>View</Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 text-gray-500">
                      <p className="text-sm">No recent tasks</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard">View All Tasks</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="priority" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>High Priority Tasks</CardTitle>
                <CardDescription>
                  Tasks that need your immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {highPriorityTasks.length > 0 ? (
                    highPriorityTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-4">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          {task.dueDate && (
                            <p className="text-xs text-gray-500">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard?task=${task.id}`}>View</Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 text-gray-500">
                      <Star className="h-8 w-8 mb-2" />
                      <p className="text-sm">No high priority tasks</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard">View All Tasks</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
