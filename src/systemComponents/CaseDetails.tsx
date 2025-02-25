import {
  Box,
  Grid,
  Icon,
  Button,
  Text,
  Collapsible,
  Image,
  EmptyState,
  CheckboxCard,
  Input,
  VStack,
} from "@chakra-ui/react";
import { IoIosWarning } from "react-icons/io";
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
import { FaFaceSadCry } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { InputGroup } from "@/components/ui/input-group";
import { CloseButton } from "@/components/ui/close-button";
import { IoIosArrowDown } from "react-icons/io";
import { LuFileUp } from "react-icons/lu";
import {
  LoaderFunctionArgs,
  useNavigate,
  ActionFunction,
  useLoaderData,
  Form,
  useNavigation,
} from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import {
  FileUploadClearTrigger,
  FileInput,
  FileUploadLabel,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import {
  getSpecificCase,
  uploadDoucmentaryImages,
  uploadCaseForms,
} from "@/backendapi/caseApi";
import { FiDownload, FiUpload } from "react-icons/fi";
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  const caseDetails = await getSpecificCase(id);

  return { caseDetails };
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data: Record<string, FormDataEntryValue> = Object.fromEntries(
      formData.entries()
    );

    // Create a FormData instance to send the data to the Express API
    const apiFormData = new FormData();

    // Append each field in the data to the FormData
    Object.keys(data).forEach((key) => {
      // Handle different types of data, e.g., file upload
      const value = data[key];
      if (value instanceof File) {
        apiFormData.append(key, value, value.name);
      } else {
        apiFormData.append(key, value as string);
      }
    });

    if (data.transactionType === "caseFormUpload") {
      const uploadCaseFormsData = await uploadCaseForms(data.id, apiFormData);
      return uploadCaseFormsData;
    }

    if (data.transactionType === "documentationUpload") {
      const uploadImageData = await uploadDoucmentaryImages(
        data.id,
        apiFormData
      );

      return uploadImageData;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message); // Now TypeScript knows error is an instance of Error
    } else {
      console.log("An unknown error occurred");
    }
  }
};
const CaseDetails = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { caseDetails } = useLoaderData();

  // Initialize state with items from local storage (if any)
  const [selectedImages, setSelectedImages] = useState(() => {
    const stored = localStorage.getItem("selectedImages");
    return stored ? JSON.parse(stored) : [];
  });

  // Sync the selected images state to local storage on every change
  useEffect(() => {
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
  }, [selectedImages]);

  // Handle checkbox change events
  const handleCheckboxChange = (photoUrl: any, checked: any) => {
    if (checked) {
      // Add the image if it's not already in the state
      setSelectedImages((prev: any) =>
        prev.includes(photoUrl) ? prev : [...prev, photoUrl]
      );
    } else {
      // Remove the image from the state (and therefore from local storage)
      setSelectedImages((prev: any) =>
        prev.filter((url: any) => url !== photoUrl)
      );
    }
  };

  return (
    <Grid
      templateColumns="repeat(2, 1fr)"
      gap="5"
      width={"full"}
      height={"full"}
      padding={5}
    >
      <Box
        width={"full"}
        height={"full"}
        display={"flex"}
        flexDirection={"column"}
        gap={5}
      >
        <Box display={"flex"} alignItems={"center"} gap={5}>
          <Button
            size={"xs"}
            width={"80px"}
            onClick={() => navigate(-1)}
            colorPalette={"red"}
            variant={"surface"}
            display={"flex"}
            alignItems={"center"}
            gap={2}
          >
            <Icon>
              <TiArrowBack />
            </Icon>
            Back
          </Button>

          {/* upload forms */}
          <DialogRoot>
            <DialogTrigger asChild>
              <Button
                size={"xs"}
                colorPalette={"blue"}
                variant={"surface"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={2}
              >
                <FiUpload />
                Upload Forms
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Forms</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Box>
                  <Box width={"full"}>
                    <Form method="PUT" encType="multipart/form-data">
                      <Input name="id" value={caseDetails._id} type="hidden" />
                      <Box display={"flex"} flexDirection={"column"} gap={2}>
                        <FileUploadRoot
                          accept={["application/pdf"]}
                          name="file"
                          gap="1"
                          width="full"
                        >
                          <FileUploadLabel>Upload file</FileUploadLabel>
                          <InputGroup
                            width="full"
                            startElement={<LuFileUp />}
                            endElement={
                              <FileUploadClearTrigger asChild>
                                <CloseButton
                                  me="-1"
                                  size="xs"
                                  variant="plain"
                                  focusVisibleRing="inside"
                                  focusRingWidth="2px"
                                  pointerEvents="auto"
                                  color="fg.subtle"
                                />
                              </FileUploadClearTrigger>
                            }
                          >
                            <FileInput />
                          </InputGroup>
                        </FileUploadRoot>
                        <Button
                          loading={navigation.state === "submitting"}
                          type="submit"
                          colorPalette={"blue"}
                          variant={"solid"}
                          name="transactionType"
                          value={"caseFormUpload"}
                        >
                          Upload Form
                        </Button>
                      </Box>
                    </Form>
                  </Box>
                  <Box></Box>
                </Box>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Close</Button>
                </DialogActionTrigger>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>

          {/* download forms */}
          <DialogRoot size={"lg"}>
            <DialogTrigger asChild>
              <Button
                size={"xs"}
                colorPalette={"blue"}
                variant={"solid"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={2}
              >
                <FiDownload />
                Download Forms
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Documents Available</DialogTitle>
              </DialogHeader>
              <DialogBody>
                {caseDetails.caseForms.length === 0 ? (
                  <Box>
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <IoIosWarning />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>
                            No Documents Available
                          </EmptyState.Title>
                          <EmptyState.Description>
                            Upload important documents related to the case
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Box>
                ) : (
                  <Grid templateColumns="repeat(3, 1fr)" gap="6">
                    {caseDetails.caseForms.map((val: any) => {
                      const fileName = val.split("/").pop(); // Extract file name from URL

                      return (
                        <CheckboxCard.Root key={val}>
                          <CheckboxCard.HiddenInput />

                          <CheckboxCard.Content padding={2}>
                            {/* Downloadable PDF Link */}

                            {/* Label under the button */}
                            <Text fontSize="sm" textAlign="center">
                              {fileName}
                            </Text>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              width={"full"}
                              justifyContent={"space-between"}
                              gap={2}
                            >
                              <a
                                href={val}
                                download={fileName}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button colorPalette="blue" variant="solid">
                                  Download PDF
                                </Button>
                              </a>

                              <Button colorPalette="red" variant="surface">
                                <RiDeleteBin2Fill />
                              </Button>
                            </Box>
                          </CheckboxCard.Content>
                        </CheckboxCard.Root>
                      );
                    })}
                  </Grid>
                )}
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
        </Box>

        <Box display={"flex"} flexDirection={"column"} gap={5}>
          <Text fontSize={20} fontStyle={"italic"}>
            Case Details
          </Text>

          <Box>
            <Box display={"flex"} gap={10} alignItems={"center"}>
              <Box display={"flex"} flexDirection={"column"} gap={1}>
                <Text>Complainant</Text>
                <Box width={150} height={150} background={"gray.300"}></Box>
                <Text> Name: {caseDetails.complainant_name}</Text>

                <Collapsible.Root unmountOnExit>
                  <Collapsible.Trigger
                    display={"flex"}
                    alignItems={"center"}
                    gap={2}
                    paddingY="2"
                    fontSize="sm"
                    cursor={"pointer"}
                  >
                    More <IoIosArrowDown />
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <Text>
                      {" "}
                      Number:{" "}
                      {caseDetails.complainant_number || "No Data Available"}
                    </Text>
                    <Text>
                      {" "}
                      Email:{" "}
                      {caseDetails.complainant_email || "No Data Available"}
                    </Text>
                    <Text>
                      {" "}
                      Address:{" "}
                      {caseDetails.complainant_address || "No Data Available"}
                    </Text>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Box>

              <Box display={"flex"} flexDirection={"column"} gap={1}>
                <Text>Respondent</Text>
                <Box width={150} height={150} background={"gray.300"}></Box>
                <Text> Name: {caseDetails.respondent_name}</Text>

                <Collapsible.Root unmountOnExit>
                  <Collapsible.Trigger
                    display={"flex"}
                    alignItems={"center"}
                    gap={2}
                    paddingY="2"
                    fontSize="sm"
                    cursor={"pointer"}
                  >
                    More <IoIosArrowDown />
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <Text>
                      {" "}
                      Number:{" "}
                      {caseDetails.respondent_number || "No Data Available"}
                    </Text>
                    <Text>
                      {" "}
                      Email:{" "}
                      {caseDetails.respondent_email || "No Data Available"}
                    </Text>
                    <Text>
                      {" "}
                      Address:{" "}
                      {caseDetails.respondent_address || "No Data Available"}
                    </Text>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Box>
            </Box>
          </Box>

          <Box>
            <Text fontSize={18} fontWeight={"bold"}>
              Description
            </Text>

            <Text textAlign={"justify"} fontSize={"sm"}>
              {caseDetails.case_description}
            </Text>
          </Box>

          <Box display={"flex"} flexDirection={"column"} gap={3}>
            <Text fontSize={18} fontWeight={"bold"}>
              Witnesses
            </Text>

            <Box display={"flex"} alignItems={"center"} gap={5}>
              <Box display={"flex"} flexDirection={"column"} gap={1}>
                <Box width={100} height={100} background={"gray.300"}></Box>
                <Text fontSize={"sm"}> Name: Jane Smith</Text>
                <Text fontSize={"sm"}> Number: 091231222123</Text>
                <Text fontSize={"sm"}> Email: No Email</Text>
              </Box>

              <Box display={"flex"} flexDirection={"column"} gap={1}>
                <Box width={100} height={100} background={"gray.300"}></Box>
                <Text fontSize={"sm"}> Name: Jane Smith</Text>
                <Text fontSize={"sm"}> Number: 091231222123</Text>
                <Text fontSize={"sm"}> Email: No Email</Text>
              </Box>

              <Box display={"flex"} flexDirection={"column"} gap={1}>
                <Box width={100} height={100} background={"gray.300"}></Box>
                <Text fontSize={"sm"}> Name: Jane Smith</Text>
                <Text fontSize={"sm"}> Number: 091231222123</Text>
                <Text fontSize={"sm"}> Email: No Email</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        padding={4}
        width={"full"}
        display={"flex"}
        flexDirection={"column"}
        gap={5}
      >
        <Text>Documentation</Text>

        <Box display={"flex"} alignItems={"flex-end"} gap={5}>
          <Box width={450}>
            <Form method="PUT" encType="multipart/form-data">
              <Input name="id" value={caseDetails._id} type="hidden" />
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FileUploadRoot
                  accept={["image/png", "image/jpeg"]}
                  name="file"
                  gap="1"
                  width="full"
                >
                  <FileUploadLabel>Upload file</FileUploadLabel>
                  <InputGroup
                    w="full"
                    startElement={<LuFileUp />}
                    endElement={
                      <FileUploadClearTrigger asChild>
                        <CloseButton
                          me="-1"
                          size="xs"
                          variant="plain"
                          focusVisibleRing="inside"
                          focusRingWidth="2px"
                          pointerEvents="auto"
                          color="fg.subtle"
                        />
                      </FileUploadClearTrigger>
                    }
                  >
                    <FileInput />
                  </InputGroup>
                </FileUploadRoot>
                <Button
                  loading={navigation.state === "submitting"}
                  type="submit"
                  colorPalette={"blue"}
                  variant={"solid"}
                  name="transactionType"
                  value="documentationUpload"
                >
                  Upload Photo
                </Button>
              </Box>
            </Form>
          </Box>
          <Box>
            <Box>
              <Button
                width={"80px"}
                height={"80px"}
                colorPalette={"red"}
                variant={"surface"}
              >
                <RiDeleteBin2Fill />
              </Button>
            </Box>
          </Box>
        </Box>

        {caseDetails.documentationPhotos.length === 0 ? (
          <Box>
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <FaFaceSadCry />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>No Photo Available</EmptyState.Title>
                  <EmptyState.Description>
                    Upload photos related to the case for documentation
                  </EmptyState.Description>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          </Box>
        ) : (
          <Grid templateColumns="repeat(3, 1fr)" gap="6">
            {caseDetails.documentationPhotos.map((val: any) => (
              <CheckboxCard.Root
                key={val}
                colorPalette="red"
                // Set the default checked state based on whether the image is in local storage
                defaultChecked={selectedImages.includes(val)}
                // Update state and local storage when checked changes
                onChange={(checked) => handleCheckboxChange(val, checked)}
              >
                <CheckboxCard.HiddenInput />

                <CheckboxCard.Content>
                  <Image
                    width={"full"}
                    rounded="md"
                    src={val}
                    key={val}
                    alt="Documentation Photo"
                    border={1}
                    borderColor={"gray.300"}
                    height={150}
                  />
                </CheckboxCard.Content>
              </CheckboxCard.Root>
            ))}
          </Grid>
        )}
      </Box>
    </Grid>
  );
};

export default CaseDetails;
