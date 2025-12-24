'use client'

import { SubmitButton } from "@/components/submit.button";
import { handleLogin } from '@/app/user/actions'

export default function HomePage() {
  return (
    <div style={{ marginLeft: 200 }}>
      <h2>HTML Forms</h2>

      <form action={handleLogin}>
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
        <SubmitButton />
      </form>
    </div>
  );
}
