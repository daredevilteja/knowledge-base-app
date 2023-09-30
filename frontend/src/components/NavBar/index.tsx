"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  console.log(pathname);
  return (
    <aside className="flex flex-col flex-2 bg-lime-300 px-4 py-3 gap-6">
      <Link
        className={`${
          pathname === "/upload-knowledge" || pathname === "/"
            ? "border border-black p-2 rounded-xl text-center hover:bg-[#417ee6] hover:text-[#f0f4f2] activated"
            : "border border-black p-2 rounded-xl text-center hover:bg-[#417ee6] hover:text-[#f0f4f2]"
        }`}
        href={"/upload-knowledge"}
      >
        Load Data
      </Link>
      <Link
        className={`${
          pathname === "/retrieve-answers"
            ? "border border-black p-2 rounded-xl text-center hover:bg-[#417ee6] hover:text-[#f0f4f2] activated"
            : "border border-black p-2 rounded-xl text-center hover:bg-[#417ee6] hover:text-[#f0f4f2]"
        }`}
        href={"/retrieve-answers"}
      >
        Retrieve Answers
      </Link>
    </aside>
  );
}
