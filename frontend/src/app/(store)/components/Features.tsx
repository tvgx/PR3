import { Truck, Headset, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $140",
  },
  {
    icon: Headset,
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer support",
  },
  {
    icon: ShieldCheck,
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days",
  },
];

export function Features() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-secondary/50 rounded-full">
            <div className="p-2 bg-black rounded-full">
              <feature.icon size={28} className="text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold uppercase">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}