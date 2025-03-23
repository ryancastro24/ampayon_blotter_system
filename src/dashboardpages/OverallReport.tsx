import { Box, Card, Text, IconButton, Icon, Separator } from "@chakra-ui/react";
import { BarChart, LineChart } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";
import { TbDownload } from "react-icons/tb";
import { IoCalendarClear } from "react-icons/io5";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  getCasesGroupedByBarangay,
  getAllCasesStatus,
  getAllCasesPerMonth,
} from "@/backendapi/caseApi";
import { useLoaderData } from "react-router-dom";

export const loader = async () => {
  const casesGroupedByBarangay = await getCasesGroupedByBarangay();
  const allCasesStatus = await getAllCasesStatus();
  const allCasesPerMonth = await getAllCasesPerMonth();

  return { casesGroupedByBarangay, allCasesStatus, allCasesPerMonth };
};

const OverallReport = () => {
  const { casesGroupedByBarangay, allCasesStatus, allCasesPerMonth } =
    useLoaderData();

  console.log("casesGroupedByBarangay", casesGroupedByBarangay);
  console.log("allCasesStatus", allCasesStatus);
  console.log("allCasesPerMonth", allCasesPerMonth);

  const barangayNames = casesGroupedByBarangay.map(
    (item: any) => item.barangay_name
  );

  const barSeriesData = [
    {
      data: casesGroupedByBarangay.map((item: any) => item.failed),
      label: "Failed",
      color: "red",
    },
    {
      data: casesGroupedByBarangay.map((item: any) => item.settled),
      label: "Settled",
      color: "green",
    },
    {
      data: casesGroupedByBarangay.map((item: any) => item.ongoing),
      label: "Ongoing",
      color: "orange",
    },
  ];

  const dynamicWidth = Math.max(casesGroupedByBarangay.length * 100, 500);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Sort data to ensure chronological order
  const sortedData = allCasesPerMonth.sort(
    (a: any, b: any) => a.month - b.month
  );

  // Extract months and case counts dynamically
  const months = sortedData.map((entry: any) => monthNames[entry.month - 1]); // Convert month number to name
  const failedData = sortedData.map((entry: any) => entry.failed);
  const settledData = sortedData.map((entry: any) => entry.settled);
  const ongoingData = sortedData.map((entry: any) => entry.ongoing);

  const generatePiechartPDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Get today's date
    const today = new Date().toLocaleDateString();

    // Set global font to Courier
    pdf.setFont("courier", "normal");

    // Add Logo (Top Left)
    const logoElement = document.getElementById("logo");
    if (logoElement) {
      const logoCanvas = await html2canvas(logoElement, { useCORS: true });
      const logoImageData = logoCanvas.toDataURL("image/png");
      pdf.addImage(logoImageData, "PNG", 15, 10, 30, 30);
    }

    // Header Text (Centered)
    pdf.setFont("courier", "bold");
    pdf.setFontSize(14);
    pdf.text("REPUBLIC OF THE PHILIPPINES", 105, 15, { align: "center" });

    pdf.setFont("courier", "normal");
    pdf.setFontSize(12);
    pdf.text("Department of Interior and Local Government", 105, 22, {
      align: "center",
    });

    // Date (Right-aligned)
    pdf.setFontSize(10);
    pdf.text(`Date: ${today}`, 190, 35, { align: "right" });

    // Title for Chart (Centered)
    pdf.setFont("courier", "normal");
    pdf.setFontSize(16);
    pdf.text("Resolution Status of Cases", 105, 50, { align: "center" });

    // Capture Pie Chart (Centered Below Header)
    const pieChartElement = document.getElementById("pieChart");
    if (pieChartElement) {
      const pieCanvas = await html2canvas(pieChartElement, { useCORS: true });
      const pieImageData = pieCanvas.toDataURL("image/png");
      pdf.addImage(pieImageData, "PNG", 15, 65, 180, 100);
    } else {
      console.error("Pie chart element not found!");
      return;
    }

    // Summary Title (Left-aligned)
    pdf.setFontSize(14);
    pdf.setFont("courier", "bold");
    pdf.text("Summary of Results", 15, 195);

    // Table Position & Dimensions
    const tableStartX = 15;
    const tableStartY = 205;
    const colWidths = [140, 40]; // Column widths (Status | Number of Cases)
    const rowHeight = 12; // Increased for better padding

    // Table Headers
    const headers = ["Status", "Number of Cases"];
    pdf.setFontSize(12);
    pdf.setFont("courier", "bold");

    headers.forEach((header, index) => {
      let xPos =
        tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
      pdf.rect(xPos, tableStartY, colWidths[index], rowHeight); // Draw cell border

      if (index === 0) {
        // Left-align "Status" header
        pdf.text(header, xPos + 5, tableStartY + 8);
      } else {
        // Center "Number of Cases" header
        pdf.text(header, xPos + colWidths[index] / 2, tableStartY + 8, {
          align: "center",
        });
      }
    });

    // Table Data
    const tableData = [
      ["Failed", allCasesStatus.total_failed.toString()],
      ["Ongoing", allCasesStatus.total_ongoing.toString()],
      ["Settled", allCasesStatus.total_settled.toString()],
    ];

    let currentY = tableStartY + rowHeight;
    pdf.setFont("courier", "normal");

    tableData.forEach((row) => {
      row.forEach((cell, index) => {
        let xPos =
          tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
        pdf.rect(xPos, currentY, colWidths[index], rowHeight); // Draw cell border

        if (index === 0) {
          // Left-align "Status" column
          pdf.text(cell, xPos + 5, currentY + 8);
        } else {
          // Center the "Number of Cases" column
          pdf.text(cell, xPos + colWidths[index] / 2, currentY + 8, {
            align: "center",
          });
        }
      });
      currentY += rowHeight;
    });

    // Save the PDF
    pdf.save("report.pdf");
  };

  // linegraph

  const generateLinegraphPDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Get today's date
    const today = new Date().toLocaleDateString();

    // Set global font to Courier
    pdf.setFont("courier", "normal");

    // Add Logo (Top Left)
    const logoElement = document.getElementById("logo");
    if (logoElement) {
      const logoCanvas = await html2canvas(logoElement, { useCORS: true });
      const logoImageData = logoCanvas.toDataURL("image/png");
      pdf.addImage(logoImageData, "PNG", 15, 10, 30, 30);
    }

    // Header Text (Centered)
    pdf.setFont("courier", "bold");
    pdf.setFontSize(14);
    pdf.text("REPUBLIC OF THE PHILIPPINES", 105, 15, { align: "center" });

    pdf.setFont("courier", "normal");
    pdf.setFontSize(12);
    pdf.text("Department of Interior and Local Government", 105, 22, {
      align: "center",
    });

    // Date (Right-aligned)
    pdf.setFontSize(10);
    pdf.text(`Date: ${today}`, 190, 35, { align: "right" });

    // Title for Chart (Centered)
    pdf.setFont("courier", "normal");
    pdf.setFontSize(16);
    pdf.text("Resolution Status of Cases", 105, 50, { align: "center" });

    // Capture Pie Chart (Centered Below Header)
    const pieChartElement = document.getElementById("lineGraph");
    if (pieChartElement) {
      const pieCanvas = await html2canvas(pieChartElement, { useCORS: true });
      const pieImageData = pieCanvas.toDataURL("image/png");
      pdf.addImage(pieImageData, "PNG", 15, 65, 180, 100);
    } else {
      console.error("Pie chart element not found!");
      return;
    }

    // Summary Title (Left-aligned)
    pdf.setFontSize(14);
    pdf.setFont("courier", "bold");
    pdf.text("Summary of Results", 15, 195);

    // Table Position & Dimensions
    const tableStartX = 15;
    const tableStartY = 205;
    const colWidths = [140, 40]; // Column widths (Status | Number of Cases)
    const rowHeight = 12; // Increased for better padding

    // Table Headers
    const headers = ["Status", "Number of Cases"];
    pdf.setFontSize(12);
    pdf.setFont("courier", "bold");

    headers.forEach((header, index) => {
      let xPos =
        tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
      pdf.rect(xPos, tableStartY, colWidths[index], rowHeight); // Draw cell border

      if (index === 0) {
        // Left-align "Status" header
        pdf.text(header, xPos + 5, tableStartY + 8);
      } else {
        // Center "Number of Cases" header
        pdf.text(header, xPos + colWidths[index] / 2, tableStartY + 8, {
          align: "center",
        });
      }
    });

    // Table Data
    const tableData = [
      ["Failed", allCasesStatus.total_failed.toString()],
      ["Ongoing", allCasesStatus.total_ongoing.toString()],
      ["Settled", allCasesStatus.total_settled.toString()],
    ];

    let currentY = tableStartY + rowHeight;
    pdf.setFont("courier", "normal");

    tableData.forEach((row) => {
      row.forEach((cell, index) => {
        let xPos =
          tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
        pdf.rect(xPos, currentY, colWidths[index], rowHeight); // Draw cell border

        if (index === 0) {
          // Left-align "Status" column
          pdf.text(cell, xPos + 5, currentY + 8);
        } else {
          // Center the "Number of Cases" column
          pdf.text(cell, xPos + colWidths[index] / 2, currentY + 8, {
            align: "center",
          });
        }
      });
      currentY += rowHeight;
    });

    // Save the PDF
    pdf.save("report.pdf");
  };
  return (
    <Box paddingX={10} paddingY={10}>
      <Text fontSize="xl" mb={4} textAlign="left">
        Overall Reports
      </Text>

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={6}>
        <Card.Root size="md" variant="subtle" width="full" p={4}>
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
                2025
              </Text>
            </Box>

            <Box>
              <IconButton size={"md"} colorPalette={"blue"} variant={"subtle"}>
                <TbDownload />
              </IconButton>
            </Box>
          </Card.Header>
          <Separator my={3} />
          <Card.Body>
            <Box width="500px" overflowX="auto">
              <Box>
                <BarChart
                  xAxis={[{ scaleType: "band", data: barangayNames }]}
                  series={barSeriesData}
                  width={dynamicWidth}
                  height={400}
                />
              </Box>
            </Box>
          </Card.Body>
        </Card.Root>

        <Card.Root size="md" variant="subtle" width="full" p={4}>
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
                2025
              </Text>
            </Box>

            <Box>
              <IconButton
                onClick={generatePiechartPDF}
                size={"md"}
                colorPalette={"blue"}
                variant={"subtle"}
              >
                <TbDownload />
              </IconButton>
            </Box>
          </Card.Header>
          <Separator my={3} />
          <Card.Body>
            <div id="pieChart">
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: allCasesStatus.total_failed,
                        label: "Failed",
                        color: "red",
                      },
                      {
                        id: 1,
                        value: allCasesStatus.total_settled,
                        label: "Settled",
                        color: "green",
                      },
                      {
                        id: 2,
                        value: allCasesStatus.total_ongoing,
                        label: "Ongoing",
                        color: "orange",
                      },
                    ],
                  },
                ]}
                width={500}
                height={300}
              />
            </div>
          </Card.Body>
        </Card.Root>
      </Box>

      <Box mt={6} display="flex" justifyContent="center">
        <Card.Root size="md" variant="subtle" width={600} p={4}>
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
                2025
              </Text>
            </Box>

            <Box>
              <IconButton
                onClick={generateLinegraphPDF}
                size={"md"}
                colorPalette={"blue"}
                variant={"subtle"}
              >
                <TbDownload />
              </IconButton>
            </Box>
          </Card.Header>
          <Separator my={3} />
          <Card.Body>
            <div id="lineGraph">
              <LineChart
                xAxis={[{ scaleType: "point", data: months }]} // Dynamic month labels
                series={[
                  { data: failedData, label: "Failed", color: "red" },
                  { data: settledData, label: "Settled", color: "green" },
                  { data: ongoingData, label: "Ongoing", color: "orange" },
                ]}
                width={500}
                height={300}
              />
            </div>
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
};

export default OverallReport;
