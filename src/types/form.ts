export type InputComponentProps = {
    uniqueId: string;
    typeName: "Short Text" | "Long Text" | "Number";
    label?: string; // User-created
    multi?: boolean;
    inputs: InputTypeProps[];
    onChangeInputs?: (inputs: InputTypeProps[]) => void;
};

export type InputTypeProps = {
    type: "shortText" | "longText" | "number";
    uniqueId?: string;
    placeholder?: string;
    readOnly?: boolean;
    val: any;
    setVal?: (val: string) => void;
};
