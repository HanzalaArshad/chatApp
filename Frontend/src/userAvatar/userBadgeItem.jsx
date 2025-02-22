import { Badge, Text } from "@chakra-ui/react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
       {user?.name || "No Name Available"}

      {/* {admin === user._id && <span> (Admin)</span>} */}
      <IoMdCloseCircleOutline pl={1} />
      </Badge>
  );
};

export default UserBadgeItem;