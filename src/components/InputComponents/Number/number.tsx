import React from "react";
import { InputTypeProps } from "../../../types/form";

const Number = ({ readOnly, placeholder, val, setVal }: InputTypeProps) => {
    return (
        <input
            value={val}
            onChange={(e) => setVal && setVal(e.target.value)}
            placeholder={placeholder}
            type="number"
            className="form-control"
            readOnly={readOnly}
        />
    );
};

export default Number;
