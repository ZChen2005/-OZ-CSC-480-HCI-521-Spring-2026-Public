"use client";
import { NotifCenter } from "@/components/custom/screen/home/NotifCenter";
import Welcome from "@/components/custom/screen/home/Welcome";
// import { InstructorDashboard } from "@/components/custom/screen/home/InstructorDashboard";
import { useAtomValue } from "jotai";
import { userAtom } from "@/components/custom/utils/context/state";
const Page = () => {
  const userInfo = useAtomValue(userAtom);

  return (
    <div className="w-full h-full overflow-y-auto p-10">
      <Welcome />
      <NotifCenter />
    </div>
  );
};

export default Page;
