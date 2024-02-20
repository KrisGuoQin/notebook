import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { TOKEN_MAX_AGE } from "@/const";
import { User } from "prisma/prisma-client";

export interface CodeResult<T> {
  code: number;
  success: boolean;
  message?: string;
  data?: T;
}

export type Code = 400 | 401 | 403 | 404 | 500 | 1000;

const secretKey = process.env.JWT_SECRET_KEY as string;
const salt = process.env.CRYPTO_SALT as string;

export const encryptPwd = (pwd: string) => {
  const password = crypto
    .pbkdf2Sync(pwd, salt, 10, 64, "sha512")
    .toString("hex");

  return password;
};

export const generateToken = (user: User) => {
  return jwt.sign({ user }, secretKey, { expiresIn: TOKEN_MAX_AGE * 1000 });
};

export function verifyToken(token?: string) {
  return new Promise<CodeResult<any>>((resolve) => {
    if (!token) {
      resolve(fail(401));
      return;
    }

    jwt.verify(token, secretKey, (err, data) => {
      if (err || !data) {
        resolve(fail(401));
        return;
      }

      resolve(success<typeof data>(data));
    });
  });
}

export const fail = (code: Code, err?: unknown) => {
  const HttpCode: Record<Code, CodeResult<undefined>> = {
    400: {
      code: 400,
      success: false,
      message: "参数错误",
    },
    401: {
      code: 401,
      success: false,
      message: "未登录",
    },
    403: {
      code: 403,
      success: false,
      message: "权限不足",
    },
    404: {
      code: 404,
      success: false,
      message: "未找到",
    },
    500: {
      success: false,
      code: 500,
      message: "服务器错误",
    },
    1000: {
      code: 1000,
      success: false,
      message: "用户已存在",
    },
  };

  if (err) {
    console.error(code);
    console.error(err);
  }
  return HttpCode[code];
};

export const success = <T extends any>(data: T) => {
  return {
    data,
    code: 0,
    success: true,
    message: "成功",
  } as CodeResult<T>;
};

export const getUserFromToken = async () => {
  const token = cookies().get("token")?.value;
  const res = await verifyToken(token);

  return res.data?.user as User | undefined;
};

export const gerRandom = (min: number, max: number) => {
  const randomNumber = Math.random()
  const difference = max - min + 1
  const random = Math.floor(difference * randomNumber)
  return random + 1
}

export const validateResult = (v: CodeResult<any> | CodeResult<any>[], errorMsg: string) => {
  if (Array.isArray(v)) {
    for (const item of v) {
      if (item.code !== 0) {
        throw Error(`[${errorMsg}]: ${item.message}`)
      }
    }
  } else if (v.code !== 0) {
    throw Error(`[${errorMsg}]: ${v.message}`)
  }
}