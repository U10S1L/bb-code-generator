import Home from "../pages/home/home";
import FormCreator from "../pages/form/creator/formCreator";
import Settings from "../pages/settings/settings";

export type Page = {
    id: string;
    name: string;
    component: React.FC;
    path: string;
};

const pages: Page[] = [
    {
        id: "formCreator",
        name: "New Form",
        component: FormCreator,
        path: "/forms/new"
    },
    {
        id: "settings",
        name: "Settings",
        component: Settings,
        path: "/settings"
    },
    {
        id: "home",
        name: "Home",
        component: Home,
        path: "/"
    }
];

export default pages;
