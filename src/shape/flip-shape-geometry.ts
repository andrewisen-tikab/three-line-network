import * as THREE from "three";

/**
 * Flips the geometry of a shape.
 *
 * Inspired by:
 * - https://discourse.threejs.org/t/offsetcontour-function/3185
 * - https://discourse.threejs.org/t/profiledcontourgeometry/2330
 *
 * @param shapeGeometry - The {@link THREE.ShapeGeometry | shape geometry} to flip.
 * @returns The {@link THREE.ShapeGeometry | flipped geometry}.
 * @throws {Error} If the {@link THREE.ShapeGeometry | shape geometry} does not have an index attribute.
 */
export function flipShapeGeometry(
  shapeGeometry: THREE.ShapeGeometry
): THREE.ShapeGeometry {
  // Clone the original geometry to avoid modifying the original object.
  const flippedGeometry = shapeGeometry.clone();

  // Iterate through all the vertices in the position attribute
  // Flip the x-coordinate of each vertex (multiply by -1
  for (let i = 0; i < flippedGeometry.attributes.position.count; i++) {
    flippedGeometry.attributes.position.array[i * 3] *= -1;
  }

  flippedGeometry.attributes.position.needsUpdate = true;

  if (flippedGeometry.index === null) {
    throw new Error("ShapeGeometry must have an index attribute");
  }

  // Access the index array, which defines the order of vertices for each face.
  const indexArray = flippedGeometry.index.array;

  // Iterate over the indices in groups of three (each triangle face).
  for (let i = 0; i < indexArray.length; i += 3) {
    const v2 = indexArray[i + 1];
    const tmp = v2;
    // let v3 = index[i + 2];

    // Swap the second and third vertices to flip the face orientation
    indexArray[i + 1] = indexArray[i + 2];
    indexArray[i + 2] = tmp;
  }

  flippedGeometry.computeVertexNormals();

  return flippedGeometry;
}
