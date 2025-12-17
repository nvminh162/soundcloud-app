const SbhComponent = () => {
  const name = "quyhp";
  const age = 23;

  const info = {
    name: "quyhp",
    age: 23,
  };

  const array = [1, 23, 4, true];
  return (
    <div>
      <h1
        style={{
          borderRadius: "8px",
          background: "green",
          border: "1px solid",
          padding: "6px 12px",
        }}
      >
        Hello {name}, age {age}
      </h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>{JSON.stringify(info)} </li>
        <li>{JSON.stringify(array)} </li>
        <li>Improve the spectrum technology</li>
      </ul>
    </div>
  );
};

export default SbhComponent;
