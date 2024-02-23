import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupSchema } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import {  useToast } from "@/components/ui/use-toast";
import { useCreateUserAccountMutation, useSignInAccount } from "@/lib/react-query/queryAndMutation";
import { useUserContext } from "@/context/AuthContext";

const SignUpForm = () => {
  const { toast } = useToast();
 
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext()
  const navigate = useNavigate()


  const {mutateAsync:createUserAccount, isPending: isCreatingUser} = useCreateUserAccountMutation();
  
  const {mutateAsync: signInAccount, isPending: isSigninIn} = useSignInAccount();


  // 1. Define your form.
  const form = useForm<z.infer<typeof signupSchema>>({ 
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    const newUser = await createUserAccount(values)
    if(!newUser){
      return toast({
        title: "Sign up failed. Please try again "
      })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if(!session) {
      return (
        toast({title: "Sign in failed .please try again "})
      )
    }
    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn){
      form.reset();

      navigate("/")

    }
    else{
      return toast({title: "Sign in failed .please try again " })
    }
   
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram please, enter your details
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="John Doe" className="shad-input"{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="johnny" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input  type="email" className="shad-input" placeholder="johndoe@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input  type="password" className="shad-input" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ):"Sign up" }
          </Button>

          <p className="text-small-regular text-light-2 text-center">
            Already have an account? 
            <Link to="/sign-in" className="text-primary-500 ml-1 text-small-semibold">Signin</Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignUpForm;


