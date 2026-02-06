import { Card, CardContent } from "@/src/components/ui/card";
import { Features } from "@/src/app/(store)/components/Features";
import Link from "next/link";
import { Twitter, Instagram, Linkedin } from "lucide-react";

// Dữ liệu giả
const stats = [
  { value: "10.5k", label: "Sellers active on our site" },
  { value: "33k", label: "Monthly product sales" },
  { value: "45.5k", label: "Customer active on our site" },
  { value: "25k", label: "Annual gross sale on our site" },
];

const team = [
  { name: "Tom Cruise", role: "Founder & Chairman", image: "/placeholder.svg" },
  { name: "Emma Watson", role: "Managing Director", image: "/placeholder.svg" },
  { name: "Will Smith", role: "Product Designer", image: "/placeholder.svg" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-12">
        <div className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>About</span>
        </div>
      </div>

      {/* Section 1: Our Story */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-semibold leading-tight">Our Story</h1>
          <p>
            just a project for school
          </p>
          <p>
            well ...
          </p>
        </div>
        <div>
          {/* <img src="/placeholder.svg" alt="Our Story" className="w-full h-[400px] object-cover rounded-md" /> */}
        </div>
      </div>

      {/* Section 2: Stats */}
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 py-16">
        {stats.map((stat, index) => (
          <Card key={index} className={`flex flex-col items-center justify-center p-8 aspect-square text-center ${index === 1 ? 'bg-destructive text-white' : ''}`}>
            <CardContent className="p-0 flex flex-col items-center gap-2">
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section 3: Team */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name}>
              <Card className="border-0 shadow-none bg-secondary/30">
                {/* <img src={member.image} alt={member.name} className="w-full h-auto object-cover" /> */}
              </Card>
              <div className="mt-6">
                <h3 className="text-2xl font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
                <div className="flex gap-4 mt-2">
                  <Twitter size={20} />
                  <Instagram size={20} />
                  <Linkedin size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Features */}
      <div className="container mx-auto px-4 py-16">
        <Features />
      </div>
    </div>
  );
}