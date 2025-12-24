"use client";
import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { handleLoginAntd } from "./actions";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export default function LoginForm() {
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    const res = await handleLoginAntd(values);
    setIsSubmit(false);
    console.log(res);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, marginTop: "50px" }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
