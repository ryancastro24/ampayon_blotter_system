import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Box, Text } from "@chakra-ui/react";
const Dashboard = () => {
  const [navigationList, setNavigationList] = useState("case");
  const navigate = useNavigate();
  return (
    <Box>
      <Box background={"blue.500"} display={"flex"} paddingX={5} paddingY={2}>
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
      </Box>

      <Box className="w-full p-5 font-display">{<Outlet />}</Box>
    </Box>
  );
};

export default Dashboard;
