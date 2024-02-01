'use client'
import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from 'yup'
import { filterFormikErrors } from "@/app/utils/formikHelpers";
import { toast } from "react-toastify";
import Link from "next/link";
import { signIn } from "next-auth/react";


const validationSchema = yup.object().shape({
    name: yup.string().required("Name Required"),
    email: yup.string().email("Invalid Email").required("Email Required"),
    password: yup.string().min(8, "Password Must be at least 8 characters").required("Password Required")

})
export default function SignUp() {

    const { values, handleChange, handleBlur, handleSubmit, touched, isSubmitting, errors } = useFormik({
        initialValues: {
            name: '', email: '', password: ''
        },
        validationSchema,
        onSubmit: async (values, action) => {
            action.setSubmitting(true)
            const res = await fetch('/api/users',
                {
                    method: 'POST',
                    body: JSON.stringify(values)
                })

            const { message, error } = await res.json()


            if (res.ok) {
                toast.success(message)
                await signIn('credentials',
                    {
                        email: values.email,
                        password: values.password,
                    })
            }
            if (!res.ok && error) {
                toast.error(error)
            }
        }
    })


    const formErrors: string[] = filterFormikErrors(errors, touched, values)

    const { email, name, password } = values
    type valueKeys = keyof typeof values;
    const error = (name: valueKeys) => {
        return errors[name] && touched[name] ? true : false;
    };
    return (
        <AuthFormContainer title="Create New Account"
            onSubmit={handleSubmit}
        >
            <Input name="name" label="Name"
                onChange={handleChange}
                value={name}
                onBlur={handleBlur}
                error={error("name")}

            />
            <Input name="email" label="Email"
                onChange={handleChange}
                value={email}
                onBlur={handleBlur}
                error={error("email")}
            />
            <Input name="password" label="Password" type="password"
                onChange={handleChange}
                value={password}
                onBlur={handleBlur}
                error={error("password")}

            />
            <Button type="submit" className="w-full"
                disabled={isSubmitting}
            >
                Sign up

            </Button>
            <div className="flex items-center justify-between">
                <Link href="/auth/signin">Sign In </Link>
                <Link href="/auth/forget-password">Forget password</Link>
            </div>
            <div className="">
                {formErrors.map((err) => {
                    return (
                        <div key={err} className="space-x-1 flex items-center text-red-500">
                            <XMarkIcon className="w-4 h-4" />
                            <p className="text-xs">{err}</p>
                        </div>
                    );
                })}
            </div>
        </AuthFormContainer>
    );


}