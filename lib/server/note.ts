import { z } from "zod";
import { PrismaClient } from "prisma/prisma-client";
import {
  encryptPwd,
  fail,
  success,
  getUserFromToken,
  gerRandom,
} from "@/utils";

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

export interface Note {
    id: string;
    title: string;
    images: string;
    content: string;
    createAt: Date;
    updateAt: Date;
    authorId: string;
}

const prisma = new PrismaClient({});

// 新建note
export const addNote = async (data: {
  title: string;
  content: string;
  authorId: string;
  images: string;
}) => {
    console.log('data', data)
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
export const getNote = async ({ id }: { id: string }) => {
  console.log("note", id);
  try {
    const [note, user] = await Promise.all([
      prisma.note.findFirst({
        where: {
          id,
        },
      }),
      getUserFromToken(),
    ]);

    if (!note) {
      return fail(404);
    }

    let noteRet = {
      ...note,
      like: false,
    };

    if (user?.id) {
      const record = await prisma.likeRecord.findFirst({
        where: {
          userId: user.id,
          noteId: id,
        },
      });
      if (record) {
        noteRet.like = true;
      }
    }

    return success<typeof noteRet>(noteRet);
  } catch (err) {
    return fail(500);
  }
};

export const updateNote = async (data: {
    id: string,
  title: string;
  content: string;
  authorId: string;
  images: string;
}) => {
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
export const getAllNotes = async () => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        updateAt: "desc",
      },
    });
    return success<typeof notes>(notes);
  } catch (err) {
    return fail(500);
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
