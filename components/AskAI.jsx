"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CircleDashed, CircleArrowUp } from "lucide-react";
import toast from "react-hot-toast";
import { workerUrl } from "@/lib/config";

export default function AskAI() {
  const [query, setQuery] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateText = async () => {
    if (!query) return;

    setIsLoading(true);

    try {
      const res = await fetch(workerUrl.generateText, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: query,
        }),
      });
      const data = await res.json();
      setText(data.response);
    } catch (error) {
      console.error(error.message);
      toast.error("Interval error");
    }

    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" className="rounded-xl">
          Ask AI
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-between h-[30rem]">
        <div>
          <DialogHeader>
            <DialogTitle>Ask AI</DialogTitle>
            <DialogDescription>
              Hi, I am your personal AI. What would you like to ask about your
              notes?
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <p className="text-lg flex items-center gap-2">
              <CircleDashed className="h-4 w-4 animate-spin" /> Generating
              response...
            </p>
          ) : (
            <div className="mt-4 h-[14rem] overflow-y-auto">
              <p>{text}</p>
            </div>
          )}
        </div>

        <div className="">
          <div className="relative">
            <textarea
              name="prompt"
              placeholder="Ask anything about your notes..."
              className="p-2 w-full h-24 border border-slate-300 rounded-lg resize-none"
              maxLength={128}
              onInput={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.code === "Enter" || e.code === "NumpadEnter") {
                  e.preventDefault();
                  generateText();
                }
              }}
            ></textarea>
            <div className="absolute right-2 top-2 z-10 bg-white">
              <button type="submit" onClick={generateText}>
                <CircleArrowUp className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
