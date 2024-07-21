import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCode } from "react-qrcode-logo";
import { UrlState } from "../context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Error from "./Error";
import { Card } from "./ui/card";
import * as yup from "yup";
import { useFetch } from "../hooks/use_fetch";
import { createUrl } from "../db/apiUrls";
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const longlink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longlink ? longlink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is requried"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const ref = useRef()

  const {loading , error , data , fn : fnCreateUrl} =useFetch(createUrl, {...formValues , user_id : user?.id})

  const createNewUrl = async ()=>{
    setErrors([]);
    try {
      await schema.validate(formValues , {abortEarly : false});
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve)=> canvas.toBlob(resolve))

      await fnCreateUrl(blob);

    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err)=>{
        newErrors[err.path] = err.message;
      })

      setErrors(newErrors)

    }
  }



  useEffect(()=>{
    if(error===null && data){
      navigate(`/link/${data[0].id}`)
    }
  } , [error , data] )

  return (
    <Dialog defaultOper={longlink} onOpenChange={(res)=>{if(!res) setSearchParams({}) }}>
      <DialogTrigger>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl"> Create New</DialogTitle>
        </DialogHeader>

        {
          formValues?.longUrl && <QRCode ref={ref} value={formValues?.longUrl} size={250} />
        }

        <Input id="title" placeholder="Short Link's Title" value={formValues.title} onChange={handleChange}></Input>
        { errors?.title &&  <Error message={errors.title}></Error>}

        <Input id="longUrl" placeholder="Enter your Loooong URL" value={formValues.longUrl} onChange={handleChange}></Input>
        { errors?.longUrl && <Error message={errors?.longUrl}></Error>}
        <div className=" flex items-center gap-2">
          <Card className="p-2">trimrr.in</Card> /
          <Input value={formValues.customUrl} onChange={handleChange} id="customUrl" placeholder="Custom Link (optional)" ></Input>
        </div>
        {error && <Error message={error?.message}></Error>}

        <DialogFooter className="sm:justify-start">
          <Button disabled={loading} onClick={createNewUrl} variant="destructive"> {loading ? <BeatLoader size={10} color="white" ></BeatLoader> : "Create"} </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
