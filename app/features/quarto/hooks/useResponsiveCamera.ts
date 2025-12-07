import { useEffect, useState } from 'react';

interface CameraConfig {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
}

/**
 * Hook that returns responsive camera configuration based on viewport width.
 * Mobile devices get a closer camera with wider FOV for better visibility.
 * Desktop with side panel shifts the view left to compensate for the panel.
 */
export function useResponsiveCamera(): CameraConfig {
    const [config, setConfig] = useState<CameraConfig>({
        position: [8, 8, 8],
        target: [0, 0, 0],
        fov: 45
    });

    useEffect(() => {
        const updateCamera = () => {
            const width = window.innerWidth;

            if (width < 768) {
                // Small tablet - still stacked layout
                setConfig({
                    position: [7, 7, 7],
                    target: [2.5, 0, 0],
                    fov: 55
                });
            } else {
                // Desktop with side panel - shift view left to compensate
                setConfig({
                    position: [10, 5, 10],
                    target: [2, 0, 0],
                    fov: 50
                });
            }
        };

        updateCamera();
        window.addEventListener('resize', updateCamera);
        return () => window.removeEventListener('resize', updateCamera);
    }, []);

    return config;
}

export default useResponsiveCamera;
