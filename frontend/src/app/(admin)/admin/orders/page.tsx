import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";

export default function AdminOrdersPage() {
  const orders = [
    { id: "#25426", name: "Kevin", date: "Nov 8th, 2023", status: "Delivered", amount: "₹200.00" },
    { id: "#25425", name: "Komael", date: "Nov 7th, 2023", status: "Cancelled", amount: "₹200.00" },
    { id: "#25424", name: "Nikhil", date: "Nov 6th, 2023", status: "Delivered", amount: "₹200.00" },
    { id: "#25423", name: "Shivam", date: "Nov 5th, 2023", status: "Cancelled", amount: "₹200.00" },
    { id: "#25422", name: "Shadab", date: "Nov 4th, 2023", status: "Delivered", amount: "₹200.00" },
    { id: "#25421", name: "Yogesh", date: "Nov 2nd, 2023", status: "Delivered", amount: "₹200.00" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">Order List</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="w-10 h-10 bg-muted rounded-md"></div>
                  </TableCell>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "Delivered" ? "default" : "destructive"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}