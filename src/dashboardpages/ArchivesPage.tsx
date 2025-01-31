import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ActionFunction } from "react-router-dom";
import { IoFolderOpen } from "react-icons/io5";
import { Input, Box, IconButton, Button } from "@chakra-ui/react";
import { LuDownload } from "react-icons/lu";
export const action: ActionFunction = async ({ request }) => {
  console.log(request.method);
  console.log(request);
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  if (request.method == "POST") {
    console.log("Post Method", data);
  }

  if (request.method == "PUT") {
    console.log("Put Method", data);
  }

  return { data };
};

import CasesCardContainer from "@/systemComponents/CasesCardContainer";

const cases = [
  {
    complainant: "John Doe",
    respondent: "Jane Smith",
    dateOfAppointment: "2025-01-25",
    caseType: "Property Dispute",
    status: "Ongoing",
    case_number: 1,
  },
  {
    complainant: "Alice Johnson",
    respondent: "Bob Williams",
    dateOfAppointment: "2025-01-26",
    status: "Ongoing",
    caseType: "Contract Violation",
    case_number: 2,
  },
  {
    complainant: "Carlos Martinez",
    respondent: "Sophia Brown",
    dateOfAppointment: "2025-01-27",
    status: "Ongoing",
    caseType: "Workplace Harassment",
    case_number: 3,
  },
  {
    complainant: "Emily Davis",
    respondent: "Michael Wilson",
    dateOfAppointment: "2025-01-28",
    status: "Settled",
    caseType: "Tenant-Landlord Conflict",
    case_number: 4,
  },
  {
    complainant: "George Lopez",
    respondent: "Karen Taylor",
    dateOfAppointment: "2025-01-29",
    status: "Settled",
    caseType: "Consumer Rights Violation",
    case_number: 5,
  },
  {
    complainant: "Hannah Lee",
    respondent: "Ryan Harris",
    dateOfAppointment: "2025-01-30",
    status: "Ongoing",
    caseType: "Family Dispute",
    case_number: 6,
  },
  {
    complainant: "Liam Clark",
    respondent: "Olivia Young",
    dateOfAppointment: "2025-02-01",
    status: "Failed",
    caseType: "Insurance Fraud",
    case_number: 7,
  },
  {
    complainant: "Noah White",
    respondent: "Emma Green",
    dateOfAppointment: "2025-02-02",
    status: "Ongoing",
    caseType: "Cybercrime",
    case_number: 8,
  },
  {
    complainant: "Zoe Adams",
    respondent: "Mason Thompson",
    dateOfAppointment: "2025-02-03",
    status: "Settled",
    caseType: "Defamation",
    case_number: 9,
  },
  {
    complainant: "Lucas Scott",
    respondent: "Lily Turner",
    dateOfAppointment: "2025-02-04",
    status: "Ongoing",
    caseType: "Intellectual Property Dispute",
    case_number: 10,
  },
];

const ArchivesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const casesPerPage = 8;
  const filteredCases = cases.filter(
    (c) =>
      c.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.respondent.toLowerCase().includes(searchTerm.toLowerCase())
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

          <Button colorPalette={"blue"} variant={"subtle"}>
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
          <span>Available Cases : {cases.length}</span>
        </h2>
      </Box>

      {/* Cases Grid */}
      <Box
        display={"grid"}
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        gap={4}
      >
        {paginatedCases.map((val, index) => (
          <CasesCardContainer key={index} {...val} index={index} />
        ))}
      </Box>

      {/* selected case modal */}
    </Box>
  );
};

export default ArchivesPage;
