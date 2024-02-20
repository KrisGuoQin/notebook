import {
  StarOutline,
  HeartOutline,
  StarFill,
  HeartFill,
} from "antd-mobile-icons";

export default function Footer({
  likeCount,
  favoriteCount,
  favorite,
  like,
  onLike,
  onFavorite,
}: {
  likeCount?: number;
  favoriteCount: number;
  favorite?: boolean;
  like: boolean;
  onLike?: () => Promise<void>;
  onFavorite?: () => Promise<void>;
}) {
  return (
    <div className=" bg-white fixed bottom-0 left-0 right-0 flex items-center h-[45px]">
      <div className="mr-2 flex items-center">
        <div onClick={onLike} className="mr-1">
          {like ? (
            <HeartFill fontSize={24} color="var(--adm-color-danger)" />
          ) : (
            <HeartOutline fontSize={24} color="var(--adm-color-weak)" />
          )}
        </div>
        <span>{likeCount ? likeCount : "点赞"}</span>
      </div>
      <div className="mr-2 flex items-center">
        <div onClick={onFavorite} className="mr-1">
          {favorite ? (
            <StarFill fontSize={24} color="#facc15" />
          ) : (
            <StarOutline fontSize={24} color="var(--adm-color-weak)" />
          )}
        </div>
        <span>{favoriteCount ? favoriteCount : "收藏"}</span>
      </div>
    </div>
  );
}
