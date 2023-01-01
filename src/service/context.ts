import { createContext } from "react";

export const ChildContext = createContext<{
  child: { len: number };
  updateChild: ({ len: number }) => void;
}>({
  child: { len: 0 },
  updateChild: () => { }
});

export const SystemContext = createContext<{
  systemInfo: { navHeight: number };
  updateSystemInfo: ({ navHeight: number }) => void;
}>({
  systemInfo: { navHeight: 84 },
  updateSystemInfo: () => { }
});

export const NavContext = createContext<{
  nav: {
    skip: boolean,
    // 1: 龋齿检测
    // 2: 早期预警
    prevPageType: number,
  };
  updateNav: ({
    skip,
    prevPageType,
  }) => void;
}>({
  nav: {
    skip: false,
    prevPageType: 0,
  },
  updateNav: () => { },
});