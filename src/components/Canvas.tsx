'use client';

import { getSocket } from '@/lib/socket';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Socket } from 'socket.io-client';


const ViewCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

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

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 4;
    context.strokeStyle = 'black';

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    skt.on('draw', (data: { x: number; y: number; type: string }) => {
      if (data.type === 'draw') {
        if (!isDrawing) {
          isDrawing = true;
          lastX = data.x;
          lastY = data.y;
        }

        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(data.x, data.y);
        context.stroke();
        context.closePath();

        lastX = data.x;
        lastY = data.y;
      }
    });

    return () => {
      skt.off('draw');
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      className="border border-black"
    />
  );
};

export default ViewCanvas;
