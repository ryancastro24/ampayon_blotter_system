import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  Form,
  ActionFunction,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { IoFolderOpen } from "react-icons/io5";
import {
  Button,
  Input,
  Box,
  Tabs,
  createListCollection,
  Textarea,
  IconButton,
  ClientOnly,
} from "@chakra-ui/react";
import { PiSmileySadFill } from "react-icons/pi";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import Loading from "@/systemComponents/Loading";
export const caseTypeArray = createListCollection({
  items: [
    { label: "Traffic Violation", value: "Traffic Violation" },
    { label: "Property Dispute", value: "Property Dispute" },
    { label: "Noise Complaint", value: "Noise Complaint" },
    { label: "Public Nuisance", value: "Public Nuisance" },
    { label: "Business Licensing", value: "Business Licensing" },
    { label: "Zoning Issue", value: "Zoning Issue" },
    { label: "Environmental Violation", value: "Environmental Violation" },
    { label: "Public Safety", value: "Public Safety" },
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
import { UserPropType } from "@/pages/Dashboard";
import {
  addCase,
  getCases,
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

  const casesData = await getCases(userData?.id);

  return { userData, casesData };
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

const CasesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { userData, casesData } = useLoaderData();

  const navigation = useNavigation();

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

                  <Tabs.Root defaultValue="complanant">
                    <Tabs.List>
                      <Tabs.Trigger value="complanant">
                        Complainant Details
                      </Tabs.Trigger>
                      <Tabs.Trigger value="respondent">
                        Respondent Details
                      </Tabs.Trigger>
                      <Tabs.Trigger value="casedescription">
                        Case Details
                      </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="complanant">
                      <Box display="flex" flexDirection="column" gap={5}>
                        <Input
                          type="hidden"
                          value={userData.barangay_name}
                          name="barangay_name"
                        />
                        <Input
                          type="hidden"
                          value={userData.city_name}
                          name="city_name"
                        />
                        <Input
                          type="hidden"
                          value={userData.region_name}
                          name="region_name"
                        />
                        <Input
                          type="hidden"
                          value={userData.id}
                          name="userId"
                        />
                        <Input
                          type="hidden"
                          value={userData.barangay_captain}
                          name="barangay_captain"
                        />
                        <Input
                          type="hidden"
                          value={userData.barangay_secretary}
                          name="barangay_secretary"
                        />
                        <Field label="Name" errorText="This field is required">
                          <Input
                            id="complainant_name"
                            type="text"
                            placeholder="Enter Complainant Name"
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
                            placeholder="09XXXXXXXX"
                            name="complainant_number"
                          />
                        </Field>

                        <Field label="Email" errorText="This field is required">
                          <Input
                            id="complainant_email"
                            type="text"
                            placeholder="sample@email.com"
                            name="complainant_email"
                          />
                        </Field>

                        <Field
                          label="Address"
                          errorText="This field is required"
                        >
                          <Input
                            id="complainant_address"
                            type="text"
                            placeholder="Enter Complainant Address"
                            name="complainant_address"
                          />
                        </Field>
                      </Box>
                    </Tabs.Content>

                    <Tabs.Content value="respondent">
                      <Box display="flex" flexDirection="column" gap={5}>
                        <Field label="Name" errorText="This field is required">
                          <Input
                            id="respondent_name"
                            type="text"
                            placeholder="Enter Respondent Name"
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
                            placeholder="09XXXXXXXX"
                            name="respondent_number"
                          />
                        </Field>

                        <Field label="Email" errorText="This field is required">
                          <Input
                            id="respondent_email"
                            type="text"
                            placeholder="sample@email.com"
                            name="respondent_email"
                          />
                        </Field>

                        <Field
                          label="Address"
                          errorText="This field is required"
                        >
                          <Input
                            id="respondent_address"
                            type="text"
                            placeholder="Enter Respondent Address"
                            name="respondent_address"
                          />
                        </Field>
                      </Box>
                    </Tabs.Content>
                    <Tabs.Content value="casedescription">
                      <Box display="flex" flexDirection="column" gap={5}>
                        <SelectRoot
                          collection={caseTypeArray}
                          size="sm"
                          width="320px"
                          name="case_type"
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
                      </Box>
                    </Tabs.Content>
                  </Tabs.Root>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogActionTrigger>
                  <Button
                    loading={navigation.state === "submitting"}
                    type="submit"
                    background={"blue.500"}
                  >
                    Submit
                  </Button>
                </DialogFooter>
                <DialogCloseTrigger />
              </Form>
            </DialogContent>
          </DialogRoot>
        </Box>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly fallback={<Loading />}>
      <Box
        data-state="open"
        _open={{
          animation: "fade-in 300ms ease-out",
        }}
        padding={5}
      >
        {/* Search and Add New Case */}
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
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
                <Button colorPalette={"blue"} size="sm" variant={"subtle"}>
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
                          <Input
                            type="hidden"
                            value={userData.barangay_name}
                            name="barangay_name"
                          />
                          <Input
                            type="hidden"
                            value={userData.city_name}
                            name="city_name"
                          />
                          <Input
                            type="hidden"
                            value={userData.region_name}
                            name="region_name"
                          />
                          <Input
                            type="hidden"
                            value={userData.id}
                            name="userId"
                          />
                          <Input
                            type="hidden"
                            value={userData.barangay_captain}
                            name="barangay_captain"
                          />
                          <Input
                            type="hidden"
                            value={userData.barangay_secretary}
                            name="barangay_secretary"
                          />

                          <Field
                            label="Name"
                            errorText="This field is required"
                          >
                            <Input
                              id="complainant_name"
                              type="text"
                              placeholder="Enter Complainant Name"
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
                              placeholder="09XXXXXXXX"
                              name="complainant_number"
                            />
                          </Field>

                          <Field
                            label="Email"
                            errorText="This field is required"
                          >
                            <Input
                              id="complainant_email"
                              type="text"
                              placeholder="sample@email.com"
                              name="complainant_email"
                            />
                          </Field>
                          <Field
                            label="Address"
                            errorText="This field is required"
                          >
                            <Input
                              id="complainant_address"
                              type="text"
                              placeholder="Enter Complainant Address"
                              name="complainant_address"
                            />
                          </Field>
                        </Box>
                      </Tabs.Content>

                      <Tabs.Content value="projects">
                        <Box display="flex" flexDirection="column" gap={5}>
                          <Field
                            label="Name"
                            errorText="This field is required"
                          >
                            <Input
                              id="respondent_name"
                              type="text"
                              placeholder="Enter Respondent Name"
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
                              placeholder="09XXXXXXXX"
                              name="respondent_number"
                            />
                          </Field>

                          <Field
                            label="Email"
                            errorText="This field is required"
                          >
                            <Input
                              id="respondent_email"
                              type="text"
                              placeholder="sample@email.com"
                              name="respondent_email"
                            />
                          </Field>

                          <Field
                            label="Address"
                            errorText="This field is required"
                          >
                            <Input
                              id="respondent_address"
                              type="text"
                              placeholder="Enter Respondent Address"
                              name="respondent_address"
                            />
                          </Field>
                        </Box>
                      </Tabs.Content>
                      <Tabs.Content value="tasks">
                        <Box display="flex" flexDirection="column" gap={5}>
                          <SelectRoot
                            name="case_type"
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
                                <SelectItem item={movie} key={movie.label}>
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
                        </Box>
                      </Tabs.Content>
                    </Tabs.Root>
                  </DialogBody>
                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <Button
                      loading={navigation.state === "submitting"}
                      type="submit"
                      background={"blue.500"}
                    >
                      Submit
                    </Button>
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
              variant={"surface"}
              disabled={currentPage === 1}
              onClick={handlePrevPage}
              colorPalette={"blue"}
            >
              <IoIosArrowBack />
            </IconButton>
            <span className="text-sm font-display">
              Page {currentPage} of {totalPages}
            </span>
            <IconButton
              size={"xs"}
              variant={"surface"}
              disabled={currentPage === totalPages}
              colorPalette={"blue"}
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
    </ClientOnly>
  );
};

export default CasesPage;
