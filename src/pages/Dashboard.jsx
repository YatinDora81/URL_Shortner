import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Filter } from "lucide-react";
import { useFetch } from "../hooks/use_fetch";
import { getUrls } from "../db/apiUrls";
import { UrlState } from "../context";
import { getClicksForUrls } from "../db/apiClicks";
import Link_Card from "../components/Link_Card";
import CreateLink from "../components/CreateLink";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user.id);

  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  const filterUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  return (
    <div className=" flex flex-col gap-8">
      {(loadingClicks || loading) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      <div className=" grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className=" flex justify-between">
        <h1 className=" text-4xl font-extrabold">My Links</h1>
        <CreateLink></CreateLink>
      </div>

      <div className=" relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></Input>
        <Filter className=" absolute top-2 right-2 p-1"></Filter>
      </div>

      {error && <Error message={error.message}></Error>}

      {(filterUrls || []).map((url, i) => (
        <Link_Card key={i} url={url} fetchUrls={fnUrls} fetchClicks={fnClicks}></Link_Card>
      ))}

    </div>
  );
};

export default Dashboard;
