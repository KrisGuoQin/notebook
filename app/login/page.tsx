"use client";

import { Form, Input, Button, Space, Toast } from "antd-mobile";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleClick = async (type: "register" | "login") => {
    try {
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
      if (data.code === 0) {
        router.replace("/home");
      } else {
        Toast.show({
          icon: 'fail',
          content: data.message
        })
        console.error("error", data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <div className="text-2xl text-blue-600 mb-16">小蓝书</div>
      <div className="w-full">
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
          <Form.Item
            label="手机号"
            name={"mobile"}
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            label="密码"
            name={"password"}
            rules={[{ required: true }]}
          >
            <Input type="password" placeholder="请输入密码，至少6位" />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
