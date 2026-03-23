"use client";
import { Card } from "@/components/ui/card";
import { useAtomValue } from "jotai";
import { userAtom } from "@/components/custom/utils/context/state";

import Link from "next/link";
import getWorklogDate from "../../utils/func/getDate";
const Welcome = () => {
  const userInfo = useAtomValue(userAtom);
  const name = userInfo?.name || userInfo?.email;
  const worklogdayInfo = getWorklogDate(new Date("2026-01-26"));

  return (
    <div className="w-full space-y-6 pr-15">
      <h1 className="text-4xl">Welcome {name}</h1>
      <p className="text-lg">
        The next weekly work log is due{" "}
        <span className="underline">{worklogdayInfo?.due}</span>.
      </p>
      <Card className="w-full cursor-pointer hover:bg-gray-100 transition-colors mr-10 ">
        <Link href="/worklogs">
          <div className="py-4 text-center text-xl font-medium mr-10">
            Continue This Week's Work Log
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default Welcome;
