import argon2  from "argon2";
import { IsEmail, IsString } from "class-validator";
import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";
import User from "../entities/User";

@InputType()
export class SignUpInput {
  @Field() @IsEmail() email: string;

  @Field() @IsString() username: string;

  @Field() @IsString() password: string;

}

@Resolver(User)
export class UserResolver {
  @Mutation(()=> User)
  async signUp(@Arg('signUpInput') signUpInput: SignUpInput): Promise<User> {
    const {email, username, password} = signUpInput;

    const hashedPw = await argon2.hash(password);
    const newUser = User.create({
      email,
      username,
      password: hashedPw
    });

    await User.insert(newUser)
    return newUser
  }
}