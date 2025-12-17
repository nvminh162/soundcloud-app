import { useState } from "react";

interface IProps {
  age: number;
  name: string;
  info: {
    gender: string;
    address: string;
  };
  listTodo: string[];
  setListTodo: (value: string[]) => void;
}

const InputToDo = (abc: IProps) => {
  const { listTodo, setListTodo } = abc;
  const [todoName, setTodoName] = useState("My Todo");

  const handleClick = () => {
    if (!todoName) {
      alert("Empty todo name");
      return;
    }
    setListTodo([...listTodo, todoName]);
    setTodoName("");
  };
  return (
    <div>
      <span>Add new todo</span>
      <div>
        <input
          type="text"
          value={todoName}
          onChange={(event) => {
            setTodoName(event.target.value);
          }}
        />
        &nbsp; &nbsp;
        <button onClick={() => handleClick()}>Save</button>
      </div>
    </div>
  );
};

export default InputToDo;
