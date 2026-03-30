"use client";
import { Notification } from "@/components/custom/screen/notification/Notification";

import { userAtom } from "@/components/custom/utils/context/state";
import { useAtomValue } from "jotai";
const NotificationsPage = () => {
  const userInfo = useAtomValue(userAtom);
  if (userInfo && userInfo.role == "instructor") {
    return <h1>sorry you do not have access to this page</h1>;
  }
  return <Notification />;
};

export default NotificationsPage;
