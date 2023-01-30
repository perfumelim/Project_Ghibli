import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import LoginForm from '../components/auth/LoginForm';
import CommonLayout from '../components/CommonLayout';

export default function Login() {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.800')}>
      <CommonLayout>
        <Flex align="center" justify="center">
          <LoginForm />
        </Flex>
      </CommonLayout>
    </Box>
  );
}
