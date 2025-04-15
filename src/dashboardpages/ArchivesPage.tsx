import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLoaderData } from "react-router-dom";
import { IoFolderOpen } from "react-icons/io5";
import { Input, Box, IconButton, Button } from "@chakra-ui/react";
import { LuDownload } from "react-icons/lu";
import { getSettleAndFailedCases } from "@/backendapi/caseApi";
import { ClientOnly } from "@chakra-ui/react";
import { EmptyState } from "@/components/ui/empty-state";
import Loading from "@/systemComponents/Loading";
import { PiSmileySadFill } from "react-icons/pi";
import { UserPropType } from "@/pages/Dashboard";
import "jspdf-autotable";
import dilg_logo from "@/assets/dilg_logo.png";
import lupong_logo from "@/assets/lupong_logo.png";
import jsPDF from "jspdf";
import { ActionFunction } from "react-router-dom";
import {
  addCase,
  updateCase,
  attempt1,
  attempt2,
  attempt3,
} from "@/backendapi/caseApi";

export const action: ActionFunction = async ({ request }) => {
  console.log(request.method);
  console.log(request);
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  if (data.type === "settledButton") {
    const attempt1Data = await updateCase(data?.id, data);

    return attempt1Data;
  }

  if (data.type === "failedButton") {
    const attempt1Data = await updateCase(data?.id, data);

    return attempt1Data;
  }

  if (data.type === "attempt1") {
    const attempt1Data = await attempt1(data?.id);

    return attempt1Data;
  }
  if (data.type === "attempt1") {
    const attempt1Data = await attempt1(data?.id);

    return attempt1Data;
  }

  if (data.type === "attempt2") {
    const attempt1Data = await attempt2(data?.id);

    return attempt1Data;
  }

  if (data.type === "attempt3") {
    const attempt1Data = await attempt3(data?.id);

    return attempt1Data;
  }
  if (data.type === "updateCase") {
    const updatedCaseData = await updateCase(data?.id, data);

    return updatedCaseData;
  }

  if (request.method == "POST") {
    console.log(data);
    const caseData = await addCase(data);
    return caseData;
  }

  return { data };
};
export const loader = async () => {
  const user = localStorage.getItem("user");

  const userData: UserPropType = JSON.parse(user as any);

  const casesData = await getSettleAndFailedCases(userData?.id);

  return { userData, casesData };
};

import CasesCardContainer from "@/systemComponents/CasesCardContainer";

const ArchivesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const { casesData, userData } = useLoaderData() as any;

  console.log(casesData);

  const casesPerPage = 8;
  const filteredCases = casesData.filter(
    (c: any) =>
      c.complainant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.respondent_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * casesPerPage,
    currentPage * casesPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const generatePDF = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const marginLeft = 20;
    const contentWidth = 170;
    let yPosition = 10;

    // Add Logo at the top center
    const logoUrl = userData.barangay_profile_picture;
    pdf.addImage(logoUrl, "PNG", 90, yPosition, 30, 30); // Centered at x=87.5 (page width/2 - logo width/2)

    yPosition += 35; // Move down after logo

    // Header (Centered)
    pdf.setFontSize(12);
    pdf.text("REPUBLIC OF THE PHILIPPINES", 105, yPosition + 5, {
      align: "center",
    });
    pdf.text(
      `${userData.region_name} Administrative Region`,
      105,
      yPosition + 10,
      {
        align: "center",
      }
    );
    pdf.text(userData.barangay_name, 105, yPosition + 15, { align: "center" });
    pdf.text(
      `${userData.city_name.toUpperCase()} ${
        userData.city_name.includes("City") ? "" : "CITY"
      }`,
      105,
      yPosition + 20,
      { align: "center" }
    );

    yPosition += 35;

    pdf.setFontSize(16);
    pdf.text("TRANSMITTAL FORM", 105, yPosition, { align: "center" });

    yPosition += 10;

    pdf.setFontSize(12);
    pdf.text(
      `Transmittal No: ${new Date().getDate()}${
        new Date().getMonth() + 1
      }${new Date().getFullYear()}-01`,
      marginLeft,
      yPosition
    );
    pdf.text(
      `(${new Date().getFullYear()}/${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, "0")})`,
      160,
      yPosition
    );

    yPosition += 10;

    pdf.setFontSize(14);
    pdf.text(
      `MONTHLY TRANSMITTAL OF FINAL REPORTS ${new Date()
        .toLocaleString("default", { month: "long" })
        .toUpperCase()}, ${new Date().getFullYear()}`,
      105,
      yPosition,
      { align: "center" }
    );

    yPosition += 15;

    pdf.setFontSize(12);
    pdf.text("TO: CITY COURT DILG", marginLeft, yPosition);

    yPosition += 8;

    pdf.setFontSize(10);
    pdf.text(
      "Enclosed herein are the final reports of the settlements of disputes and arbitration awards made by",
      marginLeft,
      yPosition,
      { maxWidth: contentWidth }
    );
    yPosition += 5;
    pdf.text(
      "the Punong Barangay / Pangkat Tagapagsundo in the following cases:",
      marginLeft,
      yPosition,
      { maxWidth: contentWidth }
    );

    yPosition += 10;

    // Table Setup
    const tableX = marginLeft;
    const colWidths = [40, 50, 30, 50];
    const rowHeight = 10;

    // Table Headers
    const headers = [
      "BRGY. CASE NO.",
      "COMPLAINANT/S",
      "TITLE",
      "RESPONDENT/S",
    ];

    headers.forEach((header, index) => {
      pdf.rect(
        tableX + colWidths.slice(0, index).reduce((a, b) => a + b, 0),
        yPosition,
        colWidths[index],
        rowHeight
      );
      pdf.text(
        header,
        tableX + colWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5,
        yPosition + 6
      );
    });

    yPosition += rowHeight;

    // Function to format createdAt into "MM-YYYY-XXX"
    const formatCaseNumber = (createdAt: any, index: number) => {
      const date = new Date(createdAt);
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (01-12)
      const year = date.getFullYear(); // Get year (YYYY)
      const caseNumber = String(index + 1).padStart(3, "0"); // Format index as 3-digit (001, 002, ...)
      return `${month}-${year}-${caseNumber}`;
    };

    // Table Data - Filter out failed cases
    const settledCases = casesData.filter(
      (case_: any) => case_.status !== "failed"
    );

    settledCases.forEach((row: any, index: number) => {
      const rowData = [
        formatCaseNumber(row.createdAt, index), // BRGY. CASE NO.
        row.complainant_name, // COMPLAINANT/S
        "V.S.", // TITLE
        row.respondent_name, // RESPONDENT/S
      ];

      rowData.forEach((text, colIndex) => {
        pdf.rect(
          tableX + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0),
          yPosition,
          colWidths[colIndex],
          rowHeight
        );
        pdf.text(
          text,
          tableX + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0) + 5,
          yPosition + 6
        );
      });

      yPosition += rowHeight;
    });

    yPosition += 15;

    // Footer
    pdf.setFontSize(12);
    pdf.text("Prepared by:", marginLeft, yPosition);
    pdf.text(
      userData.barangay_secretary.toUpperCase(),
      marginLeft,
      yPosition + 10
    );
    pdf.text("Barangay Secretary", marginLeft, yPosition + 15);
    pdf.text("_________________________", marginLeft, yPosition + 20);

    pdf.text("Attested by:", 120, yPosition);
    pdf.text(userData.barangay_captain.toUpperCase(), 120, yPosition + 10);
    pdf.text("Punong Barangay / Lupon Chairman", 120, yPosition + 15);
    pdf.text("_________________________", 120, yPosition + 20);

    // Save PDF
    pdf.save("monthly_transmittal.pdf");
  };

  // gerate DILG REPORT

  const generateDILGReport = () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "legal", // Using legal size for longer paper
    });

    // Set default font
    pdf.setFont("helvetica", "normal");

    // Calculate page width to fit content properly
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;
    // Header text
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");

    // Add logo on the left side
    // Calculate logo positions with 50px gap from center (convert px to mm)
    const gapInMm = 160 * 0.264583; // Convert 50px to mm
    const logoWidth = 20;
    const logoHeight = 20;
    const logoY = 7;

    // Position logos 50px away from center on each side
    const leftLogoX = centerX - logoWidth - gapInMm;
    const rightLogoX = centerX + gapInMm;

    // Add logo on the left side
    pdf.addImage(dilg_logo, "PNG", leftLogoX, logoY, logoWidth, logoHeight);

    // Add logo on the right side
    pdf.addImage(lupong_logo, "PNG", rightLogoX, logoY, logoWidth, logoHeight);

    // Center text between logos
    pdf.text("CY LUPONG TAGAPAMAYAPA", centerX, 15, { align: "center" });
    pdf.text("LTIA MONTHLY REPORT", centerX, 22, { align: "center" });

    // Form details
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const startY = 30;

    let currentY = startY;
    // Form fields in table format
    const tableStartX = 15;
    const tableWidthHeader = pageWidth - 30;
    const rowHeight = 7;
    const labelValueMargin = 50; // 50px margin between label and value

    // Calculate the width for the right-side box that will span all rows
    const rightBoxWidth = 30; // Width for the right-side box
    const mainTableWidth = tableWidthHeader - rightBoxWidth;

    // Draw table borders
    pdf.rect(tableStartX, currentY, mainTableWidth, rowHeight * 4); // Main table border

    // Draw the right-side box that spans all rows
    pdf.rect(
      tableStartX + mainTableWidth,
      currentY,
      rightBoxWidth,
      rowHeight * 4
    );

    // Horizontal lines
    pdf.line(
      tableStartX,
      currentY + rowHeight,
      tableStartX + mainTableWidth,
      currentY + rowHeight
    );
    pdf.line(
      tableStartX,
      currentY + rowHeight * 2,
      tableStartX + mainTableWidth,
      currentY + rowHeight * 2
    );
    pdf.line(
      tableStartX,
      currentY + rowHeight * 3,
      tableStartX + mainTableWidth,
      currentY + rowHeight * 3
    );

    // Vertical line separating labels from values
    // Convert 50px to mm (assuming 1px = 0.264583 mm)
    const labelWidth = 65 + labelValueMargin * 0.264583;
    pdf.line(
      tableStartX + labelWidth,
      currentY,
      tableStartX + labelWidth,
      currentY + rowHeight * 4
    );

    // Add table content
    pdf.text("NAME OF LUPONG TAGAPAMAYAPA:", tableStartX + 2, currentY + 5);
    pdf.text(
      userData.barangay_name.toUpperCase(),
      tableStartX + labelWidth + 2,
      currentY + 5
    );

    pdf.text("BARANGAY:", tableStartX + 2, currentY + rowHeight + 5);
    pdf.text(
      "BARANGAY " + userData.barangay_name.toUpperCase(),
      tableStartX + labelWidth + 2,
      currentY + rowHeight + 5
    );

    pdf.text(
      "CITY/MUNICIPALITY:",
      tableStartX + 2,
      currentY + rowHeight * 2 + 5
    );
    pdf.text(
      userData.city_name.toUpperCase(),
      tableStartX + labelWidth + 2,
      currentY + rowHeight * 2 + 5
    );

    pdf.text("REGION:", tableStartX + 2, currentY + rowHeight * 3 + 5);
    pdf.text(
      userData.region_name.toUpperCase(),
      tableStartX + labelWidth + 2,
      currentY + rowHeight * 3 + 5
    );

    // Add image on the right side
    try {
      // You can replace this with your actual logo or image path
      const imgData = userData.barangay_profile_picture;

      // Calculate position to center the image in the right box
      const rightBoxX = tableStartX + mainTableWidth;
      const rightBoxY = currentY;
      const imageWidth = rightBoxWidth - 4; // Leave a small margin
      const imageHeight = rowHeight * 4 - 4; // Leave a small margin

      // Position the image centered in the right box
      pdf.addImage(
        imgData,
        "PNG",
        rightBoxX + 2, // 2mm margin from left of box
        rightBoxY + 2, // 2mm margin from top of box
        imageWidth,
        imageHeight
      );
    } catch (error) {
      console.error("Error adding image:", error);
    }

    // Update currentY to be after the table
    currentY += rowHeight * 4;

    // Add "LIST OF CASES" header with yellow background
    const listHeaderHeight = 10;
    pdf.setFontSize(14);
    pdf.setFillColor(255, 255, 0); // Yellow background
    pdf.rect(15, currentY, pageWidth - 30, listHeaderHeight, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0); // Black text
    pdf.text("LIST OF CASES", centerX, currentY + 7, { align: "center" });

    currentY += listHeaderHeight;

    // Adjust table to fit the width of the landscape legal page
    const tableWidth = pageWidth - 30; // 15mm margins on each side
    const headers = [
      { title: "CASE NO.", width: tableWidth * 0.05 },
      { title: "CASE TITLE", width: tableWidth * 0.1 },
      { title: "COMPLAINANT TITLE", width: tableWidth * 0.1 },
      { title: "NATURE", width: tableWidth * 0.08 },
      { title: "DATE FILED", width: tableWidth * 0.08 },
      { title: "DATE OF INITIAL CONFRONTATION", width: tableWidth * 0.1 },
      { title: "ACTION TAKEN", width: tableWidth * 0.08 },
      { title: "DATE OF SETTLEMENT", width: tableWidth * 0.08 },
      { title: "DATE OF EXECUTION OF SETTLEMENT", width: tableWidth * 0.1 },
      { title: "MAIN POINT OF AGREEMENT", width: tableWidth * 0.1 },
      { title: "STATUS OF COMPLIANCE", width: tableWidth * 0.08 },
      { title: "REMARKS", width: tableWidth * 0.05 },
    ];

    let startX = 15;
    // Draw table headers with double height (two rows)
    const headerRowHeight = 18; // Double the normal row height
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    headers.forEach((header) => {
      pdf.rect(startX, currentY, header.width, headerRowHeight);
      // Center text vertically in the taller header cell
      pdf.text(
        header.title,
        startX + header.width / 2,
        currentY + headerRowHeight / 2,
        {
          maxWidth: header.width,
          align: "center",
        }
      );
      startX += header.width;
    });

    // Table data
    currentY += headerRowHeight;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10); // Slightly smaller font for data to fit better

    casesData.forEach((caseItem: any) => {
      startX = 15;
      const baseRowHeight = 8;

      // Format case number as shown in image

      const caseNumber = caseItem.case_id_number;
      const casetitlte = `${caseItem.complainant_name} (vs) ${caseItem.respondent_name}`;
      // Case data array
      const rowData = [
        { text: caseNumber, width: headers[0].width },
        { text: casetitlte || "", width: headers[1].width },
        { text: caseItem.type || "", width: headers[2].width },
        { text: caseItem.case_type || "Civil", width: headers[3].width },
        {
          text: new Date(caseItem.createdAt).toLocaleDateString(),
          width: headers[4].width,
        },
        {
          text: caseItem.initial_confrontation_date
            ? new Date(caseItem.initial_confrontation_date).toLocaleDateString()
            : "",
          width: headers[5].width,
        },
        { text: caseItem.action_taken || "", width: headers[6].width },
        {
          text: caseItem.settlement_date
            ? new Date(caseItem.settlement_date).toLocaleDateString()
            : "",
          width: headers[7].width,
        },
        {
          text: caseItem.execution_date
            ? new Date(caseItem.execution_date).toLocaleDateString()
            : "",
          width: headers[8].width,
        },
        { text: caseItem.agreement_points || "", width: headers[9].width },
        { text: caseItem.compliance_status || "", width: headers[10].width },
        { text: caseItem.remarks || "", width: headers[11].width },
      ];

      // Calculate the maximum height needed for each cell
      const cellHeights = rowData.map((cell) => {
        // Get the text width based on font size and content
        const textLines = pdf.splitTextToSize(cell.text, cell.width - 4);
        return Math.max(baseRowHeight, textLines.length * 4); // 4mm per line of text
      });

      // Use the tallest cell to determine row height
      const rowHeight = Math.max(...cellHeights);

      // Draw row cells with dynamic height
      rowData.forEach((cell, cellIndex) => {
        pdf.rect(startX, currentY, cell.width, rowHeight);

        // Split text to fit within cell width
        const textLines = pdf.splitTextToSize(cell.text, cell.width - 4);

        // Calculate vertical position to center text in cell
        const textY = currentY + 4; // Start 4mm from top of cell

        // Add each line of text
        textLines.forEach((line: string, lineIndex: number) => {
          pdf.text(
            line,
            startX + 2,
            textY + lineIndex * 4, // 4mm line height
            {
              maxWidth: cell.width - 4,
            }
          );
        });

        startX += cell.width;
      });

      currentY += rowHeight;

      // Check if we need a new page
      if (currentY > pageHeight - 20) {
        pdf.addPage();
        currentY = 20;
      }
    });

    // Add signature section at the bottom
    currentY += 15;
    pdf.setFont("helvetica", "normal");
    pdf.text("Prepared by:", 15, currentY);
    pdf.text("Attested by:", pageWidth - 80, currentY);

    currentY += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text(userData.barangay_secretary.toUpperCase(), 15, currentY);
    pdf.text(userData.barangay_captain.toUpperCase(), pageWidth - 80, currentY);

    currentY += 7;
    pdf.setFont("helvetica", "normal");
    pdf.text("Barangay Secretary", 15, currentY);
    pdf.text("Punong Barangay / Lupon Chairman", pageWidth - 80, currentY);

    // Save the PDF
    pdf.save("DILG_monthly_report.pdf");
  };

  if (casesData.length === 0) {
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
            title="Empty Archives"
            description="No cases available, manage ongoing cases"
          />
        </Box>
      </ClientOnly>
    );
  }
  return (
    <Box
      data-state="open"
      _open={{
        animation: "fade-in 300ms ease-out",
      }}
      padding={5}
    >
      {/* Search and Add New Case */}
      <Box className="flex items-center justify-between gap-2">
        <Box className="flex items-center gap-2">
          <Input
            type="search"
            width={300}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button
            onClick={generatePDF}
            colorPalette={"blue"}
            variant={"subtle"}
          >
            Generate Report
            <LuDownload />
          </Button>

          <Button
            onClick={generateDILGReport}
            colorPalette={"green"}
            variant={"subtle"}
          >
            DILG Report
            <LuDownload />
          </Button>
        </Box>

        {/* Pagination */}
        <Box className="flex justify-center items-center gap-2">
          <IconButton
            size={"xs"}
            variant={"subtle"}
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            <IoIosArrowBack />
          </IconButton>
          <span className="text-sm font-display">
            Page {currentPage} of {totalPages}
          </span>
          <IconButton
            size={"xs"}
            variant={"subtle"}
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            <IoIosArrowForward />
          </IconButton>
        </Box>
      </Box>

      {/* Available Cases */}
      <Box marginY={5}>
        <h2 className="font-display flex items-center gap-2">
          <span className="text-lg">
            <IoFolderOpen />
          </span>
          <span>Available Cases : {casesData.length}</span>
        </h2>
      </Box>

      {/* Cases Grid */}
      <Box
        display={"grid"}
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        gap={4}
      >
        {paginatedCases.map((val: any) => (
          <CasesCardContainer
            key={val._id}
            {...val}
            userType={userData.userType}
          />
        ))}
      </Box>

      {/* selected case modal */}
    </Box>
  );
};

export default ArchivesPage;
