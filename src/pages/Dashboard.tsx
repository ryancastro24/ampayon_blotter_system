import { useState } from "react";
import { useNavigation, useNavigate, Outlet } from "react-router-dom";
import logo from "../assets/logo.png";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { HiMiniCog8Tooth } from "react-icons/hi2";
import Loading from "@/systemComponents/Loading";
const Dashboard = () => {
  const [navigationList, setNavigationList] = useState("case");
  const navigation = useNavigation();
  const navigate = useNavigate();
  return (
    <Box width={"full"}>
      <Box
        width={"full"}
        background={"blue.500"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        paddingX={5}
        paddingY={2}
      >
        <Box display={"flex"} alignItems={"center"} gap={10}>
          <Box display={"flex"} alignItems={"center"} gap={3}>
            <img src={logo} alt="logo" width={50} height={50} />
            <Box>
              <Text fontWeight={"bold"} color={"white"}>
                Brgy. Ampayon
              </Text>
              <Text fontSize={"sm"} color={"white"}>
                Butuan City
              </Text>
            </Box>
          </Box>

          <Box as={"ul"} display={"flex"} alignItems={"center"} gap={5}>
            <Box
              as={"li"}
              onClick={() => {
                navigate("/dashboard");
                setNavigationList("case");
              }}
              paddingY={2}
              paddingX={3}
              background={navigationList === "case" ? "blue.600" : ""}
              color={"white"}
              cursor={"pointer"}
              rounded={"sm"}
            >
              Cases
            </Box>

            <Box
              as={"li"}
              onClick={() => {
                navigate("users");
                setNavigationList("users");
              }}
              paddingY={2}
              paddingX={3}
              background={navigationList === "users" ? "blue.600" : ""}
              color={"white"}
              cursor={"pointer"}
              rounded={"sm"}
            >
              Users
            </Box>

            <Box
              as={"li"}
              onClick={() => {
                navigate("archives");
                setNavigationList("archives");
              }}
              paddingY={2}
              paddingX={3}
              background={navigationList === "archives" ? "blue.600" : ""}
              color={"white"}
              cursor={"pointer"}
              rounded={"sm"}
            >
              Archives
            </Box>
            <Box
              as="li"
              onClick={() => {
                navigate("report");
                setNavigationList("report");
              }}
              paddingY={2}
              paddingX={3}
              background={navigationList === "report" ? "blue.600" : ""}
              color={"white"}
              cursor={"pointer"}
              rounded={"sm"}
            >
              Report
            </Box>
          </Box>
        </Box>
        <IconButton
          onClick={() => navigate("/settings")}
          colorPalette={"blue"}
          size={"sm"}
          variant={"solid"}
        >
          <HiMiniCog8Tooth />
        </IconButton>
      </Box>

      {navigation.state === "loading" ? (
        <Loading />
      ) : (
        <Box className="w-full p-5 font-display">{<Outlet />}</Box>
      )}
    </Box>
  );
};

export default Dashboard;
