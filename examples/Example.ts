import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import CameraControls from "camera-controls";

CameraControls.install({ THREE });
import Stats from "three/addons/libs/stats.module.js";

/**
 * Example class that demonstrates how to use the library.
 */
export class Example {
  /**
   * Makes a floating panel for controllers on the web. Works as a drop-in replacement for dat.gui in most projects.
   */
  public gui: GUI;

  /**
   * Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras.
   */
  public scene: THREE.Scene;

  /**
   * A group that holds all the shapes.
   */
  public group: THREE.Group;

  /**
   * The WebGL renderer displays your beautifully crafted scenes using WebGL.
   */
  public renderer: THREE.WebGLRenderer;

  /**
   * The parameters for the GUI.
   */
  public params = {};

  /**
   * A camera control for three.js, similar to THREE.OrbitControls yet supports smooth transitions and more features.
   */
  public cameraControls: CameraControls;

  constructor() {
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    this.gui = new GUI();
    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const bgColor = new THREE.Color(0x263238);
    this.renderer.setClearColor(bgColor, 1);

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const clock = new THREE.Clock();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    this.cameraControls = new CameraControls(camera, this.renderer.domElement);
    this.cameraControls.setPosition(10, 10, 10, true);

    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    this.scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(size);
    this.scene.add(axesHelper);

    const render = (): void => {
      this.renderer.render(this.scene, camera);
    };

    const animate = (_currentTime: number = 0): void => {
      // Camera controls
      const delta = clock.getDelta();
      this.cameraControls.update(delta);
      camera.updateMatrixWorld();

      // Render
      requestAnimationFrame(animate);
      stats.update();
      render();
    };

    // Everything is setup, lets go!
    animate();
  }
}