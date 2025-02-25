import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Card, Text, IconButton, Icon, Separator } from "@chakra-ui/react";
import { TbDownload } from "react-icons/tb";
import { IoCalendarClear } from "react-icons/io5";
import { UserPropType } from "@/pages/Dashboard";
import { getPermonthCases, getGroupedCases } from "@/backendapi/caseApi";
import { useLoaderData } from "react-router-dom";
import { ClientOnly } from "@chakra-ui/react";
import { EmptyState } from "@/components/ui/empty-state";
import Loading from "@/systemComponents/Loading";
import { PiSmileySadFill } from "react-icons/pi";
export const loader = async () => {
  const user = localStorage.getItem("user");

  const userData: UserPropType = JSON.parse(user as any);

  const perMonthCasesData = await getPermonthCases(userData?.id);
  const groupedCases = await getGroupedCases(userData?.id);

  return { userData, perMonthCasesData, groupedCases };
};
const ReportPage = () => {
  const { perMonthCasesData, groupedCases } = useLoaderData() as any;

  console.log(groupedCases[0].value);

  if (
    groupedCases[0].value == 0 &&
    groupedCases[1].value == 0 &&
    groupedCases[2].value == 0
  ) {
    return (
      <ClientOnly fallback={<Loading />}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
        >
          <EmptyState
            icon={<PiSmileySadFill />}
            title="No Case Available"
            description="Add case to display analytics graphs"
          />
        </Box>
      </ClientOnly>
    );
  }

  return (
    <Box paddingX={10} paddingY={20}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
      >
        <Card.Root size={"md"} variant={"subtle"}>
          <Card.Header
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"row"}
          >
            <Box display={"flex"} flexDirection={"column"} gap={1}>
              <Text margin={0} fontSize={"xl"} fontWeight={"bold"}>
                Realtime Case Status
              </Text>
              <Text
                color={"gray.500"}
                display={"flex"}
                alignItems={"center"}
                gap={2}
                fontSize={"sm"}
              >
                <Icon>
                  <IoCalendarClear />
                </Icon>{" "}
                January-July{" "}
              </Text>
            </Box>

            <Box>
              <IconButton size={"md"} colorPalette={"blue"} variant={"subtle"}>
                <TbDownload />
              </IconButton>
            </Box>
          </Card.Header>

          <Separator marginTop={3} size={"sm"} />

          <Card.Body>
            <PieChart
              series={[
                {
                  data: groupedCases,
                },
              ]}
              width={500}
              height={300}
            />
          </Card.Body>
        </Card.Root>
        <Card.Root variant={"subtle"}>
          <Card.Header
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"row"}
          >
            <Box display={"flex"} flexDirection={"column"} gap={1}>
              <Text margin={0} fontSize={"xl"} fontWeight={"bold"}>
                2025 Monthly Cases
              </Text>
              <Text
                color={"gray.500"}
                display={"flex"}
                alignItems={"center"}
                gap={2}
                fontSize={"sm"}
              >
                <Icon>
                  <IoCalendarClear />
                </Icon>{" "}
                January-July{" "}
              </Text>
            </Box>

            <Box>
              <IconButton size={"md"} colorPalette={"blue"} variant={"subtle"}>
                <TbDownload />
              </IconButton>
            </Box>
          </Card.Header>

          <Separator marginTop={3} size={"sm"} />

          <Card.Body>
            <BarChart
              xAxis={perMonthCasesData.xAxis}
              series={perMonthCasesData.series}
              width={perMonthCasesData.width}
              height={perMonthCasesData.height}
            />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
};

export default ReportPage;
