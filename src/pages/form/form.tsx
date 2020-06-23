import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import FormRenderer from "../../components/Form/Renderer/formRenderer";
import { AppContext, BBCodeFormType } from "../../context";

type FormParams = {
    slug: string;
};

type FormProps = RouteComponentProps<FormParams>;

const BBCodeForm: React.FC<FormProps> = ({ match }) => {
    const { state } = useContext(AppContext);

    const bbCodeForm: BBCodeFormType = state.forms.find((form) => form.slug === match.params.slug) || {
        uniqueId: "",
        slug: "",
        name: "",
        inputComponents: [],
        rawBBCode: "",
        matchedBBCode: ""
    };

    return <FormRenderer bbCodeForm={bbCodeForm} />;
};

export default withRouter(BBCodeForm);
