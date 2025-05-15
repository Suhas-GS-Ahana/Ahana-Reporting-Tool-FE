import HomePage from "./home/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Configurations from "./configurations/page";

export default function Home() {
  return <HomePage />;
}

const temp = {
  process_name: "Proc1",
  subprocess: [
    {
      subprocess_name: "S1",
      steps: [
        {
          step_no: 1,
          step_type: "import",
          source_tables: [
            "db_error_log",
            "question_master",
            "config_queries",
            "object_master",
            "object_details",
          ],
          destination_tables: [
            "db_error_log",
            "question_master",
            "config_queries",
            "object_master",
            "object_details",
          ],
        },
      ],
    },
    {
      subprocess_name: "S2",
      steps: [
        {
          step_no: 1,
          step_type: "process-query",
          description: "skibidi",
          query: "fsadfsadfas",
        },
        {
          step_no: 2,
          step_type: "process-query",
          description: "ohiorizz",
          query: "fsafasfdsa",
        },
        {
          step_no: 3,
          step_type: "process-query",
          description: "tung tung",
          query: "fasdfa",
        },
      ],
    },
    {
      subprocess_name: "S3",
      steps: [
        {
          step_no: 1,
          step_type: "export",
          description: "exporting",
          query: "",
        },
      ],
    },
  ],
};
