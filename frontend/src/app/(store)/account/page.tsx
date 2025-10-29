"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-destructive">Md Rimel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Cột 1: Sidebar Navigation */}
        <div className="col-span-1 flex flex-col gap-4">
          <div>
            <h3 className="font-medium mb-2">Manage My Account</h3>
            <ul className="pl-4 text-muted-foreground flex flex-col gap-2">
              <li><Link href="/account" className="text-destructive hover:underline">My Profile</Link></li>
              <li><Link href="/account/address" className="hover:underline">Address Book</Link></li>
              <li><Link href="/account/payment" className="hover:underline">My Payment Options</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">My Orders</h3>
            <ul className="pl-4 text-muted-foreground flex flex-col gap-2">
              <li><Link href="/account/orders" className="hover:underline">My Returns</Link></li>
              <li><Link href="/account/cancellations" className="hover:underline">My Cancellations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2"><Link href="/wishlist" className="hover:underline">My Wishlist</Link></h3>
          </div>
        </div>

        {/* Cột 2: Content (Edit Profile) */}
        <div className="col-span-3">
          <Card className="p-8 shadow-md">
            <h2 className="text-xl font-medium text-destructive mb-6">Edit Your Profile</h2>
            <form className="flex flex-col gap-6">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Md" className="bg-secondary/50 border-none" />
                </div>
                 <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Rimel" className="bg-secondary/50 border-none" />
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="rimelll@gmail.com" className="bg-secondary/50 border-none" />
                </div>
                 <div className="flex flex-col gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="Kingston, 5236, United State" className="bg-secondary/50 border-none" />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Password Changes */}
              <div className="flex flex-col gap-4">
                <Label>Password Changes</Label>
                <Input placeholder="Current Password" type="password" className="bg-secondary/50 border-none" />
                <Input placeholder="New Password" type="password" className="bg-secondary/50 border-none" />
                <Input placeholder="Confirm New Password" type="password" className="bg-secondary/50 border-none" />
              </div>
              
              <div className="flex justify-end gap-6 items-center mt-4">
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}