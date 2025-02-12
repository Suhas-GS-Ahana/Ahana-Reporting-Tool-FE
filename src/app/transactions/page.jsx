import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getData } from "@/lib/utils";


async function Transactions() {
  const data = await getData();
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Transactions & Logs</h1>
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default Transactions;
