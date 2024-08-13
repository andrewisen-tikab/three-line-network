import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import CameraControls from "camera-controls";
import * as TLN from "../src";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

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
   * CSS2DRenderer is a simplified version of CSS3DRenderer. The only transformation that is supported is translation.
   */
  public css2DRenderer: CSS2DRenderer;

  /**
   * CSS3DRenderer can be used to apply hierarchical 3D transformations to DOM elements via the CSS3 transform property.
   * This renderer is particularly interesting if you want to apply 3D effects to a website without canvas based rendering.
   * It can also be used in order to combine DOM elements with WebGL content.
   */
  public css3DRenderer: CSS3DRenderer;

  /**
   * The parameters for the GUI.
   */
  public params = {
    /**
     * Movement speed of the player from -100 to 100.
     */
    speed: 0,
    linkID: -1,
    startNode: -1,
    endNode: -1,
    nextStartNode: -1,
    showNodeLabels: true,
    showLinkLabels: true,
  };

  /**
   * A camera control for three.js, similar to THREE.OrbitControls yet supports smooth transitions and more features.
   */
  public cameraControls: CameraControls;

  public network: TLN.LineNetwork;

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

    const bgColor = new THREE.Color(TLN.COLORS.background);
    this.renderer.setClearColor(bgColor, 1);

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.css2DRenderer = new CSS2DRenderer();
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight);
    this.css2DRenderer.domElement.style.position = "absolute";
    this.css2DRenderer.domElement.style.top = "0px";
    this.css2DRenderer.domElement.className = "css-2d-renderer";
    document.body.appendChild(this.css2DRenderer.domElement);

    this.css3DRenderer = new CSS3DRenderer();
    this.css3DRenderer.setSize(window.innerWidth, window.innerHeight);
    this.css3DRenderer.domElement.style.position = "absolute";
    this.css3DRenderer.domElement.style.top = "0px";
    this.css3DRenderer.domElement.className = "css-3d-renderer";
    document.body.appendChild(this.css3DRenderer.domElement);

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

    this.network = new TLN.LineNetwork();
    this.group.add(this.network.debugScene);

    const movementFolder = this.gui.addFolder("Movement");

    movementFolder
      .add(this.params, "speed", -100, 100)
      .name("Speed")
      .onChange(() => {
        this.network.setSpeed(this.params.speed);
      });

    movementFolder.add(this.params, "startNode").disable().listen();
    movementFolder.add(this.params, "endNode").disable().listen();
    movementFolder.add(this.params, "nextStartNode").disable().listen();

    const visualizationFolder = this.gui.addFolder("Visualization");

    const setParams = () => {
      this.network.nodeLabelGroup.visible = this.params.showNodeLabels;
      this.network.linkLabelGroup.visible = this.params.showLinkLabels;
    };

    visualizationFolder.add(this.params, "showNodeLabels").onChange(setParams);
    visualizationFolder.add(this.params, "showLinkLabels").onChange(setParams);

    setParams();

    const render = (): void => {
      this.renderer.render(this.scene, camera);
      this.css2DRenderer.render(this.scene, camera);
      this.css3DRenderer.render(this.scene, camera);
    };

    const animate = (_currentTime: number = 0): void => {
      // Camera controls
      const delta = clock.getDelta();
      this.cameraControls.update(delta);
      camera.updateMatrixWorld();

      this.network.update(delta);

      this.params.startNode = this.network.getCurrentStartNode()?.id ?? -1;
      this.params.endNode = this.network.getCurrentEndNode()?.id ?? -1;

      this.params.nextStartNode =
        this.network.getCurrentNextStartNode()?.id ?? -1;
      // this.params.linkID = this.network.getCurrentLink()?.id ?? -1;

      // Render
      requestAnimationFrame(animate);
      stats.update();
      render();
    };

    // Everything is setup, lets go!
    animate();
  }
}
