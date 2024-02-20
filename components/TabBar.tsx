"use client";

import { TabBar as TabBarRaw } from "antd-mobile";
import {
  AppOutline,
  UserOutline,
  HeartOutline,
  FillinOutline,
} from "antd-mobile-icons";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  {
    key: "/home",
    title: "首页",
    icon: <AppOutline />,
  },
  {
    key: "/like",
    title: "点赞",
    icon: <HeartOutline />,
  },
  {
    key: "/edit",
    title: "发布",
    icon: <FillinOutline />,
  },
  {
    key: "/my",
    title: "我的",
    icon: <UserOutline />,
  },
];

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <TabBarRaw className="bg-slate-100" activeKey={pathname} onChange={(value) => router.push(value)}>
      {tabs.map((item) => (
        <TabBarRaw.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBarRaw>
  );
}
