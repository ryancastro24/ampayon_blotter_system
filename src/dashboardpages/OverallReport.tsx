import { Box, Card, Text, IconButton, Icon, Separator } from "@chakra-ui/react";
import { BarChart, LineChart } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";
import { TbDownload } from "react-icons/tb";
import { IoCalendarClear } from "react-icons/io5";
import jsPDF from "jspdf";
import { EmptyState } from "@/components/ui/empty-state";
import { PiSmileySadFill } from "react-icons/pi";
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

  // Check if data is empty or undefined
  if (
    !casesGroupedByBarangay?.length ||
    !allCasesStatus ||
    !allCasesPerMonth?.length
  ) {
    return (
      <Box paddingX={10} paddingY={10}>
        <EmptyState
          icon={<PiSmileySadFill />}
          title="No Reports Available"
          description="There are currently no reports. Please check back later"
        />
      </Box>
    );
  }

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
    pdf.text("Case Resolution Trends Analysis", 105, 50, { align: "center" });

    // Capture Line Graph (Centered Below Header)
    const lineGraphElement = document.getElementById("lineGraph");
    if (lineGraphElement) {
      const lineCanvas = await html2canvas(lineGraphElement, { useCORS: true });
      const lineImageData = lineCanvas.toDataURL("image/png");
      pdf.addImage(lineImageData, "PNG", 15, 65, 180, 100);
    } else {
      console.error("Line graph element not found!");
      return;
    }

    // Summary Title (Left-aligned)
    pdf.setFontSize(14);
    pdf.setFont("courier", "bold");
    pdf.text("Monthly Growth Analysis", 15, 195);

    // Table Position & Dimensions
    const tableStartX = 15;
    const tableStartY = 205;
    const colWidths = [100, 80]; // Column widths (Status | Growth Rate)
    const rowHeight = 12;

    // Table Headers
    const headers = ["Status", "Monthly Growth"];
    pdf.setFontSize(12);
    pdf.setFont("courier", "bold");

    headers.forEach((header, index) => {
      let xPos =
        tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
      pdf.rect(xPos, tableStartY, colWidths[index], rowHeight);

      if (index === 0) {
        pdf.text(header, xPos + 5, tableStartY + 8);
      } else {
        pdf.text(header, xPos + colWidths[index] / 2, tableStartY + 8, {
          align: "center",
        });
      }
    });

    // Calculate growth rates from actual data
    const calculateGrowthRate = (current: number, previous: number) => {
      if (previous === 0) return "0%";
      const growth = ((current - previous) / previous) * 100;
      return `${growth.toFixed(1)}%`;
    };

    const tableData = [
      [
        "Failed",
        calculateGrowthRate(
          allCasesStatus.total_failed,
          allCasesStatus.previous_failed || 0
        ),
      ],
      [
        "Ongoing",
        calculateGrowthRate(
          allCasesStatus.total_ongoing,
          allCasesStatus.previous_ongoing || 0
        ),
      ],
      [
        "Settled",
        calculateGrowthRate(
          allCasesStatus.total_settled,
          allCasesStatus.previous_settled || 0
        ),
      ],
    ];

    let currentY = tableStartY + rowHeight;
    pdf.setFont("courier", "normal");

    tableData.forEach((row) => {
      row.forEach((cell, index) => {
        let xPos =
          tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
        pdf.rect(xPos, currentY, colWidths[index], rowHeight);

        if (index === 0) {
          pdf.text(cell, xPos + 5, currentY + 8);
        } else {
          pdf.text(cell, xPos + colWidths[index] / 2, currentY + 8, {
            align: "center",
          });
        }
      });
      currentY += rowHeight;
    });

    // Save the PDF
    pdf.save("case_trends_report.pdf");
  };

  const generateBarangayStatsPDF = async () => {
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
    pdf.text("Barangay Case Statistics Report", 105, 50, { align: "center" });

    // Capture Bar Chart (Centered Below Header)
    const barChartElement = document.getElementById("barChart");
    if (barChartElement) {
      const barCanvas = await html2canvas(barChartElement, { useCORS: true });
      const barImageData = barCanvas.toDataURL("image/png");
      pdf.addImage(barImageData, "PNG", 15, 65, 180, 90);
    } else {
      console.error("Bar chart element not found!");
      return;
    }

    // Summary Title (Left-aligned)
    pdf.setFontSize(14);
    pdf.setFont("courier", "bold");
    pdf.text("Detailed Statistics by Barangay", 15, 165);

    // Table Position & Dimensions
    const tableStartX = 15;
    const tableStartY = 175;
    const colWidths = [60, 30, 30, 30, 30]; // Widths for Barangay, Failed, Settled, Ongoing, Total
    const rowHeight = 12;

    // Table Headers
    const headers = ["Barangay", "Failed", "Settled", "Ongoing", "Total"];
    pdf.setFontSize(12);
    pdf.setFont("courier", "bold");

    headers.forEach((header, index) => {
      let xPos =
        tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
      pdf.rect(xPos, tableStartY, colWidths[index], rowHeight);
      pdf.text(header, xPos + colWidths[index] / 2, tableStartY + 8, {
        align: "center",
      });
    });

    // Create table data from casesGroupedByBarangay with dynamic data
    const tableData = casesGroupedByBarangay.map((item: any) => {
      // Calculate total cases for this barangay
      const total = item.failed + item.settled + item.ongoing;

      // Log the data to verify
      console.log("Processing barangay:", {
        name: item.barangay_name,
        failed: item.failed,
        settled: item.settled,
        ongoing: item.ongoing,
        total: total,
      });

      return [
        item.barangay_name,
        item.failed.toString(),
        item.settled.toString(),
        item.ongoing.toString(),
        total.toString(),
      ];
    });

    // Calculate grand totals
    const grandTotals = tableData.reduce(
      (acc: [string, number, number, number, number], row: string[]) => {
        return [
          "Total",
          acc[1] + parseInt(row[1]),
          acc[2] + parseInt(row[2]),
          acc[3] + parseInt(row[3]),
          acc[4] + parseInt(row[4]),
        ];
      },
      ["Total", 0, 0, 0, 0]
    );

    // Convert numbers to strings in grand totals
    grandTotals[1] = grandTotals[1].toString();
    grandTotals[2] = grandTotals[2].toString();
    grandTotals[3] = grandTotals[3].toString();
    grandTotals[4] = grandTotals[4].toString();

    // Add the total row to the table data
    tableData.push(grandTotals);

    let currentY = tableStartY + rowHeight;
    pdf.setFont("courier", "normal");

    // Render each row with proper formatting
    tableData.forEach((row: string[], rowIndex: number) => {
      // Use bold font for the total row
      if (rowIndex === tableData.length - 1) {
        pdf.setFont("courier", "bold");
      }

      row.forEach((cell: string, index: number) => {
        let xPos =
          tableStartX +
          colWidths.slice(0, index).reduce((a: number, b: number) => a + b, 0);
        pdf.rect(xPos, currentY, colWidths[index], rowHeight);

        // Center all columns
        pdf.text(cell, xPos + colWidths[index] / 2, currentY + 8, {
          align: "center",
        });
      });
      currentY += rowHeight;

      // Reset to normal font after total row
      if (rowIndex === tableData.length - 1) {
        pdf.setFont("courier", "normal");
      }
    });

    // Save the PDF
    pdf.save("barangay_statistics_report.pdf");
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
                Number of Cases Per Barangay
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
                onClick={generateBarangayStatsPDF}
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
            <Box width="500px" overflowX="auto">
              <Box id="barChart">
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
                Total Cases
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
                Number of Cases Per Month
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
