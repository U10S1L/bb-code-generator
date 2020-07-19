import app from "firebase/app";
import { createContext } from "react";

const FirebaseContext = createContext<app.app.App | null | unknown>(null);
export default FirebaseContext;
