"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";

type CalendarModalProps = {
  children: ReactNode;
};

const SCHEDULING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2E8bAxqE_Sb2w8Vt_sms8jEv99FDcWDCzEd3FAtTbBNZTKxIOXb9iY3ujVFZEIFMTBgme_64j0?gv=true";

export function CalendarModal({ children }: CalendarModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        overlayClassName="bg-black/40 backdrop-blur-sm"
        className="w-[min(94vw,1080px)] sm:max-w-4xl lg:max-w-5xl p-0 bg-white border-gray-300 dark:border-primary/30"
      >
        <div className="px-4 py-3 border-b border-gray-300 dark:border-primary/30">
          <div className="text-sm font-medium">Book a Discovery Call</div>
        </div>
        <div className="p-3 md:p-4">
          <iframe
            src={SCHEDULING_URL}
            style={{ border: 0 }}
            width="100%"
            height="600"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Calendar appointment scheduling"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
