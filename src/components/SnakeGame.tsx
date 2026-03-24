import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    if (currentSnake.length >= GRID_SIZE * GRID_SIZE) {
      return { x: -1, y: -1 };
    }
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === ' ' && document.activeElement?.tagName !== 'BUTTON') {
        e.preventDefault();
      }
      
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        directionRef.current = direction;

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, Math.max(40, INITIAL_SPEED - score * 1.5));
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, score, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto bg-black relative">
      <div className="flex justify-between w-full mb-4 px-2 border-b-4 border-[#ff00ff] pb-2">
        <div className="text-[#00ffff] text-3xl font-bold tracking-widest">
          BIOMASS_UNITS: {score.toString().padStart(4, '0')}
        </div>
        <div className={`text-[#ff00ff] text-2xl uppercase tracking-widest flex items-center ${isPaused ? 'animate-pulse' : ''}`}>
          {isPaused ? 'EXEC_MODE: HALTED' : 'EXEC_MODE: ACTIVE'}
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-[#00ffff] overflow-hidden"
        style={{
          width: '100%',
          aspectRatio: '1/1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`
                ${isHead ? 'bg-[#ff00ff] z-10' : ''}
                ${isSnake && !isHead ? 'bg-[#00ffff] scale-90' : ''}
                ${isFood ? 'bg-white animate-ping scale-75' : ''}
                ${!isSnake && !isFood ? 'border border-[#00ffff]/20' : ''}
              `}
            />
          );
        })}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 tear">
            <h2 className="text-6xl font-bold text-[#ff00ff] mb-4 tracking-widest glitch-text" data-text="SYSTEM FAILURE">SYSTEM FAILURE</h2>
            <p className="text-[#00ffff] text-3xl mb-8 text-center">DATA CORRUPTED.<br/>UNITS RECOVERED: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-transparent border-4 border-[#00ffff] text-[#00ffff] font-bold text-3xl tracking-widest uppercase hover:bg-[#ff00ff] hover:text-black hover:border-[#ff00ff] transition-colors"
            >
              INITIATE_REBOOT
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-[#ff00ff] text-xl text-center uppercase tracking-widest">
        INPUT: <span className="text-[#00ffff]">WASD/ARROWS</span> | OVERRIDE: <span className="text-[#00ffff]">SPACE</span>
      </div>
    </div>
  );
}
