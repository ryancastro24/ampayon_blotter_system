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
