import {
  useNavigation,
  useNavigate,
  Outlet,
  useLoaderData,
} from "react-router-dom";
import logo from "../assets/logo.png";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { HiMiniCog8Tooth } from "react-icons/hi2";
import Loading from "@/systemComponents/Loading";
import { isAuthenticated } from "@/utils/auth";
import { redirect, useLocation } from "react-router-dom";

export type UserPropType = {
  id?: string;
  barangay_name?: string;
  city_name?: string;
  region_name?: string;
  userType?: string;
  token?: string;
  barangay_captain?: string;
  barangay_secretary?: string;
};

export const loader = async () => {
  if (!isAuthenticated()) {
    return redirect("/"); // Redirect to login if not authenticated
  }

  const user = localStorage.getItem("user");

  const userData: UserPropType = JSON.parse(user as any);

  return { userData };
};
const Dashboard = () => {
  const { userData } = useLoaderData();
  const location = useLocation();
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
                {userData.barangay_name}
              </Text>
              <Text fontSize={"sm"} color={"white"}>
                {userData.city_name}
              </Text>
            </Box>
          </Box>

          <Box as={"ul"} display={"flex"} alignItems={"center"} gap={5}>
            {userData.userType === "admin" ? (
              <>
                <Box
                  as={"li"}
                  onClick={() => {
                    navigate("users");
                  }}
                  paddingY={2}
                  paddingX={3}
                  background={
                    location.pathname === "/dashboard/users" ? "blue.600" : ""
                  }
                  color={"white"}
                  cursor={"pointer"}
                  rounded={"sm"}
                >
                  Users
                </Box>
                <Box
                  as={"li"}
                  onClick={() => {
                    navigate("overallreport");
                  }}
                  paddingY={2}
                  paddingX={3}
                  background={
                    location.pathname === "/dashboard/overallreport"
                      ? "blue.600"
                      : ""
                  }
                  color={"white"}
                  cursor={"pointer"}
                  rounded={"sm"}
                >
                  Report
                </Box>
              </>
            ) : (
              <>
                <Box
                  as={"li"}
                  onClick={() => {
                    navigate("cases");
                  }}
                  paddingY={2}
                  paddingX={3}
                  background={
                    location.pathname === "/dashboard/cases" ? "blue.600" : ""
                  }
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
                  }}
                  paddingY={2}
                  paddingX={3}
                  background={
                    location.pathname === "/dashboard/archives"
                      ? "blue.600"
                      : ""
                  }
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
                  }}
                  paddingY={2}
                  paddingX={3}
                  background={
                    location.pathname === "/dashboard/report" ? "blue.600" : ""
                  }
                  color={"white"}
                  cursor={"pointer"}
                  rounded={"sm"}
                >
                  Report
                </Box>
              </>
            )}
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
