import { PrismaClient } from "prisma/prisma-client";
import { noteSchema } from "./note";
import {
  encryptPwd,
  fail,
  success,
  getUserFromToken,
  gerRandom,
} from "@/utils";

const prisma = new PrismaClient({});

// 新建noteDraft
export const addNoteDraft = async (data: {
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
    const draft = await prisma.noteDraft.create({
      data,
    });

    return success<typeof draft>(draft);
  } catch (err) {
    return fail(500, err);
  }
};
// 获取Draft
export const getNoteDraft = async ({ id }: { id: string }) => {
  try {
    const [note, user] = await Promise.all([
      prisma.noteDraft.findFirst({
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
// 删除Draft
export const removeNoteDraft = async ({ id }: { id: string }) => {
  try {
    const note = await prisma.noteDraft.delete({
      where: {
        id,
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

// 获取我所有note-draft
export const getMyNoteDrafts = async (authorId: string) => {
  try {
    const notes = await prisma.noteDraft.findMany({
      where: {
        authorId,
      },
      orderBy: {
        createAt: "desc",
      },
    });
    return success<typeof notes>(notes);
  } catch (err) {
    return fail(500);
  }
};
