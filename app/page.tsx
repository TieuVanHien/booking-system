import Image from "next/image";
import RegisterPage from "@/pages/register";
import LoginPage from "@/pages/login";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello</h1>
      <LoginPage />
      <RegisterPage />
    </main>
  );
}
