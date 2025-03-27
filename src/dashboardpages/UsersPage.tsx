import {
  Box,
  Tabs,
  Input,
  Button,
  Grid,
  Text,
  GridItem,
  IconButton,
} from "@chakra-ui/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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

import { getUsers, addUser, updateUser } from "@/backendapi/usersApi";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";

import { useState, useEffect, ChangeEvent, useRef } from "react";
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
  const formData = await request.formData();

  if (request.method === "POST") {
    console.log("Form Data Entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Verify file data
    const file = formData.get("file");
    console.log("File data:", file);

    const userData = await addUser(formData);
    return userData;
  } else if (request.method === "PUT") {
    const data = Object.fromEntries(formData.entries());
    console.log("update data:", data);
    const updatedData = await updateUser(data.id, data);
    return updatedData;
  }

  return null;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");
  const [selectedBarangayCode, setSelectedBarangayCode] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
    }
  };

  const handleBarangayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const barangayName = e.target.value;
    const barangayCode =
      e.target.options[e.target.selectedIndex].getAttribute("data-code") || "";
    setSelectedBarangay(barangayName);
    setSelectedBarangayCode(barangayCode);
    console.log("Selected Barangay:", {
      name: barangayName,
      code: barangayCode,
    });
  };

  console.log(selectedBarangay);

  // Add this function to generate username
  const generateUsername = () => {
    if (!selectedBarangay) return "";
    return `${selectedBarangay.toLowerCase().replace(/\s+/g, "_")}_admin`;
  };

  // Filter users based on search query
  const filteredUsers = usersData.filter((user) =>
    user.barangay_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle pagination
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="full"
      >
        {/* Left side: Search and Add User */}
        <Box display="flex" alignItems="center" gap={4}>
          <Input
            width={300}
            placeholder="Search by barangay name"
            value={searchQuery}
            onChange={handleSearch}
          />
          <DialogRoot>
            <DialogTrigger asChild>
              <Button colorPalette={"blue"} variant={"subtle"} size="sm">
                Add new User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Form method="post" encType="multipart/form-data">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  {/* Tabs */}

                  <Tabs.Root defaultValue="location">
                    <Tabs.List>
                      <Tabs.Trigger value="location">Location</Tabs.Trigger>
                      <Tabs.Trigger value="officials">Officials</Tabs.Trigger>
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

                      <Field
                        label="Province"
                        errorText="This field is required"
                      >
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
                              <option
                                key={city.code}
                                value={city.name}
                                data-code={city.code}
                              >
                                {city.name}
                              </option>
                            ))}
                          </NativeSelectField>
                          <input
                            type="hidden"
                            name="city_code"
                            value={selectedCityCode}
                          />
                        </NativeSelectRoot>
                      </Field>
                      {/* Barangay Selector (Disabled if no city selected) */}

                      <Field
                        label="Barangay"
                        errorText="This field is required"
                      >
                        <NativeSelectRoot>
                          <NativeSelectField
                            name="barangay_name"
                            value={selectedBarangay}
                            onChange={handleBarangayChange}
                          >
                            <option value="">Select Barangay</option>
                            {barangays.map((barangay) => (
                              <option
                                key={barangay.code}
                                value={barangay.name}
                                data-code={barangay.code}
                              >
                                {barangay.name}
                              </option>
                            ))}
                          </NativeSelectField>
                          <input
                            type="hidden"
                            name="barangay_code"
                            value={selectedBarangayCode}
                          />
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
                          <input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            required
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <HiUpload />{" "}
                            {selectedFile ? selectedFile.name : "Upload file"}
                          </Button>
                          {selectedFile && (
                            <Text fontSize="sm" mt={2}>
                              Selected file: {selectedFile.name}
                            </Text>
                          )}
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
                            value={generateUsername()}
                            readOnly
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

        {/* Right side: Pagination */}
        <Box display="flex" alignItems="center" gap={2}>
          <Text fontSize="sm" color="gray.600">
            Page {currentPage} of {totalPages}
          </Text>
          <IconButton
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
            variant="outline"
            colorPalette="blue"
          >
            <IoIosArrowBack />
          </IconButton>
          <IconButton
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            variant="outline"
            colorPalette="blue"
          >
            <IoIosArrowForward />
          </IconButton>
        </Box>
      </Box>

      <Outlet />

      {currentUsers.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <FaUserLargeSlash />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>No users found</EmptyState.Title>
              <EmptyState.Description>
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Add new users from different cities"}
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <>
          <Text>Available Users</Text>
          <Grid templateColumns="repeat(4, 1fr)" gap="6">
            {currentUsers.map((val) => (
              <UserCardContainer key={val._id} {...val} />
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default UsersPage;
