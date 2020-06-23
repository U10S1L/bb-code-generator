import React, { createContext, useReducer, useEffect } from "react";
import { userReducer, settingsReducer, formsReducer, UserActions, SettingsActions, FormsActions } from "./reducers";
import { InputComponentProps } from "./types/form";

// Types
export enum SiteTheme {
    LIGHT,
    DARK
}
export type UserType = {
    firstName: string;
    lastName: string;
    badgeNumber: string;
};
export type SettingsType = {
    theme: SiteTheme;
};
export type BBCodeFormType = {
    uniqueId: string;
    slug: string;
    name: string;
    inputComponents: InputComponentProps[];
    rawBBCode: string;
    matchedBBCode: string;
};

// Defaults
const user = {
    firstName: "",
    lastName: "",
    badgeNumber: ""
};
const settings = {
    theme: SiteTheme.DARK
};
const forms: BBCodeFormType[] = [];

// Initial State
type InitialStateType = {
    user: UserType;
    settings: SettingsType;
    forms: BBCodeFormType[];
};
const initialState = (): InitialStateType => {
    const stateString = localStorage.getItem("state");
    if (stateString != null) {
        return JSON.parse(stateString);
    } else {
        return {
            user,
            settings,
            forms
        };
    }
};

const AppContext = createContext<{
    state: InitialStateType;
    dispatch: React.Dispatch<UserActions | SettingsActions | FormsActions>;
}>({ state: initialState(), dispatch: () => null });

const mainReducer = (
    { user, settings, forms }: InitialStateType,
    action: UserActions | SettingsActions | FormsActions
) => ({
    user: userReducer(user, action as UserActions),
    settings: settingsReducer(settings, action as SettingsActions),
    forms: formsReducer(forms, action as FormsActions)
});

const AppProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(mainReducer, initialState());

    useEffect(() => {
        localStorage.setItem("state", JSON.stringify(state));
    }, [state]);

    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
