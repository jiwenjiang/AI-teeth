import { createContext } from "react";

export const ChildContext = createContext<{
  child: { len: number };
  updateChild: ({ len: number }) => void;
}>({
  child: { len: 0 },
  updateChild: () => {}
});
