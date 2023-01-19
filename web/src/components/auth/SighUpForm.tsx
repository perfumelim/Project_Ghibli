import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useSignUpMutation, SignUpMutationVariables } from '../../generated/graphql';

export function SignUpRealForm() {
  const [signUp, { loading }] = useSignUpMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpMutationVariables>();

  return (
    <Stack as="form" spacing={4} onSubmit={handleSubmit((data) => console.log(data))}>
      <FormControl isInvalid={!!errors.signUpInput?.email}>
        <FormLabel>이메일</FormLabel>
        <Input type="email" placeholder="example@example.com" {...register('signUpInput.email')} />
        <FormErrorMessage>{errors.signUpInput?.email && errors.signUpInput.email.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.signUpInput?.username}>
        <FormLabel>아이디</FormLabel>
        <Input type="text" placeholder="example" {...register('signUpInput.username')} />
        <FormErrorMessage>{errors.signUpInput?.username && errors.signUpInput.username.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.signUpInput?.password}>
        <FormLabel>암호</FormLabel>
        <Input type="password" placeholder="8자 이상의 영문,숫자,특문" {...register('signUpInput.password')} />
        <FormErrorMessage>{errors.signUpInput?.password && errors.signUpInput.password.message}</FormErrorMessage>
      </FormControl>

      <Divider />

      <Button colorScheme="yellow" type="submit" isLoading={loading}>
        계정 생성
      </Button>
    </Stack>
  );
}

export default function SighUpForm() {
  return (
    <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
      <Stack align="center">
        <Heading fontSize="4xl">지브리 명장면 프로젝트</Heading>
        <Text fontSize="4xl" color="gray.600">
          가입을 환영합니다!
        </Text>
      </Stack>

      <Box rounded="lg" bg={useColorModeValue('white', 'gray.700')} boxShadow="lg" minW="lg" p={8}>
        <SignUpRealForm />
      </Box>
    </Stack>
  );
}
