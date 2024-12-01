import BorrowKey from "@/components/borrow-key";
import PageWrapper from "@/components/page-wrapper";
import { getKey } from "@/lib/db";
import { hasKeyInJar } from "@/lib/actions";

export default async function Page({
  params,
}: {
  params: Promise<{ keyid: string }>;
}) {
  const { keyid } = await params;

  const key = await getKey(keyid);

  if (!key) {
    return (
      <PageWrapper className="w-screen h-screen flex flex-col justify-center items-center gap-4">
        <p className="text-center">This key does not exist.</p>
      </PageWrapper>
    );
  }

  const hasKey = await hasKeyInJar();

  if (hasKey && hasKey.value !== key.id) {
    return (
      <PageWrapper className="w-screen h-screen flex flex-col justify-center items-center gap-4">
        <p className="text-center">
          You cannot borrow this key, because you are already borrowing another
          one.
        </p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="w-screen h-screen flex flex-col justify-center items-center gap-4">
      {!hasKey ? (
        <BorrowKey keyId={keyid} />
      ) : (
        <div>You are borrowing the {key.name} key</div>
      )}
    </PageWrapper>
  );
}
