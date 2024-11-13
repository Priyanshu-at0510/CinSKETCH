import z from 'zod'

export const signUpInput = z.object({
  username:z.string(),
  email:z.string().email(),
  passwordHash:z.string().min(6,"Enter atleast 6 digit passsword"),
  avatarUrl:z.string()
});

export const signInInput = z.object({
    email:z.string().email(),
    passwordHash:z.string().min(6,"Enter atleast 6 digit passsword")
});




// type inference in zod 
// frontend will need it 
export type SignUpInput = z.infer<typeof signUpInput>
export type SignInInput = z.infer<typeof signInInput>
