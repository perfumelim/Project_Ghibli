import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import SignUpForm from '../components/auth/SighUpForm';
import CommonLayout from '../components/CommonLayout';

export default function SignUp() {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.800')}>
      <CommonLayout>
        <Flex align="center" justify="center"></Flex>
        <SignUpForm />
      </CommonLayout>
    </Box>
  );
}
