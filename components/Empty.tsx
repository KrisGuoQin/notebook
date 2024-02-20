import { ErrorBlock, type ErrorBlockProps } from "antd-mobile";
import Link from "next/link";

export default function Empty(props: ErrorBlockProps) {
  return (
    <ErrorBlock
      status="empty"
      title={
        <div>
          暂无数据，去
          <Link href={"/home"} replace>
            首页
          </Link>
          看看吧
        </div>
      }
      description=""
      {...props}
    ></ErrorBlock>
  );
}
