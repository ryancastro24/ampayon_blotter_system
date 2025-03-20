import barangay_bg from "@/assets/barangay_meeting.jpg";
import { Box, Text, Button } from "@chakra-ui/react";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { UserPropType } from "@/pages/Dashboard";
import { useLoaderData, useNavigate } from "react-router-dom";
export const loader = async () => {
  const user = localStorage.getItem("user");

  const userData: UserPropType = JSON.parse(user as any);

  return { userData };
};
const IndexPage = () => {
  const { userData } = useLoaderData();
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (userData.userType === "admin") {
      navigate("/dashboard/users");
    } else {
      navigate("/dashboard/cases");
    }
  };

  console.log(userData);
  return (
    <Box width="100%" height="100vh">
      <Box
        width="100%"
        height="100%"
        style={{
          backgroundImage: `url(${barangay_bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <Box
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          padding={20}
          alignItems="center"
          backgroundColor="#000000a2"
        >
          <Text fontSize="8xl" color="white" fontWeight="bold">
            {userData.userType === "admin"
              ? "Admin"
              : userData.barangay_name.toUpperCase()}
          </Text>

          <Text fontSize="5xl" color="white" fontWeight="bold">
            Blotter Management System
          </Text>

          <Text paddingX={150} color="white" textAlign="center" maxWidth="80%">
            A system designed to efficiently record and manage blotter reports
            within the barangay, ensuring proper documentation and resolution of
            incidents.
          </Text>

          <Button
            onClick={handleNavigation}
            marginTop={20}
            colorPalette={"blue"}
            cursor={"pointer"}
            display={"flex"}
            alignItems={"center"}
            gap={2}
          >
            Get started <IoIosArrowDroprightCircle />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default IndexPage;
