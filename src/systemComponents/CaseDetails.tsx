import { Box, Grid, Icon, Button, Card, Text } from "@chakra-ui/react";
import { LoaderFunctionArgs, useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  return { id };
}
const CaseDetails = () => {
  const navigate = useNavigate();
  return (
    <Grid
      templateColumns="repeat(2, 1fr)"
      gap="5"
      width={"full"}
      height={"full"}
      padding={5}
    >
      <Box
        width={"full"}
        height={"full"}
        display={"flex"}
        flexDirection={"column"}
        gap={5}
      >
        <Button
          size={"xs"}
          width={"80px"}
          onClick={() => navigate(-1)}
          colorPalette={"blue"}
          variant={"surface"}
          display={"flex"}
          alignItems={"center"}
          gap={2}
        >
          <Icon>
            <TiArrowBack />
          </Icon>
          Back
        </Button>

        <Box>
          <Text fontSize={20} fontStyle={"italic"}>
            Case Details
          </Text>
        </Box>
      </Box>

      <Box padding={4} width={"full"} height={"full"}>
        <Box width={"full"} height={500} rounded={"md"} padding={3}>
          <Card.Root
            width={150}
            height={150}
            rounded={"md"}
            variant={"outline"}
          >
            <Card.Body></Card.Body>
          </Card.Root>
        </Box>
      </Box>
    </Grid>
  );
};

export default CaseDetails;
