import { JsonValue } from "@prisma/client/runtime/library";
import Link from "next/link";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";

export default function NoteItem({
  id,
  title,
  images,
  draft,
}: {
  id: string;
  title: string;
  images: JsonValue;
  draft?: boolean;
}) {
  const list = JSON.parse(images as string) as ImageUploadItem[];
  // const { width, height } = list[0].extra
  // const dir = width <= height ? "thumb col"
  const url = draft ? `/edit?id=${id}&draft=1` : `/note/${id}`

  return (
    <div className="note bg-white shadow">
      <Link key={id} href={url}>
        <div className="thumb-container">
          <img className="thumb" alt="image" src={list[0].url} />
        </div>
        <div className="footer">
          <div className="title">{title}</div>
        </div>
      </Link>
    </div>
  );
}
