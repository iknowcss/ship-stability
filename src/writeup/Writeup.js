import React from 'react'
import Markdown from 'react-remarkable'
import Latex from 'react-latex'

import ShipToy from 'src/writeup/figure/ShipToy'
import ShipGridToy from 'src/writeup/figure/ShipGridToy'
import FractalCanvasToy from 'src/writeup/figure/FractalCanvasToy'

const MD_OPTIONS = {
  typographer: true,
  //breaks: true,
  html: true
}

const DOMAIN = {
  a: { min: .05, max: .1 },
  w: { min: .8, max: 1.0 }
}

const FULL_DOMAIN = {
  a: { min: 0, max: 1 },
  w: { min: 0, max: 2 }
}

const MAX_SCALE = 7
const STEP_ITERATION_COUNT = 200
const MAX_SIM_COUNT = Math.pow(Math.pow(2, MAX_SCALE), 2)
const ITERATIONS_PS = 60*MAX_SIM_COUNT*STEP_ITERATION_COUNT;

const commaFormat = number => number.toString()
  .split('').reverse()
  .reduce((result, current, i) =>
    current +
    (i > 0 && i%3 === 0 ? ',' : '') +
    result
  , '')

export default () => <Markdown options={MD_OPTIONS}>{`

  # The Fisherman's Fractal

  Here is a fishing boat floating in the ocean. There is a large fish strapped
  to the side. Small waves cause the ship to toss to and fro.

  `}

  <figure>
    <ShipToy.AutoPause
      display={{ ship: true, capsizeColor: true, phaseColor: false }}
      simulationParams={{ a: 0.05, w: 1 }}
    />
    <figcaption>
      <b>Figure 1</b> - A fishing ship tossing in the ocean
    </figcaption>
  </figure>

  {`

  When the waves are very big they quickly capsize the ship.

  `}

  <figure>
    <ShipToy.AutoPause
      display={{ ship: true, capsizeColor: true, phaseColor: false }}
      simulationParams={{ a: 0.3, w: 1 }}
      autoReplay
    />
    <figcaption>
      <b>Figure 2</b> - Large waves quickly capsize the ship
    </figcaption>
  </figure>

  {`

  When the waves are medium-sized but have the right rhythm they push the ship
  farther and farther until it capsizes.

  `}

  <figure>
    <ShipToy.AutoPause
      display={{ ship: true, capsizeColor: true, phaseColor: false }}
      simulationParams={{ a: 0.05, w: 0.8890625 }}
      autoReplay
    />
    <figcaption>
      <b>Figure 3</b> - Small, resonant waves gradually capsize the ship
    </figcaption>
  </figure>

  {`

  This appears to be a simple system.

  * Large waves quickly capsize the ship
  * Medium waves can slowly capsize the ship if they have the right rhythm
  * Small waves never capsize the ship

  To better understand this system, we need to know how the ship responds to
  different wave sizes and wave rhythms. We will try to answer this question:

  > **Given** the ship starts at rest<br>
  > **When** it encounters waves of frequency "**F**" and amplitude "**ω**"<br>
  > **Does the ship eventually capsize?**

  We will make two assumptions:

  First, we assume there is a direct relationship between frequency
  and minimum capsize amplitude. The bigger the waves, the more likely the ship
  is to capsize. Waves above some critical size always capsize the ship.

  Second, we predict that the ship has one "natural frequency." The more
  closely the waves match this natural frequency, the smaller the waves have
  to be to capsize the ship.

  Based on these assumptions we can sketch a graph to predict of the response of
  the ship.

  <center>
    <div>
      <img
        alt="A sketch of the predicted capsize region"
        src="prediction-graph-150.jpg"
        width="100%"
        srcSet="prediction-graph-300.jpg 300w, prediction-graph-600.jpg 600w"
      />
    </div>
    <div><b>Figure 4</b> - Region of capsize; the shaded region represents wave frequencies and amplitudes that inevitably lead to capsize</div>
  </center>

  If we can calculate the boundary between the regions of "capsize" and "no
  capsize," then we can answer the question for all wave frequencies and
  amplitudes: **Does the ship eventually capsize?**

  Normally we would look to the equations of motion to solve for the boundary
  directly.

  `}

  <figure>
    {/*<Latex>{`$(\\ddot{x} = -\\beta\\dot{x}-(x-x^{2})+F \\sin(\\omega t))`}</Latex>*/}
    <Latex>{`$\\ddot{x} = -\\beta\\dot{x}-(x-x^{2})+F \\sin(\\omega t)$`}</Latex>
    <figcaption>
      <b>Equation 1</b> - Equations of motion. <i>β</i> is the damping coefficient, <i>F</i> is the wave amplitude, and <i>ω</i> is the wave frequency
    </figcaption>
  </figure>

  {`

  However, in this case our set of equations is
  [non-linear](https://en.wikipedia.org/wiki/Nonlinear_system). We can't solve
  for the boundary directly. We have to approximate the behavior of the system
  using an iterative process. We can use JavaScript to turn this process into
  a simulation.

  We will start by generating a rough picture of the capsize boundary. The
  interactive grid below contains 25 ship simulations. Each ship is identical
  and starts at rest; each one is rocked by waves of different amplitudes and
  frequencies.

  Click “<i class="mi mi-play-arrow inline-icon"></i>” to start the
  simulations.

  Toggle the switch to flip between ship mode <i class="mi mi-directions-boat inline-icon"></i> and <!--
  --><span style="color:#FF0000">c</span><!--
  --><span style="color:#FFA500">o</span><!--
  --><span style="color:#008000">l</span><!--
  --><span style="color:#0000FF">o</span><!--
  --><span style="color:#800080">r</span> mode <i class="mi mi-grid-on inline-icon"></i>.

  `}

  <figure>
    <ShipGridToy
      cols={5}
      rows={5}
      domain={DOMAIN}
    />
    <figcaption>
      <b>Figure 5</b> - 25 ship stability simulations
      <table>
        <tbody className="figure-5-table">
          <tr>
            <td><i className="mi mi-directions-boat inline-icon"/></td>
            <td>In ship mode the ship is shown tossing back and forth in the ocean. When it capsizes the square turns pink.</td>
          </tr>
          <tr>
            <td><i className="mi mi-grid-on inline-icon"/></td>
            <td>In color mode the phase of the ship is represented by a shade of gray: dark means tipping to the left, light means tipping to the right. Pink means the ship capsized.</td>
          </tr>
        </tbody>
      </table>
    </figcaption>
  </figure>

  {`

  The simulation results don't quite match our assumptions:

  * As we expected, the ship seems to respond to some frequencies more than others
  * Waves with large amplitudes are more likely to capsize the ship, but not as quickly as we expect
  * **One of the ships that we expect to capsize never does!**

  What happened?

  `}

  <center>
    <div>
      <img
        alt="The 1st and 3rd ships from the top of the 4th column capsized but the 2nd did not"
        src="unexpected-result-150.png"
        width="50%"
        srcSet="unexpected-result-300.png 300w, unexpected-result-600.png 600w"
      />
    </div>
    <div><b>Figure 5b</b> - An unexpected result: increasing the amplitude caused one of the ships not to capsize!</div>
  </center>

  {`

  One of our assumptions must be wrong. **Large waves do not necessarily capsize
  the ship**.

  We will run more simulations to get a clearer picture of the behavior of ship
  in different conditions. This time we will run 64 ship simulations. However,
  for performance reasons we can't show the ship anymore. We can only use <!--
  --><span style="color:#FF0000">c</span><!--
  --><span style="color:#FFA500">o</span><!--
  --><span style="color:#008000">l</span><!--
  --><span style="color:#0000FF">o</span><!--
  --><span style="color:#800080">r</span> mode.

  `}

  <figure>
    <FractalCanvasToy
      domain={DOMAIN}
      scale={3}
      pixelate={true}
    />
    <figcaption>
      <b>Figure 6</b> - 64 ship stability simulations.
    </figcaption>
  </figure>

  {`

  The boundary between "capsize" and "no capsize" appears not to be simple at
  all! We will continue to add more ships to the simulation to try to understand
  what is happening.

  `}

  <figure>
    <FractalCanvasToy
      domain={DOMAIN}
      scale={4}
      pixelate={true}
      />
    <figcaption>
      <b>Figure 7</b> - 256 ship stability simulations
    </figcaption>
  </figure>

  {`

  A pattern is gradually emerging, and it is surprisingly complex. To really 
  get a clear picture, we will take a much bigger leap: 
  **${commaFormat(MAX_SIM_COUNT)} ship simulations**.

  This will push the computational abilities of your browser. During each step
  of the iteration, every pixel calculates ${STEP_ITERATION_COUNT} iterations.
  At 60fps, ${commaFormat(MAX_SIM_COUNT)} simulations will go through total of
  **${commaFormat((ITERATIONS_PS/1e6).toFixed(0))} million iterations per
  second**.

  `}

  <figure>
    <FractalCanvasToy
      domain={DOMAIN}
      scale={MAX_SCALE}
      pixelate={true}
      />
    <figcaption>
      <b>Figure 8</b> - {commaFormat(MAX_SIM_COUNT)} ship stability simulations
    </figcaption>
  </figure>

  {`

  [todo]

  `}

  <figure>
    <FractalCanvasToy
      domain={DOMAIN}
      scale={MAX_SCALE}
      pixelate={true}
      colorize={true}
    />
    <figcaption>
      <b>Figure 9</b> - [todo]
    </figcaption>
  </figure>

  {`

  This is a small part of a larger capsize boundary.

  `}

  <figure>
    <FractalCanvasToy
      domain={FULL_DOMAIN}
      scale={MAX_SCALE}
      pixelate={true}
      colorize={true}
      />
    <figcaption>
      <b>Figure 9</b> - Many ship simulations across full boundary
    </figcaption>
  </figure>

  {`

`}</Markdown>
