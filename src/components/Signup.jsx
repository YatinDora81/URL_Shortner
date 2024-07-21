import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./Error";
import * as Yup from "yup";
import { useFetch } from "../hooks/use_fetch";
import { login, signUp } from "../db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "../context";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const longLink = searchParam.get("createNew");

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    profile_pic: null,
  });

  const handleChangeInput = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const { data, error, loading, fn: fnSignup } = useFetch(signUp, formData);
  const { fetchuser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchuser();
    }
  }, [error, loading]);

  const handleSignup = async (e) => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is Required"),
        password: Yup.string()
          .min(6, "Password Must be atleast 6 characters")
          .required("Password is Required"),
        
      });

      await schema.validate(formData, { abortEarly: false });

      //api call
      await fnSignup();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          {" "}
          Create a new account if you haven&rsquo;t already{" "}
        </CardDescription>
        {error && <Error message={error.message}></Error>}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className=" space-y-1">
          <Input
            name="name"
            type="text"
            placeholder="Enter Name"
            onChange={handleChangeInput}
          ></Input>
          {errors.name && <Error message={errors.name}></Error>}
        </div>
      </CardContent>
      <CardContent className="space-y-2">
        <div className=" space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleChangeInput}
          ></Input>
          {errors.email && <Error message={errors.email}></Error>}
        </div>
      </CardContent>
      <CardContent className="space-y-2">
        <div className=" space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={handleChangeInput}
          ></Input>
          {errors.password && <Error message={errors.password}></Error>}
        </div>
      </CardContent>
      <CardContent className="space-y-2">
        <div className=" space-y-1">
          <Input
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleChangeInput}
          ></Input>
          {errors.profile_pic && <Error message={errors.profile_pic}></Error>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup}>
          {loading ? (
            <BeatLoader size={10} color="#36d7b7"></BeatLoader>
          ) : (
            "Create account"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
