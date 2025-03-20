import {
  Box,
  Text,
  Button,
  Separator,
  Icon,
  IconButton,
  Input,
  ClientOnly,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import { PasswordInput } from "@/components/ui/password-input";
import { Field } from "@/components/ui/field";
import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { BiSolidMessageSquareEdit } from "react-icons/bi";

import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
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
import { UserPropType } from "./Dashboard";
import { useLoaderData } from "react-router-dom";
import { updateUser } from "@/backendapi/usersApi";
import Loading from "@/systemComponents/Loading";
import { ActionFunction, useNavigation, Form } from "react-router-dom";
import { getUserProfile } from "@/backendapi/usersApi";

export const action: ActionFunction = async ({ request }) => {
  console.log(request.method);
  console.log(request);
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  console.log(data);

  const updatedData = await updateUser(data.id, data);
  return { updatedData };
};
export const loader = async () => {
  const user = localStorage.getItem("user");

  const userData: UserPropType = JSON.parse(user as any);
  const userProfileData = await getUserProfile(userData.id);
  return { userData, userProfileData };
};
const Settings = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { userData, userProfileData } = useLoaderData();

  const logout = () => {
    // 🗑️ Remove authToken and user from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // 🔄 Redirect to home page
    navigate("/");
  };

  return (
    <ClientOnly fallback={<Loading />}>
      <Box width={"full"} height={"full"} padding={5}>
        <Box display={"flex"} flexDirection={"column"} gap={5}>
          <Box>
            <Button
              display={"flex"}
              alignItems={"center"}
              gap={2}
              colorPalette={"blue"}
              variant={"subtle"}
              onClick={() => navigate("/dashboard")}
            >
              <IoChevronBackCircle /> Back To dashboard
            </Button>
          </Box>

          <Box paddingLeft={5} display={"flex"} flexDir={"column"} gap={6}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"full"}
            >
              <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                  Settings
                </Text>
                <Text fontSize={"sm"}>Update your data</Text>
              </Box>
              <Box>
                <DialogRoot>
                  <DialogTrigger asChild>
                    <Button
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={2}
                      colorPalette={"blue"}
                      variant={"solid"}
                    >
                      <BiSolidMessageSquareEdit />
                      Update Data
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Data</DialogTitle>
                    </DialogHeader>

                    <Form method="PUT">
                      <DialogBody display={"flex"} flexDir={"column"} gap={5}>
                        <Input type="hidden" value={userData.id} name="id" />
                        <Grid width={"full"} templateColumns="60% 40%" gap={2}>
                          <GridItem>
                            <Field
                              label="Barangay Captain"
                              errorText="This field is required"
                            >
                              <Input
                                defaultValue={userProfileData.barangay_captain}
                                id="barangay_captain"
                                type="text"
                                placeholder="Enter New Barangay Captain"
                                name="barangay_captain"
                              />
                            </Field>
                          </GridItem>

                          <GridItem>
                            <Field
                              label="Contact Number"
                              errorText="This field is required"
                            >
                              <Input
                                defaultValue={
                                  userProfileData.barangay_captain_contact_number
                                }
                                id="contactnumber"
                                type="text"
                                placeholder="09XXXXXXXX"
                                name="barangay_captain_contact_number"
                              />
                            </Field>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns="60% 40%" width={"full"} gap={2}>
                          <GridItem>
                            <Field
                              label="Barangay Secretary"
                              errorText="This field is required"
                            >
                              <Input
                                defaultValue={
                                  userProfileData.barangay_secretary
                                }
                                id="barangay_secretary"
                                type="text"
                                placeholder="Enter New Barangay Secretary"
                                name="barangay_secretary"
                              />
                            </Field>
                          </GridItem>

                          <GridItem>
                            <Field
                              label="Contact Number"
                              errorText="This field is required"
                            >
                              <Input
                                defaultValue={
                                  userProfileData.barangay_secretary_contact_number
                                }
                                id="contactnumber"
                                type="text"
                                placeholder="09XXXXXXXX"
                                name="barangay_secretary_contact_number"
                              />
                            </Field>
                          </GridItem>
                        </Grid>

                        <Field
                          label="Change Password"
                          errorText="This field is required"
                        >
                          <PasswordInput name="password" />
                        </Field>
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                        <Button
                          type="submit"
                          loading={navigation.state === "submitting"}
                          colorPalette={"blue"}
                          variant={"solid"}
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </Form>
                  </DialogContent>
                </DialogRoot>
              </Box>
            </Box>

            {/* location */}
            <Box display={"flex"} flexDir={"column"} gap={2}>
              <Text display={"flex"} alignItems={"center"} gap={1}>
                <Icon>
                  <FaLocationDot />
                </Icon>{" "}
                Location
              </Text>
              <Separator />

              <Box marginTop={2} display={"flex"} alignItems={"center"} gap={5}>
                <Box
                  rounded={"full"}
                  bg={"gray.400"}
                  width={100}
                  height={100}
                ></Box>
                <Box>
                  <Text fontSize={"2xl"} fontWeight={"bold"}>
                    Barangay {userData.barangay_name}
                  </Text>
                  <Text fontSize={"md"}>Region: {userData.region_name}</Text>
                  <Text fontSize={"md"}>City: {userData.city_name}</Text>
                </Box>
              </Box>
            </Box>

            {/* officials */}

            <Box display={"flex"} flexDir={"column"} gap={2}>
              <Text display={"flex"} alignItems={"center"} gap={1}>
                <Icon>
                  <BsFillPeopleFill />
                </Icon>{" "}
                Officials
              </Text>
              <Separator />

              <Box
                marginTop={2}
                display={"flex"}
                alignItems={"center"}
                gap={10}
              >
                {/* profile container */}
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={1}
                  flexDirection={"column"}
                >
                  <Box
                    width={70}
                    height={70}
                    rounded={"md"}
                    background={"gray.400"}
                  ></Box>
                  <Box
                    display={"flex"}
                    flexDir={"column"}
                    gap={0}
                    alignItems={"center"}
                  >
                    <Text fontSize={"md"}>
                      {userProfileData.barangay_captain}
                    </Text>
                    <Text fontSize={"sm"} fontStyle={"italic"}>
                      Barangay Captain
                    </Text>
                  </Box>
                </Box>
                {/* profile container */}
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={1}
                  flexDirection={"column"}
                >
                  <Box
                    width={70}
                    height={70}
                    rounded={"md"}
                    background={"gray.400"}
                  ></Box>

                  <Box
                    display={"flex"}
                    flexDir={"column"}
                    gap={0}
                    alignItems={"center"}
                  >
                    <Text fontSize={"md"}>
                      {userProfileData.barangay_secretary}
                    </Text>
                    <Text fontSize={"sm"} fontStyle={"italic"}>
                      Barangay Secretary
                    </Text>
                  </Box>
                </Box>

                <Separator orientation="vertical" height="24" />

                <DialogRoot>
                  <DialogTrigger asChild>
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      gap={2}
                    >
                      <IconButton
                        colorPalette={"blue"}
                        variant={"subtle"}
                        size={"2xl"}
                      >
                        <FaPlus />
                      </IconButton>

                      <Text fontSize={"sm"} fontStyle={"italic"}>
                        add other officials
                      </Text>
                    </Box>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Barangay Official</DialogTitle>
                    </DialogHeader>
                    <DialogBody
                      display={"flex"}
                      flexDirection={"column"}
                      gap={5}
                    >
                      <Field label="Name" errorText="This field is required">
                        <Input
                          required
                          type="text"
                          placeholder="Enter Name"
                          name="name"
                        />
                      </Field>

                      <Field
                        label="Position"
                        errorText="This field is required"
                      >
                        <Input
                          required
                          type="text"
                          placeholder="Enter Position"
                          name="position"
                        />
                      </Field>

                      <Field
                        label="Profile Picture"
                        errorText="This field is required"
                      >
                        <FileUploadRoot>
                          <FileUploadTrigger>
                            <Button variant="outline">
                              <HiUpload /> Upload file
                            </Button>
                          </FileUploadTrigger>
                          <FileUploadList />
                        </FileUploadRoot>
                      </Field>
                    </DialogBody>
                    <DialogFooter>
                      <DialogActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogActionTrigger>
                      <Button colorPalette={"blue"} variant={"solid"}>
                        Save
                      </Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                  </DialogContent>
                </DialogRoot>
              </Box>
            </Box>

            {/* logout */}

            <DialogRoot>
              <DialogTrigger asChild>
                <Button
                  colorPalette={"red"}
                  variant={"surface"}
                  width={100}
                  marginTop={10}
                >
                  Logout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to exit the application?
                  </DialogTitle>
                </DialogHeader>

                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogActionTrigger>
                  <Button
                    onClick={logout}
                    colorPalette={"red"}
                    variant={"solid"}
                  >
                    Logout
                  </Button>
                </DialogFooter>
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>
          </Box>
        </Box>
      </Box>
    </ClientOnly>
  );
};

export default Settings;
