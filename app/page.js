"use client";

import AskAI from "@/components/AskAI";
import Audio from "@/components/Audio";
import IntroSection from "@/components/IntroSection";
import Summarize from "@/components/Summarize";
import { Button } from "@/components/ui/button";
import { workerUrl } from "@/lib/config";
import { formatAudio } from "@/lib/helpers";
import { Disc, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [notes, setNotes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notesCount, setNotesCount] = useState(notes.length);

  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    const getLocalData = localStorage.getItem("VoiceJournal");

    if (getLocalData) {
      setNotes(JSON.parse(getLocalData));
    }
  }, []);

  useEffect(() => {
    const recordTimer = setInterval(async () => {
      if (seconds < 60 && isRecording) {
        setSeconds((prev) => prev + 1);
      } else {
        stopRecording();
        clearInterval(recordTimer);
      }
    }, 1000);

    return () => clearInterval(recordTimer);
  }, [seconds]);

  useEffect(() => {
    localStorage.setItem("VoiceJournal", JSON.stringify(notes));
  }, [notes]);

  const startRecording = async () => {
    if (notesCount > 4) {
      toast.success("You have reached the limit");
      return;
    } else {
      setNotesCount((prev) => prev + 1);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setIsRecording(true);
      setSeconds(0);

      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        setIsProcessing(true);
        const recordedBlob = new Blob(chunks.current, {
          type: "audio/webm",
        });

        // const url = URL.createObjectURL(recordedBlob);
        // setRecordedUrl(url);

        chunks.current = [];

        try {
          const transcript = await getTranscript(recordedBlob);

          const arrayBuff = await recordedBlob.arrayBuffer();
          const base64String = btoa(
            String.fromCharCode.apply(null, new Uint8Array(arrayBuff))
          );

          setNotes([
            {
              audio: base64String,
              transcript: transcript.response.text,
            },
            ...notes,
          ]);
        } catch (error) {
          console.error(error.message);
          toast.error("Something went wrong");
        }

        setIsProcessing(false);
      };

      mediaRecorder.current.start();
    } catch (err) {
      console.error(err.message);
      toast.error(
        "Not able to get access of mic, please allow microphone access"
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
    setIsRecording(false);
  };

  const getTranscript = async (audioBlob) => {
    const res = await fetch(workerUrl.synthesize, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: audioBlob,
    });
    const data = await res.json();
    return data;
  };

  return (
    <main className="mt-10 flex min-h-screen flex-col items-center justify-between">
      <section className="fixed bottom-10 bg-white border border-slate-200 rounded-2xl px-10 py-3 space-x-4 shadow-lg z-10">
        {isRecording ? (
          <div className="flex justify-between items-center gap-10">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-xl hidden"
              onClick={stopRecording}
            >
              Cancel
            </Button>
            <p className="flex items-center gap-2">
              <Mic className="text-red-400 animate-pulse" /> Recording...
            </p>
            <Button
              size="lg"
              className="rounded-xl bg-green-700 hover:bg-green-800"
              onClick={stopRecording}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <Button size="lg" className="rounded-xl" onClick={startRecording}>
              <Disc className="mr-2 h-4 w-4" />
              Record a note
            </Button>

            <AskAI />
          </>
        )}
      </section>

      <section className="max-w-3xl mx-auto p-4">
        <div>
          <ul className="flex flex-col gap-10">
            <li>{isProcessing && <p>Generating response...</p>}</li>
            {notes.map((note, i) => (
              <li key={i}>
                <div className="flex flex-col">
                  <div className="flex gap-4">
                    <Audio audio={formatAudio(note.audio)} />
                    <p>{note.transcript}</p>
                  </div>
                  <Summarize context={note.transcript} />
                </div>
              </li>
            ))}
          </ul>
          <IntroSection />
        </div>
      </section>
    </main>
  );
}
