import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getHolder } from "@/lib/db";
import { generateQrCode } from "@/lib/utils";
import { Holder, Key } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function KeyCard({ value }: { value: Key }) {
  const qr = await generateQrCode(
    `${process.env.URL}/${value.holderType === "OWNER" ? "borrow" : "return"}/${
      value.id
    }`
  );

  let holder: Holder | null = null;

  if (value.holderId) {
    holder = await getHolder(value.holderId);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger className="!text-left">
          <Card
            className={`cursor-pointer ${
              value.holderType === "HOLDER"
                ? "opacity-50"
                : "hover:-translate-y-1 duration-150"
            }`}
          >
            <CardHeader>
              <CardTitle>{value.name}</CardTitle>
              <CardDescription>
                Number #{value.keyNumber}, {value.numberOfKeys} keys
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <p className="text-zinc-400 italic text-sm">
                {value.holderType === "OWNER"
                  ? "Held by self"
                  : `Held by ${holder?.name}`}
              </p>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {value.holderType === "OWNER"
                ? "Borrow this key"
                : "Return this key"}
            </DialogTitle>
            <DialogDescription>
              After the indiviual has successfully scanned and borrowed/returned
              the key, please refresh this page.
            </DialogDescription>
            <div className="w-full py-4 px-2">
              <img src={qr} className="w-full" />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
