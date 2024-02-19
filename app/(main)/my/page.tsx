"use client";

import { useProcessResponse, type User } from "@/hooks";
import { Avatar, List } from "antd-mobile";
import { useRouter } from "next/navigation";

import { userAtom } from "@/state";
import { useAtom } from "jotai";
import { useRequest } from "ahooks";

interface Info {
  user: User;
  note: number;
  noteDraft: number;
  browse: number;
}

export default function My() {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const processResponse = useProcessResponse();

  const { data: info } = useRequest(
    async () => {
      const response = await fetch("/api/my");
      const data = await processResponse(response);
      return data.data as Info;
    },
    { refreshDeps: [user] }
  );

  return (
    <div id="my-page">
      <div className="p-2 mt-16 avatar-container">
        <div className="flex">
          <Avatar
            src={info?.user.avatar || ""}
            style={{ "--size": "48px", "--border-radius": "50%" }}
          />
          <div className="ml-2 flex-auto">
            <div className="text-lg font-bold">{info?.user.nickname}</div>
            <div className="text-sm">{info?.user.mobile}</div>
          </div>
        </div>
        <div className="pl-2 mt-4">{info?.user.desc}</div>
      </div>
      <div className="body">
        <List>
          <List.Item
            extra={info?.note && `${info.note}`}
            onClick={() => info?.note && router.push("/note")}
          >
            笔记
          </List.Item>
          <List.Item
            extra={info?.noteDraft && `${info.noteDraft}`}
            onClick={() => info?.noteDraft && router.push("/note/draft")}
          >
            草稿
          </List.Item>
          <List.Item
            extra={info?.browse && `${info.browse}`}
            onClick={() => info?.browse && router.push("/history")}
          >
            足迹
          </List.Item>
        </List>
      </div>
    </div>
  );
}
