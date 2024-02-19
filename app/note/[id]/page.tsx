import { getNote } from "@/lib/server";
import dayjs from "dayjs";
import NavBarWrap from "./NavBarWrap";
import Images from "./Images";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { JsonValue } from "@prisma/client/runtime/library";

export default async function Note({
  params,
}: {
  params: Record<string, string>;
}) {
  const id = params.id;
  const res = await getNote({ id,  });
  const note = res.data;

  if (!note) {
    return <div>not found</div>;
  }

  return (
    <div id="detail-page">
      <NavBarWrap {...note} />
      <Detail {...note} />
    </div>
  );
}

function Detail({
  title,
  createAt,
  content,
  images,
}: {
  title: string;
  createAt: Date;
  content: string;
  images: JsonValue;
}) {
  const list = JSON.parse(images as string) as ImageUploadItem[];
  return (
    <div id="detail-content">
      <Images images={list} />
      <div className="p-4">
        <h3 className="text-lg text-black">{title}</h3>
        <p className="mt-2 leading-6">{content}</p>
        <div className="mt-2 text-sm text-gray-500">
          {dayjs(createAt).format("YYYY-MM-DD")}
        </div>
      </div>
    </div>
  );
}
