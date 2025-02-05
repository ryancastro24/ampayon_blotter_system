import { redirect, ActionFunction } from "react-router-dom";
import { deleteUser } from "../usersApi";
export const action: ActionFunction = async ({ params }) => {
  if (params && params.userId) {
    console.log(params.userId);
    const data = await deleteUser(params.userId);

    return data;
  }
  return redirect("/");
};
