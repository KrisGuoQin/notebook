"use client";
import { Swiper } from "antd-mobile";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";


export default function Images({ images = [] }: { images: ImageUploadItem[] }) {

  return (
    <Swiper>
      {images.map((item, i) => {
        const { width, height } = item.extra
        const cls = width <= height ? "m-auto h-[250px] w-auto" : "w-full m-auto"
        return (
            <Swiper.Item key={i}>
              {/* <div className="w-full flex items-center content-center"> */}
                <img src={item.url} className={cls} alt="" />
              {/* </div> */}
            </Swiper.Item>
          )
      })}
    </Swiper>
  );
}
