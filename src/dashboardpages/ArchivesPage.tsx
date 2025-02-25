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

  const { casesData } = useLoaderData() as any;

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
          <CasesCardContainer key={val._id} {...val} />
        ))}
      </Box>

      {/* selected case modal */}
    </Box>
  );
};

export default ArchivesPage;
