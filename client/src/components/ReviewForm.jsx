import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "../hooks/useForm";
import { addReview } from "../store/review";
import Rating from "@material-ui/lab/Rating";
import { errorToast } from "../utils/toastMessages";
import { useDispatch, useSelector } from "react-redux";

export default function ReviewForm() {
  const { form, handleForm, clearForm } = useForm();
  const username = useSelector((s) => s.user.username);
  const { product } = useSelector((s) => s);
  const toast = useToast();
  const dispatch = useDispatch();
  const handleSubmit = () => {
    if (!username) return errorToast(toast, "You must be logged in to leave a review.");
    if (form.review && form.appreciation) {
      dispatch(
        addReview({
          id: product._id,
          appreciation: form.appreciation,
          review: { review: form.review, username: username },
        })
      );
      clearForm();
    } else {
      errorToast(toast, "Make sure to fill all fields.");
    }
  };

  return (
    <Container w="100%" mt={20} centerContent p="0px">
      <Flex w="95vw">
        <Box
          bg="#1A202C"
          color="white"
          borderRadius="lg"
          p={{ sm: 2, md: 2, lg: 7 }}
          w="100%"
        >
          <Box p={4}>
            <VStack pl={0} spacing={2}>
              <Box py={{ base: 5, sm: 5, md: 8, lg: 5 }}>
                <Heading>Review this article</Heading>
                <Text mt={{ sm: 3, md: 3, lg: 5 }} color="blue.300">
                  Leave your thoughts on this product down here to help others!
                </Text>
              </Box>
              <Box bg="#F5F5F5" borderRadius="lg" w="95%">
                <VStack m={8} color="#0B0E3F" spacing={5} align="left">
                  <Box align="center"></Box>
                  <FormControl id="review">
                    <FormLabel>Review</FormLabel>
                    <Rating
                      id="rating"
                      precision={0.1}
                      name="appreciation"
                      defaultValue={0}
                      size="large"
                      onChange={handleForm}
                    />
                    <Textarea
                      id="review"
                      name="review"
                      borderColor="gray.300"
                      _hover={{ borderRadius: "gray.300" }}
                      placeholder="Review"
                      errorBorderColor="red.500"
                      isRequired
                      onChange={handleForm}
                    />
                  </FormControl>
                  <FormControl id="submit" float="right">
                    <Button
                      onClick={handleSubmit}
                      variant="solid"
                      bg="#1A202C"
                      color="white"
                      _hover={{ backgroundColor: "#1C4A5C" }}
                    >
                      Submit Review
                    </Button>
                  </FormControl>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}
