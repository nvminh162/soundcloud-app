import { useState } from "react";
import "./App.scss";
import InputToDo from "./todo/inputTodo.component";

function App() {
  const [listTodo, setListTodo] = useState(["Todo 1"]);

  return (
    <>
      <InputToDo
        name={"quyhp"}
        age={25}
        info={{
          gender: "male",
          address: "DN",
        }}
        listTodo={listTodo}
        setListTodo={setListTodo}
      />

      <ul>
        {listTodo.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
