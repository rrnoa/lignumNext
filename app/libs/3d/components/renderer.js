import {
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  ReinhardToneMapping,
  SRGBColorSpace,
  VSMShadowMap,
  WebGLRenderer,
} from "three";
const renderer = new WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
});

const container = document.getElementById("canvasContent");
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
//dando estilo al canvas
renderer.domElement.id = "superCanvas";
renderer.domElement.style.position = "absolute";
renderer.domElement.style.zIndex = "-1";

renderer.shadowMap.enabled = true;
renderer.toneMapping = ReinhardToneMapping;
renderer.shadowMap.type = PCFSoftShadowMap;
//renderer.outputEncoding = SRGBColorSpace;

//container.children[0].remove();//borra el primer hijo
container.appendChild(renderer.domElement);

export { container };
export default renderer;
