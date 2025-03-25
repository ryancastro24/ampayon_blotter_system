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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const loader = async () => {
  const user = localStorage.getItem("user");

  const userData: UserPropType = JSON.parse(user as any);

  const perMonthCasesData = await getPermonthCases(userData?.id);
  const groupedCases = await getGroupedCases(userData?.id);

  return { userData, perMonthCasesData, groupedCases };
};

const ReportPage = () => {
  const { perMonthCasesData, groupedCases } = useLoaderData() as any;

  // Add detailed logging to understand the data structure
  console.log("Full perMonthCasesData:", perMonthCasesData);
  console.log("xAxis data:", perMonthCasesData?.xAxis);
  console.log("series data:", perMonthCasesData?.series);

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

    await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure rendering

    // Capture Pie Chart (Centered Below Header)
    const pieChartElement = document.getElementById("pieChart");
    if (pieChartElement) {
      const pieCanvas = await html2canvas(pieChartElement, { useCORS: true });
      const pieImageData = pieCanvas.toDataURL("image/png");
      pdf.addImage(pieImageData, "PNG", 15, 65, 180, 110);
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
      ["Failed", groupedCases[0].value.toString()],
      ["Ongoing", groupedCases[1].value.toString()],
      ["Settled", groupedCases[2].value.toString()],
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

  const generateBarchartPDF = async () => {
    // Add data validation check with detailed logging
    if (!perMonthCasesData) {
      console.error("perMonthCasesData is undefined");
      alert("Unable to generate report: Data is not loaded");
      return;
    }

    // Log the full perMonthCasesData object for debugging
    console.log("Full perMonthCasesData:", perMonthCasesData);

    // Check if xAxis exists and has the expected structure
    if (!perMonthCasesData.xAxis) {
      console.error("xAxis is missing from perMonthCasesData");
      alert("Unable to generate report: Month data is missing");
      return;
    }

    // Check if xAxis.data exists and is an array
    const xAxisData = perMonthCasesData.xAxis[0].data;

    console.log("xAxisData:", xAxisData);
    if (!Array.isArray(xAxisData)) {
      console.error("xAxis.data is not an array:", xAxisData);
      alert("Unable to generate report: Invalid month data format");
      return;
    }

    // Check series data with more detailed logging
    if (!perMonthCasesData.series) {
      console.error("series is missing from perMonthCasesData");
      alert("Unable to generate report: Case data is missing");
      return;
    }

    if (
      !Array.isArray(perMonthCasesData.series) ||
      perMonthCasesData.series.length === 0
    ) {
      console.error(
        "series is empty or not an array:",
        perMonthCasesData.series
      );
      alert("Unable to generate report: No case data available");
      return;
    }

    const seriesData = perMonthCasesData.series[0]?.data;
    if (!Array.isArray(seriesData)) {
      console.error("series[0].data is not an array:", seriesData);
      alert("Unable to generate report: Invalid case data format");
      return;
    }

    // Log the validated data
    console.log("Validated xAxis data:", xAxisData);
    console.log("Validated series data:", seriesData);

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
    pdf.text("Monthly Cases Report", 105, 50, { align: "center" });

    await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure rendering

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
    pdf.text("Monthly Summary", 15, 165);

    // Table Position & Dimensions
    const tableStartX = 15;
    const tableStartY = 175;
    const colWidths = [140, 40]; // Column widths (Month | Number of Cases)
    const rowHeight = 12; // Increased for better padding

    // Table Headers
    const headers = ["Month", "Number of Cases"];
    pdf.setFontSize(12);
    pdf.setFont("courier", "bold");

    headers.forEach((header, index) => {
      let xPos =
        tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
      pdf.rect(xPos, tableStartY, colWidths[index], rowHeight); // Draw cell border

      if (index === 0) {
        // Left-align "Month" header
        pdf.text(header, xPos + 5, tableStartY + 8);
      } else {
        // Center "Number of Cases" header
        pdf.text(header, xPos + colWidths[index] / 2, tableStartY + 8, {
          align: "center",
        });
      }
    });

    // Table Data - Use the actual data from perMonthCasesData with type safety
    const months = xAxisData;
    const caseCounts = seriesData;

    const tableData: [string, string][] = months.map(
      (month: string, index: number) => {
        const count = caseCounts[index];
        if (count === undefined) {
          console.error(
            `Missing case count for month ${month} at index ${index}`
          );
          return [month, "0"];
        }
        return [month, count.toString()];
      }
    );

    let currentY = tableStartY + rowHeight;
    pdf.setFont("courier", "normal");

    tableData.forEach((row: [string, string]) => {
      row.forEach((cell: string, index: number) => {
        let xPos =
          tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
        pdf.rect(xPos, currentY, colWidths[index], rowHeight); // Draw cell border

        if (index === 0) {
          // Left-align "Month" column
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
    pdf.save("monthly_cases_report.pdf");
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

    // Process and calculate statistics from perMonthCasesData
    const barangayStats = perMonthCasesData.series.reduce(
      (acc: any, series: any) => {
        const barangay = series.name;
        const failed = series.data.filter(
          (status: string) => status === "Failed"
        ).length;
        const settled = series.data.filter(
          (status: string) => status === "Settled"
        ).length;
        const ongoing = series.data.filter(
          (status: string) => status === "Ongoing"
        ).length;
        const total = failed + settled + ongoing;

        acc[barangay] = { failed, settled, ongoing, total };
        return acc;
      },
      {}
    );

    // Create table data from statistics
    const tableData = Object.entries(barangayStats).map(
      ([barangay, stats]: [string, any]) => [
        barangay,
        stats.failed.toString(),
        stats.settled.toString(),
        stats.ongoing.toString(),
        stats.total.toString(),
      ]
    );

    let currentY = tableStartY + rowHeight;
    pdf.setFont("courier", "normal");

    tableData.forEach((row) => {
      row.forEach((cell, index) => {
        let xPos =
          tableStartX + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
        pdf.rect(xPos, currentY, colWidths[index], rowHeight);
        pdf.text(cell, xPos + colWidths[index] / 2, currentY + 8, {
          align: "center",
        });
      });
      currentY += rowHeight;
    });

    // Save the PDF
    pdf.save("barangay_statistics_report.pdf");
  };

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
                2025
              </Text>
            </Box>

            <Box>
              <IconButton
                size={"md"}
                colorPalette={"blue"}
                variant={"subtle"}
                onClick={generatePiechartPDF}
              >
                <TbDownload />
              </IconButton>
            </Box>
          </Card.Header>

          <Separator marginTop={3} size={"sm"} />

          <Card.Body>
            <div id="pieChart">
              <PieChart
                series={[
                  {
                    data: groupedCases,
                  },
                ]}
                width={500}
                height={300}
              />
            </div>
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
              <IconButton
                size={"md"}
                colorPalette={"blue"}
                variant={"subtle"}
                onClick={generateBarchartPDF}
              >
                <TbDownload />
              </IconButton>
            </Box>
          </Card.Header>

          <Separator marginTop={3} size={"sm"} />

          <Card.Body>
            <div id="barChart">
              <BarChart
                xAxis={perMonthCasesData.xAxis}
                series={perMonthCasesData.series}
                width={perMonthCasesData.width}
                height={perMonthCasesData.height}
              />
            </div>
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
};

export default ReportPage;
