import React, { useState, useEffect, useRef } from 'react';
import { Size } from '../helpers/compInterface';
import './Lake.css';
import '../container_comp/Container.css';
import { getAngle } from '../helpers/funs';
import { ICon } from '../container_comp/Container';

const Lake: React.FC<ICon> = ({ style = "lake", size, type, children }) => {
    const [initialWidth, setInitialWidth] = useState<number | undefined>(undefined);
    const [waves, setWaves] = useState<Array<{ id: string, x: number, y: number, className: string }>>([]);
    const waveIdRef = useRef<number>(0);

    useEffect(() => {
        if (size === Size.FULLSCREEN) {
            setInitialWidth(window.innerWidth);
        }
    }, [size]);

    useEffect(() => {
        let lastWaveTime = Date.now(); 
        let timeoutRef: number | null = null; 
        let prevX = 0;
        let prevY = 0;
        let prevAngle: number | null = null;
    
        const handleMouseMove = (e: MouseEvent) => {
            const newX = e.clientX;
            const newY = e.clientY;    
            const now = Date.now();
            const currentAngle = getAngle(prevX, prevY, newX, newY);
    
            if (now - lastWaveTime > 250) {
                createWave(newX, newY); 
                lastWaveTime = now; 
            } else if (prevAngle !== null) {
                const angleDiff = Math.abs(currentAngle - prevAngle);
    
                if (angleDiff > 100) {
                    if (now - lastWaveTime > 80) {
                        createWave(newX, newY); 
                        lastWaveTime = now; 
                    }
                }
            }
    
            prevX = newX;
            prevY = newY;
            prevAngle = currentAngle;
        
        };
    
        document.addEventListener('mousemove', handleMouseMove);
    
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (timeoutRef !== null) {
                clearTimeout(timeoutRef); 
            }
            prevX = 0;
            prevY = 0;
            prevAngle = null;
        };
    }, []);
    

    const createWave = (x: number, y: number) => {
        const id = waveIdRef.current++;
        setWaves((prevWaves) => [...prevWaves, { id, x, y, className: 'wave' }]);

        setTimeout(() => {
            setWaves((prevWaves) =>
                prevWaves.map((wave) =>
                    wave.id === id ? { ...wave, className: 'wave wave-move' } : wave
                )
            );
        }, 40);

        setTimeout(() => {
            setWaves((prevWaves) => prevWaves.filter(wave => wave.id !== id));
        }, 4000);
    };

    const containerStyle = initialWidth ? { width: `${initialWidth}px`} : {};

    return (
        <section 
            className={`${style}-bar ${type} ${size}`} 
            style={containerStyle} 
        >
            {waves.map((wave) => (
                <div
                    key={wave.id}
                    className={wave.className} 
                    style={{
                        left: wave.x + 'px',
                        top: wave.y + 'px'
                    }}
                />
            ))}
            {children}
        </section>
    );
};

export default Lake;