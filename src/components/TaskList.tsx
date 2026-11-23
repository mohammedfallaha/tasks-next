"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { createTask, deleteTask, listTasks, updateTask } from "@/lib/api";
import { useSession } from "@/lib/session";
import { countOpen } from "@/lib/tasks";
import type { LoadState, Task } from "@/lib/types";

export function TaskList() {
  const router = useRouter();
  const { session, ready, clearSession } = useSession();
  const [state, setState] = useState<LoadState<Task[]>>({ status: "loading" });
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!ready) return; // the browser has not read localStorage yet
    if (session === null) {
      router.replace("/login"); // not logged in: go to the login page instead
      return;
    }
    listTasks(session.token)
      .then((tasks) => setState({ status: "ready", data: tasks }))
      .catch((err: unknown) => setState({ status: "error", message: err instanceof Error ? err.message : String(err) }));
  }, [ready, session, router]);

  if (session === null || state.status === "loading") return <p>Loading...</p>;
  if (state.status === "error") return <p className="text-destructive">{state.message}</p>;
  const { token } = session;
  const tasks = state.data;

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    const task = await createTask(token, title);
    setState({ status: "ready", data: [...tasks, task] });
    setTitle("");
  }
  async function handleToggle(task: Task) {
    const updated = await updateTask(token, task.id, { done: !task.done });
    setState({ status: "ready", data: tasks.map((t) => (t.id === updated.id ? updated : t)) });
  }
  async function handleDelete(id: number) {
    await deleteTask(token, id);
    setState({ status: "ready", data: tasks.filter((t) => t.id !== id) });
  }

  return (
    <>
      <header className="mb-4 flex items-center gap-2">
        <h1 className="flex-1">Tasks</h1>
        <span className="text-sm text-muted-foreground">{session.user.email}</span>
        <Button variant="outline" size="sm" onClick={clearSession}>Log out</Button>
      </header>
      <form className="flex gap-2" onSubmit={handleAdd}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" required />
        <Button type="submit">Add</Button>
      </form>
      <p className="my-3 text-sm text-muted-foreground">{countOpen(tasks)} open</p>
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-3 rounded-md border p-3">
            <Checkbox checked={task.done} onCheckedChange={() => handleToggle(task)} />
            <span className={task.done ? "flex-1 text-muted-foreground line-through" : "flex-1"}>{task.title}</span>
            <Button variant="outline" size="sm" onClick={() => handleDelete(task.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </>
  );
}