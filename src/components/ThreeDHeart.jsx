import { useEffect, useRef } from "react";
import * as THREE from "three";

const PHRASE = "I love you";

const PARTICLE_COUNT = 900;

export default function ThreeDHeart() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    /*
    ============================================================
    SCENE
    ============================================================
    */

    const scene = new THREE.Scene();


    /*
    ============================================================
    CAMERA
    ============================================================
    */

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    camera.position.set(
      0,
      0,
      8
    );


    /*
    ============================================================
    RENDERER
    ============================================================
    */

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.8)
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setClearColor(
      0x000000,
      0
    );

    container.appendChild(
      renderer.domElement
    );


    /*
    ============================================================
    CREATE "I LOVE YOU" TEXTURE
    ============================================================
    */

    const textCanvas =
      document.createElement("canvas");

    textCanvas.width = 256;
    textCanvas.height = 64;

    const textContext =
      textCanvas.getContext("2d");

    textContext.clearRect(
      0,
      0,
      256,
      64
    );

    textContext.font =
      '500 26px "JetBrains Mono", monospace';

    textContext.textAlign =
      "center";

    textContext.textBaseline =
      "middle";

    /*
      Red neon glow.
    */

    textContext.shadowColor =
      "rgba(255, 20, 60, 0.95)";

    textContext.shadowBlur = 14;

    textContext.fillStyle =
      "#ff315d";

    textContext.fillText(
      PHRASE,
      128,
      32
    );


    const textTexture =
      new THREE.CanvasTexture(
        textCanvas
      );

    textTexture.colorSpace =
      THREE.SRGBColorSpace;

    textTexture.needsUpdate = true;


    /*
    ============================================================
    HEART MATHEMATICS
    ============================================================

    The 2D heart:

      (x² + y² - 1)³ - x²y³ <= 0

    We then give it REAL Z DEPTH.

    So we're creating a volume rather than
    a flat heart.
    */

    function insideHeart(
      x,
      y
    ) {

      return (
        Math.pow(
          x * x +
            y * y -
            1,
          3
        ) -
          x * x *
            Math.pow(y, 3) <=
        0
      );
    }


    /*
    ============================================================
    CREATE 3D HEART POSITIONS
    ============================================================
    */

    const positions =
      new Float32Array(
        PARTICLE_COUNT * 3
      );

    const targetPositions =
      new Float32Array(
        PARTICLE_COUNT * 3
      );

    const randomValues =
      new Float32Array(
        PARTICLE_COUNT
      );


    /*
      We generate points INSIDE the heart.

      Not on the surface.

      This is what gives the heart actual volume.
    */

    let created = 0;

    let attempts = 0;

    while (
      created <
        PARTICLE_COUNT &&
      attempts <
        100000
    ) {

      attempts++;


      const x =
        THREE.MathUtils.randFloat(
          -1.35,
          1.35
        );

      const y =
        THREE.MathUtils.randFloat(
          -1.15,
          1.15
        );


      if (
        !insideHeart(
          x,
          y
        )
      ) {
        continue;
      }


      /*
      ==========================================================
      DEPTH

      Instead of giving every point the same
      Z depth, make the center thicker.

      This produces a rounded 3D heart.
      */

      const normalizedX =
        x / 1.35;

      const normalizedY =
        y / 1.15;


      const radial =
        Math.sqrt(
          normalizedX *
            normalizedX +
            normalizedY *
              normalizedY
        );


      /*
        Center = thick.

        Edge = thin.
      */

      const depth =
        Math.pow(
          Math.max(
            0,
            1 - radial
          ),
          0.55
        ) *
        0.72;


      const z =
        THREE.MathUtils.randFloat(
          -depth,
          depth
        );


      /*
      ==========================================================
      TARGET POSITION
      ==========================================================
      */

      const scale = 2.35;


      targetPositions[
        created * 3
      ] =
        x * scale;

      targetPositions[
        created * 3 + 1
      ] =
        y * scale;

      targetPositions[
        created * 3 + 2
      ] =
        z * scale;


      /*
      ==========================================================
      START POSITION

      Everything begins at the center.

      This gives us the exact:

                  .
                ↙ ↓ ↘
              ↙   ↓   ↘
            ❤️ HEART ❤️

      formation.
      ==========================================================
      */

      positions[
        created * 3
      ] = 0;

      positions[
        created * 3 + 1
      ] = 0;

      positions[
        created * 3 + 2
      ] = 0;


      randomValues[
        created
      ] =
        Math.random();


      created++;
    }


    /*
    ============================================================
    GEOMETRY
    ============================================================
    */

    const geometry =
      new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );


    /*
    ============================================================
    MATERIAL
    ============================================================
    */

    const material =
      new THREE.PointsMaterial({

        map:
          textTexture,

        transparent:
          true,

        alphaTest:
          0.01,

        depthWrite:
          false,

        blending:
          THREE.AdditiveBlending,

        size:
          0.23,

        sizeAttenuation:
          true,

        color:
          0xff315d,

      });


    /*
    ============================================================
    HEART OBJECT
    ============================================================
    */

    const heart =
      new THREE.Points(
        geometry,
        material
      );


    scene.add(
      heart
    );


    /*
    ============================================================
    HEART GLOW

    A very soft sprite behind the text.
    ============================================================
    */

    const glowCanvas =
      document.createElement("canvas");

    glowCanvas.width = 256;
    glowCanvas.height = 256;

    const glowContext =
      glowCanvas.getContext("2d");

    const gradient =
      glowContext.createRadialGradient(
        128,
        128,
        0,
        128,
        128,
        128
      );

    gradient.addColorStop(
      0,
      "rgba(255, 20, 60, 0.35)"
    );

    gradient.addColorStop(
      0.45,
      "rgba(255, 20, 60, 0.10)"
    );

    gradient.addColorStop(
      1,
      "rgba(255, 20, 60, 0)"
    );

    glowContext.fillStyle =
      gradient;

    glowContext.fillRect(
      0,
      0,
      256,
      256
    );


    const glowTexture =
      new THREE.CanvasTexture(
        glowCanvas
      );


    const glowMaterial =
      new THREE.SpriteMaterial({
        map:
          glowTexture,

        transparent:
          true,

        depthWrite:
          false,

        blending:
          THREE.AdditiveBlending,

        opacity:
          0.55,
      });


    const glow =
      new THREE.Sprite(
        glowMaterial
      );


    glow.scale.set(
      7,
      7,
      1
    );


    scene.add(
      glow
    );


    /*
    ============================================================
    ANIMATION
    ============================================================
    */

    const clock =
      new THREE.Clock();


    let animationFrame;


    function animate() {

      animationFrame =
        requestAnimationFrame(
          animate
        );


      const elapsed =
        clock.getElapsedTime();


      /*
      ==========================================================
      FORMATION
      ==========================================================
      */

      const formation =
        Math.min(
          elapsed / 2.4,
          1
        );


      /*
        Smooth cubic ease-out.
      */

      const eased =
        1 -
        Math.pow(
          1 - formation,
          3
        );


      /*
      ==========================================================
      PULSE
      ==========================================================
      */

      const heartbeat =
        1 +
        Math.pow(
          Math.max(
            0,
            Math.sin(
              elapsed * 3.0
            )
          ),
          12
        ) *
        0.045;


      /*
      ==========================================================
      MOVE EVERY WORD
      ==========================================================
      */

      const positionAttribute =
        geometry.attributes.position;

      const current =
        positionAttribute.array;


      for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
      ) {

        const index =
          i * 3;


        /*
          Slightly stagger the formation.

          Words nearer the outside appear
          slightly later.
        */

        const delay =
          randomValues[i] *
          0.25;


        const progress =
          THREE.MathUtils.clamp(
            (
              eased -
              delay
            ) /
              (1 - delay),
            0,
            1
          );


        const localEase =
          1 -
          Math.pow(
            1 - progress,
            3
          );


        /*
          Target heart position.
        */

        current[index] =
          THREE.MathUtils.lerp(
            0,
            targetPositions[index] *
              heartbeat,
            localEase
          );

        current[index + 1] =
          THREE.MathUtils.lerp(
            0,
            targetPositions[index + 1] *
              heartbeat,
            localEase
          );

        current[index + 2] =
          THREE.MathUtils.lerp(
            0,
            targetPositions[index + 2] *
              heartbeat,
            localEase
          );

      }


      positionAttribute.needsUpdate =
        true;


      /*
      ==========================================================
      3D ROTATION
      ==========================================================
      */

      heart.rotation.y =
        Math.sin(
          elapsed * 0.35
        ) *
        0.18;


      heart.rotation.x =
        Math.sin(
          elapsed * 0.22
        ) *
        0.045;


      /*
        Glow follows the heartbeat.
      */

      glow.scale.set(
        7 *
          heartbeat,
        7 *
          heartbeat,
        1
      );


      glowMaterial.opacity =
        0.42 +
        (
          heartbeat - 1
        ) *
        4;


      /*
      ==========================================================
      RENDER
      ==========================================================
      */

      renderer.render(
        scene,
        camera
      );
    }


    animate();


    /*
    ============================================================
    RESIZE
    ============================================================
    */

    function handleResize() {

      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();


      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio,
          1.8
        )
      );
    }


    window.addEventListener(
      "resize",
      handleResize
    );


    /*
    ============================================================
    CLEANUP
    ============================================================
    */

    return () => {

      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      geometry.dispose();

      material.dispose();

      textTexture.dispose();

      glowMaterial.dispose();

      glowTexture.dispose();

      renderer.dispose();

      if (
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };

  }, []);


  return (
    <div
      ref={containerRef}
      className="three-heart"
    />
  );
}
