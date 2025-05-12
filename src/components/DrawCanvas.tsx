"use client";

import { getSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";

const DrawingCanvas = () => {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const skt = getSocket();
    setSocket(skt);

    if (!skt) {
      toast.error("Failed to initialize socket connection");
      router.push("/");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 4;
    context.strokeStyle = "black";

    const handleMouseDown = (e: MouseEvent) => {
      setDrawing(true);
      context.beginPath();
      context.moveTo(e.offsetX, e.offsetY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing) return;
      context.lineTo(e.offsetX, e.offsetY);
      context.stroke();

      // Emit the drawing data
      skt.emit("draw", {
        x: e.offsetX,
        y: e.offsetY,
        type: "draw",
      });
    };

    const handleMouseUp = () => {
      setDrawing(false);
      context.closePath();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [drawing]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      className="border border-black"
    />
  );
};

export default DrawingCanvas;
