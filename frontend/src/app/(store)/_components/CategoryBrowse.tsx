import { Card, CardContent } from "@/src/components/ui/card";
import { Smartphone, Watch, Camera, Gamepad, Computer, Headset } from "lucide-react";

const categories = [
  { name: "Phones", icon: Smartphone },
  { name: "Computers", icon: Computer },
  { name: "SmartWatch", icon: Watch },
  { name: "Camera", icon: Camera },
  { name: "HeadPhones", icon: Headset },
  { name: "Gaming", icon: Gamepad },
];

export function CategoryBrowse() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-destructive font-semibold text-sm mb-4">Categories</p>
        <h2 className="text-3xl font-semibold">Browse By Category</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Card key={category.name} className="flex flex-col items-center justify-center p-8 aspect-square hover:bg-destructive hover:text-white transition-colors cursor-pointer">
            <CardContent className="p-0 flex flex-col items-center gap-4">
              <category.icon size={48} strokeWidth={1.5} />
              <span className="font-medium">{category.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}