import { SignUp } from "@clerk/nextjs";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const role = searchParams.role;
  
  // কনসোলে চেক করার জন্য (সার্ভার টার্মিনালে প্রিন্ট হবে)
  console.log("🔥 Signing up with role parameter:", role);

  const isLawyer = role === "lawyer";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
      <SignUp 
        unsafeMetadata={{
          requestedRole: isLawyer ? "lawyer" : "client",
        }}
        fallbackRedirectUrl={isLawyer ? "/lawyer-dashboard" : "/dashboard"}
      />
    </div>
  );
}