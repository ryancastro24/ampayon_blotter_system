import { Field } from "@/components/ui/field";
import { Button, Card, Input, Text } from "@chakra-ui/react";
import logo from "../assets/logo.png";
import { PasswordInput } from "@/components/ui/password-input";
import {
  ActionFunction,
  Form,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { loginUser } from "@/backendapi/auth";
import { useState } from "react";
export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data: Record<string, FormDataEntryValue> = Object.fromEntries(
      formData.entries()
    );

    const loginData = await loginUser(data);

    return loginData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message); // Now TypeScript knows error is an instance of Error
    } else {
      console.log("An unknown error occurred");
    }
  }
};

const LoginPage = () => {
  const actionData = useActionData() as { error: string };
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigation = useNavigation();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card.Root width={350} padding={5}>
        <Form method="POST">
          <div>
            <div className="flex flex-col items-center gap-5  w-full h-full ">
              <img src={logo} alt="logo" width={120} height={120} />
              {/* input field */}
              <div className="flex flex-col gap-1 w-full">
                <Field
                  invalid={loginData.username === "" && formSubmitted}
                  label="Username"
                  errorText="This field is required"
                >
                  <Input
                    required
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    defaultValue={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                  />
                </Field>
              </div>

              {/* input field */}
              <div className="flex flex-col gap-1 w-full">
                <Field
                  invalid={loginData.password === "" && formSubmitted}
                  label="Password"
                  errorText="This field is required"
                >
                  <PasswordInput
                    required
                    name="password"
                    defaultValue={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </Field>
              </div>

              {actionData && (
                <Text alignSelf={"flex-start"} color={"red"} fontSize={"sm"}>
                  {actionData.error}, try again
                </Text>
              )}
              {/* submit button */}
              <Button
                loading={navigation.state === "submitting"}
                onClick={() => setFormSubmitted(true)}
                type="submit"
                background={"blue.500"}
                width="full"
              >
                LOGIN
              </Button>
            </div>
          </div>
        </Form>
      </Card.Root>
    </div>
  );
};

export default LoginPage;
