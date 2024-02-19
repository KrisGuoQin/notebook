"use client";

import { loginVisibleAtom, userAtom } from "@/state";
import { Form, Input, Button, Space, Dialog, Toast } from "antd-mobile";
import { useAtom } from "jotai";

export const LoginDialog = () => {
  const [form] = Form.useForm();
  const [, setUser] = useAtom(userAtom)
  const [visible, setVisible] = useAtom(loginVisibleAtom);

  const handleClick = async (type: "register" | "login") => {
    try {
      await form.validateFields();

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          type,
          ...form.getFieldsValue(),
        }),
      });

      if (!res.ok) {
        console.error("error", res);
        return;
      }

      const data = await res.json();

      if (data.code !== 0) {
        return Toast.show({
          icon: "fail",
          content: data.message,
        });
      }
      setVisible(false);
      setUser(data.data);
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <Dialog
      visible={visible}
      actions={undefined}
      onClose={() => setVisible(false)}
      title={<div className="text-2xl text-blue-600 mb-4">小蓝书</div>}
      content={
        <Form
          form={form}
          initialValues={{ mobile: "13117873685", password: "123456" }}
          footer={
            <Space align="center" justify="center" block>
              <Button
                color="primary"
                fill="solid"
                onClick={() => handleClick("register")}
              >
                注册
              </Button>
              <Button
                color="primary"
                fill="solid"
                onClick={() => handleClick("login")}
              >
                登录
              </Button>
            </Space>
          }
        >
          <Form.Item label="手机号" name={"mobile"}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="密码" name={"password"}>
            <Input type="password" placeholder="请输入密码，至少6位" />
          </Form.Item>
        </Form>
      }
    />
  );
};
