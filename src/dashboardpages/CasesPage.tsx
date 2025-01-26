import { useState, useRef, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Form, ActionFunction, useNavigation } from "react-router-dom";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FaCircleMinus } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { IoFolderOpen } from "react-icons/io5";
import { TbDownload } from "react-icons/tb";
export const action: ActionFunction = async ({ request }) => {
  console.log(request.method);
  console.log(request);
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  if (request.method == "POST") {
    console.log("Post Method", data);
  }

  if (request.method == "PUT") {
    console.log("Put Method", data);
  }

  return { data };
};

const cases = [
  {
    complainant: "John Doe",
    respondent: "Jane Smith",
    dateOfAppointment: "2025-01-25",
    caseType: "Property Dispute",
    status: "Ongoing",
    case_number: 1,
  },
  {
    complainant: "Alice Johnson",
    respondent: "Bob Williams",
    dateOfAppointment: "2025-01-26",
    status: "Ongoing",
    caseType: "Contract Violation",
    case_number: 2,
  },
  {
    complainant: "Carlos Martinez",
    respondent: "Sophia Brown",
    dateOfAppointment: "2025-01-27",
    status: "Ongoing",
    caseType: "Workplace Harassment",
    case_number: 3,
  },
  {
    complainant: "Emily Davis",
    respondent: "Michael Wilson",
    dateOfAppointment: "2025-01-28",
    status: "Settled",
    caseType: "Tenant-Landlord Conflict",
    case_number: 4,
  },
  {
    complainant: "George Lopez",
    respondent: "Karen Taylor",
    dateOfAppointment: "2025-01-29",
    status: "Settled",
    caseType: "Consumer Rights Violation",
    case_number: 5,
  },
  {
    complainant: "Hannah Lee",
    respondent: "Ryan Harris",
    dateOfAppointment: "2025-01-30",
    status: "Ongoing",
    caseType: "Family Dispute",
    case_number: 6,
  },
  {
    complainant: "Liam Clark",
    respondent: "Olivia Young",
    dateOfAppointment: "2025-02-01",
    status: "Failed",
    caseType: "Insurance Fraud",
    case_number: 7,
  },
  {
    complainant: "Noah White",
    respondent: "Emma Green",
    dateOfAppointment: "2025-02-02",
    status: "Ongoing",
    caseType: "Cybercrime",
    case_number: 8,
  },
  {
    complainant: "Zoe Adams",
    respondent: "Mason Thompson",
    dateOfAppointment: "2025-02-03",
    status: "Settled",
    caseType: "Defamation",
    case_number: 9,
  },
  {
    complainant: "Lucas Scott",
    respondent: "Lily Turner",
    dateOfAppointment: "2025-02-04",
    status: "Ongoing",
    caseType: "Intellectual Property Dispute",
    case_number: 10,
  },
];

const CasesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSelectedCaseModal, setOpenSelectedCaseModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const cameraRef = useRef<HTMLVideoElement | null>(null);
  const navigation = useNavigation();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [selectedData, setSelectedData] = useState({
    complainantName: "",
    complainantNumber: "",
    complainantEmail: "",
    respondentName: "",
    respondentNumber: "",
    respondentEmail: "",
    caseType: "",
    caseDescription: "",
    scheduledDate: "",
  });
  const [formData, setFormData] = useState({
    complainantName: "",
    complainantNumber: "",
    complainantEmail: "",
    respondentName: "",
    respondentNumber: "",
    respondentEmail: "",
    caseType: "",
    caseDescription: "",
    scheduledDate: "",
  });

  const handleOpenCaseModal = (data: any) => {
    setSelectedData({
      complainantName: data.complainant,
      complainantNumber: "sample",
      complainantEmail: "sample",
      respondentName: data.respondent,
      respondentNumber: data.respondent,
      respondentEmail: "sample",
      caseType: data.caseType,
      caseDescription: "sample",
      scheduledDate: data.dateOfAppointment,
    });

    setOpenSelectedCaseModal(true);
  };

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputSelectedDataChange = (field: any, value: any) => {
    setSelectedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseSelectedModal = () => {
    setOpenSelectedCaseModal(false);
    setOpenDropdownIndex(null);
  };
  const casesPerPage = 8;
  const filteredCases = cases.filter(
    (c) =>
      c.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.respondent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * casesPerPage,
    currentPage * casesPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (isModalOpen && activeTab === 1 && !photo) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (cameraRef.current) {
            cameraRef.current.srcObject = stream;
          }
          setStream(stream);
        })
        .catch((error) => console.error("Camera error:", error));
    }

    // Clean up camera on modal close
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isModalOpen, activeTab, photo]);

  const takePicture = () => {
    const video = cameraRef.current;
    if (video) {
      // Ensure video is not null
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Ensure the canvas context is not null
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/png"));
      }

      // Stop the camera after capturing photo
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    } else {
      console.error("Video element not found.");
    }
  };

  const retakePicture = () => {
    setPhoto(null);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
        }
        setStream(stream);
      })
      .catch((error) => console.error("Camera error:", error));
  };

  const closeModal = () => {
    setIsModalOpen(false);

    // Stop the camera when closing the modal
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search and Add New Case */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="search"
            className="w-[300px] h-[40px] text-sm rounded border border-gray-300 px-4 font-display"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="px-3 h-[40px] cursor-pointer hover:bg-blue-600 text-sm rounded bg-blue-500 text-white font-display"
            onClick={() => setIsModalOpen(true)}
          >
            Add new case
          </button>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <button
            className="px-2 py-2 border text-xl border-slate-300 rounded cursor-pointer bg-white"
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            <IoIosArrowBack />
          </button>
          <span className="text-sm font-display">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-2 py-2 border text-xl border-slate-300 rounded cursor-pointer bg-white"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000098] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-[600px]">
            <h2 className="text-lg font-bold mb-4">Add New Case</h2>

            {/* Tabs */}

            <Form method="post">
              <div className="flex justify-between mb-4 border-b border-slate-300">
                {["Complainant", "Respondent", "Complaint"].map(
                  (tab, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 ${
                        activeTab === index + 1
                          ? "border-b-4 border-blue-500 font-bold cursor-pointer"
                          : "cursor-pointer"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(index + 1);
                      }}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              {/* Tab Content */}
              <div
                style={{
                  display: activeTab === 1 ? "block" : "none",
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <div className="flex flex-col gap-1 w-full">
                      <label htmlFor="complainant_name" className="text-sm">
                        Name
                      </label>
                      <input
                        id="complainant_name"
                        type="text"
                        value={formData.complainantName}
                        placeholder="Enter Complainant Name"
                        onChange={(e) =>
                          handleInputChange("complainantName", e.target.value)
                        }
                        name="complainant_name"
                        className="border border-slate-300 rounded p-2 w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <label htmlFor="complainant_number" className="text-sm">
                        Phone Number
                      </label>
                      <input
                        id="complainant_number"
                        type="text"
                        value={formData.complainantNumber}
                        placeholder="09XXXXXXXXX"
                        name="complainant_number"
                        onChange={(e) =>
                          handleInputChange("complainantNumber", e.target.value)
                        }
                        className="border border-slate-300 rounded p-2 w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="complainant_email" className="text-sm">
                      Email
                    </label>
                    <input
                      id="complainant_email"
                      type="text"
                      value={formData.complainantEmail}
                      placeholder="sample@email.com"
                      name="complainant_email"
                      onChange={(e) =>
                        handleInputChange("complainantEmail", e.target.value)
                      }
                      className="border border-slate-300 rounded p-2 w-full"
                    />
                  </div>

                  {/* Camera and Picture */}
                  <div className="flex flex-col items-center gap-2">
                    {photo ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={photo}
                          alt="Captured"
                          className="w-full h-[200px] bg-gray-200 rounded"
                        />
                        <button
                          type="button"
                          className="bg-blue-500 cursor-pointer text-white rounded px-4 py-2"
                          onClick={retakePicture}
                        >
                          Retake
                        </button>
                      </div>
                    ) : (
                      <div>
                        <video
                          ref={cameraRef}
                          className="w-full h-[200px] bg-gray-200 rounded"
                          autoPlay
                        ></video>
                        <button
                          type="button"
                          className="bg-blue-500 cursor-pointer text-white rounded px-4 py-2 mt-2"
                          onClick={takePicture}
                        >
                          Take Picture
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: activeTab === 2 ? "block" : "none",
                }}
              >
                {/* Complaint Details */}
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <div className="flex flex-col gap-1 w-full">
                      <label htmlFor="respondent_name" className="text-sm">
                        Name
                      </label>
                      <input
                        onChange={(e) =>
                          handleInputChange("respondentName", e.target.value)
                        }
                        name="respondent_name"
                        value={formData.respondentName}
                        id="respondent_name"
                        type="text"
                        placeholder="Enter Respondent Name"
                        className="border border-slate-300 rounded p-2 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label htmlFor="Respondent_number" className="text-sm">
                        Phone Number
                      </label>
                      <input
                        onChange={(e) =>
                          handleInputChange("respondentNumber", e.target.value)
                        }
                        name="responded_number"
                        value={formData.respondentNumber}
                        id="Respondent_number"
                        type="text"
                        placeholder="09XXXXXXXX"
                        className="border border-slate-300 rounded p-2 w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="respondent_email" className="text-sm">
                      Email
                    </label>
                    <input
                      onChange={(e) =>
                        handleInputChange("respondentEmail", e.target.value)
                      }
                      name="responded_email"
                      value={formData.respondentEmail}
                      id="respondent_email"
                      type="text"
                      placeholder="sample@email.com"
                      className="border border-slate-300 rounded p-2 w-full"
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: activeTab === 3 ? "block" : "none",
                }}
              >
                {/* Complaint Details */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="complainant_name" className="text-sm">
                      Case Type
                    </label>
                    <select
                      onChange={(e) =>
                        handleInputChange("caseType", e.target.value)
                      }
                      value={formData.caseType}
                      name="casetype"
                      id="complainant_name"
                      className="border border-slate-300 rounded p-2 w-full"
                    >
                      <option>Select Case Type</option>
                      <option> Case Type 1</option>
                      <option> Case Type 2</option>
                      <option> Case Type 3</option>
                      <option> Case Type 4</option>
                      <option> Case Type 5</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="complainant_name" className="text-sm">
                      Case Description
                    </label>
                    <textarea
                      name="casedescription"
                      onChange={(e) =>
                        handleInputChange("caseDescription", e.target.value)
                      }
                      value={formData.caseDescription}
                      placeholder="Complaint Description"
                      className="border border-slate-300 rounded p-2 w-full resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="complainant_name" className="text-sm">
                      Scheduled Date
                    </label>
                    <input
                      name="scheduled_date"
                      onChange={(e) =>
                        handleInputChange("scheduledDate", e.target.value)
                      }
                      value={formData.scheduledDate}
                      type="date"
                      placeholder="Complaint Description"
                      className="border border-slate-300 rounded p-2 w-full resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 rounded cursor-pointer px-4 py-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                {activeTab === 3 && (
                  <button
                    type="submit"
                    className="bg-blue-500 cursor-pointer text-white rounded px-4 py-2"
                  >
                    {navigation.state == "submitting" ? "Loading" : "Submit"}
                  </button>
                )}
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* Available Cases */}
      <div>
        <h2 className="font-display flex items-center gap-2">
          <span className="text-lg">
            <IoFolderOpen />
          </span>
          <span>Available Cases : {cases.length}</span>
        </h2>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {paginatedCases.map((val, index) => (
          <div
            key={index}
            className="w-full relative flex flex-col justify-between p-4 h-[180px] shadow-md shadow-[#0000003f] border border-slate-300 rounded-md"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="flex items-center text-slate-400 gap-1 text-sm">
                    <span className="italic font-display">Case No. </span>
                    <span>{val.case_number}</span>
                  </p>

                  <p className="text-xs text-slate-400">|</p>

                  <p
                    className={`flex items-center font-display gap-1 text-sm ${
                      val.status === "Settled"
                        ? "text-green-500"
                        : val.status === "Ongoing"
                        ? "text-orange-500"
                        : "text-red-500"
                    }`}
                  >
                    <span>
                      {val.status === "Settled" ? (
                        <FaCircleCheck />
                      ) : val.status === "Ongoing" ? (
                        <FaCircleMinus />
                      ) : (
                        <FaCircleXmark />
                      )}
                    </span>
                    <span>{val.status}</span>
                  </p>
                </div>

                <div className="relative flex items-center gap-2">
                  <button className="text-xl text-slate-400 cursor-pointer hover:text-slate-500">
                    <TbDownload />
                  </button>

                  <button
                    onClick={() =>
                      setOpenDropdownIndex(
                        openDropdownIndex === index ? null : index
                      )
                    }
                    className="text-xl text-slate-400 cursor-pointer hover:text-slate-500"
                  >
                    <IoIosArrowDropdownCircle />
                  </button>

                  <div
                    style={{
                      display: openDropdownIndex === index ? "block" : "none",
                    }}
                    className="absolute right-0 top-7 w-auto p-3 bg-slate-100 shadow-slate-500 rounded-sm shadow-md"
                  >
                    {/* Dropdown content */}
                    <ul className="flex flex-col w-auto gap-1 ">
                      <div className="flex flex-col gap-2">
                        <li
                          onClick={() => handleOpenCaseModal({ ...val })}
                          className="text-sm cursor-pointer flex items-center gap-1 text-left px-4 py-1 rounded-sm   hover:bg-slate-300"
                        >
                          <span className="text-lg">
                            <BiSolidMessageSquareEdit />
                          </span>
                          <span>Update</span>
                        </li>

                        <hr className="text-slate-300 text-sm" />
                        <li className="text-sm text-left cursor-pointer   flex items-center gap-1 px-4 py-1 rounded-sm   hover:bg-slate-300">
                          <span>
                            <FaTrash />
                          </span>
                          <span>Remove</span>
                        </li>
                      </div>

                      <li
                        onClick={() =>
                          setOpenDropdownIndex(
                            openDropdownIndex === index ? null : index
                          )
                        }
                        className="text-xs mt-5  cursor-pointer  bg-red-400 text-center px-4 py-1 rounded-sm text-white  hover:bg-red-500"
                      >
                        Cancel
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <hr className="text-xs text-slate-200" />

            <div className="mt-5 flex flex-col gap-2">
              <h2 className="font-display">
                <strong className="italic">Case: </strong>
                {val.caseType}
              </h2>

              <div className="flex flex-col">
                <p className="text-sm text-slate-500">
                  <span className="italic">Complainant: </span>
                  <span>{val.complainant}</span>
                </p>
                <p className="text-sm text-slate-500">
                  <span className="italic">Respondent: </span>
                  <span>{val.respondent}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* selected case modal */}

      {openSelectedCaseModal && (
        <div className="fixed inset-0 bg-[#00000098] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-[600px]">
            <h2 className="text-lg font-bold mb-4">Update Case</h2>

            {/* Tabs */}

            <Form method="put">
              <div className="flex justify-between mb-4 border-b border-slate-300">
                {["Complainant", "Respondent", "Complaint"].map(
                  (tab, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 ${
                        activeTab === index + 1
                          ? "border-b-4 border-blue-500 font-bold cursor-pointer"
                          : "cursor-pointer"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(index + 1);
                      }}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              {/* Tab Content */}
              <div
                style={{
                  display: activeTab === 1 ? "block" : "none",
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <div className="flex flex-col gap-1 w-full">
                      <label htmlFor="complainant_name" className="text-sm">
                        Name
                      </label>
                      <input
                        id="complainant_name"
                        type="text"
                        value={selectedData.complainantName}
                        placeholder="Enter Complainant Name"
                        onChange={(e) =>
                          handleInputSelectedDataChange(
                            "complainantName",
                            e.target.value
                          )
                        }
                        name="complainant_name"
                        className="border border-slate-300 rounded p-2 w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <label htmlFor="complainant_number" className="text-sm">
                        Phone Number
                      </label>
                      <input
                        id="complainant_number"
                        type="text"
                        value={selectedData.complainantNumber}
                        placeholder="09XXXXXXXXX"
                        name="complainant_number"
                        onChange={(e) =>
                          handleInputSelectedDataChange(
                            "complainantNumber",
                            e.target.value
                          )
                        }
                        className="border border-slate-300 rounded p-2 w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="complainant_email" className="text-sm">
                      Email
                    </label>
                    <input
                      id="complainant_email"
                      type="text"
                      value={selectedData.complainantEmail}
                      placeholder="sample@email.com"
                      name="complainant_email"
                      onChange={(e) =>
                        handleInputSelectedDataChange(
                          "complainantEmail",
                          e.target.value
                        )
                      }
                      className="border border-slate-300 rounded p-2 w-full"
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: activeTab === 2 ? "block" : "none",
                }}
              >
                {/* Complaint Details */}
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <div className="flex flex-col gap-1 w-full">
                      <label htmlFor="respondent_name" className="text-sm">
                        Name
                      </label>
                      <input
                        onChange={(e) =>
                          handleInputSelectedDataChange(
                            "respondentName",
                            e.target.value
                          )
                        }
                        name="respondent_name"
                        value={selectedData.respondentName}
                        id="respondent_name"
                        type="text"
                        placeholder="Enter Respondent Name"
                        className="border border-slate-300 rounded p-2 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label htmlFor="Respondent_number" className="text-sm">
                        Phone Number
                      </label>
                      <input
                        onChange={(e) =>
                          handleInputSelectedDataChange(
                            "respondentNumber",
                            e.target.value
                          )
                        }
                        name="responded_number"
                        value={selectedData.respondentNumber}
                        id="Respondent_number"
                        type="text"
                        placeholder="09XXXXXXXX"
                        className="border border-slate-300 rounded p-2 w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="respondent_email" className="text-sm">
                      Email
                    </label>
                    <input
                      onChange={(e) =>
                        handleInputSelectedDataChange(
                          "respondentEmail",
                          e.target.value
                        )
                      }
                      name="responded_email"
                      value={selectedData.respondentEmail}
                      id="respondent_email"
                      type="text"
                      placeholder="sample@email.com"
                      className="border border-slate-300 rounded p-2 w-full"
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: activeTab === 3 ? "block" : "none",
                }}
              >
                {/* Complaint Details */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="complainant_name" className="text-sm">
                      Case Type
                    </label>
                    <select
                      onChange={(e) =>
                        handleInputSelectedDataChange(
                          "caseType",
                          e.target.value
                        )
                      }
                      value={selectedData.caseType}
                      name="casetype"
                      id="complainant_name"
                      className="border border-slate-300 rounded p-2 w-full"
                    >
                      <option>Select Case Type</option>
                      <option> Case Type 1</option>
                      <option> Case Type 2</option>
                      <option> Case Type 3</option>
                      <option> Case Type 4</option>
                      <option> Case Type 5</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="complainant_name" className="text-sm">
                      Case Description
                    </label>
                    <textarea
                      name="casedescription"
                      onChange={(e) =>
                        handleInputSelectedDataChange(
                          "caseDescription",
                          e.target.value
                        )
                      }
                      value={selectedData.caseDescription}
                      placeholder="Complaint Description"
                      className="border border-slate-300 rounded p-2 w-full resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="complainant_name" className="text-sm">
                      Scheduled Date
                    </label>
                    <input
                      name="scheduled_date"
                      onChange={(e) =>
                        handleInputSelectedDataChange(
                          "scheduledDate",
                          e.target.value
                        )
                      }
                      value={selectedData.scheduledDate}
                      type="date"
                      placeholder="Complaint Description"
                      className="border border-slate-300 rounded p-2 w-full resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 rounded cursor-pointer px-4 py-2"
                  onClick={handleCloseSelectedModal}
                >
                  Cancel
                </button>
                {activeTab === 3 && (
                  <button
                    type="submit"
                    className="bg-blue-500 cursor-pointer text-white rounded px-4 py-2"
                  >
                    {navigation.state == "submitting" ? "Loading" : "Submit"}
                  </button>
                )}
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesPage;
