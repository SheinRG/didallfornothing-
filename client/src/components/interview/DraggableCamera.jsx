import { useEffect, useRef, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

const DraggableCamera = forwardRef(({}, ref) => {
  const localVideoRef = useRef(null);
  const videoRef = ref || localVideoRef;
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let mediaStream = null;
    
    async function startCamera() {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStream(mediaStream);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    
    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  if (!stream) return null;

  return (
    <motion.div
      drag
      dragConstraints={{ 
        left: typeof window !== 'undefined' ? -window.innerWidth + 300 : -2000, 
        right: 50, 
        top: typeof window !== 'undefined' ? -window.innerHeight + 300 : -2000, 
        bottom: 50 
      }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      className="fixed bottom-6 right-6 w-36 sm:w-56 aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-[#333] hover:border-[#E8563B]/50 transition-colors bg-[#111] z-[100] cursor-grab group"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />
      
      {/* Live Badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[8px] font-bold tracking-widest text-white/90">LIVE FEED</span>
      </div>
      
      {/* Drag Indicator */}
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-8 h-1 rounded-full bg-white/30 backdrop-blur-md" />
      </div>
    </motion.div>
  );
});

export default DraggableCamera;
