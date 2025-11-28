"use client";

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
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { Order } from "@/src/types";
import { format } from "date-fns";
import { Skeleton } from "@/src/components/ui/skeleton";
import { toast } from "sonner";
import { useEffect } from "react";

const fetchAllOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get("/orders/all");
  return data;
};

export default function AdminOrdersPage() {
  const { data: orders, isLoading, isError } = useQuery<Order[]>({
    queryKey: ["admin-all-orders"],
    queryFn: fetchAllOrders,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load orders.");
    }
  }, [isError]);

  const calculateTotal = (items: Order['items']) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">Order List</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">#{order._id.slice(-6).toUpperCase()}</TableCell>
                      <TableCell>{format(new Date(order.createdAt), "MMM do, yyyy")}</TableCell>
                      <TableCell>{order.userId?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "delivered" ? "default" : order.status === "cancelled" ? "destructive" : "secondary"}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${calculateTotal(order.items).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No orders found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
