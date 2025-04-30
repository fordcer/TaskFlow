"use client";

import { Task, toggleTaskStatus } from "@/lib/task-service";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { CalendarIcon, Check, Clock } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { Button } from "../ui/button";
import TaskDeleteButton from "./task-delete-button";
import TaskButton from "./task-button";
import { toast } from "sonner";

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onUpdate: (updatedTask: Task) => void;
}

export default function TaskItem({
  task,
  onDelete,
  onComplete,
  onUpdate,
}: Readonly<TaskItemProps>) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const updatedTask = await toggleTaskStatus(task.id);
      if (updatedTask) {
        toast(
          updatedTask.status === "in-progress"
            ? "Task marked as in progress"
            : "Task completed",
          {
            description:
              updatedTask.status === "in-progress"
                ? "Your task has been marked as in progress."
                : "Your task has been marked as completed.",
          }
        );

        onComplete(task.id);
      } else {
        throw new Error("Failed to update task status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", {
        description: "Your task status could not be updated. Please try again.",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const priorityColor = {
    low: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50",
    medium:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50",
    high: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
  };

  const isDueDatePast =
    task.dueDate &&
    isPast(new Date(task.dueDate)) &&
    !isToday(new Date(task.dueDate));
  const isDueDateToday = task.dueDate && isToday(new Date(task.dueDate));

  let dueDateStatus: "completed" | "overdue" | "today" | "upcoming";

  if (task.status === "completed") {
    dueDateStatus = "completed";
  } else if (isDueDatePast) {
    dueDateStatus = "overdue";
  } else if (isDueDateToday) {
    dueDateStatus = "today";
  } else {
    dueDateStatus = "upcoming";
  }

  const dueDateColor = {
    completed: "text-gray-500",
    overdue: "text-red-600 dark:text-red-400 font-medium",
    today: "text-yellow-600 dark:text-yellow-400 font-medium",
    upcoming: "text-green-600 dark:text-green-400",
  };

  const renderCardContent = () => {
    return (
      <div>
        <p
          className={
            task.status === "completed" ? "line-through text-gray-500" : ""
          }
        >
          {task.description || "No description provided."}
        </p>
        <div className="mt-4 flex flex-col space-y-2 text-sm">
          {task.dueDate && (
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              <span className={dueDateColor[dueDateStatus]}>
                Due: {format(new Date(task.dueDate), "PPP")}
                {dueDateStatus === "overdue" && " (Overdue)"}
                {dueDateStatus === "today" && " (Today)"}
              </span>
            </div>
          )}

          {task.estimatedHours !== null && (
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <span
                className={task.status === "completed" ? "text-gray-500" : ""}
              >
                Estimated: {task.estimatedHours}{" "}
                {task.estimatedHours === 1 ? "hour" : "hours"}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card
      className={
        task?.status === "completed"
          ? "bg-green-50/50 border-green-200 dark:border-green-900 dark:bg-green-950/20"
          : "bg-gray-50 border-gray-200 dark:border-blue-900 dark:bg-gray-950/20"
      }
    >
      <CardHeader className="flex flex-row justify-between">
        <div className="space-y-1">
          <CardTitle
            className={`${
              task.status === "completed" ? "line-through text-gray-500" : ""
            } text-2xl font-bold`}
          >
            {task.title}
          </CardTitle>
          <CardDescription>
            Created on {new Date(task.createdAt).toLocaleDateString()}
          </CardDescription>
        </div>
        <div className="flex flex-row gap-2">
          <Badge className={priorityColor[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          <TaskButton task={task} onUpdate={onUpdate} mode="update" />
          <TaskDeleteButton
            taskId={task.id}
            taskTitle={task.title}
            onDelete={onDelete}
          />
        </div>
      </CardHeader>
      <CardContent>{renderCardContent()}</CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-gray-500">
          {task.status === "completed" ? "Completed" : "In progress"}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleComplete}
          disabled={isCompleting}
          className={
            task.status === "completed"
              ? "bg-gray-100 dark:bg-gray-800"
              : "bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-900/30"
          }
        >
          <Check className="mr-2 h-4 w-4" />
          {task.status === "completed"
            ? "Mark as in progress"
            : "Mark as completed"}
        </Button>
      </CardFooter>
    </Card>
  );
}
