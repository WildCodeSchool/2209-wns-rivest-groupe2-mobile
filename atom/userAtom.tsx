import { atom } from "recoil";
import { IUser } from "../types/IUser";

export const userState = atom<IUser | null>({
  key: "userState",
  default: null,
});