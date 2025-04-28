import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { deleteTask } from "@/lib/task-service";
import { toast } from "sonner";

interface TaskDeleteButtonProps {
  taskId: string;
  taskTitle: string;
  onDelete?: (id: string) => void;
}

export default function TaskDeleteButton({
  taskId,
  taskTitle,
  onDelete,
}: Readonly<TaskDeleteButtonProps>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDeleteTask = async () => {
    setIsLoading(true);
    try {
      const success = await deleteTask(taskId);
      if (success) {
        toast("Task deleted", {
          description: "Your task has been deleted successfully.",
        });
        onDelete?.(taskId);
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", {
        description: "Your task could not be deleted. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        onClick={() => setIsOpen(true)}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete task</span>
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task {`"${taskTitle}"`}. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-red-500 dark:bg-red-900 text-white hover:bg-destructive/90 dark:hover:bg-red-900/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
