"use client"

import { useState, useEffect } from "react"

interface Star {
  id: number
  x: number
  y: number
  opacity: number
}

interface StarryBackgroundProps {
  isDarkMode: boolean
}

export default function StarryBackground({ isDarkMode }: StarryBackgroundProps) {
  const [stars, setStars] = useState<Star[]>([])
  const [nextId, setNextId] = useState(0)

  // Debug: Log the current mode
  console.log('StarryBackground isDarkMode:', isDarkMode)

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newStar: Star = {
      id: nextId,
      x,
      y,
      opacity: 1
    }
    
    setStars(prev => [...prev, newStar])
    setNextId(prev => prev + 1)
    
    // Remove the star after animation
    setTimeout(() => {
      setStars(prev => prev.filter(star => star.id !== nextId))
    }, 2000)
  }

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      onClick={handleClick}
      style={{ 
        pointerEvents: 'auto',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      {isDarkMode ? (
        <>
          {/* Dark Mode - Starry Night */}
          <div className="stars"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
        </>
      ) : (
        <>
          {/* Light Mode - Morning Sky */}
          <div className="morning-sun"></div>
          <div className="morning-clouds"></div>
          <div className="morning-clouds-2"></div>
        </>
      )}
      
      {/* Click-generated stars (work in both modes) */}
      {stars.map(star => (
        <div
          key={star.id}
          className={`absolute w-2 h-2 rounded-full animate-ping ${
            isDarkMode ? 'bg-white' : 'bg-yellow-400'
          }`}
          style={{
            left: star.x - 4,
            top: star.y - 4,
            opacity: star.opacity,
            animationDuration: '2s'
          }}
        />
      ))}
      
      <style jsx>{`
        /* Dark Mode Styles */
        .stars {
          width: 1px;
          height: 1px;
          position: absolute;
          background: white;
          box-shadow: 2vw 5vh 2px white, 10vw 8vh 2px white, 15vw 15vh 1px white,
            22vw 22vh 1px white, 28vw 12vh 2px white, 32vw 32vh 1px white,
            38vw 18vh 2px white, 42vw 35vh 1px white, 48vw 25vh 2px white,
            53vw 42vh 1px white, 58vw 15vh 2px white, 63vw 38vh 1px white,
            68vw 28vh 2px white, 73vw 45vh 1px white, 78vw 32vh 2px white,
            83vw 48vh 1px white, 88vw 20vh 2px white, 93vw 52vh 1px white,
            98vw 35vh 2px white, 5vw 60vh 1px white, 12vw 65vh 2px white,
            18vw 72vh 1px white, 25vw 78vh 2px white, 30vw 85vh 1px white,
            35vw 68vh 2px white, 40vw 82vh 1px white, 45vw 92vh 2px white,
            50vw 75vh 1px white, 55vw 88vh 2px white, 60vw 95vh 1px white,
            65vw 72vh 2px white, 70vw 85vh 1px white, 75vw 78vh 2px white,
            80vw 92vh 1px white, 85vw 82vh 2px white, 90vw 88vh 1px white,
            95vw 75vh 2px white;
          animation: twinkle 8s infinite linear;
        }

        .shooting-star {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, white, transparent);
          animation: shoot 3s infinite ease-in;
        }

        .shooting-star:nth-child(1) {
          top: 20%;
          left: -100px;
          animation-delay: 0s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(2) {
          top: 35%;
          left: -100px;
          animation-delay: 2s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(3) {
          top: 50%;
          left: -100px;
          animation-delay: 4s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(4) {
          top: 15%;
          left: -100px;
          animation-delay: 6s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(5) {
          top: 65%;
          left: -100px;
          animation-delay: 8s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(6) {
          top: 25%;
          left: -100px;
          animation-delay: 10s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(7) {
          top: 45%;
          left: -100px;
          animation-delay: 12s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(8) {
          top: 30%;
          left: -100px;
          animation-delay: 14s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(9) {
          top: 55%;
          left: -100px;
          animation-delay: 16s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(10) {
          top: 40%;
          left: -100px;
          animation-delay: 18s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(11) {
          top: 70%;
          left: -100px;
          animation-delay: 20s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(12) {
          top: 10%;
          left: -100px;
          animation-delay: 22s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(13) {
          top: 60%;
          left: -100px;
          animation-delay: 24s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(14) {
          top: 75%;
          left: -100px;
          animation-delay: 26s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(15) {
          top: 5%;
          left: -100px;
          animation-delay: 28s;
          animation-name: shoot;
        }

        .shooting-star:nth-child(16) {
          top: 80%;
          left: -100px;
          animation-delay: 30s;
          animation-name: shoot;
        }

        /* Additional shooting stars from different directions */
        .shooting-star:nth-child(17) {
          top: -100px;
          left: 20%;
          animation-delay: 1s;
          animation-name: shootDown;
        }

        .shooting-star:nth-child(18) {
          top: -100px;
          left: 60%;
          animation-delay: 3s;
          animation-name: shootDown;
        }

        .shooting-star:nth-child(19) {
          top: -100px;
          left: 40%;
          animation-delay: 5s;
          animation-name: shootDown;
        }

        .shooting-star:nth-child(20) {
          top: -100px;
          left: 80%;
          animation-delay: 7s;
          animation-name: shootDown;
        }

        .shooting-star:nth-child(21) {
          top: 30%;
          right: -100px;
          animation-delay: 9s;
          animation-name: shootLeft;
        }

        .shooting-star:nth-child(22) {
          top: 70%;
          right: -100px;
          animation-delay: 11s;
          animation-name: shootLeft;
        }

        .shooting-star:nth-child(23) {
          top: 50%;
          right: -100px;
          animation-delay: 13s;
          animation-name: shootLeft;
        }

        .shooting-star:nth-child(24) {
          top: 90%;
          right: -100px;
          animation-delay: 15s;
          animation-name: shootLeft;
        }

        /* Light Mode Styles */
        .morning-sun {
          position: absolute;
          top: 10%;
          right: 10%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.1) 100%);
          border-radius: 50%;
          filter: blur(20px);
          animation: morningGlow 10s infinite ease-in-out;
        }

        .morning-clouds {
          position: absolute;
          top: 20%;
          right: 5%;
          width: 300px;
          height: 150px;
          background: radial-gradient(ellipse, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 70%, transparent 100%);
          border-radius: 50%;
          filter: blur(30px);
          animation: floatCloud 15s infinite ease-in-out;
        }

        .morning-clouds-2 {
          position: absolute;
          top: 40%;
          right: 20%;
          width: 250px;
          height: 120px;
          background: radial-gradient(ellipse, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 70%, transparent 100%);
          border-radius: 50%;
          filter: blur(25px);
          animation: floatCloud 20s infinite ease-in-out reverse;
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(25deg);
            opacity: 1;
          }
          100% {
            transform: translateX(120vw) translateY(50vh) rotate(25deg);
            opacity: 0;
          }
        }

        @keyframes shootDown {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: translateX(50vw) translateY(120vh) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes shootLeft {
          0% {
            transform: translateX(0) translateY(0) rotate(-25deg);
            opacity: 1;
          }
          100% {
            transform: translateX(-120vw) translateY(50vh) rotate(-25deg);
            opacity: 0;
          }
        }

        @keyframes morningGlow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes floatCloud {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }

        .stars::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 1px;
          background: white;
          box-shadow: 8vw 12vh 2px white, 16vw 18vh 1px white, 24vw 25vh 2px white,
            33vw 15vh 1px white, 41vw 28vh 2px white, 49vw 35vh 1px white,
            57vw 22vh 2px white, 65vw 42vh 1px white, 73vw 28vh 2px white,
            81vw 48vh 1px white, 89vw 32vh 2px white, 97vw 45vh 1px white,
            3vw 68vh 2px white, 11vw 75vh 1px white, 19vw 82vh 2px white,
            27vw 88vh 1px white, 35vw 72vh 2px white, 43vw 85vh 1px white,
            51vw 92vh 2px white, 59vw 78vh 1px white;
          animation: twinkle 6s infinite linear reverse;
        }
      `}</style>
    </div>
  )
} 