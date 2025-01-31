import { Box, Text, Separator, Grid, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CasesCardContainer from "./CasesCardContainer";
import { IoChevronBackCircle } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { IoFolderOpen } from "react-icons/io5";
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
const BarangayCases = () => {
  const navigate = useNavigate();
  return (
    <Box
      data-state="open"
      _open={{
        animation: "fade-in 500ms ease-out",
      }}
      width={"full"}
      height={"full"}
      display={"flex"}
      flexDirection={"column"}
      gap={5}
      padding={5}
    >
      <Box display={"flex"} alignItems={"center"} gap={5}>
        <Box>
          <Button
            onClick={() => navigate(-1)}
            colorPalette={"red"}
            variant={"subtle"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <IoChevronBackCircle />
            Back to users
          </Button>
        </Box>

        <Separator orientation="vertical" height="8" />
        <Box>
          <Text
            display={"flex"}
            alignItems={"center"}
            gap={1}
            fontWeight={"bold"}
          >
            <FaLocationDot />
            Barangay Ampayon
          </Text>
          <Text
            color="gray.500"
            display={"flex"}
            alignItems={"center"}
            gap={1}
            fontSize={"sm"}
          >
            <IoFolderOpen /> Total: 52 Cases
          </Text>
        </Box>
      </Box>

      <Grid templateColumns="repeat(4, 1fr)" gap="6">
        {cases.map((val, index) => (
          <CasesCardContainer key={index} {...val} index={index} />
        ))}
      </Grid>
    </Box>
  );
};

export default BarangayCases;
