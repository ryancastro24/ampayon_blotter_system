import { Field } from "@/components/ui/field";
import { Button, Card, Input } from "@chakra-ui/react";
import logo from "../assets/logo.png";
import { PasswordInput } from "@/components/ui/password-input";
const LoginPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card.Root width={350} padding={5}>
        <div>
          <div className="flex flex-col items-center gap-5  w-full h-full ">
            <img src={logo} alt="logo" width={120} height={120} />
            {/* input field */}
            <div className="flex flex-col gap-1 w-full">
              <Field label="Username" errorText="This field is required">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  name="username"
                />
              </Field>
            </div>

            {/* input field */}
            <div className="flex flex-col gap-1 w-full">
              <Field label="Password" errorText="This field is required">
                <PasswordInput />
              </Field>
            </div>
            {/* submit button */}
            <Button background={"blue.500"} width="full">
              LOGIN
            </Button>
          </div>
        </div>
      </Card.Root>
    </div>
  );
};

export default LoginPage;
