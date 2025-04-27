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
import { getCases } from "@/backendapi/caseApi";
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
    const attempt1Data = await attempt1(data?.id, data);

    return attempt1Data;
  }

  if (data.type === "attempt2") {
    const attempt1Data = await attempt2(data?.id, data);

    return attempt1Data;
  }

  if (data.type === "attempt3") {
    const attempt1Data = await attempt3(data?.id, data);

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
  const allcasesData = await getCases(userData?.id);
  return { userData, casesData, allcasesData };
};

import CasesCardContainer from "@/systemComponents/CasesCardContainer";

const ArchivesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const { casesData, userData, allcasesData } = useLoaderData() as any;

  console.log(casesData);

  const casesPerPage = 8;
  const filteredCases = casesData.filter(
    (c: any) =>
      c.complainant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.respondent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.case_id_number.toLowerCase().includes(searchTerm.toLowerCase())
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
      format: "legal",
    });

    // Set default font and calculate dimensions
    pdf.setFont("helvetica", "normal");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;

    // Header section
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");

    // Logo positioning
    const gapInMm = 160 * 0.264583;
    const logoWidth = 20;
    const logoHeight = 20;
    const logoY = 7;
    const leftLogoX = centerX - logoWidth - gapInMm;
    const rightLogoX = centerX + gapInMm;

    // Add logos
    pdf.addImage(dilg_logo, "PNG", leftLogoX, logoY, logoWidth, logoHeight);
    pdf.addImage(lupong_logo, "PNG", rightLogoX, logoY, logoWidth, logoHeight);

    // Header text
    pdf.text("CY LUPONG TAGAPAMAYAPA", centerX, 15, { align: "center" });
    pdf.text("LTIA MONTHLY REPORT", centerX, 22, { align: "center" });

    // Form details section
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    let currentY = 30;

    // Table configuration
    const tableStartX = 15;
    const tableWidthHeader = pageWidth - 30;
    const rowHeight = 7;
    const labelValueMargin = 50;
    const rightBoxWidth = 30;
    const mainTableWidth = tableWidthHeader - rightBoxWidth;
    const labelWidth = 65 + labelValueMargin * 0.264583;

    // Draw main table structure
    pdf.rect(tableStartX, currentY, mainTableWidth, rowHeight * 4);
    pdf.rect(
      tableStartX + mainTableWidth,
      currentY,
      rightBoxWidth,
      rowHeight * 4
    );

    // Draw horizontal lines
    for (let i = 1; i <= 3; i++) {
      pdf.line(
        tableStartX,
        currentY + rowHeight * i,
        tableStartX + mainTableWidth,
        currentY + rowHeight * i
      );
    }

    // Draw vertical separator
    pdf.line(
      tableStartX + labelWidth,
      currentY,
      tableStartX + labelWidth,
      currentY + rowHeight * 4
    );

    // Add table content
    const tableContent = [
      { label: "NAME OF LUPONG TAGAPAMAYAPA:", value: userData.barangay_name },
      { label: "BARANGAY CAPTAIN:", value: userData.barangay_captain },
      { label: "CITY/MUNICIPALITY:", value: userData.city_name },
      { label: "REGION:", value: userData.region_name },
    ];

    tableContent.forEach((item, index) => {
      pdf.text(item.label, tableStartX + 2, currentY + rowHeight * index + 5);
      pdf.text(
        item.value.toUpperCase(),
        tableStartX + labelWidth + 2,
        currentY + rowHeight * index + 5
      );
    });

    // Add barangay profile picture
    try {
      const imgData = userData.barangay_profile_picture;
      const rightBoxX = tableStartX + mainTableWidth;
      const imageWidth = rightBoxWidth - 4;
      const imageHeight = rowHeight * 4 - 4;

      pdf.addImage(
        imgData,
        "PNG",
        rightBoxX + 2,
        currentY + 2,
        imageWidth,
        imageHeight
      );
    } catch (error) {
      console.error("Error adding image:", error);
    }

    // Update position for next section
    currentY += rowHeight * 4;

    // List of Cases header
    const listHeaderHeight = 10;
    pdf.setFontSize(14);
    pdf.setFillColor(255, 255, 0);
    pdf.rect(15, currentY, pageWidth - 30, listHeaderHeight, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("LIST OF CASES", centerX, currentY + 7, { align: "center" });

    currentY += listHeaderHeight;

    // Table headers configuration
    const tableWidth = pageWidth - 30;
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

    // Draw headers
    let startX = 15;
    const headerRowHeight = 18;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    headers.forEach((header) => {
      pdf.rect(startX, currentY, header.width, headerRowHeight);
      pdf.text(
        header.title,
        startX + header.width / 2,
        currentY + headerRowHeight / 2,
        { maxWidth: header.width, align: "center" }
      );
      startX += header.width;
    });

    // Table data
    currentY += headerRowHeight;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    casesData.forEach((caseItem: any) => {
      startX = 15;
      const baseRowHeight = 8;
      const caseNumber = caseItem.case_id_number;
      const caseTitle = `${caseItem.complainant_name} (vs) ${caseItem.respondent_name}`;

      const rowData = [
        { text: caseNumber, width: headers[0].width },
        { text: caseTitle || "", width: headers[1].width },
        { text: caseItem.case_type || "", width: headers[2].width },
        {
          text: caseItem.nature_of_the_case || "Civil",
          width: headers[3].width,
        },
        { text: caseItem.date_filed || "", width: headers[4].width },
        {
          text: new Date(caseItem.createdAt).toLocaleDateString(),
          width: headers[5].width,
        },
        { text: caseItem.action_taken || "", width: headers[6].width },
        { text: caseItem.date_of_settlement || "", width: headers[7].width },
        { text: caseItem.date_of_settlement || "", width: headers[8].width },
        { text: caseItem.point_of_agreement || "", width: headers[9].width },
        { text: caseItem.status_of_agreement || "", width: headers[10].width },
        { text: caseItem.remarks || "", width: headers[11].width },
      ];

      // Calculate row height
      const cellHeights = rowData.map((cell) => {
        const textLines = pdf.splitTextToSize(cell.text, cell.width - 4);
        return Math.max(baseRowHeight, textLines.length * 4);
      });
      const rowHeight = Math.max(...cellHeights);

      // Draw cells
      rowData.forEach((cell) => {
        pdf.rect(startX, currentY, cell.width, rowHeight);
        const textLines = pdf.splitTextToSize(cell.text, cell.width - 4);
        const textY = currentY + 4;

        textLines.forEach((line: string, lineIndex: number) => {
          pdf.text(line, startX + 2, textY + lineIndex * 4, {
            maxWidth: cell.width - 4,
          });
        });

        startX += cell.width;
      });

      currentY += rowHeight;

      // Add new page if needed
      if (currentY > pageHeight - 20) {
        pdf.addPage();
        currentY = 20;
      }
    });

    // Signature section
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

  const generateCasesSummary = () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "legal",
    });

    pdf.setFont("helvetica", "normal");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    const headerHeight = 12;
    const tableHeight = 90;
    const startX = 25;
    const tableWidth = 300;
    const yPos = 110;

    // Add DILG Logo
    pdf.addImage(dilg_logo, "PNG", 20, 10, 15, 15);

    // Header text
    pdf.setFontSize(14);
    pdf.text("CY LUPONG TAGAPAMAYAPA INCENTIVES AWARDS (LTIA)", centerX, 15, {
      align: "center",
    });
    pdf.text("LTIA FORM 06-SUMMARY OF CASES", centerX, 22, { align: "center" });

    // Category box
    pdf.setFontSize(10);
    pdf.rect(25, 30, pageWidth - 50, 10);
    pdf.text("CATEGORY: HIGHLY URBANIZED CITY", centerX, 36, {
      align: "center",
    });

    const leftBoxWidth = (pageWidth - 50) * 0.7;
    const rightBoxWidth = (pageWidth - 50) * 0.3;

    const leftInfo = [
      "FINALIST LUPONG TAGAPAMAYAPA: BARANGAY SAMPLE",
      "PUNONG BARANGAY: JOHN DOE",
      "CITY/MUNICIPALITY: SAMPLE CITY",
      "MAYOR: HON. RONNIE VICENTE C. LAGNADA",
      "PROVINCE: AGUSAN DEL NORTE",
      "REGION: CARAGA",
    ];

    leftInfo.forEach((text, index) => {
      const itemY = 45 + 8 + index * 8;
      pdf.rect(25, itemY - 5, leftBoxWidth, 8);
      pdf.text(text, 30, itemY);
    });

    const rightBoxX = 25 + leftBoxWidth + 5;
    const rightInfo = [
      "POPULATION: 14,382",
      "LAND AREA: 1,873",
      "TOTAL NO. OF CASES: 50",
      "NUMBER OF LUPONS: 11",
      "MALE: 6",
      "FEMALE: 5",
    ];

    rightInfo.forEach((text, index) => {
      const itemY = 45 + 8 + index * 8;
      pdf.rect(25 + leftBoxWidth, itemY - 5, rightBoxWidth, 8);
      pdf.text(text, rightBoxX, itemY);
    });

    // Main table
    pdf.rect(startX, yPos, tableWidth, tableHeight);

    const colWidths = {
      natureOfCases: 70,
      settled: 70,
      notSettled: 110,
      outside: 25,
      totalCases: 25,
    };

    // Vertical lines
    let currentX = startX;
    Object.values(colWidths).forEach((width) => {
      pdf.line(currentX, yPos, currentX, yPos + tableHeight);
      currentX += width;
    });
    pdf.line(currentX, yPos, currentX, yPos + tableHeight); // last vertical

    // Horizontal lines
    pdf.line(startX, yPos, startX + tableWidth, yPos); // Top
    pdf.line(
      startX + colWidths.natureOfCases,
      yPos + headerHeight,
      startX + tableWidth,
      yPos + headerHeight
    );
    pdf.line(
      startX,
      yPos + headerHeight * 2,
      startX + tableWidth,
      yPos + headerHeight * 2
    );
    pdf.line(
      startX,
      yPos + headerHeight * 3,
      startX + tableWidth,
      yPos + headerHeight * 3
    );

    // Sub vertical between SETTLED and NOT SETTLED
    const settledX = startX + colWidths.natureOfCases;
    const notSettledX = settledX + colWidths.settled;
    pdf.line(
      notSettledX,
      yPos + headerHeight,
      notSettledX,
      yPos + headerHeight * 2
    );

    // HEADERS
    pdf.setFontSize(9);
    pdf.text(
      "NATURE OF CASES (1)",
      startX + colWidths.natureOfCases / 2,
      yPos + headerHeight,
      {
        align: "center",
        baseline: "middle",
      }
    );

    pdf.text(
      "ACTION TAKEN",
      settledX + (colWidths.settled + colWidths.notSettled) / 2,
      yPos + headerHeight / 2,
      {
        align: "center",
        baseline: "middle",
      }
    );

    pdf.text(
      "SETTLED (4)",
      settledX + colWidths.settled / 2,
      yPos + headerHeight + 7,
      {
        align: "center",
      }
    );

    pdf.text(
      "NOT SETTLED (3)",
      notSettledX + colWidths.notSettled / 2,
      yPos + headerHeight + 7,
      {
        align: "center",
      }
    );

    // Sub-headers with their corresponding numbers
    const natureHeaders = [
      {
        text: "CRIMINAL",
        number: casesData.filter(
          (caseItem: any) => caseItem.nature_of_the_case === "Criminal"
        ).length,
      },
      {
        text: "CIVIL",
        number: casesData.filter(
          (caseItem: any) => caseItem.nature_of_the_case === "Civil"
        ).length,
      },
      {
        text: "OTHERS",
        number: casesData.filter(
          (caseItem: any) =>
            caseItem.nature_of_the_case !== "Criminal" &&
            caseItem.nature_of_the_case !== "Civil"
        ).length,
      },
      { text: "TOTAL", number: casesData.length },
    ];
    let subX = startX;
    const natureColWidth = colWidths.natureOfCases / 4;
    natureHeaders.forEach((header, i) => {
      pdf.text(
        header.text,
        subX + natureColWidth / 2,
        yPos + headerHeight * 2 + 7,
        {
          align: "center",
          maxWidth: natureColWidth - 2,
        }
      );
      // Add sample values
      pdf.text(
        header.number.toString(),
        subX + natureColWidth / 2,
        yPos + tableHeight - 5,
        {
          align: "center",
        }
      );
      subX += natureColWidth;
      if (i < natureHeaders.length) {
        pdf.line(subX, yPos + headerHeight * 2, subX, yPos + tableHeight);
      }
    });

    const settledHeaders = [
      {
        text: "MEDIATION",
        number: casesData.filter(
          (caseItem: any) => caseItem.action_taken === "Mediation"
        ).length,
      },
      {
        text: "CONCILIATION",
        number: casesData.filter(
          (caseItem: any) => caseItem.action_taken === "Conciliation"
        ).length,
      },
      {
        text: "ARBITRATION",
        number: casesData.filter(
          (caseItem: any) => caseItem.action_taken === "Arbitration"
        ).length,
      },
      {
        text: "TOTAL",
        number: casesData.filter(
          (caseItem: any) => caseItem.status === "settled"
        ).length,
      },
    ];
    let currentSettledX = settledX;
    const settledColWidth = colWidths.settled / 4;
    settledHeaders.forEach((header, i) => {
      pdf.text(
        header.text,
        currentSettledX + settledColWidth / 2,
        yPos + headerHeight * 2 + 7,
        {
          align: "center",
          maxWidth: settledColWidth - 2,
        }
      );
      // Add sample values
      pdf.text(
        header.number.toString(),
        currentSettledX + settledColWidth / 2,
        yPos + tableHeight - 5,
        {
          align: "center",
        }
      );
      currentSettledX += settledColWidth;
      if (i < settledHeaders.length) {
        pdf.line(
          currentSettledX,
          yPos + headerHeight * 2,
          currentSettledX,
          yPos + tableHeight
        );
      }
    });

    const notSettledHeaders = [
      { text: "PENDING", number: allcasesData.length },
      {
        text: "DISMISSED",
        number: casesData.filter(
          (caseItem: any) => caseItem.action_taken === "Dismissed"
        ).length,
      },
      {
        text: "REPUDIATED",
        number: casesData.filter(
          (caseItem: any) => caseItem.action_taken === "Repudiated"
        ).length,
      },
      {
        text: "CERTIFICATE TO FILE IN COURT",
        number: casesData.filter(
          (caseItem: any) =>
            caseItem.action_taken === "Certificate to file in action"
        ).length,
      },
      {
        text: "WITHDRAWN",
        number: casesData.filter(
          (caseItem: any) => caseItem.action_taken === "Withdrawn"
        ).length,
      },
      {
        text: "TOTAL",
        number: casesData.filter(
          (caseItem: any) => caseItem.status === "failed"
        ).length,
      },
    ];
    let currentNotSettledX = notSettledX;
    const notSettledColWidth = colWidths.notSettled / 6;
    notSettledHeaders.forEach((header, i) => {
      const headerLines = pdf.splitTextToSize(
        header.text,
        notSettledColWidth - 2
      );
      pdf.text(
        headerLines,
        currentNotSettledX + notSettledColWidth / 2,
        yPos + headerHeight * 2 + 3,
        {
          align: "center",
        }
      );
      // Add sample values
      pdf.text(
        header.number.toString(),
        currentNotSettledX + notSettledColWidth / 2,
        yPos + tableHeight - 5,
        {
          align: "center",
        }
      );
      currentNotSettledX += notSettledColWidth;
      if (i < notSettledHeaders.length) {
        pdf.line(
          currentNotSettledX,
          yPos + headerHeight * 2,
          currentNotSettledX,
          yPos + tableHeight
        );
      }
    });

    const outsideX = notSettledX + colWidths.notSettled;
    const outsideText = pdf.splitTextToSize(
      "OUTSIDE THE JURISDICTION OF THE BARANGAY",
      colWidths.outside - 2
    );
    pdf.text(
      outsideText,
      outsideX + colWidths.outside / 2,
      yPos + headerHeight + 3,
      {
        align: "center",
      }
    );
    // Add number for outside jurisdiction
    pdf.text("0", outsideX + colWidths.outside / 2, yPos + tableHeight - 5, {
      align: "center",
    });

    const totalX = outsideX + colWidths.outside;
    const totalText = pdf.splitTextToSize(
      "TOTAL CASES FILED",
      colWidths.totalCases - 2
    );
    pdf.text(
      totalText,
      totalX + colWidths.totalCases / 2,
      yPos + headerHeight + 3,
      {
        align: "center",
      }
    );
    // Add total number of cases
    pdf.text(
      (casesData.length + allcasesData.length).toString(),
      totalX + colWidths.totalCases / 2,
      yPos + tableHeight - 5,
      {
        align: "center",
      }
    );

    // Add data rows if needed
    if (casesData && Array.isArray(casesData)) {
      // Fill rows here
    }

    pdf.save("cases_summary.pdf");
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

          <Button
            onClick={generateCasesSummary}
            colorPalette={"orange"}
            variant={"subtle"}
          >
            Cases Summary
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
