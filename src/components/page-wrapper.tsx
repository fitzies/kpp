import React from "react";

export default function PageWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <main className={`px-8 py-8 ${className}`}>{children}</main>;
}
