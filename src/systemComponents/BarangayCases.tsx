import { Box, Text, Separator, Grid, Button } from "@chakra-ui/react";
import {
  useNavigate,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import CasesCardContainer from "./CasesCardContainer";
import { IoChevronBackCircle } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { IoFolderOpen } from "react-icons/io5";
import { getAllCasesPerBarangay } from "@/backendapi/caseApi";
import { getUserDetails } from "@/backendapi/usersApi";
import { UserPropType } from "@/pages/Dashboard";
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params; // Extract `id` from URL parameters

  const user = localStorage.getItem("user");

  const userData: UserPropType = JSON.parse(user as any);

  if (!id) {
    throw new Response("Missing user ID", { status: 400 });
  }

  const casesData = await getAllCasesPerBarangay(id);
  const userDetails = await getUserDetails(id);

  console.log(casesData);

  return { casesData, userDetails, userData };
};

const BarangayCases = () => {
  const navigate = useNavigate();
  const { casesData, userDetails, userData } = useLoaderData();

  console.log(userData.userType);
  return (
    <Box
      data-state="open"
      _open={{
        animation: "fade-in 500ms ease-out",
      }}
      width={"full"}
      height={"full"}
      display={"flex"}
      flexDirection={"column"}
      gap={5}
      padding={5}
    >
      <Box display={"flex"} alignItems={"center"} gap={5}>
        <Box>
          <Button
            onClick={() => navigate(-1)}
            colorPalette={"red"}
            variant={"subtle"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <IoChevronBackCircle />
            Back to users
          </Button>
        </Box>

        <Separator orientation="vertical" height="8" />
        <Box>
          <Text
            display={"flex"}
            alignItems={"center"}
            gap={1}
            fontWeight={"bold"}
          >
            <FaLocationDot />
            Barangay {userDetails.barangay_name}
          </Text>
          <Text
            color="gray.500"
            display={"flex"}
            alignItems={"center"}
            gap={1}
            fontSize={"sm"}
          >
            <IoFolderOpen /> Total Cases: {casesData.length}
          </Text>
        </Box>
      </Box>

      <Grid templateColumns="repeat(4, 1fr)" gap="6">
        {casesData.map((val: any) => (
          <CasesCardContainer {...val} userType={userData.userType} />
        ))}
      </Grid>
    </Box>
  );
};

export default BarangayCases;
