"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Event {
    _id: string;
    name: string;
    type: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/events`);
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/events/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchEvents();
            }
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Events</h1>
                <Button asChild>
                    <Link href="/admin/events/create">
                        <Plus className="mr-2 h-4 w-4" /> Create Event
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event._id}>
                                    <TableCell className="font-medium">{event.name}</TableCell>
                                    <TableCell>{event.type}</TableCell>
                                    <TableCell>{format(new Date(event.startDate), "PP p")}</TableCell>
                                    <TableCell>{format(new Date(event.endDate), "PP p")}</TableCell>
                                    <TableCell>
                                        {new Date(event.endDate) > new Date() ? (
                                            <span className="text-green-600 font-semibold">Active</span>
                                        ) : (
                                            <span className="text-red-600 font-semibold">Ended</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(event._id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
