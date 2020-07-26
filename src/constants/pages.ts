import FormCreator from "pages/form/creator/formCreator";
import FormList from "pages/form/list/formList";
import Home from "pages/home/home";

export type Page = {
	id: string;
	name: string;
	component: React.FC<any>;
	path: string;
	protected?: boolean;
};

const pages: Page[] = [
	{
		id: "formList",
		name: "My Forms",
		component: FormList,
		path: "/forms/list",
		protected: true
	},
	{
		id: "formCreator",
		name: "New Form",
		component: FormCreator,
		path: "/forms/new",
		protected: true
	},
	{
		id: "home",
		name: "Home",
		component: Home,
		path: "/"
	}
];

export default pages;
