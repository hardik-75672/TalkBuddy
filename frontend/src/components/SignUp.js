import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { createBrowserHistory } from "history";
import { ChatContext } from "../context/Context";
import { photo } from "../asset/send.png";
const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = createBrowserHistory();
  const { setUser } = ChatContext();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/server/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chat1");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const postDetails = async (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      console.log(pics);

      data.append("file", pics);
      console.log(data);
      // data.append("upload_preset", "chat-app");
      // data.append("cloud_name", "dgcfkr6q5");
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Send the file to the server using fetch API or XMLHttpRequest
      fetch("/server/upload", {
        method: "POST",
        body: data,
      })
        .then((response) => {
          return response.json();
        })
        .then((value) => {
          console.log(value.photo);
          setPic(value.photo);
          setPicLoading(false);
        })
        .catch((error) => {
          toast({
            title: "Please Select an small image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };
  useEffect(() => {}, [history]);
  return (
    <VStack spacing="5px">
      <FormControl p={1} id="first-name" isRequired>
        <FormLabel fontSize={19} color={"darkcyan"}>
          Name
        </FormLabel>
        <Input
          border={"2px"}
          borderColor={"white"}
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl p={1} id="email" isRequired>
        <FormLabel fontSize={19} color={"darkcyan"}>
          Email Address
        </FormLabel>
        <Input
          border={"2px"}
          borderColor={"white"}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl p={1} id="password" isRequired>
        <FormLabel fontSize={19} color={"darkcyan"}>
          Password
        </FormLabel>
        <InputGroup size="md">
          <Input
            border={"2px"}
            borderColor={"white"}
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl p={1} id="password" isRequired>
        <FormLabel fontSize={19} color={"darkcyan"}>
          Confirm Password
        </FormLabel>
        <InputGroup size="md">
          <Input
            border={"2px"}
            borderColor={"white"}
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl p={1} id="pic">
        <FormLabel fontSize={19} color={"darkcyan"}>
          Upload your Picture
        </FormLabel>
        <Input
          border={"2px"}
          borderColor={"white"}
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
