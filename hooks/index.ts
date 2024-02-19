import { useEffect, useState, useCallback } from "react";
import type { CodeResult } from "@/utils";
import { useAtom } from "jotai";
import { loginVisibleAtom } from "@/state";
import { Toast } from "antd-mobile";

export interface User {
  id: string;
  mobile: string;
  nickname: string;
  avatar: string;
  desc: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const processResponse = useProcessResponse();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth");
        const data = await processResponse(response);

        setUser(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { user, loading };
};

export const useProcessResponse = (config?: { disableToastError: boolean }) => {
  const [, setVisible] = useAtom(loginVisibleAtom);

  return useCallback(async function (response: Response) {
    const data = (await response.json()) as CodeResult<any>;

    if (data.code === 401) {
      setVisible(true);
    }
    if (data.code !== 0) {
      if (!config?.disableToastError) {
        Toast.show({
          icon: "fail",
          content: data.message,
        });
      }
      throw Error(data.message);
    }

    return data;
  }, []);
};
