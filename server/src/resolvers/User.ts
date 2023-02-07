import argon2  from "argon2";
import jwt from 'jsonwebtoken';
import { IsEmail, IsString } from "class-validator";
import { MyContext } from "../apollo/createApolloServer";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import User from "../entities/User";
import { createAccessToken, createRefreshToken, REFRESH_JWT_SECRET_KEY, setRefreshTokenHeader } from "../utils/jwt-auth";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import redis from "src/redis/redis-cilent";

@InputType()
export class SignUpInput {
  @Field() @IsEmail() email: string;

  @Field() @IsString() username: string;

  @Field() @IsString() password: string;

}

@InputType({description: '로그인 인풋 데이터'})
export class LoginInput {
  @Field() @IsString() emailOrUsername: string;
  @Field() @IsString() password: string;
}

@ObjectType({description: '필드 에러 타입'})
class FieldError {
  @Field() field: string;
  @Field() message: string;
}

@ObjectType({description: '로그인 반환 데이터'})
class LoginResponse {
  @Field(()=> [FieldError], {nullable: true})
  errors?: FieldError[];

  @Field(()=> User, {nullable: true})
  user?: User;

  @Field({nullable: true})
  accessToken?: string;
}

@ObjectType({description: '액세스 토큰 새로고침 반환 데이터'})
class RefreshAccessTokenResponse {
  @Field() accessToken: string;
}

@Resolver(User)
export class UserResolver {
  @UseMiddleware(isAuthenticated)
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.verifiedUser) return undefined;
    return User.findOneByOrFail((  { id: ctx.verifiedUser.userId } ));
  }

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

  @Mutation(()=> LoginResponse)
  public async login(
    @Arg('loginInput') loginInput: LoginInput,
    @Ctx() {res, redis}: MyContext,
    ): Promise<LoginResponse> {
      const {emailOrUsername, password} = loginInput;

      const user = await User.findOne({where: [{email: emailOrUsername}, {username: emailOrUsername}]});
      if(!user) return {
        errors: [{field: 'emailOrUsername', message: '해당하는 유저가 없습니다'}]
      };

      const isValid = await argon2.verify(user.password, password);
      if(!isValid)
      return {
        errors: [
          {field: 'password', message: '비밀번호를 올바르게 입력해주세요.'}
        ]
      };


      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);

      // 리프레시 토큰 redis 적재
      await redis.set(String(user.id), refreshToken);
      // 쿠키로 리프레시 토큰 전송
      setRefreshTokenHeader(res, refreshToken)

      return {user, accessToken};
    } 

      @Mutation(()=> Boolean)
      @UseMiddleware(isAuthenticated)
      async logout(
        @Ctx() { verifiedUser, res, redis} : MyContext,
      ): Promise<boolean> {
        if(verifiedUser) {
          setRefreshTokenHeader(res, ''); // 리프레시 토큰 쿠키 제거
          await redis.del(String(verifiedUser.userId)); // redis 리프레시 토큰 제거
        }
        return true;
    }

    @Mutation(()=> RefreshAccessTokenResponse, {nullable: true})
   async refreshAccessToken(
     @Ctx() {req, redis, res}: MyContext,
   ): Promise<RefreshAccessTokenResponse | null> {
     const refreshToken = req.cookies.refreshToken;
     if(!refreshToken) return null;

     let tokenData: any = null;
     try {
       tokenData = jwt.verify(refreshToken, REFRESH_JWT_SECRET_KEY);
     } catch(e) {
       console.log(e);
       return null;
     }
     if(!tokenData) return null;

     const storedRefreshToken = await redis.get(String(tokenData.userId));
     if(!storedRefreshToken) return null;
     if(storedRefreshToken !== refreshToken) return null;

     const user = await User.findOneByOrFail({id: tokenData.userId});
     if(!user) return null;

     const newAccessToken = createAccessToken(user); //액세스 토큰 생성
     const newRefreshToken = createRefreshToken(user); //리프레시 토큰 생성
     // 리프레시 토큰 redis 저장
     await redis.set(String(user.id), newRefreshToken);

     //쿠키로 리프레시 토큰 전송
     res.cookie('refreshtoken', newRefreshToken, {
       httpOnly: true,
       secure: true,
       sameSite: 'lax'
     })

     return {accessToken: newAccessToken};
   }

}