export default function HomePage() {
  const handleLogin = async (formData: FormData) => {
    "use server";
    console.log(`check form data`, formData.get('password'));
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
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
