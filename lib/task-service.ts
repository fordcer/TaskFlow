// This is a mock task service
// In a real app, you would use a proper database

// Task type definition
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  estimatedHours: number | null;
  createdAt: string;
  updatedAt: string;
}

// Mock task data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Write and submit the project proposal for the new client.",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    estimatedHours: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Review code changes",
    description: "Review pull requests and provide feedback.",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    estimatedHours: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update the project documentation with the latest changes.",
    status: "completed",
    priority: "low",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    estimatedHours: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Fix login bug",
    description: "Investigate and fix the login issue reported by users.",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    estimatedHours: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Prepare for team meeting",
    description: "Create slides and agenda for the weekly team meeting.",
    status: "completed",
    priority: "medium",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    estimatedHours: 1.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Get tasks by status
export async function getTasksByStatus(status: string): Promise<Task[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (status === "all") {
    return [...mockTasks];
  }

  return mockTasks.filter((task) => task.status === status);
}

// Create a new task
export async function createTask(taskData: {
  title: string;
  description: string;
  priority: string;
  dueDate?: string | null;
  estimatedHours?: number | null;
}): Promise<Task> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newTask: Task = {
    id: Math.random().toString(36).substring(2, 9),
    title: taskData.title,
    description: taskData.description,
    status: "in-progress",
    priority: taskData.priority as "low" | "medium" | "high",
    dueDate: taskData.dueDate || null,
    estimatedHours: taskData.estimatedHours || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // In a real app, you would add this to the database
  mockTasks.push(newTask);

  return newTask;
}

// Update a task
export async function updateTask(
  id: string,
  taskData: Partial<Task>
): Promise<Task | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const taskIndex = mockTasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return null;
  }

  const updatedTask = {
    ...mockTasks[taskIndex],
    ...taskData,
    updatedAt: new Date().toISOString(),
  };

  // In a real app, you would update this in the database
  mockTasks[taskIndex] = updatedTask;

  return updatedTask;
}

// Delete a task
export async function deleteTask(id: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const taskIndex = mockTasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  // In a real app, you would delete this from the database
  mockTasks.splice(taskIndex, 1);

  return true;
}
