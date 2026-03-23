"use client";
import { WorkLogForm } from "@/components/custom/screen/worklogform/WorklogForm";
import { userAtom } from "@/components/custom/utils/context/state";
import { useAtomValue } from "jotai";

const page = () => {
  const userInfo = useAtomValue(userAtom);
  if (userInfo && userInfo.role == "instructor") {
    return <h1>sorry you do not have access to this page</h1>;
  }
  return (
    <div className="w-full h-full overflow-y-auto ">
      <WorkLogForm />
    </div>
  );
};

export default page;
