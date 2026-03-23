"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getWorkLog } from "@/components/custom/utils/api_utils/worklogs/allReq";
import { useAtomValue } from "jotai";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { userAtom } from "@/components/custom/utils/context/state";
import {
  CheckCircle2,
  FileText,
  ArrowRight,
  CalendarDays,
  ListTodo,
  Circle,
  Clock,
  AlertTriangle,
} from "lucide-react";

function getTaskStatusBadge(status: string) {
  if (status === "not-started") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
        <Circle className="h-3 w-3" /> Not Started
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
        <Clock className="h-3 w-3" /> In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="h-3 w-3" /> Complete
    </span>
  );
}

export const NotifCenter = () => {
  const userInfo = useAtomValue(userAtom);

  const { data, isLoading } = useQuery({
    queryKey: ["worklogs", userInfo?.id],
    enabled: !!userInfo?.id,
    queryFn: () => getWorkLog(userInfo?.email),
  });

  if (isLoading) return <p className="p-4 sm:p-10">Loading notifications...</p>;

  const worklogs = data ?? [];

  const allTasks = worklogs.flatMap((log: any) =>
    (log.taskList ?? []).map((task: any) => ({
      ...task,
      worklogName: log.worklogName,
      dateSubmitted: log.dateSubmitted,
    })),
  );

  const incompleteTasks = allTasks.filter(
    (t: any) => t.status === "not-started" || t.status === "in-progress",
  );

  const completedCount = allTasks.filter(
    (t: any) => t.status === "complete",
  ).length;

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl mb-1">
        Notification Center
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Your work log and task summary at a glance
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                {worklogs.length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Submitted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                {allTasks.length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total Tasks
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
              <ListTodo className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                {incompleteTasks.length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                {completedCount}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Work Logs */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <FileText className="h-5 w-5" /> Recent Work Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 flex-1">
            {worklogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-3">
                  No work logs submitted yet.
                </p>
                <Link href="/worklogs">
                  <Button size="sm" className="bg-green-700 hover:bg-green-800">
                    Create First Work Log
                  </Button>
                </Link>
              </div>
            ) : (
              worklogs.slice(0, 4).map((log: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-lg px-4 py-3 flex items-center justify-between gap-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        Week {log.worklogName || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Submitted {log.dateSubmitted} —{" "}
                        {log.taskList?.length ?? 0} task(s)
                      </p>
                    </div>
                  </div>
                  <Link href="/notifications">
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                </div>
              ))
            )}
          </CardContent>
          {worklogs.length > 0 && (
            <CardFooter className="pt-2">
              <Link href="/notifications">
                <Button variant="outline" size="sm" className="gap-1">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>

        {/* Pending Tasks */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <ListTodo className="h-5 w-5" /> Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 flex-1">
            {incompleteTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <CheckCircle2 className="h-10 w-10 text-green-600 mb-3" />
                <p className="text-muted-foreground">All tasks are complete!</p>
              </div>
            ) : (
              incompleteTasks.slice(0, 4).map((task: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold truncate">
                      {task.taskName || "Untitled"}
                    </p>
                    {getTaskStatusBadge(task.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Week {task.worklogName}
                    </span>
                    {task.dueDate && (
                      <span
                        className={`flex items-center gap-1 ${
                          isOverdue(task.dueDate)
                            ? "text-red-600 font-medium"
                            : ""
                        }`}
                      >
                        {isOverdue(task.dueDate) ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <CalendarDays className="h-3 w-3" />
                        )}
                        Due: {task.dueDate}
                      </span>
                    )}
                    {task.collaborators?.filter((c: string) => c).length >
                      0 && <span>With: {task.collaborators.join(", ")}</span>}
                  </div>
                </div>
              ))
            )}
          </CardContent>
          {incompleteTasks.length > 0 && (
            <CardFooter className="pt-2">
              <Link href="/task-trackers">
                <Button variant="outline" size="sm" className="gap-1">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};
