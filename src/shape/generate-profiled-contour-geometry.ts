import * as THREE from "three";
import { flipShapeGeometry } from "./flip-shape-geometry";

/**
 * Generates a profiled contour geometry based on the provided profile shape and contour.
 *
 * Inspired by:
 * - https://discourse.threejs.org/t/offsetcontour-function/3185
 * - https://discourse.threejs.org/t/profiledcontourgeometry/2330
 *
 * @param profileShape - The profile shape used for generating the geometry.
 * @param contour - The contour points defining the shape of the geometry.
 * @param contourClosed - Indicates whether the contour is closed or not. Defaults to `true`.
 * @param openEnded - Indicates whether the geometry should be open-ended or not. Defaults to `false`.
 * @throws {Error} If the `profileGeometry` or `flipProfileGeometry` does not have an index attribute.
 * @returns The generated profiled contour geometry.
 */
export function generateProfiledContourGeometry(
  profileShape: THREE.Shape,
  contour: THREE.Vector2[],
  contourClosed?: boolean,
  openEnded?: boolean
): THREE.BufferGeometry {
  contourClosed = contourClosed !== undefined ? contourClosed : true;
  openEnded = openEnded !== undefined ? openEnded : false;
  // If the contour is closed, force openEnded to be false, meaning caps will be added.
  openEnded = contourClosed === true ? false : openEnded;

  const profileGeometry = new THREE.ShapeGeometry(profileShape);
  const flipProfileGeometry = flipShapeGeometry(profileGeometry);
  profileGeometry.rotateX(Math.PI * 0.5);
  const profile = profileGeometry.attributes.position;

  const addEnds = openEnded === false ? 2 : 0;
  const profilePoints = new Float32Array(
    profile.count * (contour.length + addEnds) * 3
  );

  const endProfiles = [];

  // Loop over each point in the contour.
  // Compute vectors to the previous and next contour points.
  for (let i = 0; i < contour.length; i++) {
    const v1 = new THREE.Vector2().subVectors(
      contour[i - 1 < 0 ? contour.length - 1 : i - 1],
      contour[i]
    );
    const v2 = new THREE.Vector2().subVectors(
      contour[i + 1 == contour.length ? 0 : i + 1],
      contour[i]
    );

    // Calculate the angle between the two vectors.
    const angle = v2.angle() - v1.angle();
    const halfAngle = angle * 0.5;

    let hA = halfAngle;
    // Perpendicular angle for rotation.
    let tA = v2.angle() + Math.PI * 0.5;

    if (!contourClosed) {
      // For open contours, adjust the angles for the first and last points.
      if (i == 0 || i == contour.length - 1) {
        hA = Math.PI * 0.5;
      }
      if (i == contour.length - 1) {
        tA = v1.angle() - Math.PI * 0.5;
      }
    }

    // Compute the shift amount based on the half-angle and apply it to the profile.
    const shift = Math.tan(hA - Math.PI * 0.5);

    // prettier-ignore
    const shiftMatrix = new THREE.Matrix4().set(
             1, 0, 0, 0, 
        -shift, 1, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1
      );

    const tempAngle = tA;

    // prettier-ignore
    const rotationMatrix = new THREE.Matrix4().set(
        Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
        Math.sin(tempAngle),  Math.cos(tempAngle), 0, 0,
                          0,                    0, 1, 0,
                          0,                    0, 0, 1
      );

    // prettier-ignore
    const translationMatrix = new THREE.Matrix4().set(
        1, 0, 0, contour[i].x,
        0, 1, 0, contour[i].y,
        0, 0, 1, 0,
        0, 0, 0, 1,
      );

    const cloneProfile = profile.clone();
    cloneProfile.applyMatrix4(shiftMatrix);
    cloneProfile.applyMatrix4(rotationMatrix);
    cloneProfile.applyMatrix4(translationMatrix);

    profilePoints.set(cloneProfile.array, cloneProfile.count * i * 3);

    // If end caps are needed, store the profiles for the first and last points.
    if (openEnded === false && (i === 0 || i === contour.length - 1)) {
      endProfiles.push(cloneProfile);
    }
  }

  // Add the end profiles (caps) to the profilePoints array if necessary.
  endProfiles.forEach((ep, idx) => {
    profilePoints.set(ep.array, ep.count * (contour.length + idx) * 3);
  });

  const fullProfileGeometry = new THREE.BufferGeometry();
  fullProfileGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(profilePoints, 3)
  );

  const index: number[] = [];

  let lastCorner = contourClosed == false ? contour.length - 1 : contour.length;

  // Loop through the contour and profile to generate indices for the faces.
  for (let i = 0; i < lastCorner; i++) {
    for (let j = 0; j < profile.count; j++) {
      const currCorner = i;
      const nextCorner = i + 1 == contour.length ? 0 : i + 1;
      let currPoint = j;
      const nextPoint = j + 1 == profile.count ? 0 : j + 1;

      const a = nextPoint + profile.count * currCorner;
      const b = currPoint + profile.count * currCorner;
      const c = currPoint + profile.count * nextCorner;
      const d = nextPoint + profile.count * nextCorner;

      // First triangle of the quad.
      index.push(a, b, d);
      // Second triangle of the quad.
      index.push(b, c, d);
    }
  }

  if (profileGeometry.index === null) {
    throw new Error("ShapeGeometry must have an index attribute");
  }

  if (flipProfileGeometry.index === null) {
    throw new Error("ShapeGeometry must have an index attribute");
  }

  // If the geometry is not open-ended, add the indices for the end caps.
  if (openEnded === false) {
    // Add indices from the flipped profile geometry.
    flipProfileGeometry.index.array.forEach((i) => {
      index.push(i + profile.count * contour.length);
    });

    // Add indices from the original profile geometry.
    profileGeometry.index.array.forEach((i) => {
      index.push(i + profile.count * (contour.length + 1));
    });
  }

  fullProfileGeometry.setIndex(index);
  fullProfileGeometry.computeVertexNormals();

  return fullProfileGeometry;
}
