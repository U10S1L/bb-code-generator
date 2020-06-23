import { UserType, SettingsType, BBCodeFormType } from "./context";
//  https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm
type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
        ? {
              type: Key;
          }
        : {
              type: Key;
              payload: M[Key];
          }
};

export enum Types {
    // User
    UpdateUser = "UPDATE_USER",
    // Settings
    UpdateSettings = "UPDATE_SETTINGS",
    // Forms
    AddForm = "ADD_FORM",
    UpdateForm = "UPDATE_FORM",
    DeleteForm = "DELETE_FORM"
}

// Payloads
type UserPayload = {
    [Types.UpdateUser]: UserType;
};
type SettingsPayload = {
    [Types.UpdateSettings]: SettingsType;
};
type FormsPayload = {
    [Types.AddForm]: BBCodeFormType;
    [Types.UpdateForm]: BBCodeFormType;
    [Types.DeleteForm]: BBCodeFormType;
};

// Actions
export type UserActions = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];
export type SettingsActions = ActionMap<SettingsPayload>[keyof ActionMap<SettingsPayload>];
export type FormsActions = ActionMap<FormsPayload>[keyof ActionMap<FormsPayload>];

// Reducers
export const userReducer = (state: UserType, action: UserActions): UserType => {
    switch (action.type) {
        case Types.UpdateUser:
            return {
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                badgeNumber: action.payload.badgeNumber
            };
        default:
            return state;
    }
};
export const settingsReducer = (state: SettingsType, action: SettingsActions): SettingsType => {
    switch (action.type) {
        case Types.UpdateSettings:
            return {
                theme: action.payload.theme
            };
        default:
            return state;
    }
};
export const formsReducer = (state: BBCodeFormType[], action: FormsActions): BBCodeFormType[] => {
    console.log(state);
    switch (action.type) {
        case Types.AddForm:
            return state.concat(action.payload);

        case Types.UpdateForm:
            return state.map((origBBCodeForm) => {
                return origBBCodeForm.uniqueId === action.payload.uniqueId ? action.payload : origBBCodeForm;
            });
        case Types.DeleteForm:
            return state.filter((bbCodeForm) => bbCodeForm.uniqueId !== action.payload.uniqueId);

        default:
            return state;
    }
};
