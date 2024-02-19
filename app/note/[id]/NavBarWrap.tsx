"use client";

import { NavBar } from "antd-mobile";
import { HeartOutline } from "antd-mobile-icons";
import { useRouter } from "next/navigation";
import { type CodeResult } from '@/utils';
import { useProcessResponse } from "@/hooks";

export default function NavBarWrap({
  title,
  like,
  id,
}: {
  title: string;
  like: boolean;
  id: string;
}) {
  const router = useRouter();
  const processResponse = useProcessResponse();

  const handleLike = async () => {
    try {
      const response = await fetch("/api/note", {
        method: "POST",
        body: JSON.stringify({
          id,
          like: !like,
        }),
      });

      await processResponse(response) as CodeResult<undefined>;
      router.refresh()
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NavBar
      style={{
        "--border-bottom": "1px solid #eee",
      }}
      className="bg-white sticky top-0 z-10"
      onBack={router.back}
      right={
        <HeartOutline
          fontSize={24}
          onClick={handleLike}
          color={like ? "var(--adm-color-danger)" : "var(--adm-color-weak)"}
        />
      }
    >
      {title}
    </NavBar>
  );
}
