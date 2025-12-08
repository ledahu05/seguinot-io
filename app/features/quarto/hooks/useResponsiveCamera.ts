import { useEffect, useState } from 'react';

interface CameraConfig {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
}

interface TrayCamera {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
}

interface ResponsiveCameraResult {
    board: CameraConfig;
    tray: TrayCamera;
}

/**
 * Hook that returns responsive camera configurations for board and piece tray.
 * Board camera: perspective view focused only on the board (tray is in separate viewport).
 * Tray camera: orthographic top-down view for clear piece selection.
 */
export function useResponsiveCamera(): ResponsiveCameraResult {
    const [config, setConfig] = useState<ResponsiveCameraResult>({
        board: {
            position: [6, 12, 6],
            target: [0, 0, 0],
            fov: 40
        },
        tray: {
            position: [0, 3, -4], // Negative Z = 180° rotation, tall pieces in back
            target: [0, 0, 0],
            fov: 55
        }
    });

    useEffect(() => {
        const updateCamera = () => {
            const width = window.innerWidth;

            if (width < 768) {
                // Mobile - board-only view, tray in separate canvas below
                setConfig({
                    board: {
                        position: [5, 10, 5],
                        target: [0, 0, 0],
                        fov: 45
                    },
                    tray: {
                        position: [0, 4, -6], // Negative Z = 180° rotation
                        target: [0, 0, 0],
                        fov: 30
                    }
                });
            } else {
                // Desktop - board centered, tray in separate canvas below
                setConfig({
                    board: {
                        position: [6, 12, 6],
                        target: [0, 0, 0],
                        fov: 40
                    },
                    tray: {
                        position: [0, 3, -4], // Negative Z = 180° rotation
                        target: [0, 0, 0],
                        fov: 55
                    }
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
