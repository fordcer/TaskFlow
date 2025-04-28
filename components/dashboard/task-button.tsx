"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Pencil, Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { createTask, Task, updateTask } from "@/lib/task-service";
import { toast } from "sonner";

interface TaskButtonProps {
  task?: Task;
  onUpdate?: (updatedTask: Task) => void;
  mode: "create" | "update";
}

const formSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.date().optional(),
  estimatedHours: z.string(),
});

export default function TaskButton({
  task,
  onUpdate,
  mode,
}: Readonly<TaskButtonProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      mode === "update" && task
        ? {
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            estimatedHours: task.estimatedHours?.toString() ?? "",
          }
        : {
            title: "",
            description: "",
            priority: "medium",
            dueDate: undefined,
            estimatedHours: "",
          },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const { title, description, priority, dueDate, estimatedHours } = values;

    try {
      if (mode === "update") {
        await handleUpdateTask(values);
      } else {
        await createTask({
          title,
          description,
          priority,
          dueDate: dueDate ? dueDate.toISOString() : null,
          estimatedHours: estimatedHours
            ? Number.parseFloat(estimatedHours)
            : null,
        });

        toast.success("Task created", {
          description: "Your task has been created successfully.",
        });
      }

      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", {
        description: "Your task could not be created. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateTask(values: z.infer<typeof formSchema>) {
    if (!task) {
      throw new Error("Task not found");
    } else if (!onUpdate) {
      throw new Error("onUpdate function not provided");
    }

    const updatedTask = await updateTask(task.id, {
      title: values.title,
      description: values.description,
      priority: values.priority,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      estimatedHours: values.estimatedHours
        ? Number.parseFloat(values.estimatedHours)
        : null,
    });

    if (updatedTask) {
      toast("Task updated", {
        description: "Your task has been updated successfully.",
      });
      onUpdate(updatedTask);
      setIsOpen(false);
    } else {
      throw new Error("Failed to update task");
    }
  }

  const btnTextAction = mode === "create" ? "Create Task" : "Save Changes";
  const btnTextActionLoading = mode === "create" ? "Creating..." : "Saving...";

  const renderForm = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Task title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Task description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Time (hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="Enter estimated hours"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? btnTextActionLoading : btnTextAction}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) form.reset();
      }}
    >
      <DialogTrigger asChild>
        {mode === "update" ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsOpen(true)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit task</span>
          </Button>
        ) : (
          <Button type="button">
            <Plus /> New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task to you list. Fill in the details below.
          </DialogDescription>
          {renderForm()}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
