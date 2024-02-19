import { z } from "zod";
import { PrismaClient } from "prisma/prisma-client";
import {
  encryptPwd,
  fail,
  success,
  getUserFromToken,
  gerRandom,
} from "@/utils";

const prisma = new PrismaClient({});
// 获取我所有note
export const getMyNotes = async (authorId: string) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        authorId,
      },
      orderBy: {
        updateAt: "desc",
      },
    });
    return success<typeof notes>(notes);
  } catch (err) {
    return fail(500);
  }
};

// 获取收藏的文章
export const getMyLikeNotes = async ({ userId }: { userId: string }) => {
  try {
    const likeRecords = await prisma.likeRecord.findMany({
      where: {
        userId,
      },
      select: {
        noteId: true,
      },
    });
    const notes = await prisma.note.findMany({
      where: {
        id: { in: likeRecords.map((record) => record.noteId) },
      },
      orderBy: {
        createAt: "desc",
      },
    });
    return success(notes);
  } catch (error) {
    return fail(500, error);
  }
};

// My页面-获取发表了多少篇文章，浏览了多少个文章,多少个草稿
export const getMyCountInfo = async ({ id }: { id: string }) => {
  const [noteCount, draftCount, browseCount] = await Promise.all([
    prisma.note.count({
      where: {
        authorId: id,
      },
    }),
    prisma.noteDraft.count({
      where: {
        authorId: id,
      },
    }),
    prisma.browseRecord.count({
      where: {
        userId: id,
      },
    }),
  ]);

  return success({ noteCount, browseCount, draftCount });
};
