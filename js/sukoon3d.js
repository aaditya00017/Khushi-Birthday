// Slide 5 uses the original MoonVerse 3D scene.
// The scene is initialized only when Slide 5 is opened.

// Moonverse - Interactive 3D Moon Visualization
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, water, moon, composer, controls;
let starShaderMat, auroraMat, shootingStars = [];
let starHeadTex;
let birds = [], fishes = [];
let fishMat;

function initSukoon3D() {

    // Setup renderer with high-performance settings
    const container = document.getElementById('sukoon3d');

    if (!container) return;

    renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
        alpha: false
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        container.clientWidth || window.innerWidth,
        container.clientHeight || window.innerHeight
    );

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.appendChild(renderer.domElement);


    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x010206);

    scene.fog = new THREE.FogExp2(
        0x010206,
        0.00028
    );


    camera = new THREE.PerspectiveCamera(
        55,
        (container.clientWidth || window.innerWidth) /
        (container.clientHeight || window.innerHeight),
        1,
        30000
    );

    camera.position.set(0, 90, 300);


    /* =====================================================
       LOADING MANAGER
       ===================================================== */

    const manager = new THREE.LoadingManager();

    manager.onLoad = () => {

        // Hide Sukoon loading screen
        const loader =
            document.getElementById('sukoonLoader');

        if (loader) {

            loader.style.opacity = '0';

            setTimeout(() => {

                loader.style.display = 'none';

            }, 1000);

        }


        // Show Sukoon written content
        const ui =
            document.getElementById('sukoonUI');

        if (ui) {

            ui.style.opacity = '1';
            ui.style.visibility = 'visible';

        }

    };


    // Force loading complete after 2 seconds
    setTimeout(() => {

        manager.onLoad();

    }, 2000);


    const textureLoader =
        new THREE.TextureLoader(manager);


    /* =====================================================
       LIGHTING
       ===================================================== */

    const ambientLight =
        new THREE.AmbientLight(
            0x203040,
            0.5
        );

    scene.add(ambientLight);


    const moonLight =
        new THREE.DirectionalLight(
            0x55aaff,
            2.0
        );

    scene.add(moonLight);


    /* =====================================================
       HORIZON
       ===================================================== */

    const horizonCanvas =
        document.createElement('canvas');

    horizonCanvas.width = 1024;
    horizonCanvas.height = 512;

    const hCtx =
        horizonCanvas.getContext('2d');

    const hGrad =
        hCtx.createLinearGradient(
            0,
            512,
            0,
            0
        );

    hGrad.addColorStop(
        0,
        'rgba(255, 140, 40, 0.6)'
    );

    hGrad.addColorStop(
        0.2,
        'rgba(150, 70, 20, 0.3)'
    );

    hGrad.addColorStop(
        0.5,
        'rgba(20, 30, 80, 0.1)'
    );

    hGrad.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
    );

    hCtx.fillStyle = hGrad;

    hCtx.fillRect(
        0,
        0,
        1024,
        512
    );


    const horizonMat =
        new THREE.SpriteMaterial({

            map:
                new THREE.CanvasTexture(
                    horizonCanvas
                ),

            transparent: true,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    const horizon =
        new THREE.Sprite(
            horizonMat
        );

    horizon.scale.set(
        30000,
        6000,
        1
    );

    horizon.position.set(
        0,
        1500,
        -8000
    );

    scene.add(horizon);


    /* =====================================================
       MOON
       ===================================================== */

    const moonCanvas =
        document.createElement('canvas');

    moonCanvas.width = 512;
    moonCanvas.height = 512;

    const mCtx =
        moonCanvas.getContext('2d');


    const mGlow =
        mCtx.createRadialGradient(
            256,
            256,
            150,
            256,
            256,
            256
        );

    mGlow.addColorStop(
        0,
        'rgba(200, 220, 255, 0.25)'
    );

    mGlow.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
    );

    mCtx.fillStyle = mGlow;

    mCtx.fillRect(
        0,
        0,
        512,
        512
    );


    mCtx.fillStyle = '#ffffff';

    mCtx.beginPath();

    mCtx.arc(
        256,
        256,
        200,
        0,
        Math.PI * 2
    );

    mCtx.fill();


    mCtx.globalCompositeOperation =
        'destination-out';

    mCtx.beginPath();

    mCtx.arc(
        205,
        205,
        195,
        0,
        Math.PI * 2
    );

    mCtx.fill();

    mCtx.globalCompositeOperation =
        'source-over';


    const moonMat =
        new THREE.SpriteMaterial({

            map:
                new THREE.CanvasTexture(
                    moonCanvas
                ),

            transparent: true,

            color:
                new THREE.Color(
                    1.8,
                    2.0,
                    2.3
                ),

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    moon =
        new THREE.Sprite(
            moonMat
        );

    moon.scale.set(
        1200,
        1200,
        1
    );

    moon.position.set(
        1600,
        1500,
        -4800
    );

    moonMat.rotation =
        Math.PI / 6.5;

    scene.add(moon);


    /* =====================================================
       STAR
       ===================================================== */

    const starCanvas =
        document.createElement('canvas');

    starCanvas.width = 1024;
    starCanvas.height = 1024;

    const sCtx =
        starCanvas.getContext('2d');


    const sGrad =
        sCtx.createRadialGradient(
            512,
            512,
            0,
            512,
            512,
            512
        );


    sGrad.addColorStop(
        0,
        'rgba(255, 255, 255, 1)'
    );

    sGrad.addColorStop(
        0.05,
        'rgba(150, 220, 255, 0.9)'
    );

    sGrad.addColorStop(
        0.2,
        'rgba(50, 150, 255, 0.4)'
    );

    sGrad.addColorStop(
        0.5,
        'rgba(0, 50, 255, 0.1)'
    );

    sGrad.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
    );


    sCtx.fillStyle = sGrad;

    sCtx.fillRect(
        0,
        0,
        1024,
        1024
    );


    sCtx.save();

    sCtx.translate(
        512,
        512
    );

    sCtx.rotate(
        Math.PI / 5
    );


    sCtx.fillStyle =
        'rgba(150, 220, 255, 0.55)';

    sCtx.fillRect(
        -320,
        -2,
        640,
        4
    );


    sCtx.fillStyle =
        'rgba(255, 255, 255, 0.9)';

    sCtx.fillRect(
        -140,
        -1,
        280,
        2
    );


    sCtx.fillStyle =
        'rgba(100, 180, 255, 0.45)';

    sCtx.fillRect(
        -2,
        -140,
        4,
        280
    );

    sCtx.restore();


    const brightStarMat =
        new THREE.SpriteMaterial({

            map:
                new THREE.CanvasTexture(
                    starCanvas
                ),

            color:
                new THREE.Color(
                    2.0,
                    2.5,
                    3.0
                ),

            transparent: true,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    const brightStar =
        new THREE.Sprite(
            brightStarMat
        );


    brightStar.scale.set(
        1800,
        1800,
        1
    );


    brightStar.position.set(
        -2200,
        1900,
        -6200
    );


    scene.add(brightStar);


    const moonGlowMat =
        new THREE.SpriteMaterial({

            map:
                brightStarMat.map,

            color:
                new THREE.Color(
                    0.1,
                    0.3,
                    0.8
                ),

            transparent: true,

            opacity: 0.5,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    const moonGlow =
        new THREE.Sprite(
            moonGlowMat
        );


    moonGlow.scale.set(
        2600,
        2600,
        1
    );


    moonGlow.position.copy(
        moon.position
    );


    scene.add(moonGlow);


    moonLight.position.copy(
        brightStar.position
    );


    /* =====================================================
       STARS
       ===================================================== */

    const starsGeo =
        new THREE.BufferGeometry();

    const starsCount = 18000;

    const posArray =
        new Float32Array(
            starsCount * 3
        );

    const sizesArray =
        new Float32Array(
            starsCount
        );

    const colorsArray =
        new Float32Array(
            starsCount * 3
        );


    for (
        let i = 0;
        i < starsCount;
        i++
    ) {

        let x, y, z;


        if (i < 6000) {

            const mx =
                (Math.random() - 0.5)
                * 18000;

            const my =
                (Math.random() - 0.5)
                * 4500;

            const angle =
                Math.PI / 3.5;


            x =
                mx * Math.cos(angle)
                -
                my * Math.sin(angle)
                -
                2000;


            y =
                mx * Math.sin(angle)
                +
                my * Math.cos(angle)
                +
                3000;


            z =
                -5000 -
                Math.random() * 4000;


            colorsArray[i * 3] =
                0.4 +
                Math.random() * 0.4;

            colorsArray[i * 3 + 1] =
                0.7 +
                Math.random() * 0.3;

            colorsArray[i * 3 + 2] =
                1.0;

        } else {

            const r =
                7000 +
                Math.random() * 5000;

            const theta =
                2 *
                Math.PI *
                Math.random();

            const phi =
                Math.acos(
                    (Math.random() * 2) - 1
                );


            x =
                r *
                Math.sin(phi) *
                Math.cos(theta);


            y =
                Math.abs(
                    r *
                    Math.cos(phi)
                ) +
                100;


            z =
                r *
                Math.sin(phi) *
                Math.sin(theta);


            if (Math.random() > 0.8) {

                colorsArray[i * 3] = 0.9;
                colorsArray[i * 3 + 1] = 0.8;
                colorsArray[i * 3 + 2] = 1.0;

            } else {

                colorsArray[i * 3] = 1.0;
                colorsArray[i * 3 + 1] = 1.0;
                colorsArray[i * 3 + 2] = 1.0;

            }

        }


        posArray[i * 3] = x;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = z;

        sizesArray[i] =
            1.0 +
            Math.random() * 4.5;

    }


    starsGeo.setAttribute(
        'color',
        new THREE.BufferAttribute(
            colorsArray,
            3
        )
    );

    starsGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(
            posArray,
            3
        )
    );

    starsGeo.setAttribute(
        'aSize',
        new THREE.BufferAttribute(
            sizesArray,
            1
        )
    );


    starShaderMat =
        new THREE.ShaderMaterial({

            uniforms: {
                time: {
                    value: 0
                }
            },


            vertexShader: `

                attribute float aSize;
                attribute vec3 color;

                varying float vAlpha;
                varying vec3 vColor;

                uniform float time;


                void main() {

                    vec4 mvPosition =
                        modelViewMatrix *
                        vec4(position, 1.0);

                    gl_Position =
                        projectionMatrix *
                        mvPosition;

                    gl_PointSize =
                        aSize *
                        (400.0 / -mvPosition.z);

                    vAlpha =
                        0.4 +
                        0.6 *
                        sin(
                            time * 1.8 +
                            position.x * 120.0 +
                            position.y * 30.0
                        );

                    vColor = color;

                }

            `,


            fragmentShader: `

                varying vec3 vColor;
                varying float vAlpha;


                void main() {

                    float dist =
                        length(
                            gl_PointCoord -
                            vec2(0.5)
                        );

                    if (dist > 0.5)
                        discard;


                    gl_FragColor =
                        vec4(
                            vColor,
                            vAlpha *
                            (1.0 - dist * 2.0)
                        );

                }

            `,


            transparent: true,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    const starsMesh =
        new THREE.Points(
            starsGeo,
            starShaderMat
        );

    scene.add(starsMesh);


    /* =====================================================
       AURORA
       ===================================================== */

    const auroraGeo =
        new THREE.CylinderGeometry(
            7600,
            9000,
            2800,
            180,
            80,
            true
        );


    auroraMat =
        new THREE.ShaderMaterial({

            uniforms: {
                time: {
                    value: 0
                }
            },


            vertexShader: `

                varying vec2 vUv;
                varying float vNoise;
                varying float vHeightFactor;

                uniform float time;


                float hash(vec2 p) {

                    return fract(
                        sin(
                            dot(
                                p,
                                vec2(
                                    127.1,
                                    311.7
                                )
                            )
                        ) *
                        43758.5453123
                    );

                }


                float noise(vec2 p) {

                    vec2 i =
                        floor(p);

                    vec2 f =
                        fract(p);

                    vec2 u =
                        f * f *
                        (3.0 - 2.0 * f);


                    return mix(
                        mix(
                            hash(
                                i +
                                vec2(
                                    0.0,
                                    0.0
                                )
                            ),
                            hash(
                                i +
                                vec2(
                                    1.0,
                                    0.0
                                )
                            ),
                            u.x
                        ),

                        mix(
                            hash(
                                i +
                                vec2(
                                    0.0,
                                    1.0
                                )
                            ),
                            hash(
                                i +
                                vec2(
                                    1.0,
                                    1.0
                                )
                            ),
                            u.x
                        ),

                        u.y
                    );

                }


                void main() {

                    vUv = uv;

                    vec3 pos =
                        position;


                    float angle =
                        atan(
                            pos.z,
                            pos.x
                        );


                    float n =
                        noise(
                            vec2(
                                angle * 3.0 +
                                time * 0.04,

                                pos.y * 0.0008 -
                                time * 0.02
                            )
                        );


                    n +=
                        0.4 *
                        noise(
                            vec2(
                                angle * 7.5 -
                                time * 0.07,

                                pos.y * 0.002 +
                                time * 0.03
                            )
                        );


                    n +=
                        0.15 *
                        noise(
                            vec2(
                                angle * 16.0 +
                                time * 0.12,

                                uv.y * 4.0
                            )
                        );


                    vNoise = n;

                    vHeightFactor =
                        uv.y;


                    float waveX =
                        sin(
                            angle * 4.0 +
                            time * 0.12
                        ) *
                        500.0;


                    float waveZ =
                        cos(
                            angle * 2.5 -
                            time * 0.08
                        ) *
                        500.0;


                    pos.x +=
                        sin(angle) *
                        n *
                        650.0 +
                        waveX *
                        uv.y;


                    pos.z +=
                        cos(angle) *
                        n *
                        650.0 +
                        waveZ *
                        uv.y;


                    pos.y +=
                        sin(
                            angle * 2.5 +
                            time * 0.18
                        ) *
                        180.0 *
                        (1.0 - uv.y);


                    gl_Position =
                        projectionMatrix *
                        modelViewMatrix *
                        vec4(
                            pos,
                            1.0
                        );

                }

            `,


            fragmentShader: `

                varying vec2 vUv;
                varying float vNoise;
                varying float vHeightFactor;

                uniform float time;


                void main() {

                    float verticalFade =
                        smoothstep(
                            0.0,
                            0.08,
                            vHeightFactor
                        ) *
                        smoothstep(
                            1.0,
                            0.45,
                            vHeightFactor
                        );


                    float angle =
                        vUv.x *
                        6.28318530718;


                    float halfSideFade =
                        smoothstep(
                            0.0,
                            0.25,
                            angle
                        ) *
                        smoothstep(
                            3.14159265359,
                            2.4,
                            angle
                        );


                    vec3 baseDeepGreen =
                        vec3(
                            0.00,
                            0.18,
                            0.08
                        );


                    vec3 brightGreen =
                        vec3(
                            0.02,
                            0.85,
                            0.38
                        );


                    vec3 softTeal =
                        vec3(
                            0.01,
                            0.45,
                            0.65
                        );


                    vec3 deepViolet =
                        vec3(
                            0.25,
                            0.02,
                            0.60
                        );


                    vec3 topMagenta =
                        vec3(
                            0.55,
                            0.01,
                            0.32
                        );


                    vec3 colorStructure;


                    if (vHeightFactor < 0.12) {

                        colorStructure =
                            mix(
                                baseDeepGreen,
                                brightGreen,
                                smoothstep(
                                    0.0,
                                    0.12,
                                    vHeightFactor
                                )
                            );

                    } else if (vHeightFactor < 0.45) {

                        colorStructure =
                            mix(
                                brightGreen,
                                softTeal,
                                smoothstep(
                                    0.12,
                                    0.45,
                                    vHeightFactor
                                )
                            );

                    } else if (vHeightFactor < 0.78) {

                        colorStructure =
                            mix(
                                softTeal,
                                deepViolet,
                                smoothstep(
                                    0.45,
                                    0.78,
                                    vHeightFactor
                                )
                            );

                    } else {

                        colorStructure =
                            mix(
                                deepViolet,
                                topMagenta,
                                smoothstep(
                                    0.78,
                                    1.0,
                                    vHeightFactor
                                )
                            );

                    }


                    float ray1 =
                        sin(
                            vUv.x * 320.0 +
                            time * 0.6
                        ) *
                        cos(
                            vUv.x * 160.0 -
                            time * 0.3
                        );


                    float ray2 =
                        sin(
                            vUv.x * 640.0 -
                            time * 1.1
                        ) *
                        0.4;


                    float ray3 =
                        sin(
                            vUv.x * 110.0 +
                            time * 0.2
                        ) *
                        0.3;


                    float curtainRays =
                        smoothstep(
                            -0.4,
                            0.6,
                            ray1 +
                            ray2 +
                            ray3
                        ) *
                        0.75;


                    float baseNoise =
                        smoothstep(
                            0.05,
                            0.55,
                            vNoise
                        );


                    float intensity =
                        baseNoise *
                        verticalFade *
                        halfSideFade;


                    intensity *=
                        (
                            0.35 +
                            curtainRays *
                            smoothstep(
                                0.08,
                                1.0,
                                vHeightFactor
                            ) *
                            1.8
                        );


                    gl_FragColor =
                        vec4(
                            colorStructure * 1.1,
                            intensity * 0.24
                        );

                }

            `,


            transparent: true,

            blending:
                THREE.AdditiveBlending,

            side:
                THREE.DoubleSide,

            depthWrite: false

        });


    const auroraMesh =
        new THREE.Mesh(
            auroraGeo,
            auroraMat
        );


    auroraMesh.position.set(
        -2400,
        1950,
        -2000
    );


    auroraMesh.rotation.y =
        Math.PI * 1.52;


    scene.add(auroraMesh);


    /* =====================================================
       TERRAIN
       ===================================================== */

    const mountGeo =
        new THREE.PlaneGeometry(
            16000,
            16000,
            256,
            256
        );


    mountGeo.rotateX(
        -Math.PI / 2
    );


    const pos =
        mountGeo.attributes.position;


    function smoothstep(
        min,
        max,
        value
    ) {

        var x =
            Math.max(
                0,
                Math.min(
                    1,
                    (value - min) /
                    (max - min)
                )
            );

        return x * x *
            (3 - 2 * x);

    }


    for (
        let i = 0;
        i < pos.count;
        i++
    ) {

        const x =
            pos.getX(i);

        const z =
            pos.getZ(i);

        const dist =
            Math.sqrt(
                x * x +
                z * z
            );


        let y = 0;


        y +=
            Math.sin(
                x * 0.0004
            ) *
            Math.cos(
                z * 0.0004
            ) *
            500;


        y +=
            Math.sin(
                x * 0.0015 +
                z * 0.002
            ) *
            150;


        y +=
            Math.sin(
                x * 0.005
            ) *
            Math.cos(
                z * 0.005
            ) *
            50;


        let mask =
            smoothstep(
                800,
                5000,
                dist
            );


        if (z > 500)
            mask *= 0.15;


        y *= mask;

        y -= 80;


        y +=
            Math.max(
                0,
                Math.sin(
                    x * 0.0002
                ) *
                Math.cos(
                    z * 0.0002
                ) *
                300 *
                smoothstep(
                    3000,
                    8000,
                    dist
                )
            );


        if (y > 0) {

            y +=
                Math.pow(
                    y * 0.02,
                    1.2
                );

        }


        pos.setY(
            i,
            y
        );

    }


    mountGeo.computeVertexNormals();


    const mountMat =
        new THREE.MeshStandardMaterial({

            color: 0x010306,

            roughness: 0.95,

            metalness: 0.05,

            flatShading: false

        });


    const mountains =
        new THREE.Mesh(
            mountGeo,
            mountMat
        );


    scene.add(mountains);


    /* =====================================================
       WATER
       ===================================================== */

    const waterGeometry =
        new THREE.PlaneGeometry(
            25000,
            25000
        );


    const canvas =
        document.createElement('canvas');

    canvas.width = 512;
    canvas.height = 512;


    const ctx =
        canvas.getContext('2d');


    for (
        let i = 0;
        i < 512;
        i += 32
    ) {

        for (
            let j = 0;
            j < 512;
            j += 32
        ) {

            ctx.fillStyle =
                `rgb(
                    ${128 + Math.random() * 30},
                    ${128 + Math.random() * 30},
                    255
                )`;


            ctx.fillRect(
                i,
                j,
                32,
                32
            );

        }

    }


    const waterNormals =
        new THREE.CanvasTexture(
            canvas
        );


    waterNormals.wrapS =
        waterNormals.wrapT =
        THREE.RepeatWrapping;


    water =
        new Water(
            waterGeometry,
            {

                textureWidth: 512,

                textureHeight: 512,

                waterNormals:
                    waterNormals,

                sunDirection:
                    new THREE.Vector3()
                        .copy(
                            moonLight.position
                        )
                        .normalize(),

                sunColor:
                    0xbbddff,

                waterColor:
                    0x00081a,

                distortionScale:
                    0.4,

                fog:
                    scene.fog !== undefined

            }
        );


    water.rotation.x =
        -Math.PI / 2;


    water.position.y =
        -5;


    scene.add(water);


    /* =====================================================
       POST PROCESSING
       ===================================================== */

    const renderScene =
        new RenderPass(
            scene,
            camera
        );


    const bloomPass =
        new UnrealBloomPass(
            new THREE.Vector2(
                container.clientWidth ||
                window.innerWidth,

                container.clientHeight ||
                window.innerHeight
            ),

            1.5,
            0.4,
            0.85
        );


    bloomPass.threshold =
        0.15;

    bloomPass.strength =
        1.3;

    bloomPass.radius =
        1.0;


    composer =
        new EffectComposer(
            renderer
        );


    composer.addPass(
        renderScene
    );

    composer.addPass(
        bloomPass
    );


    /* =====================================================
       CAMERA CONTROLS
       ===================================================== */

    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );


    controls.maxPolarAngle =
        Math.PI / 2 + 0.02;


    controls.minPolarAngle =
        Math.PI / 3;


    controls.minDistance =
        50;


    controls.maxDistance =
        1200;


    controls.enablePan =
        false;


    controls.enableDamping =
        true;


    controls.dampingFactor =
        0.04;


    controls.target.set(
        -150,
        90,
        -500
    );


    controls.update();


    /* =====================================================
       SHOOTING STAR TEXTURE
       ===================================================== */

    const starHeadCanvas =
        document.createElement('canvas');

    starHeadCanvas.width = 64;
    starHeadCanvas.height = 64;


    const starHeadCtx =
        starHeadCanvas.getContext('2d');


    const starHeadGrad =
        starHeadCtx.createRadialGradient(
            32,
            32,
            0,
            32,
            32,
            32
        );


    starHeadGrad.addColorStop(
        0,
        'rgba(255, 255, 255, 1)'
    );

    starHeadGrad.addColorStop(
        0.1,
        'rgba(150, 200, 255, 0.8)'
    );

    starHeadGrad.addColorStop(
        0.4,
        'rgba(50, 120, 255, 0.3)'
    );

    starHeadGrad.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
    );


    starHeadCtx.fillStyle =
        starHeadGrad;


    starHeadCtx.fillRect(
        0,
        0,
        64,
        64
    );


    starHeadTex =
        new THREE.CanvasTexture(
            starHeadCanvas
        );


    /* =====================================================
       FISH
       ===================================================== */

    const fishCanvas =
        document.createElement('canvas');

    fishCanvas.width = 32;
    fishCanvas.height = 32;


    const fishCtx =
        fishCanvas.getContext('2d');


    const fishGrad =
        fishCtx.createRadialGradient(
            16,
            16,
            0,
            16,
            16,
            16
        );


    fishGrad.addColorStop(
        0,
        'rgba(100, 255, 200, 0.6)'
    );

    fishGrad.addColorStop(
        0.3,
        'rgba(50, 200, 150, 0.3)'
    );

    fishGrad.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
    );


    fishCtx.fillStyle =
        fishGrad;


    fishCtx.fillRect(
        0,
        0,
        32,
        32
    );


    fishMat =
        new THREE.SpriteMaterial({

            map:
                new THREE.CanvasTexture(
                    fishCanvas
                ),

            color:
                0xffffff,

            transparent:
                true,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    for (
        let i = 0;
        i < 150;
        i++
    ) {

        createFish();

    }


    window.addEventListener(
        'resize',
        onWindowResize
    );

}


/* =========================================================
   SHOOTING STARS
   ========================================================= */

function createShootingStar() {

    const startX =
        (Math.random() - 0.5) *
        8000;


    const startY =
        2000 +
        Math.random() * 1500;


    const startZ =
        (Math.random() - 0.5) *
        8000;


    const geo =
        new THREE.BufferGeometry();


    const pos =
        new Float32Array(6);


    pos[0] =
        startX;

    pos[1] =
        startY;

    pos[2] =
        startZ;

    pos[3] =
        startX;

    pos[4] =
        startY;

    pos[5] =
        startZ;


    geo.setAttribute(
        'position',
        new THREE.BufferAttribute(
            pos,
            3
        )
    );


    const colors =
        new Float32Array([

            0,
            0,
            0,

            1,
            1,
            1

        ]);


    geo.setAttribute(
        'color',
        new THREE.BufferAttribute(
            colors,
            3
        )
    );


    const mat =
        new THREE.LineBasicMaterial({

            vertexColors:
                true,

            transparent:
                true,

            opacity:
                1,

            blending:
                THREE.AdditiveBlending

        });


    const line =
        new THREE.Line(
            geo,
            mat
        );


    scene.add(line);


    const spriteMat =
        new THREE.SpriteMaterial({

            map:
                starHeadTex,

            color:
                0xaaccff,

            transparent:
                true,

            blending:
                THREE.AdditiveBlending

        });


    const head =
        new THREE.Sprite(
            spriteMat
        );


    head.scale.set(
        100,
        100,
        1
    );


    head.position.set(
        startX,
        startY,
        startZ
    );


    scene.add(head);


    const speed =
        70 +
        Math.random() * 50;


    const dirX =
        (Math.random() - 0.5) *
        0.8;


    const dirY =
        -0.3 -
        Math.random() * 0.4;


    const dirZ =
        (Math.random() - 0.5) *
        0.8;


    shootingStars.push({

        mesh:
            line,

        head:
            head,

        speed:
            speed,

        dir:
            new THREE.Vector3(
                dirX,
                dirY,
                dirZ
            ).normalize(),

        life:
            1.0

    });

}


/* =========================================================
   BIRDS
   ========================================================= */

function createBird() {

    const birdGeo =
        new THREE.BufferGeometry();


    const vertices =
        new Float32Array([

            0,
            0,
            0,

            -10,
            3,
            -5,

            10,
            3,
            -5

        ]);


    birdGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(
            vertices,
            3
        )
    );


    birdGeo.setIndex([
        0,
        1,
        0,
        2
    ]);


    const mat =
        new THREE.LineBasicMaterial({

            color:
                0x010204,

            transparent:
                true,

            opacity:
                0.8

        });


    const bird =
        new THREE.LineSegments(
            birdGeo,
            mat
        );


    const angle =
        Math.random() *
        Math.PI *
        2;


    const radius =
        1500 +
        Math.random() *
        1000;


    const startX =
        Math.cos(angle) *
        radius;


    const startZ =
        Math.sin(angle) *
        radius;


    const startY =
        200 +
        Math.random() *
        400;


    bird.position.set(
        startX,
        startY,
        startZ
    );


    scene.add(bird);


    birds.push({

        mesh:
            bird,

        speedX:
            -Math.cos(angle) *
            (
                8 +
                Math.random() * 10
            ),

        speedZ:
            -Math.sin(angle) *
            (
                8 +
                Math.random() * 10
            ),

        speedY:
            (
                Math.random() - 0.5
            ) *
            1.5,

        wingSpeed:
            0.1 +
            Math.random() * 0.1,

        flapOffset:
            Math.random() *
            Math.PI *
            2

    });

}


/* =========================================================
   FISH
   ========================================================= */

function createFish() {

    const fish =
        new THREE.Sprite(
            fishMat
        );


    const scale =
        3 +
        Math.random() * 8;


    fish.scale.set(
        scale,
        scale,
        1
    );


    const r =
        30 +
        Math.random() * 1200;


    const theta =
        Math.random() *
        Math.PI *
        2;


    const y =
        -1 -
        Math.random() * 10;


    fish.position.set(
        r * Math.cos(theta),
        y,
        r * Math.sin(theta)
    );


    scene.add(fish);


    fishes.push({

        mesh:
            fish,

        baseY:
            y,

        speed:
            0.2 +
            Math.random() * 0.8,

        angle:
            Math.random() *
            Math.PI *
            2,

        turnSpeed:
            (
                Math.random() - 0.5
            ) *
            0.02

    });

}


/* =========================================================
   RESIZE
   ========================================================= */

function onWindowResize() {

    camera.aspect =
        (
            container.clientWidth ||
            window.innerWidth
        ) /
        (
            container.clientHeight ||
            window.innerHeight
        );


    camera.updateProjectionMatrix();


    renderer.setSize(
        container.clientWidth ||
        window.innerWidth,

        container.clientHeight ||
        window.innerHeight
    );


    composer.setSize(
        window.innerWidth,
        window.innerHeight
    );

}


/* =========================================================
   ANIMATION
   ========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const time =
        performance.now() *
        0.001;


    water.material.uniforms[
        'time'
    ].value +=
        1.0 / 60.0;


    moon.rotation.y =
        time * 0.01;


    if (starShaderMat) {

        starShaderMat
            .uniforms
            .time
            .value =
            time;

    }


    if (auroraMat) {

        auroraMat
            .uniforms
            .time
            .value =
            time;

    }


    controls.update();


    if (
        Math.random() <
        0.02
    ) {

        createShootingStar();

    }


    /* =====================================================
       SHOOTING STARS
       ===================================================== */

    for (
        let i =
            shootingStars.length - 1;

        i >= 0;

        i--
    ) {

        const star =
            shootingStars[i];


        star.life -=
            0.012;


        if (
            star.life <= 0
        ) {

            scene.remove(
                star.mesh
            );


            star.mesh.geometry.dispose();


            star.mesh.material.dispose();


            scene.remove(
                star.head
            );


            star.head.material.dispose();


            shootingStars.splice(
                i,
                1
            );


            continue;

        }


        const positions =
            star.mesh
                .geometry
                .attributes
                .position
                .array;


        positions[3] +=
            star.dir.x *
            star.speed;


        positions[4] +=
            star.dir.y *
            star.speed;


        positions[5] +=
            star.dir.z *
            star.speed;


        const tailLength =
            600 *
            (
                1.0 -
                Math.pow(
                    1.0 -
                    star.life,
                    3
                )
            );


        positions[0] =
            positions[3] -
            star.dir.x *
            tailLength;


        positions[1] =
            positions[4] -
            star.dir.y *
            tailLength;


        positions[2] =
            positions[5] -
            star.dir.z *
            tailLength;


        star.mesh
            .geometry
            .attributes
            .position
            .needsUpdate =
            true;


        star.head.position.set(
            positions[3],
            positions[4],
            positions[5]
        );


        const opacity =
            Math.max(
                0,
                star.life * 1.5
            );


        star.mesh.material.opacity =
            opacity;


        star.head.material.opacity =
            opacity;

    }


    /* =====================================================
       BIRDS
       ===================================================== */

    if (
        Math.random() <
        0.005
    ) {

        createBird();

    }


    for (
        let i =
            birds.length - 1;

        i >= 0;

        i--
    ) {

        const bird =
            birds[i];


        bird.mesh.position.x +=
            bird.speedX;


        bird.mesh.position.y +=
            bird.speedY;


        bird.mesh.position.z +=
            bird.speedZ;


        const flap =
            Math.sin(
                time *
                bird.wingSpeed *
                100 +
                bird.flapOffset
            ) *
            6;


        const pos =
            bird.mesh
                .geometry
                .attributes
                .position
                .array;


        pos[4] =
            flap;


        pos[7] =
            flap;


        bird.mesh
            .geometry
            .attributes
            .position
            .needsUpdate =
            true;


        if (
            bird.mesh.position.lengthSq()
            >
            25000000
        ) {

            scene.remove(
                bird.mesh
            );


            bird.mesh.geometry.dispose();


            bird.mesh.material.dispose();


            birds.splice(
                i,
                1
            );

        }

    }


    /* =====================================================
       FISH
       ===================================================== */

    for (
        let i = 0;
        i < fishes.length;
        i++
    ) {

        const fish =
            fishes[i];


        fish.angle +=
            fish.turnSpeed;


        fish.mesh.position.x +=
            Math.cos(
                fish.angle
            ) *
            fish.speed;


        fish.mesh.position.z +=
            Math.sin(
                fish.angle
            ) *
            fish.speed;


        fish.mesh.position.y =
            fish.baseY +
            Math.sin(
                time * 2 +
                i
            ) *
            1.5;


        const dist =
            Math.sqrt(
                fish.mesh.position.x **
                2 +

                fish.mesh.position.z **
                2
            );


        if (
            dist > 1500
        ) {

            fish.angle +=
                Math.PI;

        }

    }


    composer.render();

}


/* =========================================================
   START SUKOON
   ========================================================= */

let started = false;

window.initSukoon3D =
    function () {

        if (started)
            return;


        started = true;


        try {

            initSukoon3D();

            animate();

        } catch (err) {

            console.error(
                "Sukoon 3D initialization failed:",
                err
            );


            const loader =
                document.getElementById(
                    "sukoonLoader"
                );


            if (loader) {

                loader.innerHTML =
                    '<div style="font-size:13px;letter-spacing:2px">3D scene could not start</div>';

            }

        }

    };