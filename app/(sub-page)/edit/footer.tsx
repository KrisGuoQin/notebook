import { MailOutline } from "antd-mobile-icons";
import { Button } from "antd-mobile";

export default function Footer({
  onSubmit,
  onDraft,
  loading,
}: {
  onDraft: () => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
}) {
  return (
    <div className="fixed left-0 right-0 bottom-0 bg-slate-100 border-t flex p-2">
      <div
        className="flex flex-col items-center px-2 cursor-pointer"
        style={{ fontSize: 10 }}
        onClick={onDraft}
      >
        <div className="rounded-full bg-slate-100 p-1">
          <MailOutline fontSize={14} />
        </div>
        <div className="text-center mt-1">存草稿</div>
      </div>
      <div className="grow px-2">
        <Button
          block
          loading={loading}
          shape="rounded"
          size="middle"
          color="primary"
          onClick={onSubmit}
        >
          发布笔记
        </Button>
      </div>
    </div>
  );
}
