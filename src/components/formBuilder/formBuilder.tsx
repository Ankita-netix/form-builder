import { useState, useEffect } from "react";
import classes from "./style.module.css";
import { z } from "zod";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const dyanmicFieldSchema = z.object({
  name: z.string().min(1, "name is required"),
  dataType: z.string().min(1, "dataType is required"),
});
const formSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(100, "Username can't be more than 100 characters"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  address: z.string().min(1, "address is reuired"),
  inputs: z.array(dyanmicFieldSchema),
});

type FormSchemaType = z.infer<typeof formSchema>;

function FormBuilder() {
  const [formData, setFormData] = useState<object>({
    username: "",
    email: "",
    address: "",
    metaData: {},
  });
  const [dataSubmitted, setDataSubmitted] = useState({
    isOkay: false,
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      address: "",
      inputs: [],
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    if (data) {
      setDataSubmitted({ isOkay: true });
    } else {
      setDataSubmitted({ isOkay: false });
    }
    console.log(data);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inputs",
  });

  useEffect(() => {
    const subscribtion = watch((value) => {
      const metaData = value.inputs?.reduce((acc, val) => {
        // @ts-ignore 
        if (val && val.name) acc[val?.name] = val?.dataType;
        return acc;
      }, {});
      delete value["inputs"];
      setFormData({ ...value, metaData });

      setDataSubmitted({ isOkay: false });
    });
    return () => subscribtion.unsubscribe();
  }, [watch]);

  return (
    <div className={classes.main}>
      <h1>Form builder</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Your username</label>
          <input
            style={{ margin: "12px 6px" }}
            type="text"
            id="username"
            placeholder="Your name"
            {...register("username")}
          />
          {errors.username && (
            <span style={{ color: "red" }}>{errors.username?.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="email">Your email</label>
          <input
            style={{ marginLeft: "12px" }}
            type="email"
            id="email"
            placeholder="Your email"
            {...register("email")}
          />
          {errors.email && (
            <span style={{ color: "red" }}>{errors.email?.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            style={{ margin: "12px 6px" }}
            type="text"
            id="address"
            placeholder="Address"
            {...register("address")}
          />
          {errors.address && (
            <span style={{ color: "red" }}>{errors.address?.message}</span>
          )}
        </div>

        {fields.map((field, index) => (
          <div key={field.id}>
            <Controller
              control={control}
              name={`inputs.${index}.name`}
              render={({ field }) => (
                <>
                  <input
                    type="text"
                    className={classes.dynamicInput}
                    {...field}
                    placeholder="Name"
                  />
                  {errors.inputs && (
                    <span style={{ color: "red" }}>
                      {errors.inputs[index]?.name?.message}
                    </span>
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name={`inputs.${index}.dataType`}
              render={({ field }) => (
                <>
                  <select {...field}>
                    <option value="">Select data type</option>
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="radio">Radio</option>
                    <option value="array">Array</option>
                    <option value="object">Object</option>
                  </select>
                  {errors.inputs && (
                    <span style={{ color: "red" }}>
                      {errors.inputs[index]?.dataType?.message}
                    </span>
                  )}
                </>
              )}
            />
            <button
              type="button"
              className={classes.removeBtn}
              onClick={() => remove(index)}
            >
              -
            </button>
          </div>
        ))}
        <div className={classes.submit}>
          <button
            type="button"
            className={classes.dynamicFieldBtn}
            onClick={() => append({ name: "", dataType: "" })}
          >
            Add Dyamic field +{" "}
          </button>
        </div>

        <div className={classes.submit}>
          <input className={classes.submitBtn} type="submit" value="Submit" />
        </div>
      </form>
      <button
        onClick={() => {
          reset();
          setDataSubmitted({ isOkay: false });
        }}
        className={classes.resetBtn}
      >
        Reset
      </button>
      <div>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>

      <h3>
        {dataSubmitted.isOkay ? "form is submitted" : "form is yet to submit"}
      </h3>
    </div>
  );
}

export default FormBuilder;
