"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-service";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().nullable().optional(),
  estimatedHours: z.number().nullable().optional(),
});

type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "in-progress" | "completed";
  priority: Priority;
  dueDate: string | null;
  estimatedHours: number | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

function formatTask(task: any): Task {
  return {
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function getTasksByStatus(status: string): Promise<Task[]> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    let where: any = {
      userId: user.id,
    };

    if (status !== "all") {
      where = {
        ...where,
        status,
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
    });

    return tasks.map(formatTask);
  } catch (error) {
    console.error("Failed to get tasks:", error);
    throw new Error("Failed to get tasks");
  }
}

export async function getTaskById(id: string): Promise<Task | null> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!task) {
      return null;
    }

    return formatTask(task);
  } catch (error) {
    console.error("Failed to get task:", error);
    throw new Error("Failed to get task");
  }
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority: string;
  dueDate?: string | null;
  estimatedHours?: number | null;
}): Promise<Task> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const validatedData = taskSchema.parse(data);

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description ?? "",
        status: "in-progress",
        priority: validatedData.priority,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        estimatedHours: validatedData.estimatedHours ?? null,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return formatTask(task);
  } catch (error) {
    console.error("Failed to create task:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw new Error("Failed to create task");
  }
}

export async function updateTask(
  id: string,
  data: Partial<Task>
): Promise<Task | null> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return null;
    }

    const validatedData = taskSchema.partial().parse(data);

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        status: data.status as "in-progress" | "completed",
        priority: validatedData.priority as "low" | "medium" | "high",
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        estimatedHours: validatedData.estimatedHours,
      },
    });

    revalidatePath("/dashboard");
    return formatTask(task);
  } catch (error) {
    console.error("Failed to update task:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw new Error("Failed to update task");
  }
}

export async function toggleTaskStatus(id: string): Promise<Task | null> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return null;
    }

    const newStatus =
      existingTask.status === "completed" ? "in-progress" : "completed";

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        status: newStatus,
      },
    });

    revalidatePath("/dashboard");
    return formatTask(task);
  } catch (error) {
    console.error("Failed to toggle task status:", error);
    throw new Error("Failed to toggle task status");
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return false;
    }

    await prisma.task.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard");
    return true;
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw new Error("Failed to delete task");
  }
}

export async function getTaskStatistics() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const allTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
    });

    const total = allTasks.length;
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

    return {
      total,
      completed,
      inProgress,
      overdue,
      highPriority,
      completionPercentage:
        total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  } catch (error) {
    console.error("Failed to get task statistics:", error);
    throw new Error("Failed to get task statistics");
  }
}

export async function getUpcomingTasks(limit = 3): Promise<Task[]> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const today = new Date();
    const inOneWeek = new Date();
    inOneWeek.setDate(today.getDate() + 7);

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        status: "in-progress",
        dueDate: {
          gte: today,
          lte: inOneWeek,
        },
      },
      orderBy: {
        dueDate: "asc",
      },
      take: limit,
    });

    return tasks.map(formatTask);
  } catch (error) {
    console.error("Failed to get upcoming tasks:", error);
    throw new Error("Failed to get upcoming tasks");
  }
}

export async function getRecentTasks(limit = 3): Promise<Task[]> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
    });

    return tasks.map(formatTask);
  } catch (error) {
    console.error("Failed to get recent tasks:", error);
    throw new Error("Failed to get recent tasks");
  }
}

export async function getHighPriorityTasks(limit = 3): Promise<Task[]> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        priority: "high",
        status: "in-progress",
      },
      orderBy: {
        dueDate: "asc",
      },
      take: limit,
    });

    return tasks.map(formatTask);
  } catch (error) {
    console.error("Failed to get high priority tasks:", error);
    throw new Error("Failed to get high priority tasks");
  }
}
