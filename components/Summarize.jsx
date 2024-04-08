"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CircleDashed } from "lucide-react";
import toast from "react-hot-toast";
import { workerUrl } from "@/lib/config";

export default function Summarize({ context }) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  const summarizeContext = async () => {
    if (!context || text.length > 0) return;
    setIsLoading(true);

    try {
      const res = await fetch(workerUrl.summarize, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: context,
        }),
      });
      const data = await res.json();
      setText(data.summary);
    } catch (error) {
      console.error(error.message);
      toast.error("Interval error");
    }

    setIsLoading(false);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="mt-4" onClick={summarizeContext}>
            Summarize
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Summary</DialogTitle>

            <div className="mt-10 text-left">
              {isLoading ? (
                <p className="flex items-center gap-2 justify-center">
                  <CircleDashed className="h-4 w-4 animate-spin" /> Generating
                  summary...
                </p>
              ) : (
                <div className="mt-4 h-[14rem] overflow-y-auto">
                  <p>{text}</p>
                </div>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
