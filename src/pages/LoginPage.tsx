import { FaRegUser } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import logo from "../assets/logo.png";
const LoginPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[350px] shadow-gray-300 shadow-md p-5 h-[450px] border border-gray-200 rounded-lg">
        <div>
          <div className="flex flex-col items-center gap-5  w-full h-full ">
            <img src={logo} alt="logo" width={120} height={120} />
            {/* input field */}
            <div className="flex flex-col gap-1 w-full">
              <label
                className="text-sm flex items-center gap-1"
                htmlFor="username"
              >
                <span>
                  <FaRegUser />
                </span>{" "}
                <span className="font-display">Username</span>
              </label>
              <input
                className="w-full h-[45px] rounded border border-gray-300 px-4  font-display"
                type="text"
                placeholder="Enter Username"
              />
            </div>

            {/* input field */}
            <div className="flex flex-col gap-1 w-full">
              <label
                className="text-sm flex items-center gap-1 font-display"
                htmlFor="username"
              >
                <span>
                  <MdLockOutline />
                </span>{" "}
                <span>Password</span>
              </label>
              <input
                className="w-full h-[45px] font-display rounded border border-gray-300 px-4 "
                type="text"
                placeholder="Enter Password"
              />
            </div>
            {/* submit button */}
            <button className="w-full h-[50px]  font-display bg-blue-500 text-white rounded mt-2 cursor-pointer">
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
