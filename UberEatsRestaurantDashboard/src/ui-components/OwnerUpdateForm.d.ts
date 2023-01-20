/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { Owner } from "../models";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type OwnerUpdateFormInputValues = {
    sub?: string;
    isDeleted?: boolean;
};
export declare type OwnerUpdateFormValidationValues = {
    sub?: ValidationFunction<string>;
    isDeleted?: ValidationFunction<boolean>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type OwnerUpdateFormOverridesProps = {
    OwnerUpdateFormGrid?: FormProps<GridProps>;
    sub?: FormProps<TextFieldProps>;
    isDeleted?: FormProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type OwnerUpdateFormProps = React.PropsWithChildren<{
    overrides?: OwnerUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    owner?: Owner;
    onSubmit?: (fields: OwnerUpdateFormInputValues) => OwnerUpdateFormInputValues;
    onSuccess?: (fields: OwnerUpdateFormInputValues) => void;
    onError?: (fields: OwnerUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: OwnerUpdateFormInputValues) => OwnerUpdateFormInputValues;
    onValidate?: OwnerUpdateFormValidationValues;
}>;
export default function OwnerUpdateForm(props: OwnerUpdateFormProps): React.ReactElement;
