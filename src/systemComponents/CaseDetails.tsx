import {
  Box,
  Grid,
  Button,
  Text,
  Collapsible,
  Image,
  EmptyState,
  CheckboxCard,
  Input,
  VStack,
  IconButton,
  Icon,
  Textarea,
  createListCollection,
  Tabs,
} from "@chakra-ui/react";

const dataArray = createListCollection({
  items: [
    { label: "Mediation", value: "Mediation" },
    { label: "Conciliation", value: "Conciliation" },
  ],
});
import { Field } from "@/components/ui/field";
import defaultUser from "@/assets/default-user.jpg";

import { Toaster, toaster } from "@/components/ui/toaster";
import { IoIosWarning } from "react-icons/io";
import { RiEdit2Fill } from "react-icons/ri";
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
import { Select } from "@chakra-ui/react";
import { FaFaceSadCry } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { InputGroup } from "@/components/ui/input-group";
import { CloseButton } from "@/components/ui/close-button";
import {
  IoIosArrowDown,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
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
  uploadComplainantPhoto,
  uploadRespondentPhoto,
} from "@/backendapi/caseApi";
import { FiUpload } from "react-icons/fi";
import { IoDocumentText } from "react-icons/io5";
import { UserPropType } from "@/pages/Dashboard";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { updateCase } from "@/backendapi/caseApi";
interface ActionDataType {
  message?: string;
  type?: string;
}

interface CaseDetailsType {
  _id: string;
  complainant_name: string;
  complainant_number?: string;
  complainant_email?: string;
  complainant_profile_picture: string;
  respondent_profile_picture: string;
  complainant_address?: string;
  respondent_name: string;
  respondent_number?: string;
  respondent_email?: string;
  respondent_address?: string;
  case_description: string;
  caseForms: string[];
  documentationPhotos: string[];
  case_type: string;
  status: string;
  createdAt: Date;
  nature_of_the_case: string;
  date_filed: string;
  date_of_settlement: string;
  point_of_agreement: string;
  status_of_agreement: string;
  remarks: string;
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

    console.log("Received form data:", data);

    // Create a FormData instance to send the data to the Express API
    const apiFormData = new FormData();

    // Append each field in the data to the FormData
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value instanceof File) {
        apiFormData.append(key, value, value.name);
      } else {
        apiFormData.append(key, value as string);
      }
    });

    // Get the case ID from the form data
    const caseId = data.id || data.caseId;

    // Handle bulk delete operation
    if (data.transactionType === "bulkDelete") {
      console.log("Bulk Delete Operation Data:", {
        raw: data,
        caseId: data.caseId,
        selectedImages: JSON.parse(data.selectedImages as string),
        type: typeof data.selectedImages,
      });

      const deleteData = {
        caseId: data.caseId.toString(),
        photoUrls: JSON.parse(data.selectedImages as string),
      };

      const deleteResponse = await deleteDocumentationImages(deleteData);
      console.log("Delete Response:", deleteResponse);
      return { ...deleteResponse, caseId };
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
      return { ...deleteResponse, caseId };
    }

    if (data.transactionType === "updateCaseDetails") {
      const updatedCaseDetails = await updateCase(data.id, data);
      console.log("Update Case details data:", updatedCaseDetails);
      return updatedCaseDetails;
    }
    if (data.transactionType === "caseFormUpload") {
      const uploadCaseFormsData = await uploadCaseForms(data.id, apiFormData);
      return { ...uploadCaseFormsData, caseId };
    }

    // Handle complainant photo update
    if (data.transactionType === "updateComplainantPhoto") {
      const uploadComplainantPhotoData = await uploadComplainantPhoto(
        data.id as string,
        apiFormData
      );

      console.log("Upload response:", uploadComplainantPhotoData);
      return { ...uploadComplainantPhotoData, caseId };
    }

    // Handle complainant photo update
    if (data.transactionType === "updateRespondentPhoto") {
      const uploadRespondentPhotoData = await uploadRespondentPhoto(
        data.id as string,
        apiFormData
      );

      console.log("Upload response:", uploadRespondentPhotoData);
      return { ...uploadRespondentPhotoData, caseId };
    }

    if (data.transactionType === "documentationUpload") {
      console.log(apiFormData);
      const uploadImageData = await uploadDoucmentaryImages(
        data.id,
        apiFormData
      );

      return { ...uploadImageData, caseId };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error in action function:", error.message);
      return {
        error: error.message,
        type: "error",
      };
    } else {
      console.log("An unknown error occurred");
      return {
        error: "An unknown error occurred",
        type: "error",
      };
    }
  }
};

const CaseDetails = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData() as ActionDataType;
  const { caseDetails, userData } = useLoaderData() as LoaderDataType;
  const [open, setOpen] = useState(false);
  const [openComplainantDialog, setOpenComplainantDialog] = useState(false);
  const [openRespondentDialog, setOpenRespondentDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

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

      if (actionData.message === "Case updated successfully") {
        setOpen(false);
        toaster.create({
          title: "Case Successfully Updated",
          description:
            "The case and associated file have been updated successfully.",
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

      if (actionData.message === "Complainant photo updated successfully") {
        setOpenComplainantDialog(false);
        toaster.create({
          title: "Photo Updated",
          description: "Complainant's photo has been updated successfully.",
          type: "success",
        });
        // Reload the page to fetch fresh data
        window.location.reload();
      }

      if (actionData.message === "Respondent photo updated successfully") {
        setOpenRespondentDialog(false);
        toaster.create({
          title: "Photo Updated",
          description: "Respondent's photo has been updated successfully.",
          type: "success",
        });
        // Reload the page to fetch fresh data
        window.location.reload();
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

      // Handle error messages
      if (actionData.type === "error") {
        toaster.create({
          title: "Error",
          description:
            actionData.message ||
            "An error occurred while processing your request.",
          type: "error",
        });
      }
    }
  }, [navigation.state, actionData]);

  const generateCaseReportPDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set global font to Courier
    pdf.setFont("courier", "normal");

    // Add Logo (Top Left)
    const logoElement = document.getElementById("logo");
    if (logoElement) {
      const logoCanvas = await html2canvas(logoElement, { useCORS: true });
      const logoImageData = logoCanvas.toDataURL("image/png");
      pdf.addImage(logoImageData, "PNG", 15, 10, 20, 20);
    }

    // Header Text (Centered)
    pdf.setFont("courier", "bold");
    pdf.setFontSize(14);
    pdf.text("REPUBLIC OF THE PHILIPPINES", 105, 15, { align: "center" });

    pdf.setFont("courier", "normal");
    pdf.setFontSize(12);
    pdf.text("Department of Interior and Local Government", 105, 22, {
      align: "center",
    });

    // Date (Right-aligned)
    pdf.setFontSize(10);
    pdf.text(
      `Date: ${new Date(caseDetails.createdAt).toLocaleDateString()}`,
      190,
      35,
      { align: "right" }
    );

    pdf.setFontSize(10);
    pdf.text(`Status: ${caseDetails.status}`, 190, 40, { align: "right" });

    // Title (Centered)
    pdf.setFontSize(16);
    pdf.text("Case Details Report", 105, 50, { align: "center" });

    // Case Details Section
    pdf.setFontSize(14);
    pdf.setFont("courier", "bold");
    pdf.text("Case Details", 15, 65);

    // Complainant Details (Left)
    pdf.setFontSize(12);
    pdf.setFont("courier", "bold");
    pdf.text("Complainant", 15, 75);
    pdf.setFont("courier", "normal");

    // Add complainant image
    const complainantElement = document.getElementById("complainantImage");
    if (complainantElement) {
      const complainantCanvas = await html2canvas(complainantElement, {
        useCORS: true,
      });
      const complainantImageData = complainantCanvas.toDataURL("image/png");
      pdf.addImage(complainantImageData, "PNG", 15, 80, 40, 40);
    } else {
      console.error("Complainant image element not found!");
      // If image fails to load, add a placeholder rectangle
      pdf.rect(15, 80, 40, 40);
      pdf.text("Photo", 35, 100, { align: "center" });
    }

    // Complainant information
    pdf.text(`Name: ${caseDetails.complainant_name}`, 65, 85);
    pdf.text(`Number: ${caseDetails.complainant_number || "N/A"}`, 65, 95);
    pdf.text(`Email: ${caseDetails.complainant_email || "N/A"}`, 65, 105);
    pdf.text(`Address: ${caseDetails.complainant_address || "N/A"}`, 65, 115);

    // Respondent Details (Right)
    pdf.setFont("courier", "bold");
    pdf.text("Respondent", 15, 130);
    pdf.setFont("courier", "normal");

    // Add respondent image
    const respondentElement = document.getElementById("respondentImage");
    if (respondentElement) {
      const respondentCanvas = await html2canvas(respondentElement, {
        useCORS: true,
      });
      const respondentImageData = respondentCanvas.toDataURL("image/png");
      pdf.addImage(respondentImageData, "PNG", 15, 135, 40, 40);
    } else {
      console.error("Respondent image element not found!");
      // If image fails to load, add a placeholder rectangle
      pdf.rect(15, 135, 40, 40);
      pdf.text("Photo", 35, 155, { align: "center" });
    }

    // Respondent information
    pdf.text(`Name: ${caseDetails.respondent_name}`, 65, 140);
    pdf.text(`Number: ${caseDetails.respondent_number || "N/A"}`, 65, 150);
    pdf.text(`Email: ${caseDetails.respondent_email || "N/A"}`, 65, 160);
    pdf.text(`Address: ${caseDetails.respondent_address || "N/A"}`, 65, 170);

    // Case Type
    pdf.setFontSize(14);
    pdf.setFont("courier", "bold");
    pdf.text("Case Type", 15, 190);
    pdf.setFont("courier", "normal");
    pdf.setFontSize(12);
    pdf.text(caseDetails.case_type || "N/A", 15, 200);

    // Case Description
    pdf.setFontSize(14);
    pdf.setFont("courier", "bold");
    pdf.text("Case Description", 15, 220);
    pdf.setFontSize(12);
    pdf.setFont("courier", "normal");

    // Split description into multiple lines if needed
    const splitDescription = pdf.splitTextToSize(
      caseDetails.case_description,
      170
    );
    pdf.text(splitDescription, 15, 230);

    // Save the PDF
    pdf.save(`case_report_${caseDetails._id}.pdf`);
  };

  const generateCertificationPDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set font to Courier
    pdf.setFont("courier", "normal");

    // Header
    pdf.setFontSize(10);
    pdf.text("(KP Form No. 20)", 105, 15, { align: "center" });

    // Republic of the Philippines text
    pdf.setFontSize(12);
    pdf.text("Republic of the Philippines", 105, 25, { align: "center" });
    pdf.text("City of Makati", 105, 30, { align: "center" });
    pdf.text("Barangay Magallanes", 105, 35, { align: "center" });
    pdf.text("Manila, Philippines", 105, 40, { align: "center" });
    pdf.text("-oOo-", 105, 45, { align: "center" });

    // Office title
    pdf.setFontSize(12);
    pdf.text("OFFICE OF THE LUPONG TAGAPAMAYAPA", 105, 55, { align: "center" });

    // Parties involved
    pdf.setFontSize(11);
    pdf.text(`${caseDetails.complainant_name.toUpperCase()}`, 30, 70);
    pdf.text("and", 30, 75);
    pdf.text(`${caseDetails.respondent_name.toUpperCase()}`, 30, 80);
    pdf.text("Respondents", 50, 85);

    // Case number on the right
    pdf.text(`Barangay Case No. ${caseDetails._id}`, 160, 70);
    pdf.text("For: Slander, Threat and", 160, 75);
    pdf.text("Physical Injuries", 160, 80);

    // Main title
    pdf.setFontSize(14);
    pdf.setFont("courier", "bold");
    pdf.text("CERTIFICATION TO FILE AN ACTION", 105, 100, { align: "center" });

    // Main content
    pdf.setFont("courier", "normal");
    pdf.setFontSize(11);
    pdf.text("This is to certify that:", 30, 115);

    // Bullet points
    const bulletPoints = [
      "1. There was a personal confrontation between the parties before the Punong Barangay/Pangkat ng Tagapagkasundo;",
      "2. An amicable settlement/agreement was not reached;",
      "3. The settlement/agreement has been repudiated in a statement sworn to before the Punong Barangay by reason of violence, intimidation, fraud, or falsification; and",
      "4. Therefore, the corresponding complaint for the dispute may now be filed in court/government office.",
    ];

    let yPosition = 130;
    bulletPoints.forEach((point) => {
      const splitText = pdf.splitTextToSize(point, 150);
      pdf.text(splitText, 30, yPosition);
      yPosition += 10 * splitText.length;
    });

    // Date
    const currentDate = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    pdf.text(`This ${currentDate}`, 30, yPosition + 10);

    // Secretary signature line
    pdf.setFontSize(11);
    pdf.text("Ms. Julie B. Roberts", 105, yPosition + 30, { align: "center" });
    pdf.text("Lupon Secretary", 105, yPosition + 35, { align: "center" });

    // Attested section
    pdf.text("Attested:", 30, yPosition + 45);

    // Chairman signature line
    pdf.text("Mr. Brando S. Topain", 105, yPosition + 60, { align: "center" });
    pdf.text("Lupon Chairman", 105, yPosition + 65, { align: "center" });

    pdf.save(`certification_${caseDetails._id}.pdf`);
  };

  const handleImageDoubleClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpenImageDialog(true);
  };

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!caseDetails.documentationPhotos.includes(selectedImage || "")) return;
    const currentIndex = caseDetails.documentationPhotos.indexOf(
      selectedImage || ""
    );
    const prevIndex =
      currentIndex > 0
        ? currentIndex - 1
        : caseDetails.documentationPhotos.length - 1;
    setSelectedImage(caseDetails.documentationPhotos[prevIndex]);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!caseDetails.documentationPhotos.includes(selectedImage || "")) return;
    const currentIndex = caseDetails.documentationPhotos.indexOf(
      selectedImage || ""
    );
    const nextIndex =
      currentIndex < caseDetails.documentationPhotos.length - 1
        ? currentIndex + 1
        : 0;
    setSelectedImage(caseDetails.documentationPhotos[nextIndex]);
  };

  return (
    <>
      <Toaster />
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={{ base: "3", md: "5" }}
        width={"full"}
        height={"full"}
        padding={{ base: "3", md: "5" }}
        position="relative"
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
              <TiArrowBack />
              Back
            </Button>

            {/* edit the case */}
            <DialogRoot>
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
                  <RiEdit2Fill />
                  Update Case Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogBody>
                  <Form method="PUT">
                    <DialogHeader>
                      <DialogTitle>Update More Details Case</DialogTitle>
                    </DialogHeader>

                    {/* Tabs */}

                    <Tabs.Root defaultValue="details_1">
                      <Tabs.List>
                        <Tabs.Trigger value="details_1">Details 1</Tabs.Trigger>
                        <Tabs.Trigger value="details_2">Details 2</Tabs.Trigger>
                      </Tabs.List>
                      <Tabs.Content value="details_1">
                        <Box display="flex" flexDirection="column" gap={5}>
                          <Input
                            type="hidden"
                            name="id"
                            value={caseDetails._id}
                          />
                          <Field
                            label="Nature of the case"
                            errorText="This field is required"
                          >
                            <Input
                              type="text"
                              placeholder="Enter the Nature of the case"
                              name="nature_of_the_case"
                              defaultValue={caseDetails.nature_of_the_case}
                            />
                          </Field>

                          <Grid templateColumns="1fr 1fr" gap={5}>
                            <Field
                              label="Date Filed"
                              errorText="This field is required"
                            >
                              <Input
                                id="date_filed"
                                type="date"
                                name="date_filed"
                                defaultValue={caseDetails.date_filed}
                              />
                            </Field>

                            <Field
                              label="Date of Settlement"
                              errorText="This field is required"
                            >
                              <Input
                                id="date_of_settlement"
                                type="date"
                                name="date_of_settlement"
                                defaultValue={caseDetails.date_of_settlement}
                              />
                            </Field>
                          </Grid>

                          <Field
                            label="Point of Agreement"
                            errorText="This field is required"
                          >
                            <Textarea
                              placeholder="Enter Complainant Address"
                              name="point_of_agreement"
                              defaultValue={caseDetails.point_of_agreement}
                              resize={"none"}
                            />
                          </Field>
                        </Box>
                      </Tabs.Content>

                      <Tabs.Content value="details_2">
                        <Box display="flex" flexDirection="column" gap={5}>
                          <Field
                            label="Status of agreement"
                            errorText="This field is required"
                          >
                            <Input
                              id="status_of_agreement"
                              type="text"
                              placeholder="Enter Status of Agreement"
                              name="status_of_agreement"
                              defaultValue={caseDetails.status_of_agreement}
                            />
                          </Field>

                          <Select.Root
                            name="action_taken"
                            collection={dataArray}
                          >
                            <Select.HiddenSelect />
                            <Select.Label>Select Action Taken</Select.Label>

                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Select Action" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                                <Select.ClearTrigger />
                              </Select.IndicatorGroup>
                            </Select.Control>

                            <Select.Positioner>
                              <Select.Content>
                                {dataArray.items.map((val) => (
                                  <Select.Item item={val} key={val.value}>
                                    {val.label}
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>

                          <Field
                            label="Remarks"
                            errorText="This field is required"
                          >
                            <Textarea
                              id="remarks"
                              placeholder="Enter remarks here..."
                              name="remarks"
                              defaultValue={caseDetails.remarks}
                              resize={"none"}
                            />
                          </Field>
                        </Box>
                      </Tabs.Content>
                    </Tabs.Root>

                    <DialogFooter className="w-full justify-end">
                      <DialogActionTrigger asChild>
                        <Button variant="outline">Close</Button>
                      </DialogActionTrigger>
                      <Button
                        value={"updateCaseDetails"}
                        name="transactionType"
                        loading={navigation.state === "submitting"}
                        type="submit"
                        background={"blue.500"}
                      >
                        Update Case Details
                      </Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                  </Form>
                </DialogBody>

                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>

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
                  Upload Documents
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Documents</DialogTitle>
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
                            Upload Documents
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
                  <IoDocumentText />
                  Documents
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
                    <Button variant="outline">Close</Button>
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
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    cursor="pointer"
                    onDoubleClick={() => setOpenComplainantDialog(true)}
                    position="relative"
                  >
                    <Image
                      id="complainantImage"
                      src={
                        caseDetails?.complainant_profile_picture || defaultUser
                      }
                      alt={`${caseDetails.complainant_name}'s photo`}
                      objectFit="cover"
                      width="100%"
                      height="100%"
                      border="1px solid"
                      borderColor="gray.300"
                    />
                    <Box
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      bg="rgba(0,0,0,0.5)"
                      color="white"
                      p={1}
                      fontSize="xs"
                      textAlign="center"
                    >
                      Double click to update
                    </Box>
                  </Box>
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
                      More Information <IoIosArrowDown />
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
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    cursor="pointer"
                    onDoubleClick={() => setOpenRespondentDialog(true)}
                    position="relative"
                  >
                    <Image
                      id="respondentImage"
                      src={
                        caseDetails?.respondent_profile_picture || defaultUser
                      }
                      alt={`${caseDetails.respondent_name}'s photo`}
                      objectFit="cover"
                      width="100%"
                      height="100%"
                      border="1px solid"
                      borderColor="gray.300"
                    />
                    <Box
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      bg="rgba(0,0,0,0.5)"
                      color="white"
                      p={1}
                      fontSize="xs"
                      textAlign="center"
                    >
                      Double click to update
                    </Box>
                  </Box>
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
                      More Information <IoIosArrowDown />
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
                Case Type
              </Text>

              <Text textAlign={"justify"} fontSize={"sm"}>
                {caseDetails.case_type}
              </Text>
            </Box>

            <Box>
              <Text fontSize={{ base: "16", md: "18" }} fontWeight={"bold"}>
                Description
              </Text>

              <Text textAlign={"justify"} fontSize={"sm"}>
                {caseDetails.case_description}
              </Text>
            </Box>
          </Box>
        </Box>

        <Box
          background={"gray.100"}
          padding={{ base: "2", md: "10" }}
          width={"full"}
          display={"flex"}
          flexDirection={"column"}
          gap={{ base: "3", md: "5" }}
          borderRadius={"md"}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Text>Documentation/Evidences</Text>
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
                        onDoubleClick={() => handleImageDoubleClick(val)}
                      />
                    </CheckboxCard.Content>
                  </CheckboxCard.Root>
                ))}
              </Grid>

              {/* Pagination Controls */}
              <Box
                display="flex"
                justifyContent="flex-end"
                mt={4}
                gap={2}
                alignItems="center"
              >
                <Text fontSize="sm" color="gray.600">
                  Page {currentPage} of {totalPages}
                </Text>
                <Box display="flex" gap={2}>
                  <IconButton
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    variant="subtle"
                    colorPalette="blue"
                  >
                    <IoIosArrowBack />
                  </IconButton>
                  <IconButton
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    variant="subtle"
                    colorPalette="blue"
                  >
                    <IoIosArrowForward />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </Box>

        {/* Add Download Button */}
        <Box
          position="fixed"
          bottom={4}
          right={4}
          zIndex={1000}
          display="flex"
          gap={2}
        >
          <Button
            colorPalette="blue"
            variant="solid"
            onClick={generateCaseReportPDF}
          >
            Download Case
          </Button>
          {caseDetails.status === "failed" && (
            <Button
              colorPalette="red"
              variant="solid"
              onClick={generateCertificationPDF}
            >
              Generate certificate for transfer
            </Button>
          )}
        </Box>

        {/* Complainant Image Dialog */}
        <DialogRoot
          open={openComplainantDialog}
          onOpenChange={(details) => setOpenComplainantDialog(details.open)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Complainant Photo</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Form method="PUT" encType="multipart/form-data">
                <Input name="id" value={caseDetails._id} type="hidden" />
                <Input
                  name="transactionType"
                  value="updateComplainantPhoto"
                  type="hidden"
                />
                <Box display="flex" flexDirection="column" gap={4}>
                  <FileUploadRoot
                    accept={["image/png", "image/jpeg"]}
                    name="file"
                    gap="1"
                    width="full"
                    required
                  >
                    <FileUploadLabel>Choose Photo</FileUploadLabel>
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
                    type="submit"
                    colorPalette="blue"
                    variant="solid"
                    loading={navigation.state === "submitting"}
                  >
                    Update Photo
                  </Button>
                </Box>
              </Form>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>

        {/* Respondent Image Dialog */}
        <DialogRoot
          open={openRespondentDialog}
          onOpenChange={(details) => setOpenRespondentDialog(details.open)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Respondent Photo</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Form method="PUT" encType="multipart/form-data">
                <Input name="id" value={caseDetails._id} type="hidden" />
                <Input
                  name="transactionType"
                  value="updateRespondentPhoto"
                  type="hidden"
                />
                <Box display="flex" flexDirection="column" gap={4}>
                  <FileUploadRoot
                    accept={["image/png", "image/jpeg"]}
                    name="file"
                    gap="1"
                    width="full"
                  >
                    <FileUploadLabel>Choose Photo</FileUploadLabel>
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
                    type="submit"
                    colorPalette="blue"
                    variant="solid"
                    loading={navigation.state === "submitting"}
                  >
                    Update Photo
                  </Button>
                </Box>
              </Form>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>

        {/* Image Zoom Dialog */}
        <DialogRoot
          open={openImageDialog}
          onOpenChange={(details) => setOpenImageDialog(details.open)}
        >
          <DialogContent
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "50vw",
              maxHeight: "90vh",
              margin: 0,
              padding: 0,
            }}
          >
            <DialogHeader>
              <DialogTitle>Documentation Photo</DialogTitle>
            </DialogHeader>
            <DialogBody p={0}>
              {selectedImage && (
                <Box position="relative" width="100%" height="70vh">
                  <img
                    src={selectedImage}
                    alt="Zoomed documentation"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <Button
                    aria-label="Previous image"
                    position="absolute"
                    left="4"
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={handlePreviousImage}
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    p={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={IoIosArrowBack} />
                  </Button>
                  <Button
                    aria-label="Next image"
                    position="absolute"
                    right="4"
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={handleNextImage}
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    p={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={IoIosArrowForward} />
                  </Button>
                </Box>
              )}
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Close</Button>
              </DialogActionTrigger>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>
      </Grid>
    </>
  );
};

export default CaseDetails;
