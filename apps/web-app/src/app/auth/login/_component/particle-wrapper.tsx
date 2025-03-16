import { ParticleBackground } from 'apps/web-app/src/components/particle-background';

export const ParticleWrapper = () => {
    return (
        <div>
            <ParticleBackground
                style={{ width: '100%', height: '100%' }}
                className='absolute inset-0 z-0 pointer-events-none'
            />
        </div>
    );
};
