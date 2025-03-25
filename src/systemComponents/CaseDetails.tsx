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

import { Toaster, toaster } from "@/components/ui/toaster";
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
  useActionData,
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
  deleteFormItem,
  deleteDocumentationImages,
} from "@/backendapi/caseApi";
import { FiDownload, FiUpload } from "react-icons/fi";
import { UserPropType } from "@/pages/Dashboard";

interface ActionDataType {
  message?: string;
  type?: string;
}

interface CaseDetailsType {
  _id: string;
  complainant_name: string;
  complainant_number?: string;
  complainant_email?: string;
  complainant_address?: string;
  respondent_name: string;
  respondent_number?: string;
  respondent_email?: string;
  respondent_address?: string;
  case_description: string;
  caseForms: string[];
  documentationPhotos: string[];
}

interface LoaderDataType {
  caseDetails: CaseDetailsType;
  userData: UserPropType;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  const user = localStorage.getItem("user");
  if (!user) throw new Error("User not found");

  const userData: UserPropType = JSON.parse(user);
  const caseDetails = await getSpecificCase(id);

  return { caseDetails, userData } as LoaderDataType;
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data: Record<string, FormDataEntryValue> = Object.fromEntries(
      formData.entries()
    );

    // Handle bulk delete operation
    if (data.transactionType === "bulkDelete") {
      console.log("Bulk Delete Operation Data:", {
        raw: data,
        caseId: data.caseId,
        selectedImages: JSON.parse(data.selectedImages as string),
        type: typeof data.selectedImages,
      });

      // Process each image for deletion
      const deleteData = {
        caseId: data.caseId.toString(),
        photoUrls: JSON.parse(data.selectedImages as string),
      };

      const deleteResponse = await deleteDocumentationImages(deleteData);
      console.log("Delete Response:", deleteResponse);
      return deleteResponse;
    }

    // Handle delete operation
    if (data.transactionType === "deleteItem") {
      console.log("Delete Operation Data:", {
        raw: data,
        caseId: data.caseId,
        arrayType: data.arrayType,
        itemUrl: data.itemUrl,
        type: typeof data.caseId,
      });

      const deleteData = {
        caseId: data.caseId.toString(),
        arrayType: data.arrayType.toString(),
        itemUrl: data.itemUrl.toString(),
      };

      console.log("Formatted Delete Data:", deleteData);

      const deleteResponse = await deleteFormItem(deleteData);
      console.log("Delete Response:", deleteResponse);
      return deleteResponse;
    }

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
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
  }
};

const CaseDetails = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData() as ActionDataType;
  const { caseDetails, userData } = useLoaderData() as LoaderDataType;
  const [open, setOpen] = useState(false);

  const [selectedImages, setSelectedImages] = useState<string[]>(() => {
    const stored = localStorage.getItem("selectedImages");
    return stored ? JSON.parse(stored) : [];
  });

  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;

  // Calculate pagination
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = caseDetails.documentationPhotos.slice(
    indexOfFirstImage,
    indexOfLastImage
  );
  const totalPages = Math.ceil(
    caseDetails.documentationPhotos.length / imagesPerPage
  );

  useEffect(() => {
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
  }, [selectedImages]);

  // Add this effect to sync selectedImages with available images
  useEffect(() => {
    // Filter out any selected images that no longer exist in documentationPhotos
    const validSelectedImages = selectedImages.filter((img) =>
      caseDetails.documentationPhotos.includes(img)
    );

    // Update state and localStorage if there are invalid selections
    if (validSelectedImages.length !== selectedImages.length) {
      setSelectedImages(validSelectedImages);
      localStorage.setItem(
        "selectedImages",
        JSON.stringify(validSelectedImages)
      );
    }
  }, [caseDetails.documentationPhotos, selectedImages]);

  const handleCheckboxChange = (photoUrl: string, checked: boolean) => {
    if (checked) {
      // Only add if the image still exists in documentationPhotos
      if (caseDetails.documentationPhotos.includes(photoUrl)) {
        setSelectedImages((prev: string[]) =>
          prev.includes(photoUrl) ? prev : [...prev, photoUrl]
        );
      }
    } else {
      setSelectedImages((prev: string[]) =>
        prev.filter((url: string) => url !== photoUrl)
      );
    }
  };

  useEffect(() => {
    // Only run when navigation changes from submitting to idle
    if (navigation.state === "idle" && actionData?.message) {
      if (actionData.message === "File uploaded successfully") {
        setOpen(false);
        toaster.create({
          title: "File Uploaded",
          description:
            "Your file has been uploaded successfully and is now available.",
          type: "success",
        });
      }

      if (actionData.message === "Documentation uploaded successfully") {
        toaster.create({
          title: "Document Uploaded",
          description:
            "Your document has been successfully uploaded and saved.",
          type: "success",
        });
      }

      if (
        actionData.message === "Item deleted successfully" ||
        actionData.message === "Items deleted successfully"
      ) {
        // Clear the selected images after successful deletion
        setSelectedImages([]);
        localStorage.removeItem("selectedImages");

        toaster.create({
          title: "Item Deleted",
          description: "The selected items have been successfully deleted.",
          type: "success",
        });
      }
    }
  }, [navigation.state, actionData]);

  return (
    <>
      <Toaster />
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={{ base: "3", md: "5" }}
        width={"full"}
        height={"full"}
        padding={{ base: "3", md: "5" }}
      >
        <Box
          width={"full"}
          height={"full"}
          display={"flex"}
          flexDirection={"column"}
          gap={{ base: "3", md: "5" }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={{ base: "2", md: "5" }}
            flexWrap="wrap"
          >
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
            <DialogRoot
              open={open}
              onOpenChange={(details) => setOpen(details.open)}
            >
              <DialogTrigger asChild>
                <Button
                  disabled={userData.userType === "admin"}
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
                        <Input
                          name="id"
                          value={caseDetails._id}
                          type="hidden"
                        />
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
            <DialogRoot size={"xl"}>
              <DialogTrigger asChild>
                <Button
                  disabled={userData.userType === "admin"}
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
                    <Grid
                      templateColumns={{
                        base: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                      }}
                      gap="6"
                    >
                      {caseDetails.caseForms.map((val: string) => {
                        const fileName = val.split("/").pop(); // Extract file name from URL

                        return (
                          <CheckboxCard.Root key={val}>
                            <CheckboxCard.HiddenInput />
                            <CheckboxCard.Content padding={2}>
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

                                <Form method="POST">
                                  <Input
                                    type="hidden"
                                    name="caseId"
                                    value={caseDetails._id}
                                  />
                                  <Input
                                    type="hidden"
                                    name="arrayType"
                                    value="caseForms"
                                  />
                                  <Input
                                    type="hidden"
                                    name="itemUrl"
                                    value={val}
                                  />
                                  <Input
                                    type="hidden"
                                    name="transactionType"
                                    value="deleteItem"
                                  />
                                  <Button
                                    type="submit"
                                    colorPalette="red"
                                    variant="surface"
                                    loading={navigation.state === "submitting"}
                                  >
                                    <RiDeleteBin2Fill />
                                  </Button>
                                </Form>
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

          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={{ base: "3", md: "5" }}
          >
            <Text fontSize={{ base: "18", md: "20" }} fontStyle={"italic"}>
              Case Details
            </Text>

            <Box>
              <Box
                display={"flex"}
                gap={{ base: "5", md: "10" }}
                alignItems={"center"}
                flexDirection={{ base: "column", md: "row" }}
              >
                <Box display={"flex"} flexDirection={"column"} gap={1}>
                  <Text>Complainant</Text>
                  <Box
                    width={{ base: "120px", md: "150px" }}
                    height={{ base: "120px", md: "150px" }}
                    background={"gray.300"}
                  ></Box>
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
                  <Box
                    width={{ base: "120px", md: "150px" }}
                    height={{ base: "120px", md: "150px" }}
                    background={"gray.300"}
                  ></Box>
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
              <Text fontSize={{ base: "16", md: "18" }} fontWeight={"bold"}>
                Description
              </Text>

              <Text textAlign={"justify"} fontSize={"sm"}>
                {caseDetails.case_description}
              </Text>
            </Box>

            <Box display={"flex"} flexDirection={"column"} gap={3}>
              <Text fontSize={{ base: "16", md: "18" }} fontWeight={"bold"}>
                Witnesses
              </Text>

              <Box
                display={"flex"}
                alignItems={"center"}
                gap={{ base: "3", md: "5" }}
                flexWrap="wrap"
                justifyContent={{ base: "center", md: "flex-start" }}
              >
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
          padding={{ base: "2", md: "4" }}
          width={"full"}
          display={"flex"}
          flexDirection={"column"}
          gap={{ base: "3", md: "5" }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Text>Documentation</Text>
            {selectedImages.length > 0 && (
              <Form method="POST">
                <Input type="hidden" name="caseId" value={caseDetails._id} />
                <Input
                  type="hidden"
                  name="selectedImages"
                  value={JSON.stringify(selectedImages)}
                />
                <Input
                  type="hidden"
                  name="transactionType"
                  value="bulkDelete"
                />
                <Button
                  type="submit"
                  colorPalette="red"
                  variant="solid"
                  loading={navigation.state === "submitting"}
                >
                  Delete Selected ({selectedImages.length})
                </Button>
              </Form>
            )}
          </Box>

          <Box display={"flex"} alignItems={"flex-end"} gap={5}>
            <Box width={{ base: "full", md: "450px" }}>
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
                    disabled={userData.userType === "admin"}
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
            <>
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
                gap={{ base: "4", md: "6" }}
              >
                {currentImages.map((val: string) => (
                  <CheckboxCard.Root
                    key={val}
                    colorPalette="red"
                    defaultChecked={selectedImages.includes(val)}
                    onChange={(e: React.FormEvent<HTMLLabelElement>) => {
                      const target = e.target as HTMLInputElement;
                      handleCheckboxChange(val, target.checked);
                    }}
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
                        height={{ base: "120px", md: "150px" }}
                      />
                    </CheckboxCard.Content>
                  </CheckboxCard.Root>
                ))}
              </Grid>

              {/* Pagination Controls */}
              <Box display="flex" justifyContent="center" mt={4} gap={2}>
                <Button
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Text alignSelf="center">
                  Page {currentPage} of {totalPages}
                </Text>
                <Button
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Grid>
    </>
  );
};

export default CaseDetails;
