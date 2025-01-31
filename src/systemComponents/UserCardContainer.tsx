import {
  Text,
  Card,
  Box,
  Badge,
  Tabs,
  IconButton,
  Button,
  Input,
  Icon,
} from "@chakra-ui/react";
import { UserDataType } from "@/backendapi/usersApi";
import { HiUpload } from "react-icons/hi";
import { Form } from "react-router-dom";
import { Field } from "@/components/ui/field";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { PasswordInput } from "@/components/ui/password-input";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";
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
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigation, useNavigate } from "react-router-dom";
// end of imports

const API_BASE_URL = "https://psgc.gitlab.io/api"; // PSGC API Base URL
interface Region {
  code: string;
  name: string;
}

interface City {
  code: string;
  name: string;
}

interface Barangay {
  code: string;
  name: string;
}
const fetchRegions = async (): Promise<Region[]> => {
  const res = await fetch(`${API_BASE_URL}/regions`);
  return res.json();
};

const fetchCities = async (regionCode: string): Promise<City[]> => {
  const res = await fetch(
    `${API_BASE_URL}/regions/${regionCode}/cities-municipalities`
  );
  return res.json();
};

const fetchBarangays = async (cityCode: string): Promise<Barangay[]> => {
  const res = await fetch(
    `${API_BASE_URL}/cities-municipalities/${cityCode}/barangays`
  );
  return res.json();
};

const UserCardContainer = ({
  barangay_name,
  _id,
  city_name,
  city_code,
  region_code,
  barangay_captain,
  barangay_secretary,
  username,
  region_name,
}: UserDataType) => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>(region_name);
  const [selectedCity, setSelectedCity] = useState<string>(city_name);
  const [selectedRegionCode, setSelectedRegionCode] = useState<string | number>(
    region_code
  );
  const [selectedCityCode, setSelectedCityCode] = useState<string | number>(
    city_code
  );

  useEffect(() => {
    fetchRegions().then((data) => setRegions(data));
  }, []);

  const handleRegionChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const regionName = e.target.value;
    const regionCode =
      e.target.selectedOptions[0].getAttribute("data-code") || "";

    setSelectedRegion(regionName);
    setSelectedRegionCode(regionCode); // Store the region code separately
    setSelectedCity("");
    setBarangays([]);

    if (regionCode) {
      const citiesData = await fetchCities(regionCode);
      setCities(citiesData);
    }
  };
  const handleCityChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    const cityCode =
      e.target.selectedOptions[0].getAttribute("data-code") || "";
    setSelectedCityCode(cityCode); // Store the region code separately
    setSelectedCity(cityName);

    if (cityCode) {
      const barangaysData = await fetchBarangays(cityCode);
      setBarangays(barangaysData);
    }
  };

  return (
    <div key={_id}>
      <Card.Root key={_id} variant={"subtle"}>
        <Card.Body
          position={"relative"}
          display={"flex"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={2}
        >
          <Box
            width={"70px"}
            height={"70px"}
            background={"gray.300"}
            rounded={"full"}
          ></Box>
          <Box>
            <Box>
              <Text fontSize={"md"}>Brgy. {barangay_name}</Text>
              <Text fontSize={"xs"}>{city_name} City</Text>
            </Box>

            <Box>
              <Badge colorPalette="green" marginTop={2}>
                Total Case: 10
              </Badge>
            </Box>
          </Box>

          <Box position={"absolute"} right={2} top={2}>
            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton
                  size={"xs"}
                  variant={"surface"}
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
                <Box width={"full"}>
                  <Button
                    onClick={() => navigate("/dashboard/barangayCases")}
                    width={"full"}
                    colorPalette={"green"}
                    variant={"subtle"}
                    display={"flex"}
                    justifyContent={"flex-start"}
                  >
                    Show Cases
                  </Button>
                </Box>
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
                      Update User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Form method="put">
                      <DialogHeader>
                        <DialogTitle>Update User</DialogTitle>
                      </DialogHeader>
                      <DialogBody>
                        {/* Tabs */}

                        <Tabs.Root defaultValue="location">
                          <Tabs.List>
                            <Tabs.Trigger value="location">
                              Location
                            </Tabs.Trigger>
                            <Tabs.Trigger value="officials">
                              Officials
                            </Tabs.Trigger>
                            <Tabs.Trigger value="credentials">
                              Credentials
                            </Tabs.Trigger>
                          </Tabs.List>
                          <Tabs.Content
                            value="location"
                            display={"flex"}
                            flexDirection={"column"}
                            gap={5}
                          >
                            <Field
                              label="Region"
                              errorText="This field is required"
                            >
                              <NativeSelectRoot>
                                <NativeSelectField
                                  name="region_name"
                                  value={selectedRegion}
                                  onChange={handleRegionChange}
                                >
                                  <option value="">Select Region</option>
                                  {regions.map((region) => (
                                    <option
                                      key={region.code}
                                      value={region.name}
                                      data-code={region.code}
                                    >
                                      {region.name}
                                    </option>
                                  ))}
                                </NativeSelectField>
                                <input
                                  type="hidden"
                                  name="region_code"
                                  value={selectedRegionCode}
                                />
                              </NativeSelectRoot>
                            </Field>

                            <Field
                              label="City"
                              errorText="This field is required"
                            >
                              <NativeSelectRoot>
                                <NativeSelectField
                                  name="city_name"
                                  value={selectedCity}
                                  onChange={handleCityChange}
                                >
                                  <option value="">Select City</option>
                                  {cities.map((city) => (
                                    <>
                                      <option
                                        key={city.code}
                                        value={city.name}
                                        data-code={city.code}
                                      >
                                        {city.name}
                                      </option>
                                      <input
                                        type="hidden"
                                        name="city_code"
                                        value={selectedCityCode}
                                      />
                                    </>
                                  ))}
                                </NativeSelectField>
                              </NativeSelectRoot>
                            </Field>
                            {/* Barangay Selector (Disabled if no city selected) */}

                            <Field
                              label="Barangay"
                              errorText="This field is required"
                            >
                              <NativeSelectRoot>
                                <NativeSelectField name="barangay_name">
                                  <option value="">Select Barangay</option>
                                  {barangays.map((barangay) => (
                                    <>
                                      <option
                                        key={barangay.code}
                                        value={barangay.name}
                                      >
                                        {barangay.name}
                                      </option>
                                      <input
                                        type="hidden"
                                        name="barangay_code"
                                        value={barangay.code}
                                      />
                                    </>
                                  ))}
                                </NativeSelectField>
                              </NativeSelectRoot>
                            </Field>
                          </Tabs.Content>

                          <Tabs.Content value="officials">
                            <Box display="flex" flexDirection="column" gap={5}>
                              <Field
                                label="Barangay Captain"
                                errorText="This field is required"
                              >
                                <Input
                                  required
                                  id="barangay_captain"
                                  type="text"
                                  placeholder="Enter Baranggay Captain"
                                  name="barangay_captain"
                                  defaultValue={barangay_captain}
                                />
                              </Field>

                              <Field
                                label="Barangay Secretary"
                                errorText="This field is required"
                              >
                                <Input
                                  required
                                  id="barangay_secretary"
                                  type="text"
                                  placeholder="Enter Barangay Secretary"
                                  name="barangay_secretary"
                                  defaultValue={barangay_secretary}
                                />
                              </Field>

                              <Field
                                label="Barangay Logo"
                                errorText="This field is required"
                              >
                                <FileUploadRoot name="file_logo">
                                  <FileUploadTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <HiUpload /> Upload file
                                    </Button>
                                  </FileUploadTrigger>
                                  <FileUploadList />
                                </FileUploadRoot>
                              </Field>
                            </Box>
                          </Tabs.Content>

                          <Tabs.Content value="credentials">
                            <Box display="flex" flexDirection="column" gap={5}>
                              <Field
                                label="Username"
                                errorText="This field is required"
                              >
                                <Input
                                  required
                                  id="username"
                                  type="text"
                                  placeholder="Enter Username"
                                  name="username"
                                  defaultValue={username}
                                />
                              </Field>

                              <Field
                                label="Password"
                                errorText="This field is required"
                              >
                                <PasswordInput required name="password" />
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
                          Update
                        </Button>
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
              </MenuContent>
            </MenuRoot>
          </Box>
        </Card.Body>
      </Card.Root>
    </div>
  );
};

export default UserCardContainer;
