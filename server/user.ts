import { z } from "zod";
import { PrismaClient } from "prisma/prisma-client";
import {
  encryptPwd,
  fail,
  success,
  gerRandom,
} from "@/utils";

const userSchema = z.object({
  mobile: z.string().length(11, "格式不对"),
  password: z.string().min(6, "密码至少6为"),
});

const prisma = new PrismaClient({});

// 用户
// 新建用户
export const addUser = async (data: { mobile: string; password: string }) => {
  const { mobile, password } = data;
  const result = userSchema.safeParse(data);

  if (!result.success) {
    return fail(400);
  }

  const user = await prisma.user.findFirst({
    where: {
      mobile,
    },
  });

  if (user) {
    return fail(1000);
  }

  try {
    const user = await prisma.user.create({
      data: {
        mobile,
        avatar: `/avatar/${gerRandom(1, 12)}.png`,
        nickname: mobile,
        desc: "来一段有趣的简介吧",
        password: encryptPwd(password),
      },
    });
    return success(user);
  } catch (err) {
    return fail(500);
  }
};

// 登录获取用户
export const getUser = async (data: { mobile: string; password: string }) => {
  const { mobile, password } = data;
  const result = userSchema.safeParse(data);

  if (!result.success) {
    return fail(400);
  }

  const pwd = encryptPwd(password);
  const user = await prisma.user.findFirst({
    where: {
      mobile,
      password: pwd,
    },
    select: {
      id: true,
      mobile: true,
      nickname: true,
      avatar: true,
      desc: true,
    },
  });

  if (!user) {
    return fail(404);
  }

  return success(user);
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        nickname: true,
        avatar: true,
      }
    })
    return success(user)
  } catch (error) {
    return fail(500, error)
  }
}