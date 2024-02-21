import { NavBar, Avatar, Popover } from "antd-mobile";
import { useRouter } from "next/navigation";
import { MoreOutline } from "antd-mobile-icons";
import { Action } from "antd-mobile/es/components/popover";

export default function NavBarWrap({
  avatar,
  nickname,
  isMine,
  id,
  onDeleted,
}: {
  nickname: string;
  avatar: string;
  id: string;
  isMine?: boolean;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const home = {
    key: "home",
    text: "首页",
    icon: null,
    onClick() {
      router.push(`/home`);
    },
  };
  const actions: Action[] = isMine
    ? [
        {
          key: "edit",
          text: "编辑",
          icon: null,
          onClick() {
            router.push(`/edit?id=${id}`);
          },
        },
        {
          key: "delete",
          text: "删除",
          icon: null,
          onClick() {
            onDeleted?.();
          },
        },
        home,
      ]
    : [home];
  return (
    <NavBar
      onBack={router.back}
      style={{
        "--border-bottom": "1px solid #eee",
      }}
      className="bg-slate-100 sticky top-0 z-10"
      left={
        <div className="flex items-center">
          <Avatar
            className="mr-1"
            src={avatar}
            style={{ "--border-radius": "50%", "--size": "28px" }}
          />
          <span>{nickname}</span>
        </div>
      }
      right={
        <Popover.Menu actions={actions} trigger="click">
          <MoreOutline fontSize={24} />
        </Popover.Menu>
      }
    />
  );
}
