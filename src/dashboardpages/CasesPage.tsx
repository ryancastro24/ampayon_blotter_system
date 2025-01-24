import { HiOutlineFolder } from "react-icons/hi2";
import { LuCalendarClock } from "react-icons/lu";
import { RiPoliceBadgeLine } from "react-icons/ri";
import { useState, useRef, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
const cases = [
  {
    complainant: "John Doe",
    respondent: "Jane Smith",
    dateOfAppointment: "2025-01-25",
    caseType: "Property Dispute",
  },
  {
    complainant: "Alice Johnson",
    respondent: "Bob Williams",
    dateOfAppointment: "2025-01-26",
    status: "ongoing",
    caseType: "Contract Violation",
  },
  {
    complainant: "Carlos Martinez",
    respondent: "Sophia Brown",
    dateOfAppointment: "2025-01-27",
    status: "ongoing",
    caseType: "Workplace Harassment",
  },
  {
    complainant: "Emily Davis",
    respondent: "Michael Wilson",
    dateOfAppointment: "2025-01-28",
    status: "settled",
    caseType: "Tenant-Landlord Conflict",
  },
  {
    complainant: "George Lopez",
    respondent: "Karen Taylor",
    dateOfAppointment: "2025-01-29",
    status: "settled",
    caseType: "Consumer Rights Violation",
  },
  {
    complainant: "Hannah Lee",
    respondent: "Ryan Harris",
    dateOfAppointment: "2025-01-30",
    status: "ongoing",
    caseType: "Family Dispute",
  },
  {
    complainant: "Liam Clark",
    respondent: "Olivia Young",
    dateOfAppointment: "2025-02-01",
    status: "ongoing",
    caseType: "Insurance Fraud",
  },
  {
    complainant: "Noah White",
    respondent: "Emma Green",
    dateOfAppointment: "2025-02-02",
    status: "ongoing",
    caseType: "Cybercrime",
  },
  {
    complainant: "Zoe Adams",
    respondent: "Mason Thompson",
    dateOfAppointment: "2025-02-03",
    status: "settled",
    caseType: "Defamation",
  },
  {
    complainant: "Lucas Scott",
    respondent: "Lily Turner",
    dateOfAppointment: "2025-02-04",
    status: "ongoing",
    caseType: "Intellectual Property Dispute",
  },
];

const CasesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const cameraRef = useRef<HTMLVideoElement | null>(null);

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
            className="w-[150px] h-[40px] cursor-pointer hover:bg-blue-600 text-sm rounded bg-blue-500 text-white font-display"
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
            <div className="flex justify-between mb-4 border-b border-slate-300">
              <button
                className={`px-4 py-2 ${
                  activeTab === 1
                    ? "border-b-4 border-blue-500 font-bold cursor-pointer"
                    : "cursor-pointer"
                }`}
                onClick={() => setActiveTab(1)}
              >
                Complainant
              </button>

              <button
                className={`px-4 py-2 ${
                  activeTab === 2
                    ? "border-b-4 border-blue-500 font-bold cursor-pointer"
                    : "cursor-pointer"
                }`}
                onClick={() => setActiveTab(2)}
              >
                Respondent
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === 3
                    ? "border-b-4 border-blue-500 font-bold cursor-pointer"
                    : "cursor-pointer"
                }`}
                onClick={() => setActiveTab(3)}
              >
                Complaint
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 1 && (
              <div>
                {/* Complainant Details */}
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <div className="flex flex-col gap-1 w-full">
                      <label htmlFor="complainant_name" className="text-sm">
                        Name
                      </label>
                      <input
                        id="complainant_name"
                        type="text"
                        placeholder="Enter Complainant Name"
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
                        placeholder="09XXXXXXXXX"
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
                      placeholder="SAMPLE@EXAMPLE.COM"
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
            )}

            {activeTab === 2 && (
              <div>
                {/* Complaint Details */}
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <div className="flex flex-col gap-1 w-full">
                      <label htmlFor="respondent_name" className="text-sm">
                        Name
                      </label>
                      <input
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
                        id="Respondent_number"
                        type="text"
                        placeholder="Enter Respondent Number"
                        className="border border-slate-300 rounded p-2 w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="respondent_email" className="text-sm">
                      Email
                    </label>
                    <input
                      id="respondent_email"
                      type="text"
                      placeholder="Enter Respondent Email"
                      className="border border-slate-300 rounded p-2 w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div>
                {/* Complaint Details */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="complainant_name" className="text-sm">
                      Case Type
                    </label>
                    <select
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
                      placeholder="Complaint Description"
                      className="border border-slate-300 rounded p-2 w-full resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="bg-gray-300 rounded  cursor-pointer px-4 py-2"
                onClick={closeModal}
              >
                Cancel
              </button>
              {activeTab === 3 && (
                <button
                  type="submit"
                  className="bg-blue-500 cursor-pointer text-white rounded px-4 py-2"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Available Cases */}
      <div>
        <h2 className="font-display flex items-center gap-2">
          <span className="text-lg">
            <HiOutlineFolder />
          </span>
          <span>Available Cases</span>
        </h2>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {paginatedCases.map((val, index) => (
          <div
            key={index}
            className="w-full relative cursor-pointer hover:shadow-lg hover:shadow-[#0000006c] flex flex-col justify-between p-4 h-[180px] shadow-md shadow-[#0000003f] border border-slate-300 rounded-md"
          >
            <div
              className={`absolute top-2 right-2 rounded-full w-[15px] h-[15px] ${
                val.status === "settled" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <span className="text-lg">
                  <RiPoliceBadgeLine />
                </span>
                <h1 className="text-lg font-display">{val.caseType}</h1>
              </div>
              <div>
                <p className="text-sm font-display">
                  <strong>Complainant: </strong>
                  {val.complainant}
                </p>
                <p className="text-sm font-display">
                  <strong>Respondent: </strong>
                  {val.respondent}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">
                <LuCalendarClock />
              </span>
              <span className="text-sm font-display">
                <strong>Schedule: </strong>
                {val.dateOfAppointment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasesPage;
