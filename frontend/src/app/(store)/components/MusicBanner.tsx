"use client";

import { Button } from "@/src/components/ui/button";
import { Event } from "@/src/types";
import { useEffect, useState } from "react";
import { formatDuration, intervalToDuration } from "date-fns";

export function MusicBanner({ event }: { event: Event | null }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!event) return;

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(event.endDate);

      if (now >= end) {
        clearInterval(timer);
        return;
      }

      const duration = intervalToDuration({ start: now, end });
      setTimeLeft({
        days: duration.days || 0,
        hours: duration.hours || 0,
        minutes: duration.minutes || 0,
        seconds: duration.seconds || 0,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  if (!event) return null;

  return (
    <section className="bg-black text-white p-12 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        {/* Phần nội dung */}
        <div className="flex flex-col items-start gap-6">
          <p className="text-green-400 font-semibold">Categories</p>
          <h2 className="text-5xl font-semibold leading-tight">
            {event.name}
          </h2>

          {/* Countdown */}
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center text-black">
              <span className="font-bold">{timeLeft.days}</span>
              <span className="text-xs">Days</span>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center text-black">
              <span className="font-bold">{timeLeft.hours}</span>
              <span className="text-xs">Hours</span>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center text-black">
              <span className="font-bold">{timeLeft.minutes}</span>
              <span className="text-xs">Minutes</span>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center text-black">
              <span className="font-bold">{timeLeft.seconds}</span>
              <span className="text-xs">Seconds</span>
            </div>
          </div>

          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
            Buy Now!
          </Button>
        </div>

        {/* Phần hình ảnh */}
        <div className="relative w-full aspect-square">
          {/* Placeholder or event image if available */}
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
            Event Image
          </div>
        </div>
      </div>
    </section>
  );
}