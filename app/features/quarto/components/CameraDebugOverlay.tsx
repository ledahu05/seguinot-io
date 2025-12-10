import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraDebugOverlayProps {
    controlsRef?: React.RefObject<OrbitControlsImpl | null>;
}

export function CameraDebugOverlay({ controlsRef }: CameraDebugOverlayProps) {
    const { camera } = useThree();
    const debugRef = useRef<HTMLDivElement>(null);

    useFrame(() => {
        if (!debugRef.current) return;

        const pos = camera.position;
        const target = controlsRef?.current?.target;
        const fov = 'fov' in camera ? (camera as { fov: number }).fov : 0;

        debugRef.current.innerHTML = `
            <div style="font-family: monospace; font-size: 11px; line-height: 1.4;">
                <div><b>pos:</b> [${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}]</div>
                ${target ? `<div><b>target:</b> [${target.x.toFixed(1)}, ${target.y.toFixed(1)}, ${target.z.toFixed(1)}]</div>` : ''}
                <div><b>fov:</b> ${fov.toFixed(0)}</div>
            </div>
        `;
    });

    return (
        <Html
            position={[0, 0, 0]}
            style={{
                position: 'fixed',
                top: '8px',
                left: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '4px',
                pointerEvents: 'none',
                zIndex: 1000,
            }}
            calculatePosition={() => [0, 0]}
        >
            <div ref={debugRef} />
        </Html>
    );
}
