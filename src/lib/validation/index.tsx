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
    email: z.string().email(),
    password: z.string().min(8, {
      message: ""
    })
  })


  export const postFormSchema = z.object({
    caption: z.string().min(2).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags:z.string()
  })

  export const ProfileSchema = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    bio: z.string(),
  });