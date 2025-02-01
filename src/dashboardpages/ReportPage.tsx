import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Card, Text, IconButton, Icon, Separator } from "@chakra-ui/react";
import { TbDownload } from "react-icons/tb";
import { IoCalendarClear } from "react-icons/io5";
const ReportPage = () => {
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
                  data: [
                    { id: 0, value: 10, label: "series A", color: "#4CAF50" },
                    { id: 1, value: 15, label: "series B", color: "#FF9800" },
                    { id: 2, value: 20, label: "series C", color: "#F44336" },
                  ],
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
              xAxis={[
                {
                  id: "barCategories",
                  data: ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul"],
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  data: [2, 5, 3, 4, 5, 8],
                  color: "#2196F3",
                },
              ]}
              width={500}
              height={300}
            />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
};

export default ReportPage;
