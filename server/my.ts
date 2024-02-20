import { PrismaClient } from "prisma/prisma-client";
import { fail, success } from "@/utils";
import { getNoteLikeCountAndFavorite } from ".";

const prisma = new PrismaClient({});
// 获取我所有note
export const getMyNotes = async (authorId: string) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        authorId,
        isDeleted: false,
      },
      include: {
        author: {
          select: {
            avatar: true,
            nickname: true,
          }
        }
      },
      orderBy: {
        updateAt: "desc",
      },
    });

    return getNoteLikeCountAndFavorite({ notes, userId: authorId })
  } catch (err) {
    return fail(500);
  }
};

// 获取我点赞过的文章
export const getMyLikeNotes = async ({ userId }: { userId: string }) => {
  try {
    const likeRecords = await prisma.likeRecord.findMany({
      where: {
        userId,
      },
      select: {
        noteId: true,
      },
      orderBy: {
        createAt: "desc",
      },
    });
    const notes = await prisma.note.findMany({
      where: {
        id: { in: likeRecords.map((record) => record.noteId) },
      },
      include: {
        author: {
          select: {
            avatar: true,
            nickname: true,
          },
        },
      },
    });

    return getNoteLikeCountAndFavorite({ notes, userId });
  } catch (error) {
    return fail(500, error);
  }
};

// 获取我收藏过的文章
export const getMyFavoriteNotes = async ({ userId }: { userId: string }) => {
  try {
    const favoriteRecords = await prisma.favoriteRecord.findMany({
      where: {
        userId,
      },
      select: {
        noteId: true,
      },
      orderBy: {
        createAt: "desc",
      },
    });
    const notes = await prisma.note.findMany({
      where: {
        isDeleted: false,
        id: { in: favoriteRecords.map((record) => record.noteId) },
      },
      include: {
        author: {
          select: {
            avatar: true,
            nickname: true,
          },
        },
      },
    });

    return getNoteLikeCountAndFavorite({ notes, userId })
  } catch (error) {
    return fail(500, error);
  }
};

// 获取我浏览过的文章
export const getMyBrowseNotes = async ({ userId }: { userId: string }) => {
  try {
    const browseRecords = await prisma.browseRecord.findMany({
      where: {
        userId,
      },
      select: {
        noteId: true,
      },
      orderBy: {
        createAt: "desc",
      },
    });
    const notes = await prisma.note.findMany({
      where: {
        id: { in: browseRecords.map((record) => record.noteId) },
        authorId: {
          not: userId,
        },
      },
      include: {
        author: {
          select: {
            avatar: true,
            nickname: true,
          },
        },
      },
    });

    return getNoteLikeCountAndFavorite({ notes, userId })
  } catch (error) {
    return fail(500, error);
  }
};

// My页面-获取发表了多少篇文章，浏览了多少个文章,多少个草稿
export const getMyCountInfo = async ({ userId }: { userId: string }) => {
  const [noteCount, draftCount, browseCount, likeCount, favoriteCount] =
    await Promise.all([
      prisma.note.count({
        where: {
          authorId: userId,
          isDeleted: false,
        },
      }),
      prisma.noteDraft.count({
        where: {
          authorId: userId,
        },
      }),
      prisma.browseRecord.count({
        where: {
          userId,
        },
      }),
      prisma.likeRecord.count({
        where: {
          userId,
        },
      }),
      prisma.favoriteRecord.count({
        where: {
          userId,
        },
      }),
    ]);

  return success({
    noteCount,
    browseCount,
    draftCount,
    likeCount,
    favoriteCount,
  });
};

// 文章是否被我点赞
export const getNoteIsMyLike = async ({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) => {
  try {
    const res = await prisma.likeRecord.findFirst({
      where: {
        noteId,
        userId,
      },
    });

    return success(Boolean(res));
  } catch (error) {
    return fail(500, error);
  }
};

// 文章是否被我收藏
export const getNoteIsMyFavorite = async ({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) => {
  try {
    const res = await prisma.favoriteRecord.findFirst({
      where: {
        noteId,
        userId,
      },
    });

    return success(Boolean(res));
  } catch (error) {
    return fail(500, error);
  }
};

// 产生一条浏览记录
export const createBrowseRecord = async ({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) => {
  try {
    const record = await prisma.browseRecord.findFirst({
      where: {
        noteId,
        userId,
      },
    });

    if (record) {
      await prisma.browseRecord.update({
        where: {
          id: record.id,
        },
        data: {
          noteId,
          userId,
        },
      });
    } else {
      await prisma.browseRecord.create({
        data: {
          noteId,
          userId,
        },
      });
    }

    return success(null);
  } catch (error) {
    return fail(500, error);
  }
};
