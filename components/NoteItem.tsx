import Link from "next/link";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import type { NoteType } from "./NoteList";
import { Avatar } from "antd-mobile";
import { HeartFill, HeartOutline } from "antd-mobile-icons";

export default function NoteItem({
  data,
  draft,
  onLike,
}: {
  data: NoteType;
  draft?: boolean;
  onLike?: (id: string, like: boolean) => void;
}) {
  const id = data.note.id;
  const title = data.note.title;
  const list = JSON.parse(data.note.images as string) as ImageUploadItem[];
  // const { width, height } = list[0].extra
  // const dir = width <= height ? "thumb col"
  const url = draft ? `/edit?id=${id}&draft=1` : `/note/${id}`;

  return (
    <div className="note bg-white shadow">
      <Link key={id} href={url}>
        <div className="thumb-container">
          <img className="thumb" alt="image" src={list[0].url} />
        </div>
        <div className="footer">
          <div className="title">{title}</div>
          {!draft && <div className="flex">
            <div className="flex flex-1 items-center">
              <Avatar
                src={data.note.author.avatar}
                style={{ "--border-radius": "50%", "--size": "14px" }}
              />
              <span
                className="ml-1 truncate text-slate-500"
                style={{ width: "22vw" }}
              >
                {data.note.author.nickname}
              </span>
            </div>
            <div
              className="flex items-center text-slate-500"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation()
                onLike?.(id, !data.isMyLike)
              }}
            >
              {data.isMyLike ? (
                <HeartFill fontSize={14} color="red" />
              ) : (
                <HeartOutline fontSize={14} />
              )}
              <span className="ml-1 text-sm">
                {data.likeCount ? data.likeCount : "点赞"}
              </span>
            </div>
          </div>}
        </div>
      </Link>
    </div>
  );
}
