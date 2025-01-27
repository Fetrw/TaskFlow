"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export function Board() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
  });

  useEffect(() => {
    const savedColumns = localStorage.getItem("taskflow-columns");
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    } else {
      const defaultColumns = [
        {
          id: "todo",
          title: "To Do",
          tasks: [],
        },
        {
          id: "in-progress",
          title: "In Progress",
          tasks: [],
        },
        {
          id: "done",
          title: "Done",
          tasks: [],
        },
      ];
      setColumns(defaultColumns);
      localStorage.setItem("taskflow-columns", JSON.stringify(defaultColumns));
    }
  }, []);

  useEffect(() => {
    if (columns.length > 0) {
      localStorage.setItem("taskflow-columns", JSON.stringify(columns));
    }
  }, [columns]);

  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newColumns = [...columns];
    const sourceColumn = newColumns.find(
      (col) => col.id === source.droppableId
    );
    const destColumn = newColumns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    const [removed] = sourceColumn.tasks.splice(source.index, 1);
    destColumn.tasks.splice(destination.index, 0, removed);

    setColumns(newColumns);
  };

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;

    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: newColumnTitle,
      tasks: [],
    };

    setColumns([...columns, newColumn]);
    setNewColumnTitle("");
  };

  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId));
  };

  const addTask = (columnId: string) => {
    if (!newTask.title?.trim()) return;

    const newColumns = [...columns];
    const column = newColumns.find((col) => col.id === columnId);
    if (!column) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description || "",
      priority: (newTask.priority as "low" | "medium" | "high") || "medium",
    };

    column.tasks.push(task);
    setColumns(newColumns);
    setNewTask({ title: "", description: "", priority: "medium" });
  };

  const updateTask = (
    columnId: string,
    taskId: string,
    updatedTask: Partial<Task>
  ) => {
    const newColumns = [...columns];
    const column = newColumns.find((col) => col.id === columnId);
    if (!column) return;

    const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    column.tasks[taskIndex] = { ...column.tasks[taskIndex], ...updatedTask };
    setColumns(newColumns);
    setEditingTask(null);
  };

  const deleteTask = (columnId: string, taskId: string) => {
    const newColumns = [...columns];
    const column = newColumns.find((col) => col.id === columnId);
    if (!column) return;

    column.tasks = column.tasks.filter((task) => task.id !== taskId);
    setColumns(newColumns);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">My Tasks</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="New column title"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="w-48"
            />
            <Button onClick={addColumn}>
              <Plus className="mr-2 h-4 w-4" /> Add Column
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((column) => (
            <div key={column.id} className="board-column">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">{column.title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteColumn(column.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mb-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask({ ...newTask, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Description"
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) =>
                          setNewTask({
                            ...newTask,
                            priority: value as "low" | "medium" | "high",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button onClick={() => addTask(column.id)}>Add Task</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 min-h-[200px]"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 ${
                              snapshot.isDragging ? "dragging" : ""
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {task.title}
                                  </div>
                                  {task.description && (
                                    <div className="text-sm text-muted-foreground">
                                      {task.description}
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingTask(task)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Edit Task</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Input
                                            placeholder="Task title"
                                            value={editingTask?.title}
                                            onChange={(e) =>
                                              setEditingTask(
                                                editingTask
                                                  ? {
                                                      ...editingTask,
                                                      title: e.target.value,
                                                    }
                                                  : null
                                              )
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Input
                                            placeholder="Description"
                                            value={editingTask?.description}
                                            onChange={(e) =>
                                              setEditingTask(
                                                editingTask
                                                  ? {
                                                      ...editingTask,
                                                      description:
                                                        e.target.value,
                                                    }
                                                  : null
                                              )
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Select
                                            value={editingTask?.priority}
                                            onValueChange={(value) =>
                                              setEditingTask(
                                                editingTask
                                                  ? {
                                                      ...editingTask,
                                                      priority: value as
                                                        | "low"
                                                        | "medium"
                                                        | "high",
                                                    }
                                                  : null
                                              )
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="low">
                                                Low
                                              </SelectItem>
                                              <SelectItem value="medium">
                                                Medium
                                              </SelectItem>
                                              <SelectItem value="high">
                                                High
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <DialogClose asChild>
                                        <Button
                                          onClick={() =>
                                            editingTask &&
                                            updateTask(
                                              column.id,
                                              task.id,
                                              editingTask
                                            )
                                          }
                                        >
                                          Save Changes
                                        </Button>
                                      </DialogClose>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      deleteTask(column.id, task.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  task.priority === "high"
                                    ? "destructive"
                                    : task.priority === "medium"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
