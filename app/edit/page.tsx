"use client";

import { useAuth, useProcessResponse } from "@/hooks";
import {
  ImageUploader,
  Toast,
  Form,
  Input,
  NavBar,
  TextArea,
  Dialog,
} from "antd-mobile";
import { filter, omit } from "ramda";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import Footer from "./footer";
import { useRequest } from "ahooks";

export default function Edit() {
  useAuth();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const processResponse = useProcessResponse();
  const search = useSearchParams()

  useRequest(async () => {
    const response = await fetch(`/api/edit/detail?${search.toString()}`)
    const { data } = await processResponse(response);

    setFileList(JSON.parse(data.images))
    form.setFieldsValue(omit(['images'], data))
  }, {
    refreshDeps: [search],
    manual: !search.get('id'),
  })

  const urlList = useMemo(
    () => filter((item) => Boolean(item.url), fileList),
    [fileList]
  );

  const getConfig = () => {
    return {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        ...form.getFieldsValue(),
        images: JSON.stringify(urlList),
        id: search.get('id'),
        draft: search.get('draft'),
      }),
    } as RequestInit;
  };

  const handlePublish = async () => {
    if (!urlList.length) {
      Toast.show("请至少使用一张图片");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/edit/publish", getConfig());
      const data = await processResponse(response);

      if (data.data) {
        router.replace(`/home`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);

    try {
      const response = await fetch("/api/edit/uploadImage", {
        body: form,
        method: "POST",
      });
      const data = await processResponse(response);

      return {
        url: data.data.url,
        extra: data.data.dimension,
      };
    } catch (error) {
      Toast.show({
        icon: "fail",
        content: "上传失败",
      });
      return {
        url: "",
      };
    }
  };
  const handleBack = () => {
    if (urlList.length) {
      return Dialog.confirm({
        content: "保存并退出",
        onConfirm: async () => {
          const response = await fetch("/api/edit/draft", getConfig());
          await processResponse(response)
          router.back();
        },
      });
    }
    router.back();
  };
  const handleSaveDraft = () => {
    if (!urlList.length) {
      Toast.show("请至少使用一张图片");
      return;
    }
    Dialog.confirm({
      content: "确定保存笔记至草稿箱吗?",
      onConfirm: async () => {
        const response = await fetch("/api/edit/draft", getConfig());
        await processResponse(response)
        router.replace('/home');
      },
    });
  };

  return (
    <div id="edit-page">
      <NavBar onBack={handleBack} />
      <div className="py-2">
        <ImageUploader
          value={fileList}
          onChange={setFileList}
          upload={handleUpload}
          beforeUpload={beforeUpload}
          style={{ margin: 12 }}
        />
        <Form form={form} mode="card">
          <Form.Item name={"title"}>
            <Input
              style={{ "--font-size": "14px" }}
              placeholder="填写标题会有更多赞哦~"
            />
          </Form.Item>
          <Form.Item name={"content"}>
            <TextArea
              style={{ "--color": "#666", "--font-size": "14px" }}
              autoSize={{ minRows: 8 }}
              placeholder="请输入内容"
            />
          </Form.Item>
        </Form>
      </div>
      <Footer
        onSubmit={handlePublish}
        onDraft={handleSaveDraft}
        loading={loading}
      />
    </div>
  );
}

function beforeUpload(file: File) {
  if (file.size > 1024 * 1024 * 5) {
    Toast.show("请选择小于 1M 的图片");
    return null;
  }
  return file;
}
