import {
  Box,
  Text,
  Button,
  Separator,
  Icon,
  IconButton,
  Input,
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

export const loader = async () => {
  const user = localStorage.getItem("user");

  const userData: UserPropType = JSON.parse(user as any);

  return { userData };
};
const Settings = () => {
  const navigate = useNavigate();
  const { userData } = useLoaderData();

  const logout = () => {
    // 🗑️ Remove authToken and user from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // 🔄 Redirect to home page
    navigate("/");
  };

  return (
    <>
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
                <Text fontSize={"md"}>Update your data</Text>
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
                    <DialogBody display={"flex"} flexDir={"column"} gap={5}>
                      <Field
                        label="Barangay Captain"
                        errorText="This field is required"
                      >
                        <Input
                          required
                          id="barangay_captain"
                          type="text"
                          placeholder="Enter New Baranggay Captain"
                          name="barangay_captain"
                        />
                      </Field>

                      <Field
                        label="Barangay Secretary"
                        errorText="This field is required"
                      >
                        <Input
                          required
                          id="barangay_captain"
                          type="text"
                          placeholder="Enter New Barangay Secretary"
                          name="barangay_captain"
                        />
                      </Field>

                      <Field
                        label="Change Password"
                        errorText="This field is required"
                      >
                        <PasswordInput />
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
                    <Text fontSize={"md"}>{userData.barangay_captain}</Text>
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
                    <Text fontSize={"md"}>{userData.barangay_secretary}</Text>
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

            <Button
              onClick={logout}
              colorPalette={"red"}
              variant={"surface"}
              width={100}
              marginTop={10}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Settings;
