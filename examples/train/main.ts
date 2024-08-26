import { Example } from "../Example";
import "../styles.css";

import * as THREE from "three";

const example = new Example();
const { scene, renderer, camera } = example;

const nodes = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(5, 0, 0),
  new THREE.Vector3(20, 0, 5),
  new THREE.Vector3(25, 0, 5),
  new THREE.Vector3(40, 0, 0),
  new THREE.Vector3(50, 0, -10),
  new THREE.Vector3(50, 0, -20),
  new THREE.Vector3(40, 0, -30),
  new THREE.Vector3(30, 0, -25),
  new THREE.Vector3(20, 0, -20),
  new THREE.Vector3(10, 0, -20),
  new THREE.Vector3(0, 0, -15),
  new THREE.Vector3(-10, 0, -10),
  new THREE.Vector3(-10, 0, -5),
  new THREE.Vector3(-5, 0, -5 / 2),
  new THREE.Vector3(),
];

nodes.forEach((node) => {
  const geometry = new THREE.SphereGeometry(0.2);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(node);
  scene.add(sphere);
});

const curve = new THREE.CatmullRomCurve3(nodes);
const curveLength = curve.getLength();

const locomotiveLength = 4;
const locomotive = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, locomotiveLength),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(locomotive);

type Wagon = {
  length: number;
  mesh: THREE.Mesh;
};

const wagons: Wagon[] = [
  {
    length: 1,
    mesh: new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    ),
  },
  {
    length: 2,
    mesh: new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 2),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
    ),
  },
  {
    length: 2,
    mesh: new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 2),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    ),
  },
  {
    length: 2,
    mesh: new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 2),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    ),
  },
];

wagons.forEach((wagon) => scene.add(wagon.mesh));

const gapBetweenWagons = -1;

let distanceTraveled = 0;
const speed = 1 / 10; // Speed of the train

function animate() {
  requestAnimationFrame(animate);

  // Update the distance traveled by the locomotive
  distanceTraveled += speed;
  if (distanceTraveled > curveLength) distanceTraveled = 0; // Loop the train path

  // Calculate the locomotive position on the curve
  const locomotivePosition = curve.getPointAt(distanceTraveled / curveLength);
  locomotive.position.copy(locomotivePosition);

  // Orient the locomotive in the direction of travel
  const tangent = curve.getTangentAt(distanceTraveled / curveLength);
  locomotive.lookAt(locomotivePosition.clone().add(tangent));

  // Track the position for the next wagon
  let currentDistance = distanceTraveled;

  // Update the first wagon's position based on its distance from the locomotive
  currentDistance -= locomotiveLength + wagons[0].length + gapBetweenWagons;

  const firstWagonPositionOnCurve =
    currentDistance < 0
      ? (curveLength + currentDistance) % curveLength
      : currentDistance;

  const firstWagonPosition = curve.getPointAt(
    firstWagonPositionOnCurve / curveLength
  );

  wagons[0].mesh.position.copy(firstWagonPosition);

  const firstWagonTangent = curve.getTangentAt(
    firstWagonPositionOnCurve / curveLength
  );

  wagons[0].mesh.lookAt(firstWagonPosition.clone().add(firstWagonTangent));

  // Update subsequent wagons' positions
  for (let i = 1; i < wagons.length; i++) {
    const previousWagonLength = wagons[i - 1].length;
    const currentWagon = wagons[i];

    currentDistance -=
      previousWagonLength + currentWagon.length + gapBetweenWagons;

    const wagonPositionOnCurve =
      currentDistance < 0
        ? (curveLength + currentDistance) % curveLength
        : currentDistance;

    const wagonPosition = curve.getPointAt(wagonPositionOnCurve / curveLength);

    // Update wagon position
    currentWagon.mesh.position.copy(wagonPosition);

    // Orient the wagon towards the next point
    const wagonTangent = curve.getTangentAt(wagonPositionOnCurve / curveLength);
    currentWagon.mesh.lookAt(wagonPosition.clone().add(wagonTangent));
  }

  renderer.render(scene, camera);
}

animate();
