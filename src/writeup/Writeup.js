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

export default () => <Markdown options={MD_OPTIONS}>{`

  # The Fisherman's Fractal

  Here is a fishing boat in the ocean. There is a large fish strapped to the
  side.

  `}

  <figure>
    <ShipToy
      display={{ ship: true, capsizeColor: true, phaseColor: false }}
      simulationParams={{ a: 0.05, w: 1 }}
    />
    <figcaption>
      <b>Figure 1</b> - A fishing ship tossing in the ocean
    </figcaption>
  </figure>

  {`

  When the ocean waves are very big they capsize the ship

  `}

  <figure>
    <ShipToy
      display={{ ship: true, capsizeColor: true, phaseColor: false }}
      simulationParams={{ a: 0.3, w: 1 }}
      autoReplay={true}
    />
    <figcaption>
      <b>Figure 2</b> - Large waves quickly capsize the ship
    </figcaption>
  </figure>

  {`

  When the ocean waves are small but have the right frequency they push the ship farther and farther until it capsizes.

  `}

  <figure>
    <ShipToy
      display={{ ship: true, capsizeColor: true, phaseColor: false }}
      simulationParams={{ a: 0.05, w: 0.8890625 }}
      autoReplay={true}
    />
    <figcaption>
      <b>Figure 3</b> - Small, resonant waves gradually capsize the ship
    </figcaption>
  </figure>

  {`

  This seems to be a very simple system. Small waves which closely match the ship's natural frequency capsize the ship slowly. Large waves capsize the ship easily no matter their frequency. This naturally leads to two questions:

  1. What is the natural frequency of the ship?
  1. How big must waves of a particular frequency be to capsize the ship?

  To answer these questions we will start by sketching a graph. We assume that, given some frequency, there is a minimum wave amplitude which will cause our ship to capsize. Above that amplitude the waves will always capsize the ship; below it they won't.

  <center>
    <div>
      <!--<img
        alt="A sketch of the predicted capsize region"
        src="prediction-graph-150.jpg"
        width="100%"
        srcset="prediction-graph-300.jpg 300w, prediction-graph-600.jpg 600w"
      >-->
    </div>
    <div><b>Figure 4</b> - Region of capsize; the shaded region represents wave frequencies and amplitudes that inevitably lead to capsize</div>
  </center>

  To answer our 2 questions we will try to find the boundary between the regions of "capsize" and "no capsize."

  Normally we would look to the equations of motion to solve for this boundary.

  `}

  <figure>
    {/*<Latex>{`$(\\ddot{x} = -\\beta\\dot{x}-(x-x^{2})+F \\sin(\\omega t))`}</Latex>*/}
    <Latex>{`$\\ddot{x} = -\\beta\\dot{x}-(x-x^{2})+F \\sin(\\omega t)$`}</Latex>
    <figcaption>
      <b>Equation 1</b> - Equations of motion. <i>β</i> is the damping coefficient, <i>F</i> is the wave amplitude, and <i>ω</i> is the wave frequency
    </figcaption>
  </figure>

  {`

  However, in this case our set of equations is non-linear. We can't solve for the boundary directly.

  We will try to get a rough picture of the boundry by running some simulations. The interactive grid below contains 25 squares, each one a ship simulation. Each ship starts at rest and is rocked by waves of different amplitudes and frequencies.

  Click play <i class="mi mi-play-arrow inline-icon"></i> to start the simulation.

  Toggle the switch to flip between ship mode <i class="mi mi-directions-boat inline-icon"></i> and color mode <i class="mi mi-grid-on inline-icon"></i>.

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
            <td><i className="mi mi-directions-boat inline-icon"></i></td>
            <td>In ship mode the ship is shown tossing back and forth in the ocean. When it capsizes the square turns pink.</td>
          </tr>
          <tr>
            <td><i className="mi mi-grid-on inline-icon"></i></td>
            <td>In color mode the phase of the ship is represented by a shade of gray: dark means tipping to the left, light means tipping to the right. Pink means the ship capsized.</td>
          </tr>
        </tbody>
      </table>
    </figcaption>
  </figure>

  {`

  The simulation results are not quite what we expected:

  * As we expected, the ship seems to respond to some frequencies more than others
  * Waves with large amplitudes tend to capsize the ship, but not as quickly as we expect
  * **One of the ships that we expect to capsize never does!**

  What happened in the 4th column? The 1st and 3rd ships from the top capsized but the 2nd did not. This means one of our assumptions is wrong. **Larger waves do not necessarily capsize the ship**.

  To get a clearer picture of the behavior of ship in different conditions, we will run more simulations. Here is a 64-ship simulation

  `}

  <figure>
    <FractalCanvasToy
      domain={DOMAIN}
      scale={3}
      pixelate={true}
    />
    <figcaption>
      <b>Figure 6</b> - 64 ship stability simulations. For performance reasons we can only view simulations in color mode.
    </figcaption>
  </figure>

  {`

  Is the boundary between "capsize" and "no capsize" regions simple? It appears not to be.

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

  As we run more simulations we see that the boundary is surprisingly complex.

  `}

  <figure>
    <FractalCanvasToy
      domain={DOMAIN}
      scale={6}
      pixelate={true}
      />
    <figcaption>
      <b>Figure 8</b> - 4,096 ship stability simulations
    </figcaption>
  </figure>

  {`

  [todo]

  `}

  <figure>
    <FractalCanvasToy
      domain={DOMAIN}
      scale={6}
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
      scale={7}
      pixelate={true}
      colorize={true}
      />
    <figcaption>
      <b>Figure 9</b> - Many ship simulations across full boundary
    </figcaption>
  </figure>

  {`

`}</Markdown>
