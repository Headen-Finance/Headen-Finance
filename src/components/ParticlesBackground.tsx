import { useCallback } from 'react';
import * as React from 'react';
import Particles from 'react-tsparticles';
import { Engine } from 'tsparticles-engine';
import { loadLinksPreset } from 'tsparticles-preset-links';

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadLinksPreset(engine);
  }, []);
  return (
    <Particles
      className='absolute inset-0'
      id='tsparticles'
      url='/particlesjs-config.json'
      init={particlesInit}
    />
  );
}
