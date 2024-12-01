import PageWrapper from "@/components/page-wrapper";

export default async function Page() {
  return (
    <PageWrapper className="w-screen h-screen flex flex-col justify-center items-center gap-4">
      <p>You are currently holding no keys.</p>
    </PageWrapper>
  );
}
