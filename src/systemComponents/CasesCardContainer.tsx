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
  userType: string;
};

import { useNavigation, useNavigate } from "react-router-dom";
const CasesCardContainer = ({
  case_number,
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
  case_type,
  _id,
}: CaseType) => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [buttonClicked, setButtonClicked] = useState("");

  useEffect(() => {
    setButtonClicked("");
  }, [navigation.state]);
  return (
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
                        <Box display={"flex"} flexDirection={"column"} gap={2}>
                          <Text>Send notification</Text>
                          <Box display={"flex"} alignItems={"center"} gap={5}>
                            <Form method="put">
                              <Input value={_id} name="id" type="hidden" />
                              <IconButton
                                disabled={userType === "admin"}
                                loading={
                                  navigation.state === "submitting" &&
                                  buttonClicked == "attempt1"
                                }
                                type={attempt1 ? "button" : "submit"}
                                name="type"
                                value={"attempt1"}
                                variant={attempt1 ? "solid" : "subtle"}
                                colorPalette={attempt1 ? "green" : ""}
                                size={"lg"}
                                onClick={() => setButtonClicked("attempt1")}
                              >
                                {attempt1 ? <FaCheck /> : <TbMessage2Share />}
                              </IconButton>
                            </Form>

                            <Form method="put">
                              <Input value={_id} name="id" type="hidden" />
                              <IconButton
                                disabled={userType === "admin"}
                                loading={
                                  navigation.state === "submitting" &&
                                  buttonClicked == "attempt2"
                                }
                                type={attempt2 ? "button" : "submit"}
                                name="type"
                                value={"attempt2"}
                                variant={attempt2 ? "solid" : "subtle"}
                                colorPalette={attempt2 ? "green" : ""}
                                size={"lg"}
                                onClick={() => setButtonClicked("attempt2")}
                              >
                                {attempt2 ? <FaCheck /> : <TbMessage2Share />}
                              </IconButton>
                            </Form>

                            <Form method="put">
                              <Input value={_id} name="id" type="hidden" />
                              <IconButton
                                disabled={userType === "admin"}
                                loading={
                                  navigation.state === "submitting" &&
                                  buttonClicked == "attempt3"
                                }
                                type={attempt3 ? "button" : "submit"}
                                name="type"
                                value={"attempt3"}
                                variant={attempt3 ? "solid" : "subtle"}
                                colorPalette={attempt3 ? "green" : ""}
                                size={"lg"}
                                onClick={() => setButtonClicked("attempt3")}
                              >
                                {attempt3 ? <FaCheck /> : <TbMessage2Share />}
                              </IconButton>
                            </Form>
                          </Box>
                        </Box>

                        <Box display={"flex"} flexDirection={"column"} gap={2}>
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
  );
};

export default CasesCardContainer;
