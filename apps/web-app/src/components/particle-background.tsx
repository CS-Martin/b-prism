'use client';

import { memo, useEffect, useMemo, useState, useCallback } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { type Container, type ISourceOptions, MoveDirection, OutMode } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

interface ParticleBackgroundProps {
    style?: React.CSSProperties;
    className?: string;
}

export const ParticleBackground = memo(({ style, className }: ParticleBackgroundProps) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = useCallback(async (container?: Container): Promise<void> => {
        ('');
    }, []); // Callback is stable and will not change on re-renders

    // Using useMemo to prevent re-creating options object
    const options = useMemo<ISourceOptions>(
        () => ({
            background: {
                color: { value: 'transparent' },
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: { enable: true, mode: 'push' },
                    onHover: { enable: true, mode: 'repulse' },
                },
                modes: {
                    push: { quantity: 4 },
                    repulse: { distance: 200, duration: 0.4 },
                },
            },
            particles: {
                color: { value: '#ffffff' },
                links: {
                    color: '#ffffff',
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                },
                move: {
                    direction: MoveDirection.none,
                    enable: true,
                    outModes: { default: OutMode.out },
                    random: true,
                    speed: 3,
                    straight: false,
                },
                number: {
                    density: { enable: true, area: 800 },
                    value: 80,
                },
                opacity: { value: 0.4 },
                shape: { type: 'circle' },
                size: { value: { min: 1, max: 5 } },
            },
            detectRetina: true,
        }),
        [],
    );

    if (!init) return null;

    return (
        <div
            style={style}
            className={className}>
            <Particles
                id='tsparticles'
                options={options}
                particlesLoaded={particlesLoaded}
            />
        </div>
    );
});

ParticleBackground.displayName = 'ParticleBackground';
