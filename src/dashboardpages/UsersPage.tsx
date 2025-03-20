import {
  Box,
  Tabs,
  Input,
  Button,
  Grid,
  Text,
  GridItem,
} from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogRoot,
} from "@/components/ui/dialog";
import { Outlet } from "react-router-dom";
import UserCardContainer from "@/systemComponents/UserCardContainer";
import { PasswordInput } from "@/components/ui/password-input";
import { EmptyState, VStack } from "@chakra-ui/react";
import { FaUserLargeSlash } from "react-icons/fa6";
import { HiUpload } from "react-icons/hi";
import {
  Form,
  ActionFunction,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { Field } from "@/components/ui/field";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { getUsers, addUser, updateUser } from "@/backendapi/usersApi";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";

import { useState, useEffect, ChangeEvent } from "react";
const API_BASE_URL = "https://psgc.gitlab.io/api"; // PSGC API Base URL

// Define types for the data fetched
interface Region {
  code: string;
  name: string;
}

interface City {
  code: string;
  name: string;
}
interface Province {
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

const fetchProvinces = async (regionCode: string): Promise<Province[]> => {
  const res = await fetch(`${API_BASE_URL}/regions/${regionCode}/provinces`);
  return res.json();
};

const fetchCities = async (provinceCode: string): Promise<City[]> => {
  const res = await fetch(
    `${API_BASE_URL}/provinces/${provinceCode}/cities-municipalities`
  );
  return res.json();
};

const fetchBarangays = async (cityCode: string): Promise<Barangay[]> => {
  const res = await fetch(
    `${API_BASE_URL}/cities-municipalities/${cityCode}/barangays`
  );
  return res.json();
};

export const loader = async () => {
  const usersData = await getUsers();
  console.log("users data", usersData);
  return { usersData };
};

export const action: ActionFunction = async ({ request }) => {
  console.log(request.method);
  console.log(request);
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  if (request.method == "POST") {
    console.log(data);
    const userData = await addUser(data);

    return userData;
  } else if (request.method == "PUT") {
    console.log("update data:", data);
    const updatedData = await updateUser(data.id, data);
    return updatedData;
  }

  return { data };
};

import { UserDataType } from "@/backendapi/usersApi";

type LoaderType = {
  usersData: UserDataType[];
};

const UsersPage = () => {
  const { usersData } = useLoaderData() as LoaderType;
  const navigation = useNavigation();
  // const [viewCases, setViewCases] = useState<boolean>(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>("");
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
  const [selectedCityCode, setSelectedCityCode] = useState<string>("");
  console.log("regions", regions);

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
      const provincesData = await fetchProvinces(regionCode);
      setProvinces(provincesData);
    }
  };

  const handleProvinceChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const provinceName = e.target.value;
    const provinceCode =
      e.target.selectedOptions[0].getAttribute("data-code") || "";
    setSelectedProvinceCode(provinceCode); // Store the region code separately
    setSelectedProvince(provinceName);

    if (provinceCode) {
      const citiesData = await fetchCities(provinceCode);
      console.log(citiesData);
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
    <Box
      data-state="open"
      _open={{
        animation: "fade-in 300ms ease-out",
      }}
      display={"flex"}
      flexDirection={"column"}
      padding={5}
      gap={5}
    >
      <Box display={"flex"} alignItems={"center"} gap={2}>
        <Input placeholder="Search" type="text" width={300} />
        <DialogRoot>
          <DialogTrigger asChild>
            <Button colorPalette={"blue"} variant={"subtle"} size="sm">
              Add new User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form method="post">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <DialogBody>
                {/* Tabs */}

                <Tabs.Root defaultValue="location">
                  <Tabs.List>
                    <Tabs.Trigger value="location">Location</Tabs.Trigger>
                    <Tabs.Trigger value="officials">Officials</Tabs.Trigger>
                    <Tabs.Trigger value="credentials">Credentials</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content
                    value="location"
                    display={"flex"}
                    flexDirection={"column"}
                    gap={5}
                  >
                    <Field label="Region" errorText="This field is required">
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

                    <Field label="Province" errorText="This field is required">
                      <NativeSelectRoot>
                        <NativeSelectField
                          name="province_name"
                          value={selectedProvince}
                          onChange={handleProvinceChange}
                        >
                          <option value="">Select Province</option>
                          {provinces.map((province) => (
                            <option
                              key={province.code}
                              value={province.name}
                              data-code={province.code}
                            >
                              {province.name}
                            </option>
                          ))}
                        </NativeSelectField>
                        <input
                          type="hidden"
                          name="province_code"
                          value={selectedProvinceCode}
                        />
                      </NativeSelectRoot>
                    </Field>
                    <Field label="City" errorText="This field is required">
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

                    <Field label="Barangay" errorText="This field is required">
                      <NativeSelectRoot>
                        <NativeSelectField name="barangay_name">
                          <option value="">Select Barangay</option>
                          {barangays.map((barangay) => (
                            <>
                              <option key={barangay.code} value={barangay.name}>
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
                      <Grid width={"100%"} templateColumns="60% 40%" gap={2}>
                        <GridItem>
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
                            />
                          </Field>
                        </GridItem>

                        <GridItem>
                          <Field
                            label="Contact Number"
                            errorText="This field is required"
                          >
                            <Input
                              required
                              id="barangay_captain_contact_number"
                              type="text"
                              placeholder="09XXXXXXX"
                              name="barangay_captain_contact_number"
                            />
                          </Field>
                        </GridItem>
                      </Grid>

                      <Grid templateColumns="60% 40%" gap={4}>
                        <GridItem>
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
                            />
                          </Field>
                        </GridItem>

                        <GridItem>
                          <Field
                            label="Contact Number"
                            errorText="This field is required"
                          >
                            <Input
                              required
                              id="barangay_secretary_contact_number"
                              type="text"
                              placeholder="09XXXXXXXX"
                              name="barangay_secretary_contact_number"
                            />
                          </Field>
                        </GridItem>
                      </Grid>

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
                  Submit
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </Form>
          </DialogContent>
        </DialogRoot>
      </Box>

      <Outlet />

      {usersData.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <FaUserLargeSlash />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>No user available</EmptyState.Title>
              <EmptyState.Description>
                Add new users from different cities
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <>
          <Text>Available Users</Text>
          <Grid templateColumns="repeat(4, 1fr  )" gap="6">
            {usersData.map((val) => (
              <UserCardContainer key={val._id} {...val} />
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default UsersPage;
