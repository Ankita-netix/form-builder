import { useState, ChangeEvent } from "react";
import classes from "./style.module.css";
import { useForm, Resolver, Controller } from "react-hook-form";
import Select from "react-select";

function FormBuilder() {
  const [formData, setFormData] = useState<object>({});
  const [fields, setFields] = useState([{ value: "" }]);
  const handleAddField = () => {
    setFields([...fields, { value: "" }]);
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({});

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    setFormData(data);
  });

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newFields = [...fields];
    newFields[index].value = event.target.value;
    setFields(newFields);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((x, number) => number != index);
    setFields(newFields);
  };

  return (
    <div className={classes.main}>
      <h1>Form builder</h1>

      <form onSubmit={onSubmit}>
        <Controller
          control={control}
          name="combinedInput"
          render={({ field: { onChange, value } }) => (
            <div className={classes.combinedField}>
              <input
                style={{ marginRight: "12px" }}
                type="text"
                value={value?.name}
                onChange={(e) => onChange({ ...value, name: e.target.value })}
              />
              <Select
                {...fields}
                onChange={(e) => onChange({ ...value, type: e?.value })}

                options={[
                  { value: "string", label: "string" },
                  { value: "int", label: "int" },
                  { value: "number", label: "number" },
                ]}
              />{" "}
            </div>
          )}
        />
        {fields.map((field, index) => (
          <div key={index}>
            <input
              key={index}
              {...register(`dataType${index}`)}
              type="text"
              value={field.value}
              onChange={(event) => handleChange(index, event)}
            />
            <button
              onClick={() => {
                removeField(index);
              }}
            >
              -
            </button>
          </div>
        ))}
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>

      <button onClick={handleAddField}>Add field</button>

      <div>
        <pre>{JSON.stringify(formData)}</pre>
      </div>
    </div>
  );
}

export default FormBuilder;
