import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// create type for our schema using zod "infer"
type FormSchemaType = z.infer<typeof formSchema>;

function SimpleForm() {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting,isValid },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log(data);
  };


  console.log("valid",isValid)

  return (
    <form onSubmit={handleSubmit(onSubmit)} 
    
    >
      <button 
      onClick={()=>trigger()}
      >
        display data requirements
      </button>
      <div>
        <label htmlFor="username">Your username</label>
        <input
          type="text"
          id="username"
          placeholder="Your name"
          {...register("username")}
        />
        {errors.username && <span style={{color:"red"}}>{errors.username?.message}</span>}
      </div>
      <div>
        <label htmlFor="email">Your email</label>
        <input
          type="email"
          id="email"
          placeholder="your email"
          {...register("email")}
        />
        {errors.email && <span style={{color:"red"}}>{errors.email?.message}</span>}
      </div>{" "}
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && <span style={{color:"red"}}>{errors.password?.message}</span>}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="••••••••"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <span style={{color:"red"}}>{errors.confirmPassword?.message}</span>
        )}
      </div>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            aria-describedby="terms"
            type="checkbox"
            {...register("terms")}
          />
        </div>
        <div>
          <label htmlFor="terms">I accept the Terms and Conditions</label>
        </div>
        {errors.terms && <span style={{color:"red"}}>{errors.terms?.message}</span>}

      </div>
      <button type="submit" disabled={isSubmitting}>
        Create an account
      </button>
    </form>
  );
}

export default SimpleForm;
