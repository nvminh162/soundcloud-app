import { SubmitButton } from "@/components/submit.button";

export default function HomePage() {
  const handleLogin = async (formData: FormData) => {
    "use server";
    console.log(`check form data`, formData.get('password'));
    await new Promise(resolve => setTimeout(resolve, 5000));
  };

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
