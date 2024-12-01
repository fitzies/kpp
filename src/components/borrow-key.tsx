"use client";

import { createHolder } from "@/lib/actions";
import { ArrowRight } from "lucide-react";

export default function BorrowKey({ keyId }: { keyId: string }) {
  return (
    <>
      <p>What is your name?</p>
      <form
        className="flex gap-2"
        action={async (data: FormData) => {
          await createHolder(data);
        }}
      >
        <input
          placeholder="Mark Chuang"
          className="text-center border-b border-zinc-800 py-2"
          name="name"
        />
        <input
          type="text"
          name="keyId"
          value={keyId}
          className="hidden"
          onChange={() => {}}
        />
        <button
          className="bg-zinc-800 text-white rounded-md px-2 py-1"
          type="submit"
        >
          <ArrowRight className="scale-75" />
        </button>
      </form>
    </>
  );
}
