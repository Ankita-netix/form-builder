import React from "react";
import "./App.css";

import { useForm, Resolver } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

type FormValues = {
  firstName: string;
  lastName: string;
};


//create basic  schema for validation 

const schema=z.object({
  firstName:z.string().nonempty({message:"First name is required"}),
  lastName:z.string().nonempty({message:"Last name is required"})
})


// default validation of react-hook-form
const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.firstName ? values : {},
    errors: !values.firstName
      ? {
          firstName: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
      
  };
};

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver:zodResolver(schema) });
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <input {...register("firstName")} placeholder="first name" />
        {errors?.firstName && <p>{errors.firstName.message}</p>}

        <input {...register("lastName")} placeholder="last name" />
        {errors?.lastName && <p>{errors.lastName.message}</p>}

        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
