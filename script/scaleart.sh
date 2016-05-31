#!/bin/bash

for size in 150 300 600; do
  convert src/art/prediction-graph.jpg -resize ${size}x${size} dist/prediction-graph-$size.jpg
  convert src/art/unexpected-result.png -resize ${size}x${size} dist/unexpected-result-$size.png
done