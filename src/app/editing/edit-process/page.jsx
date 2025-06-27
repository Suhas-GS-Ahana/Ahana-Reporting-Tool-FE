"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash,
  ChevronRight,
  Component,
  Trash2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

//new imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// API Setup
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

// on overlay UI to show while laoding
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center">
      <Loader2 className="h-8 w-8 mb-4 animate-spin text-blue-600" />
      <p className="text-lg font-medium">Loading...</p>
    </div>
  </div>
);

export default function EditProcess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const processId = id

  const [processName, setProcessName] = useState("");
  const [processMasterId, setProcessMasterId] = useState(null);
  const [subprocesses, setSubprocesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [connections, setConnections] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const { toast } = useToast();

  // Add sensors for subprocess drag and drop
  const subprocessSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
 
  const mockData = {
    process: {
      process_master_id: 8,
      process_master_guid: "01e54ae6-b17f-4f37-b8f1-e3bc72531231",
      inserted_by: 1,
      modified_by: 1,
      inserted_date: "2025-06-26T15:41:06.351001",
      modified_date: "2025-06-26T15:41:06.351001",
      process_name: "Process for Edit",
      is_active: true,
      is_deleted: false,
      process_version: 1,
      rerun: true,
    },
    subprocesses: [
      {
        subprocess_data: {
          sub_process_id: 31,
          sub_process_guid: "d3abebb4-d217-476f-929b-b84fe3adf1df",
          inserted_by: 1,
          modified_by: 1,
          inserted_date: "2025-06-26T15:41:06.503954",
          modified_date: "2025-06-26T15:41:06.503954",
          process_master_id: 8,
          sub_process_order: 1,
          sub_process_name: "Sub1",
          is_active: true,
          is_deleted: false,
        },
        steps: [
          {
            steps: {
              process_step_id: 69,
              process_step_guid: "7c311e4c-b8f8-4ca3-b66f-6784e0b33870",
              inserted_by: 1,
              modified_by: 1,
              inserted_date: "2025-06-26T15:41:06.646289",
              modified_date: "2025-06-26T15:41:06.646289",
              process_master_id: 8,
              sub_process_id: 31,
              process_step_order: 1,
              process_step_query: [],
              process_table_name: null,
              where_clause: null,
              joining_condition: null,
              process_step_action: "import",
              process_select: null,
              update_columns: null,
              insert_columns: null,
              is_active: true,
              is_deleted: false,
              process_step_description: null,
              source_conn_id: 4,
              dest_conn_id: 5,
            },
            create_table: [],
            table_config: [
              [
                {
                  table_config_id: 56,
                  table_config_guid: "04a334c6-8871-4e1b-8503-3107287237bf",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:06.794041",
                  modified_date: "2025-06-26T15:41:06.794041",
                  process_step_id: 69,
                  data_source_id: 4,
                  schema_name: "public",
                  table_name: "exception_master",
                  is_temporary_table: false,
                  table_type: "source",
                  table_category: "import",
                  is_partitioning: false,
                  is_column_store: false,
                  is_reload: false,
                  is_incremental_load: false,
                  database_name: "JanaBank",
                  is_imported: false,
                  is_exported: false,
                  is_active: true,
                  is_deleted: false,
                  is_upsert: false,
                },
                {
                  table_config_id: 57,
                  table_config_guid: "7c5541c9-2ec9-4432-b4a1-215fc290ff75",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:06.924119",
                  modified_date: "2025-06-26T15:41:06.924119",
                  process_step_id: 69,
                  data_source_id: 5,
                  schema_name: "source_schema",
                  table_name: "exception_master",
                  is_temporary_table: false,
                  table_type: "destination",
                  table_category: "import",
                  is_partitioning: false,
                  is_column_store: false,
                  is_reload: false,
                  is_incremental_load: false,
                  database_name: "DestinationDB",
                  is_imported: false,
                  is_exported: false,
                  is_active: true,
                  is_deleted: false,
                  is_upsert: true,
                },
              ],
              [
                {
                  table_config_id: 58,
                  table_config_guid: "07152567-10ba-4068-b7ae-e49a929a541a",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:07.047289",
                  modified_date: "2025-06-26T15:41:07.047289",
                  process_step_id: 69,
                  data_source_id: 4,
                  schema_name: "public",
                  table_name: "npa_auto_tech_write_off",
                  is_temporary_table: false,
                  table_type: "source",
                  table_category: "import",
                  is_partitioning: false,
                  is_column_store: false,
                  is_reload: false,
                  is_incremental_load: false,
                  database_name: "JanaBank",
                  is_imported: false,
                  is_exported: false,
                  is_active: true,
                  is_deleted: false,
                  is_upsert: false,
                },
                {
                  table_config_id: 59,
                  table_config_guid: "c8ec80bd-e752-4cec-be23-8cc355ab2644",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:07.198508",
                  modified_date: "2025-06-26T15:41:07.198508",
                  process_step_id: 69,
                  data_source_id: 5,
                  schema_name: "source_schema",
                  table_name: "npa_auto_tech_write_off",
                  is_temporary_table: false,
                  table_type: "destination",
                  table_category: "import",
                  is_partitioning: false,
                  is_column_store: false,
                  is_reload: false,
                  is_incremental_load: false,
                  database_name: "DestinationDB",
                  is_imported: false,
                  is_exported: false,
                  is_active: true,
                  is_deleted: false,
                  is_upsert: true,
                },
              ],
            ],
            table_config_details: [
              [
                [
                  {
                    table_config_detail_id: 967,
                    table_config_detail_guid:
                      "3e8a7420-56c6-4f93-8071-3ae85f312b7c",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:07.328678",
                    modified_date: "2025-06-26T15:41:07.328678",
                    process_step_id: 69,
                    table_config_id: 56,
                    column_name: "row_id",
                    datatype: "numeric",
                    length: null,
                    precision: 10,
                    scale: 0,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 1,
                    nullable: false,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 968,
                    table_config_detail_guid:
                      "f625be8c-169d-4878-9cea-68d7296e540b",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:07.478006",
                    modified_date: "2025-06-26T15:41:07.478006",
                    process_step_id: 69,
                    table_config_id: 56,
                    column_name: "account_number",
                    datatype: "numeric",
                    length: null,
                    precision: 20,
                    scale: 0,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 2,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 969,
                    table_config_detail_guid:
                      "3b392ec4-f0ba-4eac-8dc2-43a9718f1ab3",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:07.618864",
                    modified_date: "2025-06-26T15:41:07.618864",
                    process_step_id: 69,
                    table_config_id: 56,
                    column_name: "cbs_restructured_date",
                    datatype: "character varying",
                    length: 40,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 3,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 970,
                    table_config_detail_guid:
                      "d111988c-289a-435c-9c93-6c8e7b19d1c3",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:07.729903",
                    modified_date: "2025-06-26T15:41:07.729903",
                    process_step_id: 69,
                    table_config_id: 56,
                    column_name: "cm_accrual",
                    datatype: "character varying",
                    length: 2,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 4,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 971,
                    table_config_detail_guid:
                      "48a0c497-53d2-43d1-9ef5-ddfb9c610dcf",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:07.866655",
                    modified_date: "2025-06-26T15:41:07.866655",
                    process_step_id: 69,
                    table_config_id: 56,
                    column_name: "npa_date",
                    datatype: "timestamp without time zone",
                    length: null,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 5,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 972,
                    table_config_detail_guid:
                      "3f0ab40c-a58b-446c-be62-507c60cd322d",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:07.993301",
                    modified_date: "2025-06-26T15:41:07.993301",
                    process_step_id: 69,
                    table_config_id: 56,
                    column_name: "business_date",
                    datatype: "timestamp without time zone",
                    length: null,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 6,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                ],
                [
                  {
                    table_config_detail_id: 973,
                    table_config_detail_guid:
                      "36048425-3c13-43e2-9949-d0b122a786fc",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:08.127804",
                    modified_date: "2025-06-26T15:41:08.127804",
                    process_step_id: 69,
                    table_config_id: 57,
                    column_name: "row_id",
                    datatype: "numeric",
                    length: null,
                    precision: 10,
                    scale: 0,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 1,
                    nullable: false,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 974,
                    table_config_detail_guid:
                      "6da80f80-0bf9-4359-beb5-0cb09e4a9322",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:08.261619",
                    modified_date: "2025-06-26T15:41:08.261619",
                    process_step_id: 69,
                    table_config_id: 57,
                    column_name: "account_number",
                    datatype: "numeric",
                    length: null,
                    precision: 20,
                    scale: 0,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 2,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 975,
                    table_config_detail_guid:
                      "8b1b1182-c3b2-48e9-9d5f-641348963fb4",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:08.400908",
                    modified_date: "2025-06-26T15:41:08.400908",
                    process_step_id: 69,
                    table_config_id: 57,
                    column_name: "cbs_restructured_date",
                    datatype: "character varying",
                    length: 40,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 3,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 976,
                    table_config_detail_guid:
                      "5873cb0b-fb06-454d-aef1-e9a68829abf7",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:08.535501",
                    modified_date: "2025-06-26T15:41:08.535501",
                    process_step_id: 69,
                    table_config_id: 57,
                    column_name: "cm_accrual",
                    datatype: "character varying",
                    length: 2,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 4,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 977,
                    table_config_detail_guid:
                      "f353b809-655c-4f3c-ad8e-6d5e6cc81618",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:08.676859",
                    modified_date: "2025-06-26T15:41:08.676859",
                    process_step_id: 69,
                    table_config_id: 57,
                    column_name: "npa_date",
                    datatype: "timestamp without time zone",
                    length: null,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 5,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 978,
                    table_config_detail_guid:
                      "471567ec-8df4-4789-8a89-ff7ee2751806",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:08.843762",
                    modified_date: "2025-06-26T15:41:08.843762",
                    process_step_id: 69,
                    table_config_id: 57,
                    column_name: "business_date",
                    datatype: "timestamp without time zone",
                    length: null,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 6,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                ],
              ],
              [
                [
                  {
                    table_config_detail_id: 979,
                    table_config_detail_guid:
                      "b53c76d3-21a6-4d7f-907b-bdebdaea5342",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:09.000962",
                    modified_date: "2025-06-26T15:41:09.000962",
                    process_step_id: 69,
                    table_config_id: 58,
                    column_name: "row_id",
                    datatype: "numeric",
                    length: null,
                    precision: 38,
                    scale: 0,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 1,
                    nullable: false,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 980,
                    table_config_detail_guid:
                      "2246863b-afd5-4379-add3-5cefd6e01d01",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:09.179677",
                    modified_date: "2025-06-26T15:41:09.179677",
                    process_step_id: 69,
                    table_config_id: 58,
                    column_name: "createddate",
                    datatype: "timestamp without time zone",
                    length: null,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 2,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 981,
                    table_config_detail_guid:
                      "11a78615-31c1-4ee6-b2c2-a4a9b1d79662",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:09.321223",
                    modified_date: "2025-06-26T15:41:09.321223",
                    process_step_id: 69,
                    table_config_id: 58,
                    column_name: "account_number",
                    datatype: "character varying",
                    length: 255,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 3,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 982,
                    table_config_detail_guid:
                      "cbfadff3-417d-4485-8215-a3638db8f762",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:09.495946",
                    modified_date: "2025-06-26T15:41:09.495946",
                    process_step_id: 69,
                    table_config_id: 58,
                    column_name: "write_off_month",
                    datatype: "character varying",
                    length: 255,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 4,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                ],
                [
                  {
                    table_config_detail_id: 983,
                    table_config_detail_guid:
                      "1d032324-7d76-4265-b9cc-233692996b36",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:09.649660",
                    modified_date: "2025-06-26T15:41:09.649660",
                    process_step_id: 69,
                    table_config_id: 59,
                    column_name: "row_id",
                    datatype: "numeric",
                    length: null,
                    precision: 38,
                    scale: 0,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 1,
                    nullable: false,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 984,
                    table_config_detail_guid:
                      "cf384a33-ceb7-40a6-a9ad-c766e2155b2b",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:09.783100",
                    modified_date: "2025-06-26T15:41:09.783100",
                    process_step_id: 69,
                    table_config_id: 59,
                    column_name: "createddate",
                    datatype: "timestamp without time zone",
                    length: null,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 2,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 985,
                    table_config_detail_guid:
                      "52b8a8e0-e6bc-4807-8b20-a5e3b1c33047",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:09.930746",
                    modified_date: "2025-06-26T15:41:09.930746",
                    process_step_id: 69,
                    table_config_id: 59,
                    column_name: "account_number",
                    datatype: "character varying",
                    length: 255,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 3,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                  {
                    table_config_detail_id: 986,
                    table_config_detail_guid:
                      "f6f4d6a2-3fb3-4ec1-a143-e2a72440a65c",
                    inserted_by: 1,
                    modified_by: 1,
                    inserted_date: "2025-06-26T15:41:10.087863",
                    modified_date: "2025-06-26T15:41:10.087863",
                    process_step_id: 69,
                    table_config_id: 59,
                    column_name: "write_off_month",
                    datatype: "character varying",
                    length: 255,
                    precision: null,
                    scale: null,
                    is_primary_key: false,
                    is_autogenerated: false,
                    ordinal_position: 4,
                    nullable: true,
                    is_deleted: false,
                    is_active: true,
                  },
                ],
              ],
            ],
            table_mapping: [
              [
                {
                  table_mapping_id: 484,
                  table_mapping_guid: "0da07028-86dc-4827-bda6-ab22e3306bb3",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:10.211187",
                  modified_date: "2025-06-26T15:41:10.211187",
                  process_step_id: 69,
                  source_conn_id: 4,
                  source_db: "JanaBank",
                  source_schema: "public",
                  source_table: "exception_master",
                  source_column: "row_id",
                  source_data_type: "numeric",
                  dest_conn_id: 5,
                  dest_db: "DestinationDB",
                  dest_schema: "source_schema",
                  dest_table: "exception_master",
                  dest_column: "row_id",
                  dest_data_type: "numeric",
                  ordinal_position: 1,
                  is_active: true,
                  is_deleted: false,
                },
                {
                  table_mapping_id: 485,
                  table_mapping_guid: "c74320fb-638a-48f1-9760-d989be5f505f",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:10.356740",
                  modified_date: "2025-06-26T15:41:10.356740",
                  process_step_id: 69,
                  source_conn_id: 4,
                  source_db: "JanaBank",
                  source_schema: "public",
                  source_table: "exception_master",
                  source_column: "account_number",
                  source_data_type: "numeric",
                  dest_conn_id: 5,
                  dest_db: "DestinationDB",
                  dest_schema: "source_schema",
                  dest_table: "exception_master",
                  dest_column: "account_number",
                  dest_data_type: "numeric",
                  ordinal_position: 2,
                  is_active: true,
                  is_deleted: false,
                },
                {
                  table_mapping_id: 486,
                  table_mapping_guid: "dbb5d3fd-baaa-44bc-a00f-6975ec9602a4",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:10.518855",
                  modified_date: "2025-06-26T15:41:10.518855",
                  process_step_id: 69,
                  source_conn_id: 4,
                  source_db: "JanaBank",
                  source_schema: "public",
                  source_table: "exception_master",
                  source_column: "cbs_restructured_date",
                  source_data_type: "character varying",
                  dest_conn_id: 5,
                  dest_db: "DestinationDB",
                  dest_schema: "source_schema",
                  dest_table: "exception_master",
                  dest_column: "cbs_restructured_date",
                  dest_data_type: "character varying",
                  ordinal_position: 3,
                  is_active: true,
                  is_deleted: false,
                },
                {
                  table_mapping_id: 487,
                  table_mapping_guid: "b911aee5-88f4-4718-8bd6-3bdaa62ca240",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:10.638233",
                  modified_date: "2025-06-26T15:41:10.638233",
                  process_step_id: 69,
                  source_conn_id: 4,
                  source_db: "JanaBank",
                  source_schema: "public",
                  source_table: "exception_master",
                  source_column: "cm_accrual",
                  source_data_type: "character varying",
                  dest_conn_id: 5,
                  dest_db: "DestinationDB",
                  dest_schema: "source_schema",
                  dest_table: "exception_master",
                  dest_column: "cm_accrual",
                  dest_data_type: "character varying",
                  ordinal_position: 4,
                  is_active: true,
                  is_deleted: false,
                },
                {
                  table_mapping_id: 488,
                  table_mapping_guid: "20ea5631-66c3-4657-a748-454ff67090b5",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:10.750090",
                  modified_date: "2025-06-26T15:41:10.750090",
                  process_step_id: 69,
                  source_conn_id: 4,
                  source_db: "JanaBank",
                  source_schema: "public",
                  source_table: "exception_master",
                  source_column: "npa_date",
                  source_data_type: "timestamp without time zone",
                  dest_conn_id: 5,
                  dest_db: "DestinationDB",
                  dest_schema: "source_schema",
                  dest_table: "exception_master",
                  dest_column: "npa_date",
                  dest_data_type: "timestamp without time zone",
                  ordinal_position: 5,
                  is_active: true,
                  is_deleted: false,
                },
                {
                  table_mapping_id: 489,
                  table_mapping_guid: "fbc8522e-4b02-4900-9f25-757b7cfc523a",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:10.885672",
                  modified_date: "2025-06-26T15:41:10.885672",
                  process_step_id: 69,
                  source_conn_id: 4,
                  source_db: "JanaBank",
                  source_schema: "public",
                  source_table: "exception_master",
                  source_column: "business_date",
                  source_data_type: "timestamp without time zone",
                  dest_conn_id: 5,
                  dest_db: "DestinationDB",
                  dest_schema: "source_schema",
                  dest_table: "exception_master",
                  dest_column: "business_date",
                  dest_data_type: "timestamp without time zone",
                  ordinal_position: 6,
                  is_active: true,
                  is_deleted: false,
                },
              ],
              [
                {
                  table_mapping_id: 490,
                  table_mapping_guid: "b2b127bd-9820-4c93-94c7-52581bfa1d6b",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:11.062783",
                  modified_date: "2025-06-26T15:41:11.062783",
                  process_step_id: 69,
                  source_conn_id: 4,
                  source_db: "JanaBank",
                  source_schema: "public",
                  source_table: "npa_auto_tech_write_off",
                  source_column: "row_id",
                  source_data_type: "numeric",
                  dest_conn_id: 5,
                  dest_db: "DestinationDB",
                  dest_schema: "source_schema",
                  dest_table: "npa_auto_tech_write_off",
                  dest_column: "row_id",
                  dest_data_type: "numeric",
                  ordinal_position: 1,
                  is_active: true,
                  is_deleted: false,
                },
                {
                  table_mapping_id: 491,
                  table_mapping_guid: "22076a2f-e002-443a-a44b-d46f5f2ba635",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:11.178898",
                  modified_date: "2025-06-26T15:41:11.178898",
                  process_step_id: 69,
                  source_conn_id: 4,
                  source_db: "JanaBank",
                  source_schema: "public",
                  source_table: "npa_auto_tech_write_off",
                  source_column: "createddate",
                  source_data_type: "timestamp without time zone",
                  dest_conn_id: 5,
                  dest_db: "DestinationDB",
                  dest_schema: "source_schema",
                  dest_table: "npa_auto_tech_write_off",
                  dest_column: "createddate",
                  dest_data_type: "timestamp without time zone",
                  ordinal_position: 2,
                  is_active: true,
                  is_deleted: false,
                },
                {
                  table_mapping_id: 492,
                  table_mapping_guid: "ea6d9f9d-200a-452e-b0ef-cc22849a158c",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:11.281585",
                  modified_date: "2025-06-26T15:41:11.281585",
                  process_step_id: 69,
                  source_conn_id: 4,
                  source_db: "JanaBank",
                  source_schema: "public",
                  source_table: "npa_auto_tech_write_off",
                  source_column: "account_number",
                  source_data_type: "character varying",
                  dest_conn_id: 5,
                  dest_db: "DestinationDB",
                  dest_schema: "source_schema",
                  dest_table: "npa_auto_tech_write_off",
                  dest_column: "account_number",
                  dest_data_type: "character varying",
                  ordinal_position: 3,
                  is_active: true,
                  is_deleted: false,
                },
                {
                  table_mapping_id: 493,
                  table_mapping_guid: "8e6e30b4-3775-4fd9-a629-c0fb859021b6",
                  inserted_by: 1,
                  modified_by: 1,
                  inserted_date: "2025-06-26T15:41:11.411494",
                  modified_date: "2025-06-26T15:41:11.411494",
                  process_step_id: 69,
                  source_conn_id: 4,
                  source_db: "JanaBank",
                  source_schema: "public",
                  source_table: "npa_auto_tech_write_off",
                  source_column: "write_off_month",
                  source_data_type: "character varying",
                  dest_conn_id: 5,
                  dest_db: "DestinationDB",
                  dest_schema: "source_schema",
                  dest_table: "npa_auto_tech_write_off",
                  dest_column: "write_off_month",
                  dest_data_type: "character varying",
                  ordinal_position: 4,
                  is_active: true,
                  is_deleted: false,
                },
              ],
            ],
          },
          {
            steps: {
              process_step_id: 70,
              process_step_guid: "5a7af963-fb57-4b29-8c2d-7bba6faea97a",
              inserted_by: 1,
              modified_by: 1,
              inserted_date: "2025-06-26T15:41:11.557998",
              modified_date: "2025-06-26T15:41:11.557998",
              process_master_id: 8,
              sub_process_id: 31,
              process_step_order: 2,
              process_step_query: ["Subprocess 1 query"],
              process_table_name: null,
              where_clause: null,
              joining_condition: null,
              process_step_action: "process-query",
              process_select: null,
              update_columns: null,
              insert_columns: null,
              is_active: true,
              is_deleted: false,
              process_step_description: "Subprocess 1 description",
              source_conn_id: 5,
              dest_conn_id: null,
            },
            create_table: [],
            table_config: [],
            table_config_details: [],
            table_mapping: [],
          },
          {
            steps: {
              process_step_id: 71,
              process_step_guid: "f757dc87-556f-4248-b12d-7bad160a9451",
              inserted_by: 1,
              modified_by: 1,
              inserted_date: "2025-06-26T15:41:11.709142",
              modified_date: "2025-06-26T15:41:11.709142",
              process_master_id: 8,
              sub_process_id: 31,
              process_step_order: 3,
              process_step_query: ["ex query1", "ex query2"],
              process_table_name: null,
              where_clause: null,
              joining_condition: null,
              process_step_action: "export",
              process_select: null,
              update_columns: null,
              insert_columns: null,
              is_active: true,
              is_deleted: false,
              process_step_description: "export description",
              source_conn_id: 4,
              dest_conn_id: null,
            },
            create_table: [],
            table_config: [],
            table_config_details: [],
            table_mapping: [],
          },
        ],
      },
      {
        subprocess_data: {
          sub_process_id: 32,
          sub_process_guid: "51f5ae90-c05b-495a-b348-e21752ce48dd",
          inserted_by: 1,
          modified_by: 1,
          inserted_date: "2025-06-26T15:41:11.811824",
          modified_date: "2025-06-26T15:41:11.811824",
          process_master_id: 8,
          sub_process_order: 2,
          sub_process_name: "Sub2",
          is_active: true,
          is_deleted: false,
        },
        steps: [
          {
            steps: {
              process_step_id: 72,
              process_step_guid: "0ac070b5-9529-43cd-971f-9086da5382d8",
              inserted_by: 1,
              modified_by: 1,
              inserted_date: "2025-06-26T15:41:11.915566",
              modified_date: "2025-06-26T15:41:11.915566",
              process_master_id: 8,
              sub_process_id: 32,
              process_step_order: 1,
              process_step_query: ["Subprocess 2 query"],
              process_table_name: null,
              where_clause: null,
              joining_condition: null,
              process_step_action: "process-query",
              process_select: null,
              update_columns: null,
              insert_columns: null,
              is_active: true,
              is_deleted: false,
              process_step_description: "Subprocess 2 description",
              source_conn_id: 6,
              dest_conn_id: null,
            },
            create_table: [],
            table_config: [],
            table_config_details: [],
            table_mapping: [],
          },
        ],
      },
    ],
  };

  // run fetchConnections on load
  useEffect(() => {
    fetchConnections();
  }, []);

  //to fetch all available connections (/connection)
  const fetchConnections = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/connection`);
      if (!response.ok) {
        throw new Error("Failed to fetch connections");
      }
      const { data } = await response.json();
      setConnections(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connections",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load mock data on component mount
  useEffect(() => {
    if (id) {
      loadMockData();
    }
  }, []);

  // Helper function to fetch connection details
const fetchConnectionDetails = async (connectionId, baseURL) => {
  if (!connectionId) return null;
  
  try {
    const response = await fetch(`${baseURL}/connection-view?conn_id=${connectionId}`);
    if (!response.ok) {
      console.error(`Failed to fetch connection details for ID: ${connectionId}`);
      return null;
    }
    const {data} = await response.json();
    return {
      connection_name: data.connection_name || "",
      server_name: data.server_name || "",
      port_number: data.port_number || "",
      database_type: data.database_type || "",
      database_name: data.database_name || "",
      username: data.username || "",
    };
  } catch (error) {
    console.error(`Error fetching connection details for ID ${connectionId}:`, error);
    return null;
  }
};

const loadMockData = async () => {
  setLoadingData(true);

  // Simulate loading delay
  setTimeout(async () => {
    try {
      const processData = mockData;

      // Set process details
      setProcessName(processData.process.process_name);
      setProcessMasterId(processData.process.process_master_id);

      // Transform and set subprocesses data with connection details
      const transformedSubprocesses = await Promise.all(
        processData.subprocesses.map(async (sp, spIndex) => ({
          id: sp.subprocess_data.sub_process_id || Date.now() + spIndex,
          sub_process_id: sp.subprocess_data.sub_process_id,
          subprocess_no: sp.subprocess_data.sub_process_order,
          subprocess_name: sp.subprocess_data.sub_process_name,
          steps: await Promise.all(
            sp.steps.map(async (step, stepIndex) => {
              const sourceConnectionId = step.steps.source_conn_id?.toString();
              const destConnectionId = step.steps.dest_conn_id?.toString();

              // Fetch connection details in parallel
              const [sourceDetails, destinationDetails] = await Promise.all([
                fetchConnectionDetails(sourceConnectionId, baseURL),
                fetchConnectionDetails(destConnectionId, baseURL)
              ]);

              return {
                id: step.steps.process_step_id || Date.now() + stepIndex,
                process_step_id: step.steps.process_step_id,
                step_no: step.steps.process_step_order,
                step_type: step.steps.process_step_action,
                connection_id: sourceConnectionId || "",
                destination_connection_id: destConnectionId || "",
                source_tables: [],
                destination_tables: [],
                selected_tables: [],
                pq_description: step.steps.process_step_description || "",
                pq_query: step.steps.process_step_query || [],
                ex_description: step.steps.process_step_description || "",
                ex_query: step.steps.process_step_query || [],
                source_details: sourceDetails,
                destination_details: destinationDetails,
                create_table:
                  step.table_config?.map(([first, second]) => ({
                    table_name: first.table_name,
                    source_schema_name: first.schema_name,
                    dest_schema_name: second.schema_name,
                    is_table_exist: true,
                  })) || [],
              };
            })
          ),
        }))
      );

      setSubprocesses(transformedSubprocesses);
      // setConnections(mockConnections);
    } catch (error) {
      console.error("Error loading mock data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load process data",
      });
    } finally {
      setLoadingData(false);
    }
  }, 500); // Simulate 500ms loading time
};

  // Subprocess Management Functions
  const addSubprocess = () => {
    const newSubprocess = {
      id: Date.now(),
      sub_process_id: null, // New subprocess, no existing ID
      subprocess_no: subprocesses.length + 1,
      subprocess_name: "",
      steps: [],
    };
    setSubprocesses([...subprocesses, newSubprocess]);
  };

  const updateSubprocessName = (subprocessId, name) => {
    setSubprocesses(
      subprocesses.map((subprocess) =>
        subprocess.id === subprocessId
          ? { ...subprocess, subprocess_name: name }
          : subprocess
      )
    );
  };

  const deleteSubprocess = (subprocessId) => {
    const updatedSubprocesses = subprocesses.filter(
      (subprocess) => subprocess.id !== subprocessId
    );
    const renumberedSubprocesses = updatedSubprocesses.map(
      (subprocess, index) => ({
        ...subprocess,
        subprocess_no: index + 1,
      })
    );
    setSubprocesses(renumberedSubprocesses);
  };

  const handleSubprocessDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = subprocesses.findIndex(
        (subprocess) => subprocess.id === active.id
      );
      const newIndex = subprocesses.findIndex(
        (subprocess) => subprocess.id === over.id
      );

      const reorderedSubprocesses = arrayMove(subprocesses, oldIndex, newIndex);
      const updatedSubprocesses = reorderedSubprocesses.map(
        (subprocess, index) => ({
          ...subprocess,
          subprocess_no: index + 1,
        })
      );

      setSubprocesses(updatedSubprocesses);
    }
  };

  // Step Management Functions
  const addStep = (subprocessId) => {
    const subprocessIndex = subprocesses.findIndex(
      (sp) => sp.id === subprocessId
    );
    if (subprocessIndex !== -1) {
      const newSteps = [...subprocesses[subprocessIndex].steps];
      newSteps.push({
        id: Date.now(),
        process_step_id: null, // New step, no existing ID
        step_no: newSteps.length + 1,
        step_type: "",
        connection_id: "",
        destination_connection_id: "",
        source_tables: [],
        destination_tables: [],
        selected_tables: [],
        pq_description: "",
        pq_query: [],
        ex_description: "",
        ex_query: [],
        source_details: null,
        destination_details: null,
        create_table: [],
      });

      const updatedSubprocesses = [...subprocesses];
      updatedSubprocesses[subprocessIndex].steps = newSteps;
      setSubprocesses(updatedSubprocesses);
    }
  };

  const updateStep = (subprocessId, stepId, field, value) => {
    const subprocessIndex = subprocesses.findIndex(
      (sp) => sp.id === subprocessId
    );
    if (subprocessIndex !== -1) {
      const stepIndex = subprocesses[subprocessIndex].steps.findIndex(
        (step) => step.id === stepId
      );
      if (stepIndex !== -1) {
        const updatedSubprocesses = [...subprocesses];

        if (field === "pq_query") {
          updatedSubprocesses[subprocessIndex].steps[stepIndex][field] =
            Array.isArray(value) ? value : [value];
        } else {
          updatedSubprocesses[subprocessIndex].steps[stepIndex][field] = value;
        }

        setSubprocesses(updatedSubprocesses);
      }
    }
  };

  const deleteStep = (subprocessId, stepId) => {
    const subprocessIndex = subprocesses.findIndex(
      (sp) => sp.id === subprocessId
    );
    if (subprocessIndex !== -1) {
      const updatedSteps = subprocesses[subprocessIndex].steps.filter(
        (step) => step.id !== stepId
      );
      const renamedSteps = updatedSteps.map((step, index) => ({
        ...step,
        step_no: index + 1,
      }));

      const updatedSubprocesses = [...subprocesses];
      updatedSubprocesses[subprocessIndex].steps = renamedSteps;
      setSubprocesses(updatedSubprocesses);
    }
  };

  const updateSubprocessSteps = (subprocessId, newSteps) => {
    setSubprocesses(
      subprocesses.map((subprocess) =>
        subprocess.id === subprocessId
          ? { ...subprocess, steps: newSteps }
          : subprocess
      )
    );
  };

  const getConnectionDetails = (connectionId) => {
    return connections.find(
      (conn) => conn.data_sources_id.toString() === connectionId.toString()
    );
  };

  // Save/Update Process Function (Mock implementation)
  const saveProcess = async () => {
    // Validates that a process name is provided
    if (!processName.trim()) {
      setNotification({
        show: true,
        message: "Please enter a process name",
        type: "default",
      });
      return;
    }

    //begin-------------------------------------------------------------------------------

    // Helper function to fetch column details for a table
    const fetchColumnDetails = async (connectionId, source_schema_name, tableName) => {
      try {
        const response = await fetch(
          `${baseURL}/connection-columns?conn_id=${connectionId}&schema_name=${source_schema_name}&table_name=${tableName}`
        );
        const result = await response.json();

        if (result.status === "success") {
          return result.data.map((column, index) => ({
            p_inserted_by: 1,
            p_modified_by: 1,
            p_column_name: column.column_name,
            p_datatype: column.data_type,
            p_length: column.character_maximum_length,
            p_precision: column.numeric_precision,
            p_scale: column.numeric_scale,
            p_is_primary_key: column.is_primary_key,
            p_isautogenerated: column.is_identity,
            p_ordinal_position: column.ordinal_position,
            p_nullable: column.is_nullable,
          }));
        }
        return [];
      } catch (error) {
        console.error(
          `Error fetching columns for ${schemaName}.${tableName}:`,
          error
        );
        return [];
      }
    };

    // Helper function to create table mappings
    const createTableMappings = async (
      createTableData,
      sourceConnectionId,
      sourceConnectionDetails,
      destinationConnectionId,
      destinationConnectionDetails
    ) => {
      const tableMappings = await Promise.all(
        createTableData.map(
          async ({ source_schema_name, table_name, dest_schema_name }) => {
            // Fetch source columns
            const sourceColumns = await fetchColumnDetails(
              sourceConnectionId,
              source_schema_name,
              table_name
            );

            // Fetch destination csolumns (only if table exists)
            const destColumns = await fetchColumnDetails(
              destinationConnectionId,
              dest_schema_name,
              table_name
            );

            // Create mappings between source and destination columns
            const mappings = sourceColumns.map((sourceCol, index) => {
              // Try to find matching destination column by name or use index-based mapping
              const destCol =
                destColumns.find(
                  (col) =>
                    col.p_column_name.toLowerCase() ===
                    sourceCol.p_column_name.toLowerCase()
                ) ||
                destColumns[index] ||
                destColumns[0]; // Fallback to index or first column

              return {
                p_inserted_by: 1,
                p_modified_by: 1,
                p_source_conn_id: Number(sourceConnectionId),
                p_source_db: sourceConnectionDetails.database_name,
                p_source_schema: source_schema_name,
                p_source_table: table_name,
                p_source_column: sourceCol.p_column_name,
                p_source_data_type: sourceCol.p_datatype,
                p_dest_conn_id: Number(destinationConnectionId),
                p_dest_db: destinationConnectionDetails.database_name,
                p_dest_schema: dest_schema_name,
                p_dest_table: table_name,
                p_dest_column: destCol
                  ? destCol.p_column_name
                  : sourceCol.p_column_name,
                p_dest_data_type: destCol
                  ? destCol.p_datatype
                  : sourceCol.p_datatype,
                p_ordinal_position: sourceCol.p_ordinal_position,
              };
            });

            return mappings;
          }
        )
      );

      return tableMappings;
    };

    // Main function to format data
    const formatDataWithConfigDetails = async (processName, subprocesses) => {
      const formattedSubprocesses = await Promise.all(
        subprocesses.map(async (sp) => ({
          subprocess_data: {
            p_inserted_by: 1,
            p_modified_by: 1,
            p_sub_process_order: sp.subprocess_no,
            p_sub_process_name: sp.subprocess_name,
          },
          steps: await Promise.all(
            sp.steps.map(async (step) => {
              if (step.step_type === "import") {
                // Use create_table data which contains the complete mapping info
                const createTableData = step.create_table || [];

                // Fetch column details for each table - create pairs for source and destination
                const tableConfigDetails = await Promise.all(
                  createTableData.map(
                    async ({ source_schema_name, table_name, dest_schema_name }) => [
                      // First entry for source table
                      await fetchColumnDetails(
                        step.connection_id,
                        source_schema_name,
                        table_name
                      ),
                      // Second entry for destination table (or same source table if needed)
                      await fetchColumnDetails(
                        step.connection_id,
                        source_schema_name,
                        table_name
                      ),
                    ]
                  )
                );

                // Create table mappings using create_table data
                const tableMappings = await createTableMappings(
                  createTableData,
                  step.connection_id,
                  step.source_details,
                  step.destination_connection_id,
                  step.destination_details
                );

                return {
                  steps: {
                    p_inserted_by: 1,
                    p_modified_by: 1,
                    p_process_step_order: step.step_no,
                    p_process_step_action: step.step_type,
                    p_source_conn_id: Number(step.connection_id),
                    p_dest_conn_id: Number(step.destination_connection_id),
                  },
                  create_table: createTableData.map(
                    ({
                      source_schema_name,
                      table_name,
                      dest_schema_name,
                      is_table_exist,
                    }) => ({
                      table_name: table_name,
                      source_schema_name: source_schema_name,
                      dest_schema_name: dest_schema_name,
                      is_table_exist: is_table_exist,
                    })
                  ),
                  table_config: createTableData.map(
                    ({ source_schema_name, table_name, dest_schema_name }) => [
                      // Source table config
                      {
                        p_inserted_by: 1,
                        p_modified_by: 1,
                        p_connection_name: step.source_details.connection_name,
                        p_database_name: step.source_details.database_name,
                        p_schema_name: source_schema_name,
                        p_table_name: table_name,
                        p_is_temp_table: false,
                        p_table_type: "source",
                        p_table_category: "import",
                        p_is_upsert: false,
                      },
                      // Destination table config
                      {
                        p_inserted_by: 1,
                        p_modified_by: 1,
                        p_connection_name:
                          step.destination_details.connection_name,
                        p_database_name: step.destination_details.database_name,
                        p_schema_name: dest_schema_name,
                        p_table_name: table_name,
                        p_is_temp_table: false,
                        p_table_type: "destination",
                        p_table_category: "import",
                        p_is_upsert: true,
                      },
                    ]
                  ),
                  table_config_details: tableConfigDetails,
                  table_mapping: tableMappings,
                };
              } else if (step.step_type === "process-query") {
                return {
                  steps: {
                    p_inserted_by: 1,
                    p_modified_by: 1,
                    p_process_step_order: step.step_no,
                    p_process_step_action: "process-query",
                    p_process_step_description: step.pq_description,
                    p_process_step_query: step.pq_query,
                    p_source_conn_id: Number(step.connection_id),
                  },
                  create_table: [],
                  table_config: [],
                  table_config_details: [],
                  table_mapping: [],
                };
              } else {
                // Export step
                return {
                  steps: {
                    p_inserted_by: 1,
                    p_modified_by: 1,
                    p_process_step_order: step.step_no,
                    p_process_step_action: "export",
                    p_process_step_description: step.ex_description,
                    p_process_step_query: step.ex_query,
                    p_source_conn_id: Number(step.connection_id),
                  },
                  create_table: [],
                  table_config: [],
                  table_config_details: [],
                  table_mapping: [],
                };
              }
            })
          ),
        }))
      );

      return {
        process: {
          p_inserted_by: 1,
          p_modified_by: 1,
          p_process_name: processName,
          p_process_version: 1,
          p_rerun: true,
        },
        subprocesses: formattedSubprocesses,
      };
    };

    // Usage - simplified parameters since step data now contains all needed info
    const formattedData = await formatDataWithConfigDetails(
      processName,
      subprocesses
    );

    const formattedData2 = {
      process:processName,
      subprocess:subprocesses
    }
    console.log(formattedData2);
    console.log(formattedData);

    //end---------------------------------------------------------------------------------

    // setLoading(true);

    // try {
    //   // Replace with your actual API endpoint
    //   const response = await fetch(`${baseURL}/process-hierarchy-upsert`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formattedData),
    //   });

    //   if (response.ok) {
    //     console.log(formattedData);
    //     setNotification({
    //       show: true,
    //       message: "Process created successfully!",
    //       type: "success",
    //     });

    //     setTimeout(() => {
    //       router.push("/process");
    //     }, 500); // Redirect after 1.5 seconds
    //     // Optional: Reset form or redirect
    //   } else {
    //     const errorData = await response.json();
    //     setNotification({
    //       show: true,
    //       message: errorData.message || "Failed to create process",
    //       type: "error",
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error creating process:", error);
    //   setNotification({
    //     show: true,
    //     message: "An error occurred while saving the process",
    //     type: "error",
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };


  // Show loading screen while loading initial data
  if (loadingData) {
    return <LoadingOverlay />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Loading Screen */}
      {(loading || loadingSave) && <LoadingOverlay />}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Process</h1>
          <p className="text-gray-600 mt-1">Process ID: {id}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => router.push("/process")}>
            Cancel
          </Button>
          <Button onClick={saveProcess} disabled={loadingSave}>
            {loadingSave ? "Updating..." : "Update Process"}
          </Button>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <Alert
          className={`mb-6 ${
            notification.type === "error"
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <AlertDescription
            className={
              notification.type === "error" ? "text-red-700" : "text-green-700"
            }
          >
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Process Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Process Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Process Name
              </label>
              <Input
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                placeholder="Enter process name"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Draggable Subprocess Cards */}
      <DndContext
        sensors={subprocessSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSubprocessDragEnd}
      >
        <SortableContext
          items={subprocesses.map((subprocess) => subprocess.id)}
          strategy={verticalListSortingStrategy}
        >
          {subprocesses.map((subprocess) => (
            <DraggableSubprocessCard
              key={subprocess.id}
              subprocess={subprocess}
              connections={connections}
              updateSubprocessName={updateSubprocessName}
              deleteSubprocess={deleteSubprocess}
              addStep={addStep}
              updateStep={updateStep}
              deleteStep={deleteStep}
              updateSubprocessSteps={updateSubprocessSteps}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button onClick={addSubprocess} className="w-full" variant="outline">
        <Plus className="mr-2 h-4 w-4" /> Add Subprocess
      </Button>
    </div>
  );
}

// New Draggable SubprocessCard component
function DraggableSubprocessCard({
  subprocess,
  connections,
  updateSubprocessName,
  deleteSubprocess,
  addStep,
  updateStep,
  deleteStep,
  updateSubprocessSteps,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subprocess.id });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle drag end event for steps within this subprocess
  const handleStepDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = subprocess.steps.findIndex(
        (step) => step.id === active.id
      );
      const newIndex = subprocess.steps.findIndex(
        (step) => step.id === over.id
      );

      // Reorder the steps array
      const reorderedSteps = arrayMove(subprocess.steps, oldIndex, newIndex);

      // Update step numbers based on new positions
      const updatedSteps = reorderedSteps.map((step, index) => ({
        ...step,
        step_no: index + 1,
      }));

      // Update the subprocess with new step order
      updateSubprocessSteps(subprocess.id, updatedSteps);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`mb-6 ${isDragging ? "shadow-lg" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 flex-1 mr-4">
              {/* Drag handle for subprocess */}
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Subprocess {subprocess.subprocess_no}
                </label>
                <Input
                  value={subprocess.subprocess_name}
                  onChange={(e) =>
                    updateSubprocessName(subprocess.id, e.target.value)
                  }
                  placeholder="Enter subprocess name"
                  className="w-full"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteSubprocess(subprocess.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleStepDragEnd}
            >
              <SortableContext
                items={subprocess.steps.map((step) => step.id)}
                strategy={verticalListSortingStrategy}
              >
                {subprocess.steps.map((step) => (
                  <DraggableStepCard
                    key={step.id}
                    step={step}
                    subprocessId={subprocess.id}
                    connections={connections}
                    updateStep={updateStep}
                    deleteStep={deleteStep}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => addStep(subprocess.id)}
            variant="outline"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Step
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// New Draggable StepCard component
function DraggableStepCard({
  step,
  subprocessId,
  connections,
  updateStep,
  deleteStep,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`border border-gray-200 ${isDragging ? "shadow-lg" : ""}`}
      >
        <CardHeader className="pb-2 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {/* Drag handle */}
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <CardTitle className="text-md font-medium">
                Step {step.step_no}
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={step.step_type}
                onValueChange={(value) =>
                  updateStep(subprocessId, step.id, "step_type", value)
                }
                disabled={step.process_step_id != null}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="process-query">Process Query</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteStep(subprocessId, step.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {step.step_type === "import" ? (
            <ImportStepContent
              step={step}
              subprocessId={subprocessId}
              stepId={step.id}
              connections={connections}
              updateStep={updateStep}
            />
          ) : step.step_type === "process-query" ? (
            <QueryStepContent
              step={step}
              subprocessId={subprocessId}
              stepId={step.id}
              connections={connections}
              updateStep={updateStep}
            />
          ) : step.step_type === "export" ? (
            <ExportStepContent
              step={step}
              subprocessId={subprocessId}
              stepId={step.id}
              connections={connections}
              updateStep={updateStep}
            />
          ) : (
            <div className="border">
              <div className="text-center text-sm text-gray-500 p-5">
                Please select the step type
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// This component configures table import between source & destination databases
// Key data fetched - create_table: [{table_name, schema_name, dest_schema_name, is_table_exist}]
function ImportStepContent({
  step,
  subprocessId,
  stepId,
  connections,
  updateStep,
}) {
  const [sourceSchemas, setSourceSchemas] = useState([]);
  const [selectedSourceSchema, setSelectedSourceSchema] = useState("");
  const [sourceTables, setSourceTables] = useState([]);
  const [destinationSchemas, setDestinationSchemas] = useState([]);
  const [selectedDestinationSchema, setSelectedDestinationSchema] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [destinationTables, setDestinationTables] = useState([]);

  // Handle source connection change with connection details fetch
  const handleSourceConnectionChange = async (connectionId) => {
    try {
      // Update connection_id
      updateStep(subprocessId, stepId, "connection_id", connectionId);

      // Fetch and store source connection details
      const response = await fetch(
        `${baseURL}/connection-view?conn_id=${connectionId}`
      );
      const data = await response.json();
      updateStep(subprocessId, stepId, "source_details", data.data);
    } catch (error) {
      console.error("Error fetching source connection details:", error);
    }
  };

  // Handle destination connection change with connection details fetch
  const handleDestinationConnectionChange = async (connectionId) => {
    try {
      // Update destination_connection_id
      updateStep(
        subprocessId,
        stepId,
        "destination_connection_id",
        connectionId
      );

      // Fetch and store destination connection details
      const response = await fetch(
        `${baseURL}/connection-view?conn_id=${connectionId}`
      );
      const data = await response.json();
      updateStep(subprocessId, stepId, "destination_details", data.data);
    } catch (error) {
      console.error("Error fetching destination connection details:", error);
    }
  };

  // Fetch source schemas when source connection changes
  useEffect(() => {
    if (step.connection_id) {
      fetchSourceSchemas();
    } else {
      setSourceSchemas([]);
      setSelectedSourceSchema("");
      setSourceTables([]);
    }
  }, [step.connection_id]);

  // Fetch destination schemas when destination connection changes
  useEffect(() => {
    if (step.destination_connection_id) {
      fetchDestinationSchemas();
    } else {
      setDestinationSchemas([]);
      setSelectedDestinationSchema("");
      setDestinationTables([]);
      // Clear destination_tables when destination connection changes
      updateStep(subprocessId, stepId, "destination_tables", []);
    }
  }, [step.destination_connection_id]);

  // Fetch source tables when source schema changes
  useEffect(() => {
    if (selectedSourceSchema && step.connection_id) {
      fetchSourceTables();
    }
  }, [selectedSourceSchema, step.connection_id]);

  // Fetch destination tables when destination schema changes
  useEffect(() => {
    if (selectedDestinationSchema && step.destination_connection_id) {
      fetchDestinationTables();
    }
  }, [selectedDestinationSchema, step.destination_connection_id]);

  const fetchSourceSchemas = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-schema?conn_id=${step.connection_id}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setSourceSchemas(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching source schemas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinationSchemas = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-schema?conn_id=${step.destination_connection_id}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setDestinationSchemas(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching destination schemas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSourceTables = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-tables?conn_id=${step.connection_id}&schema_name=${selectedSourceSchema}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setSourceTables(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching source tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinationTables = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-tables?conn_id=${step.destination_connection_id}&schema_name=${selectedDestinationSchema}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setDestinationTables(data.data);
          // Update step with destination tables (only table names)
          const tableNames = data.data.map((table) => table.table_name);
          updateStep(subprocessId, stepId, "destination_tables", tableNames);
          // Update create_table after destination tables are fetched
          updateCreateTable();
        }
      }
    } catch (error) {
      console.error("Error fetching destination tables:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update create_table array
  const updateCreateTable = () => {
    if (step.selected_tables && step.selected_tables.length > 0) {
      const createTableData = step.selected_tables.map((selectedTable) => ({
        table_name: selectedTable.table_name,
        source_schema_name: selectedTable.schema_name,
        dest_schema_name: selectedDestinationSchema,
        is_table_exist: step.destination_tables.includes(
          selectedTable.table_name
        ),
      }));
      updateStep(subprocessId, stepId, "create_table", createTableData);
    }
  };

  // Update create_table whenever selected_tables or destination_tables change
  useEffect(() => {
    updateCreateTable();
  }, [
    step.selected_tables,
    step.destination_tables,
    selectedDestinationSchema,
  ]);

  // Check if any tables are selected
  const hasSelectedTables =
    step.selected_tables && step.selected_tables.length > 0;

  const handleSourceSchemaChange = (schema) => {
    setSelectedSourceSchema(schema);
    // Clear source tables and selected tables when schema changes
    // updateStep(subprocessId, stepId, "selected_tables", []);
    // updateStep(subprocessId, stepId, "create_table", []);
  };

  const handleDestSchemaChange = (schema) => {
    setSelectedDestinationSchema(schema);
    // Update create_table when destination schema changes
    setTimeout(() => updateCreateTable(), 100);
  };

  const handleSourceTableChange = (tableName, isChecked) => {
    let updatedSelectedTables = [...(step.selected_tables || [])];

    if (isChecked) {
      const tableExists = updatedSelectedTables.some(
        (item) =>
          item.table_name === tableName &&
          item.schema_name === selectedSourceSchema
      );

      if (!tableExists) {
        updatedSelectedTables.push({
          table_name: tableName,
          schema_name: selectedSourceSchema,
        });
      }
    } else {
      updatedSelectedTables = updatedSelectedTables.filter(
        (item) =>
          !(
            item.table_name === tableName &&
            item.schema_name === selectedSourceSchema
          )
      );
    }

    updateStep(subprocessId, stepId, "selected_tables", updatedSelectedTables);
  };

  const isTableSelected = (tableName) => {
    if (step.selected_tables) {
      return step.selected_tables.some(
        (item) =>
          item.table_name === tableName &&
          item.schema_name === selectedSourceSchema
      );
    }
    return false;
  };

  // Check if table selection should be available
  const isTableSelectionAvailable =
    step.connection_id &&
    selectedSourceSchema &&
    step.destination_connection_id &&
    selectedDestinationSchema;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Database Section */}
        <Card className="border border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">Source Database</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {/* Source Connection Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Connection
                </label>
                <Select
                  value={step.connection_id}
                  onValueChange={handleSourceConnectionChange}
                  disabled={hasSelectedTables || step.process_step_id != null}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections
                      .filter(
                        (conn) =>
                          conn.data_sources_id.toString() !==
                          step.destination_connection_id
                      )
                      .map((conn) => (
                        <SelectItem
                          key={conn.data_sources_id}
                          value={conn.data_sources_id.toString()}
                        >
                          {conn.connection_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {hasSelectedTables && (
                  <p className="text-xs text-amber-600 mt-1">
                    Uncheck all tables to change connection
                  </p>
                )}
              </div>

              {/* Display Source Connection Details */}
              {step.source_details && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2 text-blue-700">
                    Source Connection Details:
                  </h4>
                  <div className="text-sm text-blue-600 space-y-1">
                    <p>
                      <span className="font-medium">Database:</span>{" "}
                      {step.source_details.database_name}
                    </p>
                    <p>
                      <span className="font-medium">Server:</span>{" "}
                      {step.source_details.server_name}:
                      {step.source_details.port_number}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {step.source_details.database_type}
                    </p>
                  </div>
                </div>
              )}

              {/* Source Schema Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">Schema</label>
                <Select
                  value={selectedSourceSchema}
                  onValueChange={handleSourceSchemaChange}
                  disabled={
                    !step.connection_id ||
                    loading ||
                    step.process_step_id != null
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schema" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceSchemas.map((schema) => (
                      <SelectItem
                        key={schema.schema_name}
                        value={schema.schema_name}
                      >
                        {schema.schema_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasSelectedTables && (
                  <p className="text-xs text-amber-600 mt-1">
                    Uncheck all tables to change schema
                  </p>
                )}
              </div>

              {/* Source Tables */}
              {selectedSourceSchema && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tables
                  </label>
                  {!isTableSelectionAvailable ? (
                    <div className="py-3 px-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
                      Please select both source and destination connections and
                      schemas to view tables
                    </div>
                  ) : loading ? (
                    <div className="text-center py-4">Loading tables...</div>
                  ) : (
                    <>
                      {sourceTables.length > 0 ? (
                        <ScrollArea className="h-60 border rounded-md p-4">
                          <div className="space-y-2">
                            {sourceTables.map((table) => (
                              <div
                                key={table.table_name}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`source-${table.table_name}`}
                                  checked={isTableSelected(table.table_name)}
                                  onCheckedChange={(checked) =>
                                    handleSourceTableChange(
                                      table.table_name,
                                      checked
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`source-${table.table_name}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {table.table_name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="py-3 px-4 bg-gray-100 rounded text-gray-600 text-sm">
                          No tables exist in this schema
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Destination Database Section */}
        <Card className="border border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">
              Destination Database
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {/* Destination Connection Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Connection
                </label>
                <Select
                  value={step.destination_connection_id}
                  onValueChange={handleDestinationConnectionChange}
                  disabled={hasSelectedTables || step.process_step_id != null}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections
                      .filter(
                        (conn) =>
                          conn.data_sources_id.toString() !== step.connection_id
                      )
                      .map((conn) => (
                        <SelectItem
                          key={conn.data_sources_id}
                          value={conn.data_sources_id.toString()}
                        >
                          {conn.connection_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {hasSelectedTables && (
                  <p className="text-xs text-amber-600 mt-1">
                    Uncheck all tables to change connection
                  </p>
                )}
              </div>

              {/* Display Destination Connection Details */}
              {step.destination_details && (
                <div className="bg-green-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2 text-green-700">
                    Destination Connection Details:
                  </h4>
                  <div className="text-sm text-green-600 space-y-1">
                    <p>
                      <span className="font-medium">Database:</span>{" "}
                      {step.destination_details.database_name}
                    </p>
                    <p>
                      <span className="font-medium">Server:</span>{" "}
                      {step.destination_details.server_name}:
                      {step.destination_details.port_number}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {step.destination_details.database_type}
                    </p>
                  </div>
                </div>
              )}

              {/* Destination Schema Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">Schema</label>
                <Select
                  value={selectedDestinationSchema}
                  onValueChange={handleDestSchemaChange}
                  disabled={
                    !step.destination_connection_id ||
                    loading ||
                    hasSelectedTables ||
                    step.process_step_id != null
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schema" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationSchemas.map((schema) => (
                      <SelectItem
                        key={schema.schema_name}
                        value={schema.schema_name}
                      >
                        {schema.schema_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasSelectedTables && (
                  <p className="text-xs text-amber-600 mt-1">
                    Uncheck all tables to change schema
                  </p>
                )}
              </div>

              {/* Destination Tables Display */}
              {step.process_step_id != null ? (
                <div>Skibdi</div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Available Tables in Destination Schema
                  </label>
                  {destinationTables.length > 0 ? (
                    <ScrollArea className="h-40 border rounded-md p-4">
                      <div className="space-y-1">
                        {destinationTables.map((table) => (
                          <div
                            key={table.table_name}
                            className="text-sm text-gray-600"
                          >
                            {table.table_name}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : selectedDestinationSchema ? (
                    <div className="py-3 px-4 bg-gray-100 rounded text-gray-600 text-sm">
                      No tables exist in this destination schema
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Select a destination schema to view available tables
                    </div>
                  )}
                </div>
              )}

              {/* Selected Tables Display */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Selected Tables for Import
                </label>
                {step.selected_tables && step.selected_tables.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {step.selected_tables.map((table, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-green-50"
                      >
                        {table.table_name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Tables will appear here when selected from source
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Creation Summary */}
      {step.create_table && step.create_table.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Table Creation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {step.create_table.map((table, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Component className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{table.table_name}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>{table.schema_name}</span>
                      <ChevronRight className="h-4 w-4" />
                      <span>{table.dest_schema_name}</span>
                    </div>
                    <Badge
                      variant={table.is_table_exist ? "default" : "secondary"}
                      className={
                        table.is_table_exist
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {table.is_table_exist ? "Exists" : "Will Create"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// This component manages the query, description & connection of a process query step
function QueryStepContent({
  step,
  subprocessId,
  stepId,
  connections,
  updateStep,
}) {
  // Handle connection selection and fetch details
  const handleConnectionChange = async (connectionId) => {
    try {
      // Update the connection_id first
      updateStep(subprocessId, stepId, "connection_id", connectionId);

      // Fetch connection details from API
      const response = await fetch(
        `${baseURL}/connection-view?conn_id=${connectionId}`
      );
      const data = await response.json();

      // Update source_details with the fetched data
      updateStep(subprocessId, stepId, "source_details", data.data);
    } catch (error) {
      console.error("Error fetching connection details:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Connection</label>
        <Select
          value={step.connection_id}
          onValueChange={handleConnectionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select connection" />
          </SelectTrigger>
          <SelectContent>
            {connections.map((conn) => (
              <SelectItem
                key={conn.data_sources_id}
                value={conn.data_sources_id.toString()}
              >
                {conn.connection_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display Connection Details (if available) */}
      {step.source_details && (
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Connection Details:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Database:</span>{" "}
              {step.source_details.database_name}
            </p>
            <p>
              <span className="font-medium">Server:</span>{" "}
              {step.source_details.server_name}:
              {step.source_details.port_number}
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              {step.source_details.database_type}
            </p>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={step.pq_description}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "pq_description", e.target.value)
          }
          placeholder="Describe what this query does..."
          rows={3}
        />
      </div>

      {/* Query */}
      <div>
        <label className="block text-sm font-medium mb-1">SQL Query</label>
        <Textarea
          value={step.pq_query}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "pq_query", e.target.value)
          }
          placeholder="Enter your SQL query here..."
          rows={8}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}

// This component manages the queries, description & connection of a export step
function ExportStepContent({
  step,
  subprocessId,
  stepId,
  connections,
  updateStep,
}) {
  const [queryList, setQueryList] = useState(step.ex_query || []);

  const addQuery = () => {
    const newQuery = "";
    const updatedQueries = [...queryList, newQuery];
    setQueryList(updatedQueries);
    updateStep(subprocessId, stepId, "ex_query", updatedQueries);
  };

  const updateQuery = (index, value) => {
    const updatedQueries = [...queryList];
    updatedQueries[index] = value;
    setQueryList(updatedQueries);
    updateStep(subprocessId, stepId, "ex_query", updatedQueries);
  };

  const removeQuery = (index) => {
    const updatedQueries = queryList.filter((_, i) => i !== index);
    setQueryList(updatedQueries);
    updateStep(subprocessId, stepId, "ex_query", updatedQueries);
  };

  // Handle connection selection and fetch details
  const handleConnectionChange = async (connectionId) => {
    try {
      // Update the connection_id first
      updateStep(subprocessId, stepId, "connection_id", connectionId);

      // Fetch connection details from API
      const response = await fetch(
        `${baseURL}/connection-view?conn_id=${connectionId}`
      );
      const data = await response.json();

      // Update source_details with the fetched data
      updateStep(subprocessId, stepId, "source_details", data.data);
    } catch (error) {
      console.error("Error fetching connection details:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Connection</label>
        <Select
          value={step.connection_id}
          onValueChange={handleConnectionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select connection" />
          </SelectTrigger>
          <SelectContent>
            {connections.map((conn) => (
              <SelectItem
                key={conn.data_sources_id}
                value={conn.data_sources_id.toString()}
              >
                {conn.connection_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display Connection Details (if available) */}
      {step.source_details && (
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Connection Details:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Database:</span>{" "}
              {step.source_details.database_name}
            </p>
            <p>
              <span className="font-medium">Server:</span>{" "}
              {step.source_details.server_name}:
              {step.source_details.port_number}
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              {step.source_details.database_type}
            </p>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={step.ex_description}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "ex_description", e.target.value)
          }
          placeholder="Describe what this export does..."
          rows={3}
        />
      </div>

      {/* Queries */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Export Queries</label>
          <Button onClick={addQuery} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Query
          </Button>
        </div>

        <div className="space-y-3">
          {queryList.map((query, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Query {index + 1}</span>
                <Button
                  onClick={() => removeQuery(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={query}
                onChange={(e) => updateQuery(index, e.target.value)}
                placeholder="Enter your export query here..."
                rows={4}
                className="font-mono text-sm"
              />
            </div>
          ))}

          {queryList.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No queries added yet. Click "Add Query" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
