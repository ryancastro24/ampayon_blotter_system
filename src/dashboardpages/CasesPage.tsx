import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Form, ActionFunction } from "react-router-dom";
import { IoFolderOpen } from "react-icons/io5";
import {
  Button,
  Input,
  Box,
  Tabs,
  createListCollection,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { PiSmileySadFill } from "react-icons/pi";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
const caseTypeArray = createListCollection({
  items: [
    { label: "Traffic Violation", value: "traffic_violation" },
    { label: "Property Dispute", value: "property_dispute" },
    { label: "Noise Complaint", value: "noise_complaint" },
    { label: "Public Nuisance", value: "public_nuisance" },
    { label: "Business Licensing", value: "business_licensing" },
    { label: "Zoning Issue", value: "zoning_issue" },
    { label: "Environmental Violation", value: "environmental_violation" },
    { label: "Public Safety", value: "public_safety" },
  ],
});
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
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

const CasesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    complainantName: "",
    complainantNumber: "",
    complainantEmail: "",
    respondentName: "",
    respondentNumber: "",
    respondentEmail: "",
    caseType: "",
    caseDescription: "",
    scheduledDate: "",
  });

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  if (cases.length === 0) {
    return (
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <EmptyState
          icon={<PiSmileySadFill />}
          title="Empty Dashboard"
          description="No cases available. Click the button below to add new case"
        />

        <DialogRoot>
          <DialogTrigger asChild>
            <Button colorPalette={"blue"} variant={"subtle"} size="sm">
              Add new case
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form method="post">
              <DialogHeader>
                <DialogTitle>Add New Case</DialogTitle>
              </DialogHeader>
              <DialogBody>
                {/* Tabs */}

                <Tabs.Root defaultValue="members">
                  <Tabs.List>
                    <Tabs.Trigger value="members">
                      Complainant Details
                    </Tabs.Trigger>
                    <Tabs.Trigger value="projects">
                      Respondent Details
                    </Tabs.Trigger>
                    <Tabs.Trigger value="tasks">Case Details</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="members">
                    <Box display="flex" flexDirection="column" gap={5}>
                      <Field label="Name" errorText="This field is required">
                        <Input
                          id="complainant_name"
                          type="text"
                          value={formData.complainantName}
                          placeholder="Enter Complainant Name"
                          onChange={(e) =>
                            handleInputChange("complainantName", e.target.value)
                          }
                          name="complainant_name"
                        />
                      </Field>

                      <Field
                        label="Phone Number"
                        errorText="This field is required"
                      >
                        <Input
                          id="complainant_number"
                          type="text"
                          value={formData.complainantName}
                          placeholder="09XXXXXXXX"
                          onChange={(e) =>
                            handleInputChange(
                              "complainantNumber",
                              e.target.value
                            )
                          }
                          name="complainant_number"
                        />
                      </Field>

                      <Field label="Email" errorText="This field is required">
                        <Input
                          id="complainant_email"
                          type="text"
                          value={formData.complainantEmail}
                          placeholder="sample@email.com"
                          name="complainant_email"
                          onChange={(e) =>
                            handleInputChange(
                              "complainantEmail",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                    </Box>
                  </Tabs.Content>

                  <Tabs.Content value="projects">
                    <Box display="flex" flexDirection="column" gap={5}>
                      <Field label="Name" errorText="This field is required">
                        <Input
                          id="respondent_name"
                          type="text"
                          value={formData.respondentName}
                          placeholder="Enter Respondent Name"
                          onChange={(e) =>
                            handleInputChange("respondentName", e.target.value)
                          }
                          name="respondent_name"
                        />
                      </Field>

                      <Field
                        label="Phone Number"
                        errorText="This field is required"
                      >
                        <Input
                          id="respondent_number"
                          type="text"
                          value={formData.respondentName}
                          placeholder="09XXXXXXXX"
                          onChange={(e) =>
                            handleInputChange(
                              "respondentNumber",
                              e.target.value
                            )
                          }
                          name="respondent_number"
                        />
                      </Field>

                      <Field label="Email" errorText="This field is required">
                        <Input
                          id="respondent_email"
                          type="text"
                          value={formData.respondentEmail}
                          placeholder="sample@email.com"
                          name="respondent_email"
                          onChange={(e) =>
                            handleInputChange("respondentEmail", e.target.value)
                          }
                        />
                      </Field>
                    </Box>
                  </Tabs.Content>
                  <Tabs.Content value="tasks">
                    <Box display="flex" flexDirection="column" gap={5}>
                      <SelectRoot
                        collection={caseTypeArray}
                        size="sm"
                        width="320px"
                      >
                        <SelectLabel>Select framework</SelectLabel>
                        <SelectTrigger>
                          <SelectValueText placeholder="Select Case Type" />
                        </SelectTrigger>
                        <SelectContent zIndex={1800}>
                          {caseTypeArray.items.map((movie) => (
                            <SelectItem item={movie} key={movie.value}>
                              {movie.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectRoot>
                      <Field
                        label="Case Description"
                        errorText="This field is required"
                      >
                        <Textarea
                          placeholder="Case Description..."
                          name="case_description"
                          resize={"none"}
                        />
                      </Field>

                      <Field
                        label="Scheduled Date"
                        errorText="This field is required"
                      >
                        <Input
                          id="Scheduled_date"
                          type="date"
                          name="scheduled_date"
                        />
                      </Field>
                    </Box>
                  </Tabs.Content>
                </Tabs.Root>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button background={"blue.500"}>Submit</Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </Form>
          </DialogContent>
        </DialogRoot>
      </Box>
    );
  }

  return (
    <Box padding={5}>
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

          <DialogRoot>
            <DialogTrigger asChild>
              <Button colorPalette={"blue"} size="sm">
                Add new case
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Form method="post">
                <DialogHeader>
                  <DialogTitle>Add New Case</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  {/* Tabs */}

                  <Tabs.Root defaultValue="members">
                    <Tabs.List>
                      <Tabs.Trigger value="members">
                        Complainant Details
                      </Tabs.Trigger>
                      <Tabs.Trigger value="projects">
                        Respondent Details
                      </Tabs.Trigger>
                      <Tabs.Trigger value="tasks">Case Details</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="members">
                      <Box display="flex" flexDirection="column" gap={5}>
                        <Field label="Name" errorText="This field is required">
                          <Input
                            id="complainant_name"
                            type="text"
                            value={formData.complainantName}
                            placeholder="Enter Complainant Name"
                            onChange={(e) =>
                              handleInputChange(
                                "complainantName",
                                e.target.value
                              )
                            }
                            name="complainant_name"
                          />
                        </Field>

                        <Field
                          label="Phone Number"
                          errorText="This field is required"
                        >
                          <Input
                            id="complainant_number"
                            type="text"
                            value={formData.complainantName}
                            placeholder="09XXXXXXXX"
                            onChange={(e) =>
                              handleInputChange(
                                "complainantNumber",
                                e.target.value
                              )
                            }
                            name="complainant_number"
                          />
                        </Field>

                        <Field label="Email" errorText="This field is required">
                          <Input
                            id="complainant_email"
                            type="text"
                            value={formData.complainantEmail}
                            placeholder="sample@email.com"
                            name="complainant_email"
                            onChange={(e) =>
                              handleInputChange(
                                "complainantEmail",
                                e.target.value
                              )
                            }
                          />
                        </Field>
                      </Box>
                    </Tabs.Content>

                    <Tabs.Content value="projects">
                      <Box display="flex" flexDirection="column" gap={5}>
                        <Field label="Name" errorText="This field is required">
                          <Input
                            id="respondent_name"
                            type="text"
                            value={formData.respondentName}
                            placeholder="Enter Respondent Name"
                            onChange={(e) =>
                              handleInputChange(
                                "respondentName",
                                e.target.value
                              )
                            }
                            name="respondent_name"
                          />
                        </Field>

                        <Field
                          label="Phone Number"
                          errorText="This field is required"
                        >
                          <Input
                            id="respondent_number"
                            type="text"
                            value={formData.respondentName}
                            placeholder="09XXXXXXXX"
                            onChange={(e) =>
                              handleInputChange(
                                "respondentNumber",
                                e.target.value
                              )
                            }
                            name="respondent_number"
                          />
                        </Field>

                        <Field label="Email" errorText="This field is required">
                          <Input
                            id="respondent_email"
                            type="text"
                            value={formData.respondentEmail}
                            placeholder="sample@email.com"
                            name="respondent_email"
                            onChange={(e) =>
                              handleInputChange(
                                "respondentEmail",
                                e.target.value
                              )
                            }
                          />
                        </Field>
                      </Box>
                    </Tabs.Content>
                    <Tabs.Content value="tasks">
                      <Box display="flex" flexDirection="column" gap={5}>
                        <SelectRoot
                          collection={caseTypeArray}
                          size="sm"
                          width="320px"
                        >
                          <SelectLabel>Select framework</SelectLabel>
                          <SelectTrigger>
                            <SelectValueText placeholder="Select Case Type" />
                          </SelectTrigger>
                          <SelectContent zIndex={1800}>
                            {caseTypeArray.items.map((movie) => (
                              <SelectItem item={movie} key={movie.value}>
                                {movie.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectRoot>
                        <Field
                          label="Case Description"
                          errorText="This field is required"
                        >
                          <Textarea
                            placeholder="Case Description..."
                            name="case_description"
                            resize={"none"}
                          />
                        </Field>

                        <Field
                          label="Scheduled Date"
                          errorText="This field is required"
                        >
                          <Input
                            id="Scheduled_date"
                            type="date"
                            name="scheduled_date"
                          />
                        </Field>
                      </Box>
                    </Tabs.Content>
                  </Tabs.Root>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogActionTrigger>
                  <Button background={"blue.500"}>Submit</Button>
                </DialogFooter>
                <DialogCloseTrigger />
              </Form>
            </DialogContent>
          </DialogRoot>
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
          <CasesCardContainer {...val} index={index} />
        ))}
      </Box>

      {/* selected case modal */}
    </Box>
  );
};

export default CasesPage;
