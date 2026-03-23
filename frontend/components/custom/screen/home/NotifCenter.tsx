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
import { CheckCircle2, FileText, ArrowRight, CalendarDays } from "lucide-react";

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

  return (
    <div className="mr-12 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl mb-1">
        Notification Center
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Your work log and task summary at a glance
      </p>


      {/* Recent Work Logs — full width */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" /> Recent Work Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
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
                {/* <Link href="/notifications">
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link> */}
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
    </div>
  );
};
