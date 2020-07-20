import Firebase from "components/firebase/firebase";
import { createContext } from "react";

const FirebaseContext = createContext<Firebase | null>(null);
export default FirebaseContext;
