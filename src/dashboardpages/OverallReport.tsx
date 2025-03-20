import { Box, Card, Text, IconButton, Icon, Separator } from "@chakra-ui/react";
import { BarChart, LineChart } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";
import { TbDownload } from "react-icons/tb";
import { IoCalendarClear } from "react-icons/io5";

const OverallReport = () => {
  const generatePDF = () => {
    console.log("Download PDF functionality to be implemented");
  };

  return (
    <Box paddingX={10} paddingY={20}>
      <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
        Overall Reports
      </Text>

      <Box display="flex" justifyContent="space-evenly" flexWrap="wrap" gap={6}>
        <Card.Root size="md" variant="subtle" width={500} p={4}>
          <Card.Header
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                Bar Chart Analysis
              </Text>
              <Text
                fontSize="sm"
                color="gray.500"
                display="flex"
                alignItems="center"
              >
                <Icon as={IoCalendarClear} mr={2} /> January-July
              </Text>
            </Box>
            <IconButton size="md" colorScheme="blue" onClick={generatePDF}>
              <TbDownload />
            </IconButton>
          </Card.Header>
          <Separator my={3} />
          <Card.Body>
            <BarChart
              xAxis={[
                { scaleType: "band", data: ["Group A", "Group B", "Group C"] },
              ]}
              series={[
                { data: [4, 3, 5], label: "Series 1" },
                { data: [1, 6, 3], label: "Series 2" },
                { data: [2, 5, 6], label: "Series 3" },
              ]}
              width={400}
              height={300}
            />
          </Card.Body>
        </Card.Root>

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
              <IconButton
                size={"md"}
                colorPalette={"blue"}
                variant={"subtle"}
                onClick={generatePDF}
              >
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
                    { id: 0, value: 10, label: "Category A" },
                    { id: 1, value: 20, label: "Category B" },
                    { id: 2, value: 30, label: "Category C" },
                  ],
                },
              ]}
              width={300}
              height={300}
            />
          </Card.Body>
        </Card.Root>
      </Box>

      <Box mt={6} display="flex" justifyContent="center">
        <Card.Root size="md" variant="subtle" width={600} p={4}>
          <Card.Header
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                Sales & Revenue Trends
              </Text>
              <Text
                fontSize="sm"
                color="gray.500"
                display="flex"
                alignItems="center"
              >
                <Icon as={IoCalendarClear} mr={2} /> January-May
              </Text>
            </Box>
            <IconButton size="md" colorScheme="blue" onClick={generatePDF}>
              <TbDownload />
            </IconButton>
          </Card.Header>
          <Separator my={3} />
          <Card.Body>
            <LineChart
              xAxis={[
                {
                  scaleType: "point",
                  data: ["Jan", "Feb", "Mar", "Apr", "May"],
                },
              ]}
              series={[
                { data: [10, 20, 15, 25, 30], label: "Sales" },
                { data: [5, 15, 10, 20, 25], label: "Revenue" },
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

export default OverallReport;
