import FormCreator from "pages/form/creator/formCreator";
import FormList from "pages/form/list/formList";
import Home from "pages/home/home";
import Settings from "pages/settings/settings";
import SignIn from "pages/auth/signIn";
import SignUp from "pages/auth/signUp";

export type Page = {
	id: string;
	name: string;
	component: React.FC<any>;
	path: string;
};

const pages: Page[] = [
	{
		id: "formList",
		name: "My Forms",
		component: FormList,
		path: "/forms/list"
	},
	{
		id: "formCreator",
		name: "Add Form",
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
		id: "signIn",
		name: "Sign In",
		component: SignIn,
		path: "/auth/signin"
	},
	{
		id: "signUp",
		name: "Sign Up",
		component: SignUp,
		path: "/auth/signup"
	},
	{
		id: "home",
		name: "Home",
		component: Home,
		path: "/"
	}
];

export default pages;
