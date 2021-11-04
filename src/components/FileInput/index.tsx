import React, {ChangeEvent, useRef} from 'react';
import {useField} from "formik";
import {Button, Icon} from "semantic-ui-react";

interface IProps {
    name: string;
    accept?: string;

    [key: string]: any;
}

const FileInput: React.FC<IProps> = ({name, accept, ...rest}) => {
    const [{value}, meta, {setValue}] = useField(name)
    const input = useRef<HTMLInputElement>(null);
    const clickHandler = () => {
        input.current?.click();
    };
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setValue({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: reader.result,
                })
            }
            if (file) {
                reader.readAsDataURL(file);
            }
        }
    };

    console.log(meta.error);

    return (
        <>
            <input ref={input} className={'visually-hidden'} type="file" accept={accept} onChange={changeHandler}/>
            <Button
                icon
                negative={!!meta.error && meta.touched}
                labelPosition='left'
                type={'button'}
                onClick={clickHandler}
                {...rest}>
                <Icon name='file'/>
                {
                    meta.error && meta.touched ? 'Максимальный размер - 2Мб, формат - jpg или png' : (value?.name || 'Выберите файл')
                }
            </Button>
        </>
    );
};

export default FileInput;
