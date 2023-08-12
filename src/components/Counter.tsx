import { ChangeEvent, FC, useState } from "react";
import classes from "../styles/Counter.module.scss";

export const Counter: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const increment = () => {
    setCount(count + 1);
  };
  return (
    <div className={classes.content}>
      <h1>{count}</h1>
      <button onClick={increment}>click</button>
      cdfrfrf
      <input type="text" value={text} onChange={handleTextChange} />
      <p>{text}</p>
    </div>
  );
};
