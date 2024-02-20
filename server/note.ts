import { z } from "zod";
import { type Note, PrismaClient } from "prisma/prisma-client";
import { fail, success, validateResult } from "@/utils";
import { getNoteIsMyLike } from './my'
import { JsonValue } from "@prisma/client/runtime/library";

export const noteSchema = z.object({
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  images: z.string(),
});

export interface NoteParams {
  title: string;
  images: string;
  content: string;
  authorId: string;
}

const prisma = new PrismaClient({});

// 新建note
export const addNote = async (data: {
  title: string;
  content: string;
  authorId: string;
  images: JsonValue;
}) => {
  console.log("data", data);
  const result = noteSchema.safeParse(data);
  if (!result.success) {
    return fail(400, result.error);
  }

  try {
    const note = await prisma.note.create({
      data,
    });

    return success<typeof note>(note);
  } catch (err) {
    return fail(500, err);
  }
};

// 获取note
export const getNote = async ({ noteId }: { noteId: string }) => {
  console.log("note", noteId);
  try {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
      },
      include: {
        author: {
          select: {
            id: true,
            avatar: true,
            nickname: true,
          },
        },
      },
    });

    if (!note) {
      return fail(404);
    }

    return success<typeof note>(note);
  } catch (err) {
    return fail(500);
  }
};
// 删除note
export const removeNote = async ({ noteId, authorId }: { noteId: string; authorId: string }) => {
  console.log('noteId', noteId, authorId)
  try {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        authorId,
      }
    })
    if (note) {
      console.log('note', note)
      await Promise.all([
        prisma.note.update({
          where: {
            id: noteId,
          },
          data: {
            isDeleted: true,
          }
        }),
        prisma.likeRecord.deleteMany({
          where: {
            noteId,
          }
        }),
        prisma.favoriteRecord.deleteMany({
          where: {
            noteId,
          }
        }),
        prisma.browseRecord.deleteMany({
          where: {
            noteId,
          }
        }),
      ])
    } else {
      return fail(404)
    }
    return success(null)
  } catch (error) {
    return fail(500, error)
  }
}
// 更新Note
export const updateNote = async (data: Note) => {
  const result = noteSchema.safeParse(data);
  if (!result.success) {
    return fail(400, result.error);
  }

  try {
    const note = await prisma.note.update({
      where: {
        id: data.id,
      },
      data,
    });

    return success<typeof note>(note);
  } catch (err) {
    return fail(500, err);
  }
};

// Home页面-获取所有note
export const getAllNotes = async ({ userId }: { userId?: string }) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        isDeleted: false,
        authorId: {
          not: userId,
        }
      },
      orderBy: {
        updateAt: "desc",
      },
      include: {
        author: {
          select: {
            avatar: true,
            nickname: true,
          }
        }
      }
    });

    return getNoteLikeCountAndFavorite({ userId, notes })
  } catch (err) {
    return fail(500, err);
  }
};

// 点赞/取消点赞
export const likeNote = async ({
  noteId,
  like,
  userId,
}: {
  noteId: string;
  like: boolean;
  userId: string;
}) => {
  try {
    if (like) {
      await prisma.likeRecord.create({
        data: {
          noteId,
          userId,
        },
      });
    } else {
      await prisma.likeRecord.deleteMany({
        where: {
          noteId,
          userId,
        },
      });
    }
    return success(undefined);
  } catch (err) {
    return fail(500);
  }
};

// 收藏/取消收藏
export const favoriteNote = async ({
  noteId,
  favorite,
  userId,
}: {
  noteId: string;
  favorite: boolean;
  userId: string;
}) => {
  try {
    if (favorite) {
      await prisma.favoriteRecord.create({
        data: {
          noteId,
          userId,
        },
      });
    } else {
      await prisma.favoriteRecord.deleteMany({
        where: {
          noteId,
          userId,
        },
      });
    }
    return success(undefined);
  } catch (err) {
    return fail(500);
  }
};

// note被点赞的次数
export const getNoteLikeCount = async ({ noteId }: { noteId: string }) => {
  try {
    const count = await prisma.likeRecord.count({
      where: {
        noteId,
      },
    });
    return success(count);
  } catch (error) {
    return fail(500);
  }
};

// note被收藏的次数
export const getNoteFavoriteCount = async ({ noteId }: { noteId: string }) => {
  try {
    const count = await prisma.favoriteRecord.count({
      where: {
        noteId,
      },
    });
    return success(count);
  } catch (error) {
    return fail(500);
  }
};

// 根据notes获取每个note的点赞数，是否我点赞了
export const getNoteLikeCountAndFavorite = async ({ notes,userId}: {notes: Note[], userId?: string}) => {
  const likeCounts = await Promise.all(notes.map(note => {
    return getNoteLikeCount({ noteId: note.id })
  }))

  validateResult(likeCounts, '获取点赞数')

  if (userId) {
    const isMyLikes = await Promise.all(notes.map(note => {
      return getNoteIsMyLike({ noteId: note.id, userId })
    }))
    validateResult(isMyLikes, '获取我是否点赞')

    const finalResult = notes.map((note, i) => {
      const likeCount = likeCounts[i]
      const isMyLike = isMyLikes[i]

      return {
        note,
        likeCount: likeCount.data,
        isMyLike: isMyLike.data,
      }
    })
    return success<typeof finalResult>(finalResult);
  } else {
    const finalResult = notes.map((note, i) => {
      const likeCount = likeCounts[i]

      return {
        note,
        likeCount: likeCount.data,
        isMyLike: false,
      }
    })
    return success<typeof finalResult>(finalResult);
  }
}