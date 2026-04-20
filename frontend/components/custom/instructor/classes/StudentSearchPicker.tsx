"use client";
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  enrollUser,
  getAllUsers,
  ClassUser,
} from "@/components/custom/utils/api_utils/req/class";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  classID: string;
  existingEmails: string[];
}

type EnrollState =
  | { kind: "pending" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmails(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const piece of raw.split(/[\s,;]+/)) {
    const e = piece.trim().toLowerCase();
    if (!e) continue;
    if (seen.has(e)) continue;
    seen.add(e);
    out.push(e);
  }
  return out;
}

export default function StudentSearchPicker({
  classID,
  existingEmails,
}: Props) {
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, EnrollState>>({});

  const { data: allUsers } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
  });

  const userByEmail = useMemo(() => {
    const m = new Map<string, ClassUser>();
    (allUsers ?? []).forEach((u) => {
      if (u.email) m.set(u.email.toLowerCase(), u);
    });
    return m;
  }, [allUsers]);

  const existingSet = useMemo(
    () => new Set(existingEmails.map((e) => e.toLowerCase())),
    [existingEmails],
  );

  const parsed = useMemo(() => parseEmails(input), [input]);

  const classified = useMemo(() => {
    return parsed.map((email) => {
      const invalid = !EMAIL_RE.test(email);
      const alreadyInClass = existingSet.has(email);
      const user = userByEmail.get(email);
      const unknown = !invalid && !user;
      const notStudent = !!user && user.role !== "student";
      return { email, invalid, alreadyInClass, unknown, notStudent, user };
    });
  }, [parsed, existingSet, userByEmail]);

  const enrollable = classified.filter(
    (c) => !c.invalid && !c.alreadyInClass && !c.unknown && !c.notStudent,
  );

  const enrollMutation = useMutation({
    mutationFn: (email: string) => enrollUser(email, classID),
  });

  const handleInviteAll = async () => {
    if (enrollable.length === 0) return;
    setResults(
      Object.fromEntries(
        enrollable.map((c) => [c.email, { kind: "loading" } as EnrollState]),
      ),
    );

    let successCount = 0;
    for (const c of enrollable) {
      try {
        await enrollMutation.mutateAsync(c.email);
        setResults((prev) => ({
          ...prev,
          [c.email]: { kind: "success" },
        }));
        successCount++;
      } catch (err: any) {
        setResults((prev) => ({
          ...prev,
          [c.email]: {
            kind: "error",
            message: err?.response?.data ?? err?.message ?? "Failed",
          },
        }));
      }
    }

    qc.invalidateQueries({ queryKey: ["roster", classID] });
    qc.invalidateQueries({ queryKey: ["class", classID] });
    qc.invalidateQueries({ queryKey: ["all-users"] });
    qc.invalidateQueries({ queryKey: ["users-from-class", classID] });

    if (successCount > 0) {
      toast.success(
        `Enrolled ${successCount} student${successCount === 1 ? "" : "s"}. Ask them to log out and back in.`,
      );
    }
    if (successCount < enrollable.length) {
      toast.error(
        `${enrollable.length - successCount} student${enrollable.length - successCount === 1 ? "" : "s"} failed to enroll.`,
      );
    }
  };

  const anyLoading = Object.values(results).some((s) => s.kind === "loading");

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Paste student emails separated by commas, spaces, or new lines..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setResults({});
        }}
        rows={4}
        className="min-h-24 text-sm"
      />

      {parsed.length > 0 && (
        <div className="rounded-lg border divide-y text-sm max-h-64 overflow-auto">
          {classified.map((c) => {
            const state = results[c.email];
            let tag: React.ReactNode = null;
            if (state?.kind === "loading") {
              tag = (
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Enrolling...
                </span>
              );
            } else if (state?.kind === "success") {
              tag = (
                <span className="text-xs text-emerald-700 inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Enrolled
                </span>
              );
            } else if (state?.kind === "error") {
              tag = (
                <span className="text-xs text-red-700 inline-flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" />
                  {state.message}
                </span>
              );
            } else if (c.invalid) {
              tag = (
                <span className="text-xs text-red-700">Invalid email</span>
              );
            } else if (c.alreadyInClass) {
              tag = (
                <span className="text-xs text-muted-foreground">
                  Already in class
                </span>
              );
            } else if (c.unknown) {
              tag = (
                <span className="text-xs text-amber-700">No account yet</span>
              );
            } else if (c.notStudent) {
              tag = (
                <span className="text-xs text-amber-700">Not a student</span>
              );
            } else {
              tag = (
                <span className="text-xs text-emerald-700">Ready</span>
              );
            }

            return (
              <div
                key={c.email}
                className="flex items-center justify-between px-3 py-2 gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {c.user?.name ?? c.email}
                  </p>
                  {c.user?.name && (
                    <p className="text-xs text-muted-foreground truncate">
                      {c.email}
                    </p>
                  )}
                </div>
                {tag}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {enrollable.length} ready · {parsed.length - enrollable.length}{" "}
          skipped
        </p>
        <Button
          size="sm"
          disabled={enrollable.length === 0 || anyLoading}
          onClick={handleInviteAll}
          className="cursor-pointer"
        >
          {anyLoading
            ? "Enrolling..."
            : `Invite ${enrollable.length || ""} Student${
                enrollable.length === 1 ? "" : "s"
              }`.trim()}
        </Button>
      </div>
    </div>
  );
}
