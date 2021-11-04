import {Formik, FormikHelpers} from 'formik';
import React, {useState} from 'react';
import * as Yup from 'yup';
import cn from 'classnames';
import axios from "axios";
import './index.scss';
import {Button, Container, Image} from "semantic-ui-react";
import {Form, Input, ResetButton, Select, TextArea} from "formik-semantic-ui-react";
import FileInput from "../FileInput";

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Невалидный email').required('Обязательное поле'),
    message: Yup.string().trim().min(10, 'Минимальная длина - 10 символов').required('Обязательное поле'),
    category: Yup.string().min(1).required('Обязательное поле'),
    surname: Yup.string().trim().when('name', {
        is: (name: string) => !name || name.trim().length === 0,
        then: Yup.string().trim().required('Обязательное поле'),
        otherwise: Yup.string()
    }),
    name: Yup.string().trim().when('surname', {
        is: (surname: string) => !surname || surname.trim().length === 0,
        then: Yup.string().trim().required('Обязательное поле'),
        otherwise: Yup.string()
    }),
    file: Yup.object().nullable().shape({
        size: Yup.number().max(2000000),
        type: Yup.string().oneOf(["image/jpeg", "image/png"]),
    })
}, [['name', 'surname']])

interface IFeedbackForm {
    email: string;
    message: string;
    category: string;
    name: string;
    surname: string;
    file: {
        size: number;
        type: string;
        name: string;
        data: string | null;
    } | null;
}

export const initialValues: IFeedbackForm = {
    email: '',
    message: '',
    category: '',
    name: '',
    surname: '',
    file: null
};

const FeedbackForm = () => {
    const [networkError, setNetworkError] = useState(false);

    const handleSubmit = async (values: IFeedbackForm, {resetForm}: FormikHelpers<IFeedbackForm>) => {
        try {
            await axios.post('https://webhook.site/2099961d-817d-4ef5-bd6f-2792184e520e', values);
            setNetworkError(false);
            resetForm();
        } catch (error) {
            setNetworkError(true);
        }
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
            {
                ({values, isSubmitting, setFieldValue}) => (
                    <Form
                        className={cn({'form_disabled': isSubmitting})}
                        onChange={() => setNetworkError(false)}>
                        <Container text textAlign={'center'} className={'form__text'}>
                            Запрос отправляется на <a target='_blank' rel='noreferrer'
                                                      href='https://webhook.site/#!/2099961d-817d-4ef5-bd6f-2792184e520e'>webhook.site</a>
                        </Container>
                        <Input
                            errorPrompt
                            name={'email'}
                            label={'Почта'}
                            placeholder={'test@gmail.com'}
                        />
                        <Input
                            errorPrompt
                            name={'name'}
                            label={'Имя'}
                            placeholder={'Иван'}/>
                        <Input
                            errorPrompt
                            name={'surname'}
                            label={'Фамилия'}
                            placeholder={'Иванов'}/>
                        <Select
                            errorPrompt
                            label={'Выберите тип сообщения'}
                            name={'category'}
                            placeholder={'Не выбрано'}
                            options={[
                                {text: 'Сообщение', value: 'message'},
                                {text: 'Другое', value: 'other'}]}/>
                        <FileInput
                            name={'file'}
                            accept={'image/png, image/jpeg'}/>
                        <Image
                            rounded
                            className={'form__image-preview'}
                            src={values.file?.data || 'https://react.semantic-ui.com/images/wireframe/square-image.png'}/>
                        <TextArea
                            errorPrompt
                            className={'form__message'}
                            name={'message'}
                            placeholder={'Ваше сообщение'}/>
                        <Button
                            fluid
                            positive
                            type={'submit'}
                            negative={networkError}
                            loading={isSubmitting}>
                            {networkError ? 'Попробовать еще раз' : 'Отправить'}
                        </Button>
                        <ResetButton fluid primary>
                            Сбросить форму
                        </ResetButton>
                    </Form>
                )
            }
        </Formik>
    );
};

export default FeedbackForm;
