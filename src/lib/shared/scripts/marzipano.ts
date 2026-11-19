let marzipanoScriptPromise = null;

function loadMarzipanoScript() {
    if (typeof window === 'undefined') return Promise.reject('SSR not supported');
    if (window.Marzipano) return Promise.resolve(window.Marzipano);
    if (marzipanoScriptPromise) return marzipanoScriptPromise;

    marzipanoScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marzipano@0.10.2/dist/marzipano.js';
        script.async = true;
        script.onload = () => resolve(window.Marzipano);
        script.onerror = (err) => {
            marzipanoScriptPromise = null; // Reset on failure so it can retry
            reject(err);
        };
        document.head.appendChild(script);
    });

    return marzipanoScriptPromise;
}

export async function setupPanorama({ container, imageUrl, difficulty, initialView, onLoading, onReady }) {
    if (!container || !imageUrl) return () => {};

    if (onLoading) onLoading(true);

    try {
        const Marzipano = await loadMarzipanoScript();

        if (!container.isConnected) return () => {};

        const viewer = new Marzipano.Viewer(container, {
            controls: { mouseViewMode: 'drag' }
        });

        const levels = [
            { tileSize: 512, size: 512 },
            { tileSize: 512, size: 1024 },
            { tileSize: 512, size: 2048 },
            { tileSize: 512, size: 4096 },
            { tileSize: 512, size: 8192 },
            { tileSize: 512, size: 16384 }
        ];

        const geometry = new Marzipano.CubeGeometry(levels);
        const source = Marzipano.ImageUrlSource.fromString(imageUrl);

        const traditionalLimiter = Marzipano.RectilinearView.limit.traditional(
            4096,
            120 * Math.PI / 180
        );

        let limiter;
        let startView;

        let randomYaw = (Math.random() * 360 - 180) * Math.PI / 180;

        if(initialView){
            startView = initialView;
            limiter = traditionalLimiter;
        } else {
            if (difficulty === 'easy') {
                limiter = traditionalLimiter;
                startView = { yaw: randomYaw, pitch: 0, fov: 90 * Math.PI / 180 };
            } else if (difficulty === 'medium') {
                // // Wierd quirks with how marzipano wraps the image, but maybe its doable with the tiling now
                // randomYaw = (Math.random() * 270 - 135) * Math.PI / 180;
                let minYaw = randomYaw - (45 * Math.PI / 180);
                let maxYaw = randomYaw + (45 * Math.PI / 180);
                limiter = Marzipano.util.compose(
                    traditionalLimiter,
                    Marzipano.RectilinearView.limit.yaw(minYaw, maxYaw)
                );
                startView = { yaw: randomYaw, pitch: 0, fov: 90 * Math.PI / 180 };
            } else {
                limiter = Marzipano.util.compose(
                    traditionalLimiter,
                    Marzipano.RectilinearView.limit.yaw(randomYaw, randomYaw),
                    Marzipano.RectilinearView.limit.pitch(0,0)
                );
                startView = { yaw: randomYaw, pitch: 0, fov: 90 * Math.PI / 180 };
            }
        }

        const view = new Marzipano.RectilinearView(startView, limiter);

        const scene = viewer.createScene({
            source,
            geometry,
            view,
            pinFirstLevel: true
        });

        viewer.switchScene(scene, { transitionDuration: 300 }, () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (onLoading) onLoading(false);
                    if (onReady) onReady({ viewer, view });
                });
            });
        });

        return () => {
            if (viewer) {
                viewer.destroyAllScenes();
                viewer.destroy();
            }
        };
    } catch (err) {
        console.error('Failed to load or initialize Marzipano:', err);
        if (onLoading) onLoading(false);
        return () => {};
    }
}