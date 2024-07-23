import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Copy, Download, Trash } from "lucide-react";
import { useFetch } from "../hooks/use_fetch";
import { deleteUrl } from "../db/apiUrls";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

const Link_Card = ({ url, fetchUrls, fetchClicks }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    anchor.target = "_blank";
    document.body.appendChild(anchor);
    anchor.click();
    document.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

  return (
    <div className=" flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        alt="qr code"
        className=" h-32 object-contain ring ring-blue-500 self-start"
      ></img>

      <Link to={`/link/${url?.id}`} className=" flex flex-col flex-1">
        <span className=" text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className=" text-2xl  text-blue-400 font-bold hover:underline cursor-pointer">
          https://trimrr.in/{url?.custon_url ? url?.custon_url : url.short_url}
        </span>
        <span className=" flex items-center gap-1 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span className=" flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className=" flex gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(
              `${import.meta.env.VITE_DOMAIN}${url?.short_url}`
            );
            toast.success("Copied Successfully");
          }}
        >
          <Copy></Copy>
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download></Download>
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            fnDelete().then(() => {
              fetchClicks();
              fetchUrls();
            })
          }
        >
          {loadingDelete ? (
            <BeatLoader size={5} color="white" />
          ) : (
            <Trash></Trash>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Link_Card;
