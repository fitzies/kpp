export const fetchCache = "force-no-store";

import KeyCard from "@/components/key-card";
import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { getOwner } from "@/lib/db";
import { Key } from "@prisma/client";

export default async function Page() {
  const owner = await getOwner(1);

  if (!owner) {
    return <PageWrapper>This owner does not exist.</PageWrapper>;
  }

  return (
    <PageWrapper className="flex flex-col w-screen justify-center items-center">
      <div className="w-full flex justify-end">
        <Button>Edit Keys</Button>
      </div>
      <div className="w-full grid lg:grid-cols-5 grid-cols-2 gap-2 mt-4">
        {owner.keys.map((key: Key) => (
          <KeyCard value={key} key={key.id} />
        ))}
      </div>
    </PageWrapper>
  );
}
