import {
  Card,
  Box,
  Text,
  IconButton,
  Tabs,
  Button,
  Input,
  Textarea,
  createListCollection,
  Separator,
  Icon,
} from "@chakra-ui/react";
import { TbMessage2Share } from "react-icons/tb";
import { Form } from "react-router-dom";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { Field } from "@/components/ui/field";
import { FaCircleMinus } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
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
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
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
import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";
type CaseType = {
  case_number: number;
  status: string;
  index: number;
  caseType: string;
  complainant: string;
  respondent: string;
};

import { TbDownload } from "react-icons/tb";
const CasesCardContainer = ({
  case_number,
  status,
  index,
  caseType,
  complainant,
  respondent,
}: CaseType) => {
  return (
    <Box>
      <Card.Root
        variant={"subtle"}
        key={index}
        width={"full"}
        padding={5}
        display={"flex"}
        gap={2}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={2}
          >
            <Text fontSize={"sm"} display={"flex"} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray"} fontStyle={"italic"}>
                Case No.{" "}
              </Text>
              <Text fontSize={"sm"} color={"gray"}>
                {case_number}
              </Text>
            </Text>

            <Separator orientation="vertical" height="4" />

            <Text
              display={"flex"}
              alignItems={"center"}
              gap={1}
              fontSize={"sm"}
              color={
                status === "Settled"
                  ? "green.500"
                  : status === "Ongoing"
                  ? "orange.500"
                  : "red.500"
              }
            >
              <span>
                {status === "Settled" ? (
                  <FaCircleCheck />
                ) : status === "Ongoing" ? (
                  <FaCircleMinus />
                ) : (
                  <FaCircleXmark />
                )}
              </span>
              <span>{status}</span>
            </Text>
          </Box>

          <Box display={"flex"} alignItems={"center"} gap={1}>
            <IconButton size={"xs"} variant={"surface"} colorPalette={"blue"}>
              <TbDownload />
            </IconButton>

            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton size={"xs"} variant={"solid"} colorPalette={"blue"}>
                  <Icon>
                    <IoIosArrowDropdownCircle />
                  </Icon>
                </IconButton>
              </MenuTrigger>
              <MenuContent
                display={"flex"}
                flexDirection={"column"}
                gap={2}
                alignItems={"start"}
              >
                <DialogRoot>
                  <DialogTrigger asChild>
                    <Button
                      colorPalette={"blue"}
                      width={"full"}
                      display={"flex"}
                      justifyContent={"start"}
                      size="sm"
                      variant={"subtle"}
                    >
                      Update Case
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Form method="post">
                      <DialogHeader>
                        <DialogTitle>Update Case</DialogTitle>
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
                            <Tabs.Trigger value="tasks">
                              Case Details
                            </Tabs.Trigger>
                          </Tabs.List>
                          <Tabs.Content value="members">
                            <Box display="flex" flexDirection="column" gap={5}>
                              <Field
                                label="Name"
                                errorText="This field is required"
                              >
                                <Input
                                  id="complainant_name"
                                  type="text"
                                  placeholder="Enter Complainant Name"
                                  name="complainant_name"
                                  defaultValue={complainant}
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
                                  {caseTypeArray.items.map((val: any) => (
                                    <SelectItem item={val} key={val.value}>
                                      {val.label}
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

                {/* remove /delete case */}
                <DialogRoot>
                  <DialogTrigger asChild>
                    <Button
                      colorPalette={"red"}
                      size="sm"
                      variant={"subtle"}
                      width={"full"}
                      display={"flex"}
                      justifyContent={"start"}
                    >
                      Remove
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Form method="post">
                      <DialogHeader>
                        <DialogTitle>Delete this case</DialogTitle>

                        <Text>Are you sure you want to delete this case?</Text>
                      </DialogHeader>
                      <DialogBody>
                        {/* Tabs */}
                        <Text></Text>
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                        <Button background={"red.500"}>Delete</Button>
                      </DialogFooter>
                      <DialogCloseTrigger />
                    </Form>
                  </DialogContent>
                </DialogRoot>

                {/* actions */}

                <DialogRoot>
                  <DialogTrigger asChild>
                    <Button
                      colorPalette={"green"}
                      size="sm"
                      variant={"subtle"}
                      width={"full"}
                      display={"flex"}
                      justifyContent={"start"}
                    >
                      Action
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Form method="post">
                      <DialogHeader>
                        <DialogTitle>Case Update</DialogTitle>

                        <Text>Stay Informed About Case Progress</Text>
                      </DialogHeader>
                      <DialogBody
                        display={"flex"}
                        justifyContent={"space-between"}
                      >
                        <Box display={"flex"} flexDirection={"column"} gap={2}>
                          <Text>Send notification</Text>
                          <Box display={"flex"} alignItems={"center"} gap={5}>
                            <IconButton variant={"subtle"} size={"lg"}>
                              <TbMessage2Share />
                            </IconButton>

                            <IconButton variant={"subtle"} size={"lg"}>
                              <TbMessage2Share />
                            </IconButton>

                            <IconButton variant={"subtle"} size={"lg"}>
                              <TbMessage2Share />
                            </IconButton>
                          </Box>
                        </Box>

                        <Box display={"flex"} flexDirection={"column"} gap={2}>
                          <Text>Case Status</Text>
                          <Box display={"flex"} alignItems={"center"} gap={3}>
                            <Button colorPalette={"green"} variant={"subtle"}>
                              Settled
                            </Button>
                            <Button colorPalette={"red"} variant={"subtle"}>
                              Failed
                            </Button>
                          </Box>
                        </Box>
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                      </DialogFooter>
                      <DialogCloseTrigger />
                    </Form>
                  </DialogContent>
                </DialogRoot>
              </MenuContent>
            </MenuRoot>

            <Box>{/* Dropdown content */}</Box>
          </Box>
        </Box>

        <Separator />

        <Box className="mt-5 flex flex-col gap-2">
          <h2 className="font-display">
            <strong className="italic">Case: </strong>
            {caseType}
          </h2>

          <Box className="flex flex-col">
            <Text
              display={"flex"}
              alignItems={"center"}
              gap={2}
              fontSize={"sm"}
            >
              <Text fontStyle={"italic"}>Complainant: </Text>
              <Text>{complainant}</Text>
            </Text>
            <Text
              display={"flex"}
              alignItems={"center"}
              gap={2}
              fontSize={"sm"}
            >
              <Text fontStyle={"italic"}>Respondent: </Text>
              <Text>{respondent}</Text>
            </Text>
          </Box>
        </Box>
      </Card.Root>
    </Box>
  );
};

export default CasesCardContainer;
