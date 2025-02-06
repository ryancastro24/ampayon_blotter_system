import { redirect, ActionFunction } from "react-router-dom";
import { deleteCase } from "../caseApi";
export const action: ActionFunction = async ({ params }) => {
  if (params && params.caseId) {
    console.log(params.caseId);
    const data = await deleteCase(params.caseId);

    return data;
  }
  return redirect("/");
};
