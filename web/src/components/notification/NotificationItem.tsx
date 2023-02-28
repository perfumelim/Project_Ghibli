import { Box, MenuItem, Text } from '@chakra-ui/react';
import { Notification as INotification } from '../../generated/graphql';

interface NotificationItemProps {
  notification: INotification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  return (
    <MenuItem cursor="pointer">
      <Box position="relative" w="100%">
        <Text>{notification.text}</Text>
        <Text fontSize="xs" color="gray.500">
          {new Date(parseInt(notification.createdAt, 10)).toLocaleDateString()}
        </Text>
      </Box>
    </MenuItem>
  );
};

export default NotificationItem;
