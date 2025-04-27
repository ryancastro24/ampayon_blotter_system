import {
  Card,
  Box,
  Text,
  IconButton,
  Tabs,
  Button,
  Input,
  Textarea,
  Separator,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaFileLines } from "react-icons/fa6";
import { TbMessage2Share } from "react-icons/tb";
import { Form } from "react-router-dom";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { Field } from "@/components/ui/field";
import { FaCircleMinus } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { caseTypeArray } from "@/dashboardpages/CasesPage";
import { FaCheck } from "react-icons/fa";
import { Toaster, toaster } from "@/components/ui/toaster";

import { useActionData } from "react-router-dom";
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
  case_id_number: string;
  status: string;
  attempt1: boolean;
  attempt2: boolean;
  attempt3: boolean;
  complainant_name: string;
  respondent_name: string;
  complainant_number: string;
  complainant_email: string;
  respondent_number: string;
  respondent_email: string;
  _id: string;
  case_description: string;
  case_type: string;
  region_name: string;
  city_name: string;
  barangay_name: string;
  barangay_captain: string;
  barangay_secretary: string;
  complainant_address: string;
  respondent_address: string;
  userType: string;
};

import { useNavigation, useNavigate } from "react-router-dom";
const CasesCardContainer = ({
  userType,
  status,
  complainant_name,
  respondent_name,
  complainant_number,
  complainant_email,
  respondent_number,
  respondent_email,
  case_description,
  attempt1,
  attempt2,
  attempt3,
  complainant_address,
  respondent_address,
  case_type,
  case_id_number,
  _id,
}: CaseType) => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const actionData = useActionData();
  const [buttonClicked, setButtonClicked] = useState("");

  useEffect(() => {
    // Only show toast if the action is completed and matches this case's ID
    if (
      navigation.state === "idle" &&
      actionData &&
      actionData.caseId === _id
    ) {
      if (actionData.message) {
        toaster.create({
          title: "Success",
          description: actionData.message,
          type: "success",
        });
      } else if (actionData.error) {
        toaster.create({
          title: "Error",
          description: actionData.error,
          type: "error",
        });
      }
    }
  }, [navigation.state, actionData, _id]);

  // Reset the error shown flag when navigation state changes to submitting

  return (
    <>
      <Toaster />

      <Box>
        <Card.Root
          variant={"subtle"}
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
                  Case No:{" "}
                </Text>
                <Text fontSize={"sm"} color={"gray"}>
                  {case_id_number}
                </Text>
              </Text>

              <Separator orientation="vertical" height="4" />

              <Text
                display={"flex"}
                alignItems={"center"}
                gap={1}
                fontSize={"sm"}
                color={
                  status === "settled"
                    ? "green.500"
                    : status === "ongoing"
                    ? "orange.500"
                    : "red.500"
                }
              >
                <span>
                  {status === "settled" ? (
                    <FaCircleCheck />
                  ) : status === "ongoing" ? (
                    <FaCircleMinus />
                  ) : (
                    <FaCircleXmark />
                  )}
                </span>
                <span>{status}</span>
              </Text>
            </Box>

            <Box display={"flex"} alignItems={"center"} gap={1}>
              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton
                    size={"xs"}
                    variant={"solid"}
                    colorPalette={"blue"}
                  >
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
                  {userType === "user" && (
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
                        <Form method="PUT">
                          <DialogHeader>
                            <DialogTitle>Update Case</DialogTitle>
                          </DialogHeader>
                          <DialogBody>
                            {/* Tabs */}

                            <Tabs.Root defaultValue="complainant">
                              <Tabs.List>
                                <Tabs.Trigger value="complainant">
                                  Complainant Details
                                </Tabs.Trigger>
                                <Tabs.Trigger value="respondents">
                                  Respondent Details
                                </Tabs.Trigger>
                                <Tabs.Trigger value="case">
                                  Case Details
                                </Tabs.Trigger>
                              </Tabs.List>
                              <Tabs.Content value="complainant">
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={5}
                                >
                                  <Input type="hidden" name="id" value={_id} />
                                  <Field
                                    label="Name"
                                    errorText="This field is required"
                                  >
                                    <Input
                                      id="complainant_name"
                                      type="text"
                                      placeholder="Enter Complainant Name"
                                      name="complainant_name"
                                      defaultValue={complainant_name}
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
                                      defaultValue={complainant_number}
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
                                      defaultValue={complainant_email}
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
                                      defaultValue={complainant_address}
                                    />
                                  </Field>
                                </Box>
                              </Tabs.Content>

                              <Tabs.Content value="respondents">
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={5}
                                >
                                  <Field
                                    label="Name"
                                    errorText="This field is required"
                                  >
                                    <Input
                                      id="respondent_name"
                                      type="text"
                                      placeholder="Enter Respondent Name"
                                      name="respondent_name"
                                      defaultValue={respondent_name}
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
                                      defaultValue={respondent_number}
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
                                      defaultValue={respondent_email}
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
                                      defaultValue={respondent_address}
                                    />
                                  </Field>
                                </Box>
                              </Tabs.Content>
                              <Tabs.Content value="case">
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={5}
                                >
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
                                      defaultValue={case_description}
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
                              value={"updateCase"}
                              name="type"
                              loading={navigation.state === "submitting"}
                              type="submit"
                              background={"blue.500"}
                            >
                              Update
                            </Button>
                          </DialogFooter>
                          <DialogCloseTrigger />
                        </Form>
                      </DialogContent>
                    </DialogRoot>
                  )}

                  {/* remove /delete case */}

                  {userType === "user" && (
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
                        <Form
                          method="post"
                          action={`/dashboard/cases/${_id}/destroy`}
                        >
                          <DialogHeader>
                            <DialogTitle>Delete this case</DialogTitle>

                            <Text>
                              Are you sure you want to delete this case?
                            </Text>
                          </DialogHeader>
                          <DialogBody>
                            {/* Tabs */}
                            <Text></Text>
                          </DialogBody>
                          <DialogFooter>
                            <DialogActionTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogActionTrigger>
                            <Button
                              loading={navigation.state === "submitting"}
                              type="submit"
                              background={"red.500"}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                          <DialogCloseTrigger />
                        </Form>
                      </DialogContent>
                    </DialogRoot>
                  )}
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
                      <DialogHeader>
                        <DialogTitle>Case Update</DialogTitle>

                        <Text>Stay Informed About Case Progress</Text>
                      </DialogHeader>
                      <DialogBody
                        display={"flex"}
                        justifyContent={"space-between"}
                        flexDirection={"column"}
                        gap={10}
                      >
                        <Box display={"flex"} justifyContent={"space-between"}>
                          <Box
                            display={"flex"}
                            flexDirection={"column"}
                            gap={2}
                          >
                            <Text>Send notification</Text>
                            <Box display={"flex"} alignItems={"center"} gap={5}>
                              <DialogRoot>
                                <DialogTrigger asChild>
                                  <IconButton
                                    disabled={userType === "admin" || attempt1}
                                    type={attempt1 ? "button" : "submit"}
                                    variant={attempt1 ? "solid" : "subtle"}
                                    colorPalette={attempt1 ? "green" : ""}
                                    size={"lg"}
                                    onClick={() => setButtonClicked("attempt1")}
                                  >
                                    {attempt1 ? (
                                      <FaCheck />
                                    ) : (
                                      <TbMessage2Share />
                                    )}
                                  </IconButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <Form method="put">
                                    <Input
                                      value={_id}
                                      name="id"
                                      type="hidden"
                                    />
                                    <DialogHeader>
                                      <DialogTitle>
                                        Schedule Notification
                                      </DialogTitle>
                                      <Text>
                                        Set the date and time for sending the
                                        notification
                                      </Text>
                                    </DialogHeader>
                                    <DialogBody>
                                      <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={4}
                                      >
                                        <Box>
                                          <Text mb={2}>Hearing Date</Text>
                                          <Input
                                            type="date"
                                            name="hearing_date"
                                            required
                                          />
                                        </Box>
                                        <Box>
                                          <Text mb={2}>Hearing Time</Text>
                                          <Input
                                            type="time"
                                            name="hearing_time"
                                            required
                                          />
                                        </Box>
                                      </Box>
                                    </DialogBody>
                                    <DialogFooter>
                                      <DialogActionTrigger asChild>
                                        <Button variant="outline">
                                          Cancel
                                        </Button>
                                      </DialogActionTrigger>
                                      <Button
                                        loading={
                                          navigation.state === "submitting"
                                        }
                                        type="submit"
                                        background={"blue.500"}
                                        name="type"
                                        value={"attempt1"}
                                      >
                                        Send Schedule
                                      </Button>
                                    </DialogFooter>
                                    <DialogCloseTrigger />
                                  </Form>
                                </DialogContent>
                              </DialogRoot>

                              <DialogRoot>
                                <DialogTrigger asChild>
                                  <IconButton
                                    disabled={
                                      userType === "admin" ||
                                      !attempt1 ||
                                      attempt2
                                    }
                                    type={attempt2 ? "button" : "submit"}
                                    variant={attempt2 ? "solid" : "subtle"}
                                    colorPalette={attempt2 ? "green" : ""}
                                    size={"lg"}
                                    onClick={() => setButtonClicked("attempt2")}
                                  >
                                    {attempt2 ? (
                                      <FaCheck />
                                    ) : (
                                      <TbMessage2Share />
                                    )}
                                  </IconButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <Form method="put">
                                    <Input
                                      value={_id}
                                      name="id"
                                      type="hidden"
                                    />
                                    <DialogHeader>
                                      <DialogTitle>
                                        Schedule Notification
                                      </DialogTitle>
                                      <Text>
                                        Set the date and time for sending the
                                        notification
                                      </Text>
                                    </DialogHeader>
                                    <DialogBody>
                                      <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={4}
                                      >
                                        <Box>
                                          <Text mb={2}>Hearing Date</Text>
                                          <Input
                                            type="date"
                                            name="hearing_date"
                                            required
                                          />
                                        </Box>
                                        <Box>
                                          <Text mb={2}>Hearing Time</Text>
                                          <Input
                                            type="time"
                                            name="hearing_time"
                                            required
                                          />
                                        </Box>
                                      </Box>
                                    </DialogBody>
                                    <DialogFooter>
                                      <DialogActionTrigger asChild>
                                        <Button variant="outline">
                                          Cancel
                                        </Button>
                                      </DialogActionTrigger>
                                      <Button
                                        loading={
                                          navigation.state === "submitting"
                                        }
                                        type="submit"
                                        background={"blue.500"}
                                        name="type"
                                        value={"attempt2"}
                                      >
                                        Send Schedule
                                      </Button>
                                    </DialogFooter>
                                    <DialogCloseTrigger />
                                  </Form>
                                </DialogContent>
                              </DialogRoot>

                              <DialogRoot>
                                <DialogTrigger asChild>
                                  <IconButton
                                    disabled={
                                      userType === "admin" ||
                                      !attempt2 ||
                                      attempt3
                                    }
                                    type={attempt3 ? "button" : "submit"}
                                    variant={attempt3 ? "solid" : "subtle"}
                                    colorPalette={attempt3 ? "green" : ""}
                                    size={"lg"}
                                    onClick={() => setButtonClicked("attempt3")}
                                  >
                                    {attempt3 ? (
                                      <FaCheck />
                                    ) : (
                                      <TbMessage2Share />
                                    )}
                                  </IconButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <Form method="put">
                                    <Input
                                      value={_id}
                                      name="id"
                                      type="hidden"
                                    />
                                    <DialogHeader>
                                      <DialogTitle>
                                        Schedule Notification
                                      </DialogTitle>
                                      <Text>
                                        Set the date and time for sending the
                                        notification
                                      </Text>
                                    </DialogHeader>
                                    <DialogBody>
                                      <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={4}
                                      >
                                        <Box>
                                          <Text mb={2}>Hearing Date</Text>
                                          <Input
                                            type="date"
                                            name="hearing_date"
                                            required
                                          />
                                        </Box>
                                        <Box>
                                          <Text mb={2}>Hearing Time</Text>
                                          <Input
                                            type="time"
                                            name="hearing_time"
                                            required
                                          />
                                        </Box>
                                      </Box>
                                    </DialogBody>
                                    <DialogFooter>
                                      <DialogActionTrigger asChild>
                                        <Button variant="outline">
                                          Cancel
                                        </Button>
                                      </DialogActionTrigger>
                                      <Button
                                        loading={
                                          navigation.state === "submitting"
                                        }
                                        type="submit"
                                        background={"blue.500"}
                                        name="type"
                                        value={"attempt3"}
                                      >
                                        Send Schedule
                                      </Button>
                                    </DialogFooter>
                                    <DialogCloseTrigger />
                                  </Form>
                                </DialogContent>
                              </DialogRoot>
                            </Box>
                          </Box>

                          <Box
                            display={"flex"}
                            flexDirection={"column"}
                            gap={2}
                          >
                            <Text>Case Status</Text>
                            <Box display={"flex"} alignItems={"center"} gap={3}>
                              <Form method="PUT">
                                <Input type="hidden" name="id" value={_id} />

                                <Input
                                  type="hidden"
                                  name="status"
                                  value={"settled"}
                                />
                                <Button
                                  loading={
                                    navigation.state === "submitting" &&
                                    buttonClicked == "settled"
                                  }
                                  name="type"
                                  type="submit"
                                  value={"settledButton"}
                                  disabled={userType === "admin"}
                                  colorPalette={"green"}
                                  onClick={() => setButtonClicked("settled")}
                                  variant={
                                    status === "settled" ? "solid" : "subtle"
                                  }
                                >
                                  Settled
                                </Button>
                              </Form>

                              <Form method="PUT">
                                <Input type="hidden" name="id" value={_id} />
                                <Input
                                  type="hidden"
                                  name="status"
                                  value={"failed"}
                                />
                                <Button
                                  loading={
                                    navigation.state === "submitting" &&
                                    buttonClicked == "failed"
                                  }
                                  onClick={() => setButtonClicked("failed")}
                                  name="type"
                                  value={"failedButton"}
                                  disabled={userType === "admin"}
                                  colorPalette={"red"}
                                  variant={
                                    status === "failed" ? "solid" : "subtle"
                                  }
                                  type="submit"
                                >
                                  Failed
                                </Button>
                              </Form>
                            </Box>
                          </Box>
                        </Box>

                        <Box>
                          <Button
                            onClick={() => navigate(`/casedetails/${_id}`)}
                            colorPalette={"blue"}
                            variant={"surface"}
                            display={"flex"}
                            alignItems={"center"}
                            gap={2}
                          >
                            <Icon size={"sm"}>
                              <FaFileLines />
                            </Icon>
                            Case Details
                          </Button>
                        </Box>
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                      </DialogFooter>
                      <DialogCloseTrigger />
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
              {case_type}
            </h2>

            <Box className="flex flex-col">
              <Text
                display={"flex"}
                alignItems={"center"}
                gap={2}
                fontSize={"sm"}
              >
                <Text fontStyle={"italic"}>Complainant: </Text>
                <Text>{complainant_name}</Text>
              </Text>
              <Text
                display={"flex"}
                alignItems={"center"}
                gap={2}
                fontSize={"sm"}
              >
                <Text fontStyle={"italic"}>Respondent: </Text>
                <Text>{respondent_name}</Text>
              </Text>
            </Box>
          </Box>
        </Card.Root>
      </Box>
    </>
  );
};

export default CasesCardContainer;
