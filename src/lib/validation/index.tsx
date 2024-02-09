import * as z from "zod"


export const signupSchema = z.object({
    name: z.string().min(3, {
      message: "name must be atleast 2 characters."  
    }),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "email must be valid"
    }),
    password: z.string().min(8, {
      message: "password must be atleast 8 characters"
    }),
    
  })


  export const signinSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
      message: ""
    })
  })