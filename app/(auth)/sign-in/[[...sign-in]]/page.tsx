import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
      {/* ক্লার্কের ডিফল্ট অফিশিয়াল সাইন-ইন কম্পোনেন্ট */}
      <SignIn />
    </div>
  );
}