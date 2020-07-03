import Home from "../pages/home/home";
import FormCreator from "../pages/form/creator/formCreator";
import Settings from "../pages/settings/settings";
import FormList from "../pages/form/list/formList";

export type Page = {
	id: string;
	name: string;
	component: React.FC<any>;
	path: string;
};

const pages: Page[] = [
	{
		id: "formList",
		name: "Forms",
		component: FormList,
		path: "/forms/list"
	},
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
