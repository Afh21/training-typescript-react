import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";

import { useTodos } from './useTodos'

const Heading = ({ title }: { title: string }) => <h2>{title}...</h2>;

const Box: React.FunctionComponent = ({ children }) => <div>{children}</div>;

const List: React.FunctionComponent<{
  items: string[];
  onClick?: (item: string) => void;
}> = ({ items, onClick }) => (
  <ul>
    {items.map((item, index) => (
      <li key={index} onClick={() => onClick?.(item)}>
        {item}
      </li>
    ))}
  </ul>
);
interface Payload {
  text: string;
}

const useNumber = (initialValue: number) => useState<number>(initialValue)

type useNumberValue = ReturnType<typeof useNumber>[0]
type useNumberSetValue = ReturnType<typeof useNumber>[1]

const Incrementer: React.FunctionComponent<{
  value: useNumberValue;
  setValue: useNumberSetValue
}> = ({ value, setValue }) => (
  <Button onClick={() => setValue(value + 1)} title={`Add - ${value}`} />
);

const Button: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { title?: string }
> = ({ title, children, ...rest }) => <button style={{ fontSize: "xx-large" }} {...rest}>{title ?? children}</button>;

function App() {
  const { todos, addTodo, removeTodo  } = useTodos([
    { id: 0, done: false, text: "Hello", }
  ])

  const [value, setValue] = useState(0);
  const [payload, setPayload] = useState<Payload | null>(null);
  const newTodoRef = useRef<HTMLInputElement>(null);

  const onListClick = useCallback((item: string) => {
    alert(item);
  }, []);

  useEffect(() => {
    fetch("/db.json")
      .then((resp) => resp.json())
      .then((data) => setPayload(data));
  }, []);

  const onAddTodo = useCallback(() => {
    if (newTodoRef.current) {
      addTodo(newTodoRef.current.value);
      newTodoRef.current.value = "";
    }
  }, [addTodo]);

  

  return (
    <div>
      <Heading title="Intro" />
      <Box>
        <h5>Hello again!</h5>
      </Box>
      <List items={["one", "two", "three"]} onClick={onListClick} />
      <Box>{JSON.stringify(payload)}</Box>

      <Incrementer value={value} setValue={setValue} />

      <Heading title="Todos" />
      {todos.map((todo) => (
        <div key={todo.id}>
          {todo.text}
          <button onClick={() => removeTodo(todo.id)}>
            Remove
          </button>
        </div>
      ))}

      <div>
        <input type="text" ref={newTodoRef} />
        <Button onClick={onAddTodo}>Add Todo</Button>
      </div>
    </div>
  );
}

export default App;
