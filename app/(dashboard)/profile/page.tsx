"use client";
import Head from "next/head";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import UserForm from "./components/user-form";

const UserProfile = () => {
  return (
    <SidebarLayout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="">
        <UserForm />
      </div>
    </SidebarLayout>
  );
};

export default UserProfile;
