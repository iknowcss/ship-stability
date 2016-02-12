# The Fisherman's Fractal

> “Wouldst thou,”—so the helmsman answered,
> “Learn the secret of the sea?
> Only those who brave its dangers
> Comprehend its mystery!”

<cite>“The Secret of the Sea”—Henry Wadsworth Longfellow</cite>

[fishing ship bobbing in the ocean]

Physics can be really boring.

Yeah yeah, I know. It's not fashionable to say such a thing these days. It's basically nerd heresy.

Hear me out.

Maybe it's not fair to say "physics can be really boring." It's just that we make it boring. We take all the fun bits out. When someone asks, "how long does it take an apple to fall from a height of 4 meters" what is the first thing we do? Neglect air resistance of course.

[XKCD comic "Experiment"]

Why? Because we're scared of air resistance. We're scared of friction. We're scared of anything that makes our equations "non-linear" if you want to be all scientific. But if we're not careful we get [scared into making our cows spherical](https://en.wikipedia.org/wiki/Spherical_cow). And that's not good for anyone.

We do it because we want things to be easy. If our system of equations is linear we can calculate exactly where the falling apple will be at any point in time. One equation lets us jump straight from the start to the end.

[one step equations]

The shape you see above is like a map the path the apple will take in time; a parabola in this case. When we remove the air resistance, we can make this nice map. No surprises.

[question mark equations]

The same is not true of non-linear systems. We can't make a nice map of the path beforehand. We have to start at the beginning and calculate each step one one-by-one to the end. Each step takes into account the result from the previous step. Since you don't have a map of the path, you can never be certain where you will end up.

But you can still walk the path. It requires more effort, but it pays off when things take unexpected turns. Which brings me back to my point about physics being boring.

Linear equations are great because you know exactly how things will happen. The apple falls from the tree and strikes the ground in exactly 0.64 seconds. It's predictable. It's boring.

Non-linear equations seem scary because we have to do lots of calculations to find out how they behave. The apple falls from the tree, but we can't know ahead of time when it will strike the ground. We must walk the path to find where it ends. It's a bit more mysterious.

Let me show you what I mean. Just be careful not to get seasick.

## Gone Fishing

> "Everyone should believe in something; I believe I'll go fishing."

<cite>Henry David Thoreau</cite>

As interesting as apples falling from trees are, we'll abandon them for a problem with a bit more meat. Don't worry, your computer will do all the calculating for you. No pencil and paper needed.

A tiny fishing vessel headed by captain Santiago passes silently through the gulf off the coast of Florida. A small storm collects at the horizon.

Santiago is exhausted a 2 days struggle with his catch: a marlin of impressive size which is strapped to the starboard side. The fish is so big it makes his ship tip to one side. But it's his first catch in months and will not part with it.

(Diagram/animation)

As the storm rolls in the waves get bigger. The ship pitches and threatens to capsize. The question is, will it?

We'll use a simple equation to model our ship's behaviour.

Force = -x + x^2

Which behaves like this

[interactive; bottom slider let's you apply force]

If you force the ship to the left, it pushes back to the right. If you force the ship to the right, it is pushes back to the left. But if the ship rolls too far to the right, it tips over and capsizes.

Using this model, we can run some tests with different wave rhythms and sizes.

[3x3 ships]

In # of the 6 tests, the ship capsized. Based on these results, we might assume the ship "resonates" at a certain frequency. That is to say waves that match the natural rhythm of the ship don't have to be so big to capsize it.

Let's see if we can figure out the natural rhythm by doing more tests.

[9x9 ships]