import ForgotPassword from "pages/auth/forgotPassword";
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
		id: "settings",
		name: "Settings",
		component: Settings,
		path: "/settings",
		protected: true
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
		id: "forgotPassword",
		name: "Forgot Password",
		component: ForgotPassword,
		path: "/auth/forgotpassword"
	},
	{
		id: "home",
		name: "Home",
		component: Home,
		path: "/"
	}
];

export default pages;
