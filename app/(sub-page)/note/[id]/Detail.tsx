import Images from "./Images";
import { JsonValue } from "@prisma/client/runtime/library";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import dayjs from "dayjs";

export default function Detail({
  title,
  content,
  createAt,
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
