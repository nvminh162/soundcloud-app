"use client";

import { SubmitButton } from "@/components/submit.button";
import { handleLogin } from "@/app/user/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { message } from "antd";

export default function HomePage() {
  const [state, formAction] = useFormState(handleLogin, {});

  useEffect(() => {
    if(state?.data?.access_token) {
      message.success("LOGIN OK");
    } else {
      message.error(state?.message);
    }
  }, [state])

  return (
    <div style={{ marginLeft: 200 }}>
      <h2>HTML Forms</h2>

      <form action={formAction}>
        <label>Username:</label>
        <br />
        <input type="text" name="username" />
        <br />
        <br />
        <label>Password:</label>
        <br />
        <input type="text" name="password" />
        <br />
        <br />
        {/* <input type="submit" value="Submit" /> */}
        {/* <div>{JSON.stringify(state)}</div> */}
        <SubmitButton />
      </form>
    </div>
  );
}
