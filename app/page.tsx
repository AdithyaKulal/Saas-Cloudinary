import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  // If not signed in, go to the sign-in page
  if (!userId) {
    redirect("/sign-in");
  }

  // If signed in, send them to the main app home
  redirect("/home");
}
