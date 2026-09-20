import { useEffect, useMemo, useState } from "react";
import TextType from "./TextType";
import "./MessageScreen.css";

const PHRASE = "I love you";

/*
============================================================
3D HEART CONFIGURATION
============================================================
*/

const HEART_SCALE = 270;

/*
  Smaller = denser.
*/
const GRID_STEP = 0.075;

/*
  Maximum number of text instances.

  ~700-900 gives a dense heart without murdering
  the browser.
*/
const MAX_PHRASES = 900;


/*
============================================================
HEART EQUATION
============================================================

This creates the classic heart silhouette.

We then give every valid point a real Z depth,
turning it into a volumetric heart.
*/

function heartEquation(x, y) {
  return (
    Math.pow(
      x * x + y * y - 1,
      3
    ) -
    x * x * Math.pow(y, 3)
  );
}


/*
============================================================
GENERATE 3D HEART
============================================================
*/

function generateHeart() {

  const points = [];

  /*
    We scan the heart on an XY plane.
  */

  for (
    let y = 1.15;
    y >= -1.15;
    y -= GRID_STEP
  ) {

    for (
      let x = -1.35;
      x <= 1.35;
      x += GRID_STEP
    ) {

      /*
        Is this point inside the heart?
      */

      if (
        heartEquation(
          x,
          y
        ) > 0
      ) {
        continue;
      }


      /*
      ========================================================
      DEPTH

      Center of heart = thickest.

      Edges = thinner.

      This is what creates the actual 3D volume.
      ========================================================
      */

      const normalizedX =
        x / 1.35;

      const normalizedY =
        y / 1.15;


      const radialDistance =
        Math.sqrt(
          normalizedX *
            normalizedX +
          normalizedY *
            normalizedY
        );


      /*
        The heart is thickest around the middle.

        We also slightly flatten the top/bottom.
      */

      const depthFactor =
        Math.pow(
          Math.max(
            0,
            1 -
              radialDistance
          ),
          0.55
        );


      const maxDepth =
        depthFactor *
        1.05;


      /*
      ========================================================
      MULTIPLE DEPTH LAYERS

      This is important.

      We're not just putting text on one flat surface.

      Each XY location gets several phrases through
      the Z axis.
      ========================================================
      */

      const layers =
        Math.max(
          1,
          Math.ceil(
            maxDepth * 3.2
          )
        );


      for (
        let layer = 0;
        layer < layers;
        layer++
      ) {

        let z;

        if (layers === 1) {

          z = 0;

        } else {

          /*
            -1 → +1 through the heart.
          */

          const depthProgress =
            layer /
            (layers - 1);

          z =
            (
              depthProgress -
              0.5
            ) *
            maxDepth *
            2;

        }


        /*
        ======================================================
        SLIGHT STAGGER

        Prevents the heart from looking like a
        perfectly aligned voxel grid.
        ======================================================
        */

        const stagger =
          (
            layer % 2
          ) *
          GRID_STEP *
          0.35;


        const finalX =
          x +
          stagger;


        /*
        ======================================================
        CENTER DISTANCE

        Used for:

        - formation
        - heartbeat ripple
        ======================================================
        */

        const centerDistance =
          Math.sqrt(
            x * x +
            y * y +
            z * z
          );


        points.push({

          x:
            finalX *
            HEART_SCALE,

          y:
            -y *
            HEART_SCALE,

          z:
            z *
            HEART_SCALE *
            0.42,

          distance:
            centerDistance,

          /*
            Tiny deterministic variation.
          */

          depth:
            z,

        });

      }

    }

  }


  /*
  ============================================================
  SORT BY DISTANCE FROM CENTER

  This means the closest phrases to the center
  get rendered first.
  ============================================================
  */

  points.sort(
    (a, b) =>
      a.distance -
      b.distance
  );


  /*
  ============================================================
  LIMIT COUNT

  Keep the heart dense but reasonable.
  ============================================================
  */

  if (
    points.length >
    MAX_PHRASES
  ) {

    /*
      Instead of just chopping off the end,
      evenly sample the entire volume.
    */

    const sampled = [];

    const step =
      points.length /
      MAX_PHRASES;


    for (
      let i = 0;
      i < MAX_PHRASES;
      i++
    ) {

      sampled.push(
        points[
          Math.floor(
            i * step
          )
        ]
      );

    }

    return sampled;
  }


  return points;
}


/*
============================================================
MESSAGE SCREEN
============================================================
*/

export default function MessageScreen() {

  const [started, setStarted] =
    useState(false);


  const heart =
    useMemo(
      () =>
        generateHeart(),
      []
    );


  /*
  ============================================================
  START
  ============================================================
  */

  useEffect(() => {

    const timer =
      setTimeout(
        () =>
          setStarted(true),
        100
      );


    return () =>
      clearTimeout(timer);

  }, []);


  return (

    <main
      className={
        `message-screen ${
          started
            ? "started"
            : ""
        }`
      }
    >

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="message-glow" />

      <div className="radial-rays" />

      <div className="heart-aura" />


      {/* ==================================================
          HUD
      ================================================== */}

      <div className="system-left">

        <div>
          LOVE_PROTOCOL.EXE
        </div>

        <div>
          &gt; DECRYPTING MESSAGE...
        </div>

      </div>


      <div className="system-right">

        <div>
          [ 100% ]
        </div>

        <div>
          [ ACCESS GRANTED ]
        </div>

        <div>
          [ OPENING... ]
        </div>

        <div>
          [ FOR YOU ] ♥
        </div>

      </div>


      {/* ==================================================
          HEART
      ================================================== */}

      <section className="heart-stage">

        <div className="heart-3d">

          <div className="heart-volume">

            {heart.map(
              (point, index) => (

                <span
                  key={index}
                  className="love-particle"

                  style={{
                    "--x":
                      `${point.x}px`,

                    "--y":
                      `${point.y}px`,

                    "--z":
                      `${point.z}px`,

                    /*
                      Distance controls when the
                      phrase appears.

                      Center = first.
                      Outside = later.
                    */

                    "--spawn-delay":
                      `${
                        point.distance *
                        0.28
                      }s`,

                    /*
                      Heartbeat ripple.

                      Center beats first.
                    */

                    "--pulse-delay":
                      `${
                        point.distance *
                        0.34
                      }s`,

                    /*
                      Depth controls brightness.
                    */

                    "--depth":
                      point.depth,

                    /*
                      Tiny variation.
                    */

                    "--index":
                      index,
                  }}
                >
                  {PHRASE}
                </span>

              )
            )}

          </div>


          {/* ==================================================
              CENTER MESSAGE
          ================================================== */}

          <div className="center-message">

            <TextType
              text="I love you."
              typingSpeed={85}
              pauseDuration={1800}
              cursorCharacter=""
              cursorBlinkDuration={0}
              showCursor={false}
              loop={false}
            />

          </div>


          {/* ==================================================
              MY HEART
          ================================================== */}

          <div className="heart-caption">
            my heart
          </div>

        </div>

      </section>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="message-footer">

        ALWAYS YOU.

        <span />

      </div>

    </main>
  );
}
