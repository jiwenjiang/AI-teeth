import { createContext } from "react";

export const ChildContext = createContext<{
  child: { len: number };
  updateChild: ({ len: number }) => void;
}>({
  child: { len: 0 },
  updateChild: () => {}
});

export const SystemContext = createContext<{
  systemInfo: { navHeight: number };
  updateSystemInfo: ({ navHeight: number }) => void;
}>({
  systemInfo: { navHeight: 84 },
  updateSystemInfo: () => {}
});
