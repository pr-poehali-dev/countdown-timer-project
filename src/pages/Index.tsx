import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 1.0;
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            return 0;
          }
          
          if (prev <= 5) {
            const utterance = new SpeechSynthesisUtterance('хуй');
            utterance.lang = 'ru-RU';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
          }
          
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (totalSeconds > 0 && !isRunning) {
      setTimeLeft(totalSeconds);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleSetTime = () => {
    const total = minutes * 60 + seconds;
    setTotalSeconds(total);
    setTimeLeft(total);
    setIsRunning(false);
  };

  const displayMinutes = Math.floor(timeLeft / 60);
  const displaySeconds = timeLeft % 60;
  const isWarning = timeLeft <= 5 && timeLeft > 0;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div 
          className={`mb-12 text-center transition-all duration-300 ${
            isWarning ? 'animate-pulse scale-105' : ''
          }`}
        >
          <div 
            className={`font-mono font-bold tracking-wider ${
              isWarning ? 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'text-red-600'
            }`}
            style={{ fontSize: 'clamp(4rem, 20vw, 12rem)', lineHeight: '1' }}
          >
            {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
          </div>
        </div>

        {!isRunning && timeLeft === 0 && (
          <div className="bg-zinc-900 rounded-lg p-8 mb-8 border border-zinc-800">
            <h2 className="text-red-500 text-2xl font-bold mb-6 text-center">Установить время</h2>
            <div className="flex gap-4 mb-6 justify-center items-end">
              <div>
                <label className="text-zinc-400 text-sm mb-2 block">Минуты</label>
                <Input
                  type="number"
                  min="0"
                  max="99"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 bg-black border-zinc-700 text-red-500 text-2xl font-mono text-center"
                />
              </div>
              <div>
                <label className="text-zinc-400 text-sm mb-2 block">Секунды</label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-24 bg-black border-zinc-700 text-red-500 text-2xl font-mono text-center"
                />
              </div>
              <Button
                onClick={handleSetTime}
                className="bg-red-600 hover:bg-red-700 text-white px-8 h-12"
              >
                <Icon name="Check" className="mr-2" size={20} />
                Установить
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          {!isRunning && timeLeft > 0 && (
            <Button
              onClick={handleStart}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white text-xl px-12 h-16"
            >
              <Icon name="Play" className="mr-2" size={24} />
              Старт
            </Button>
          )}
          
          {isRunning && (
            <Button
              onClick={handlePause}
              size="lg"
              className="bg-zinc-800 hover:bg-zinc-700 text-red-500 text-xl px-12 h-16"
            >
              <Icon name="Pause" className="mr-2" size={24} />
              Пауза
            </Button>
          )}

          {timeLeft > 0 && (
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="border-red-600 text-red-500 hover:bg-red-950 text-xl px-12 h-16"
            >
              <Icon name="RotateCcw" className="mr-2" size={24} />
              Сброс
            </Button>
          )}
        </div>

        {isWarning && (
          <div className="mt-8 text-center">
            <div className="text-red-500 text-xl font-bold animate-pulse">
              ⚠️ ВНИМАНИЕ! ⚠️
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;