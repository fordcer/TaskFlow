"use client";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import TaskButton from "@/components/dashboard/task-button";
import TaskItem from "@/components/dashboard/task-item";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTasksByStatus, Task } from "@/lib/task-service";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const tasks = await getTasksByStatus("all");
        setTasks(tasks);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  const handleStatusChange = async (status: string) => {
    setIsLoading(true);
    try {
      const filteredTasks = await getTasksByStatus(status);
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Failed to filter tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCompleteTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "completed" ? "in-progress" : "completed",
            }
          : task
      )
    );
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const tabItems = [
    { value: "all", label: "All Tasks" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const tabTriggerClass =
    "rounded-sm p-1 w-24 text-muted-foreground data-[state=active]:text-black data-[state=active]:bg-background dark:data-[state=active]:bg-input dark:data-[state=active]:text-foreground";

  const hasTasks = tasks.length > 0;
  const taskList = hasTasks ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
          onUpdate={handleUpdateTask}
        />
      ))}
    </motion.div>
  ) : (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="task" />
      <EmptyPlaceholder.Title>No tasks created</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        You don&apos;t have any tasks yet.
      </EmptyPlaceholder.Description>
    </EmptyPlaceholder>
  );

  const renderTasks = () => (
    <AnimatePresence mode="popLayout">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-20 rounded-md border border-gray-800 dark:border-white border-dashed animate-pulse bg-muted/50"
            ></div>
          ))}
        </div>
      ) : (
        taskList
      )}
    </AnimatePresence>
  );

  return (
    <DashboardShell>
      <DashboardHeader heading="Tasks" text="Create and manage your tasks.">
        <TaskButton mode="create" />
      </DashboardHeader>
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={handleStatusChange}
      >
        <TabsList className="mb-2 h-10 rounded-sm p-1">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={tabTriggerClass}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">{renderTasks()}</TabsContent>
        <TabsContent value="in-progress">{renderTasks()}</TabsContent>
        <TabsContent value="completed">{renderTasks()}</TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
