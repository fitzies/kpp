import PageWrapper from "@/components/page-wrapper";
import { getKey } from "@/lib/db";
import { hasKeyInJar, returnKeyAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export default async function Page({
  params,
}: {
  params: Promise<{ keyid: string }>;
}) {
  const { keyid } = await params;

  const key = await getKey(keyid);
  const hasKey = await hasKeyInJar();

  if (!key) {
    return (
      <PageWrapper className="w-screen h-screen flex flex-col justify-center items-center gap-4">
        This key does not exist.
      </PageWrapper>
    );
  }

  if (!hasKey) {
    return (
      <PageWrapper className="w-screen h-screen flex flex-col justify-center items-center gap-4">
        You are not holding a key
      </PageWrapper>
    );
  }

  if (key && hasKey && key.id !== hasKey.value) {
    return (
      <PageWrapper className="w-screen h-screen flex flex-col justify-center items-center gap-4">
        <p className="text-center">
          You can not return this key, because you are not borrowing this key.
        </p>
      </PageWrapper>
    );
  }

  if (hasKey && hasKey.value === key.id) {
    return (
      <PageWrapper className="w-screen h-screen flex flex-col justify-center items-center gap-4">
        <form action={returnKeyAction}>
          {/* TO DO: Create a form that you click to return the key and call removeFromJar, this is because you can only remove the key in cookies via a server action. After you are done basically... */}
          <input name="key-id" className="hidden" value={key.id} />
          <Button>Return {key.name} Key</Button>
        </form>
      </PageWrapper>
    );

    // await returnKey(key.id, (success, message) => {
    //   if (!success) {
    //     return (
    //       <PageWrapper className="w-screen h-screen flex flex-col justify-center items-center gap-4">
    //         <p className="text-center">{message}</p>
    //       </PageWrapper>
    //     );
    //   } else {
    //     removeKeyFromJar();
    //     return (
    //       <PageWrapper className="w-screen h-screen flex flex-col justify-center items-center gap-4">
    //         Thank you for returning the {key.name} key.
    //       </PageWrapper>
    //     );
    //   }
    // });
  }
}
