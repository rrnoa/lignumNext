//import camera from "./lib/components/camera.js";
//import makeBlock from "./lib/components/block.js";
import renderer from "./components/renderer.js";
import { Resizer } from "./lib/Resizer.js";
import { container } from "./lib/components/renderer.js";
import { OrbitControls } from "./lib/OrbitControls.js";
import {
  TextureLoader,
  EquirectangularReflectionMapping,
  MathUtils,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  CubeTextureLoader,
  CubeRefractionMapping,
  Color,
  DirectionalLightHelper,
  Object3D,
  Vector3,
  RectAreaLight,
  SpotLight,
  PointLight,
  DirectionalLight,
  AmbientLight,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  CameraHelper,
  InstancedMesh,
  Matrix4,
  MeshLambertMaterial,
  RepeatWrapping,
  RawShaderMaterial,
  InstancedBufferAttribute,
  MeshBasicMaterial,
  SpotLightHelper,
  SRGBColorSpace,
} from "three";
import { OBJLoader } from "./lib/OBJLoader.js";

import { GUI } from "./lib/lil-gui.module.min.js";
import RectLightControl from "./lib/controls/RectLightControl.js";
import SpotLightControl from "./lib/controls/SpotLightControl.js";

import dof from "./lib/controls/DOF.js";
import MaterialControl from "./lib/controls/MaterialControl.js";
import PointLightControl from "./lib/controls/PointLightControl.js";
import DirectionalLightControl from "./lib/controls/DirectionalLightControl.js";
import AmbientLightControl from "./lib/controls/AmbientLightControl.js";
import RendererControl from "./lib/controls/RendererControl.js";
import { RectAreaLightHelper } from "./lib/RectAreaLightHelper.js";

import { EffectComposer } from "./lib/EffectComposer.js";
import { RenderPass } from "./lib/RenderPass.js";
import { BokehPass } from "./lib/BokehPass.js";

let gui;
let camera;
let directionalLight;
let lightSpot1;
let lightSpot2;
let bulbLight;
let material;
let rectLight;
let ambientlight;
let cameraZ;
let scene;
let savedJson;
let ballControls;
let yBlocks;
let xBlocks;
let cornerX;
let cornerY;

let renderPass;
let bokehPass;
let composer;
let postprocessing = {};

const RES_URL = wp_variables.resources_path;

const cubeURL = RES_URL + "/NCUBE.obj";

const loader = new OBJLoader();

var preperScene = function (json) {
  savedJson = json;
  scene = new Scene();
  gui = new GUI();
  lightSpot1 = new SpotLight();
  lightSpot2 = new SpotLight();
  camera = new PerspectiveCamera(75, 1, 1, 1000);
  material = new MeshStandardMaterial();
  rectLight = new RectAreaLight(0xffffff, 1, 24, 20);
  ambientlight = new AmbientLight(0xffffff, 1);
  bulbLight = new PointLight(0xffffff, 1, 100, 2);
  directionalLight = new DirectionalLight(0xffffff, 1);
  ballControls = new OrbitControls(camera, renderer.domElement);

  //config Directional Light
  {
    directionalLight.name = "DirectionalLight";
    directionalLight.castShadow = true;
    directionalLight.position.set(0, 30, 6);
    directionalLight.shadow.camera.right = 48;
    directionalLight.shadow.camera.left = -48;
    directionalLight.shadow.camera.top = 48;
    directionalLight.shadow.camera.bottom = -48;
  }
  //configuring light spots
  {
    /*lightSpot1.castShadow = true;
            lightSpot1.position.set(-10, 10, 10);
            lightSpot1.target.position.set(0, 0, 0);
        
            let shadowHelper1 = new CameraHelper( lightSpot1.shadow.camera );
            shadowHelper1.visible = true;
            scene.add(shadowHelper1); 

        */

    lightSpot1.castShadow = true;
    lightSpot2.castShadow = true;
  }
  //config Point Light
  {
    bulbLight.castShadow = true;
    bulbLight.shadow.mapSize.width = 2048;
    bulbLight.shadow.mapSize.height = 2048;
  }
  //config scene
  {
    //const axesHelper = new AxesHelper( 10 );
    // scene.add( axesHelper );
  }
  // config camera
  {
    camera.name = "Camera";
    camera.lookAt(0, 0, 0);
  }
  //config DOF
  {
    renderPass = new RenderPass(scene, camera);

    bokehPass = new BokehPass(scene, camera, {
      focus: 1.0,
      aperture: 0.025,
      maxblur: 0.0,
    });

    composer = new EffectComposer(renderer);

    composer.addPass(renderPass);
    composer.addPass(bokehPass);

    postprocessing.composer = composer;
    postprocessing.bokeh = bokehPass;
  }
  //adicionar contorlles
  {
    MaterialControl(gui, material);
    RectLightControl(gui, rectLight);
    RendererControl(gui, renderer);
    AmbientLightControl(gui, ambientlight);
    DirectionalLightControl(gui, directionalLight);
    SpotLightControl(gui, lightSpot1, "SpotLightLeft");
    SpotLightControl(gui, lightSpot2, "SpotLightRight");
    PointLightControl(gui, bulbLight);
    dof(gui, bokehPass);
  }
  //add to scene
  {
    scene.add(ambientlight);
    scene.add(directionalLight.target);
    scene.add(directionalLight);
    scene.add(lightSpot1.target);
    scene.add(lightSpot1);
    scene.add(lightSpot2.target);
    scene.add(lightSpot2);
    scene.add(bulbLight);
    scene.add(rectLight);
  }

  gui.load(savedJson);

  //update the camera-aspect and render-size to fix the container
  const resizer = new Resizer(container, camera, renderer);
  resizer.onResize = () => {
    renderer.render(scene, camera);
  };

  function animate() {
    requestAnimationFrame(animate);
    //ballControls.update();
    postprocessing.composer.render(0.1);
    //renderer.render(scene, camera);
  }

  animate();

  return scene;
};
function paintBlocks(allColors, xBs = 24, yBs = 24, blockSize) {
  removeObjWithChildren(scene); //remover bloques

  loader.load(cubeURL, function (object) {
    console.log("cubo cargado", cubeURL);
    paintFrame(allColors, xBs, yBs, blockSize, object.children[0].geometry); //despues de cargado el cubo entonces dibuja
  });
}

function paintFrame(allColors, xBs, yBs, blockSize, blockGeometry) {
  xBlocks = xBs;
  yBlocks = yBs;
  const numBlocks = xBs * yBs;

  // Calcula el desplazamiento necesario para que (0, 0, 0) quede en el centro del cuadro
  const offsetX = -(xBlocks - 1) * blockSize * 0.5;
  const offsetY = -(yBlocks - 1) * blockSize * 0.5;

  if (blockSize === 1) {
    cornerX = -xBlocks / 2 + 0.5;
    cornerY = (yBlocks * blockSize) / 2 - 0.5;
  } else {
    cornerX = (-xBlocks * 2) / 2 + 1;
    cornerY = (yBlocks * 2) / 2 - 1;
  }
  repositionLights(); //position of spot and rectangle lights

  cameraZ = Math.max(blockSize * xBlocks, blockSize * yBlocks);
  camera.position.z = cameraZ;
  camera.updateProjectionMatrix();
  //config Arcball
  {
    ballControls.minDistance = 10;
    ballControls.maxDistance = cameraZ * 1.2;
    ballControls.enablePan = false;
    ballControls.maxPolarAngle = MathUtils.degToRad(120);
    ballControls.minPolarAngle = MathUtils.degToRad(60);
    ballControls.maxAzimuthAngle = MathUtils.degToRad(30);
    ballControls.minAzimuthAngle = MathUtils.degToRad(-30);
    //ballControls.saveState();

    ballControls.update();
  }
  //create a matrix to store blocks rotation angles
  let matrixRotations = new Array(yBlocks);
  for (let index = 0; index < matrixRotations.length; index++) {
    matrixRotations[index] = new Array(xBlocks);
  }

  const diffuseMaps = [
    RES_URL + "/textures/Textura1_Albedo.jpg",
    RES_URL + "/textures/Textura2_Albedo.jpg",
    RES_URL + "/textures/Textura3_Albedo.jpg",
    RES_URL + "/textures/Textura4_Albedo.jpg",
    // Agrega más texturas aquí
  ];

  const roughnessMaps = [
    RES_URL + "/textures/Textura1_Roughness.jpg",
    RES_URL + "/textures/Textura2_Roughness.jpg",
    RES_URL + "/textures/Textura3_Roughness.jpg",
    RES_URL + "/textures/Textura4_Roughness.jpg",
  ];

  const normalMaps = [
    RES_URL + "/textures/Textura1_Normal.jpg",
    RES_URL + "/textures/Textura2_Normal.jpg",
    RES_URL + "/textures/Textura3_Normal.jpg",
    RES_URL + "/textures/Textura4_Normal.jpg",
  ];

  const diffuseTextures = [];
  const roughnessTextures = [];
  const normalTextures = [];
  const textureLoader = new TextureLoader();
  //cargar texturas diffuse
  for (const texturePath of diffuseMaps) {
    const texture = textureLoader.load(texturePath);
    /*texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;*/
    diffuseTextures.push(texture);
  }
  //cargar texturas roughness

  for (const texturePath of roughnessMaps) {
    const texture = textureLoader.load(texturePath);
    //texture.wrapS = RepeatWrapping;
    //texture.wrapT = RepeatWrapping;
    roughnessTextures.push(texture);
  }

  for (const texturePath of normalMaps) {
    const texture = textureLoader.load(texturePath);
    //texture.wrapS = RepeatWrapping;
    //texture.wrapT = RepeatWrapping;
    normalTextures.push(texture);
  }

  console.log(material);

  // Preparar los 4 materiales
  const material1 = material.clone();
  material1.map = diffuseTextures[0];
  material1.roughnessMap = roughnessTextures[0];
  material1.normalMap = normalTextures[0];
  material1.vertexColors = true;
  material1.needsUpdate = true;

  const material2 = material.clone();
  material2.map = diffuseTextures[1];
  material2.roughnessMap = roughnessTextures[1];
  material2.normalMap = normalTextures[1];
  material2.vertexColors = true;
  material2.needsUpdate = true;

  const material3 = material.clone();
  material3.map = diffuseTextures[2];
  material3.roughnessMap = roughnessTextures[2];
  material3.normalMap = normalTextures[2];
  material3.vertexColors = true;
  material3.needsUpdate = true;

  const material4 = material.clone();
  material4.map = diffuseTextures[3];
  material4.roughnessMap = roughnessTextures[3];
  material4.normalMap = normalTextures[3];
  material4.vertexColors = true;
  material4.needsUpdate = true;

  let materials = [material1, material2, material3, material4];

  //de cada bloque guarda su colo y su posicion y wel materrial que le toca
  let blockInfos = allColors.map((color, index) => {
    const matrix = new Matrix4();
    const fila = Math.floor(index / xBlocks);
    const columna = index % xBlocks;
    const posX = columna * blockSize + offsetX;
    const posY = -fila * blockSize - offsetY;
    matrix.setPosition(posX, posY, 0);

    const materialIndex = Math.floor(Math.random() * 4);

    return {
      materialIndex: materialIndex,
      matrix: matrix,
      color: color,
      rotation: null, // La rotación se definirá en el siguiente paso
    };
  });

  blockInfos.forEach((block, index) => {
    const availableRotations = getAvailableRotations(
      index,
      blockInfos,
      xBlocks
    );
    const randomRotation =
      availableRotations[Math.floor(Math.random() * availableRotations.length)];

    const rotationMatrix = new Matrix4().makeRotationZ(randomRotation);
    block.matrix.multiply(rotationMatrix);
    block.rotation = randomRotation;
  });

  //por cada material los bloques que le corresponden
  let organizedByMaterial = materials.map(() => []);
  blockInfos.forEach((blockInfo) => {
    organizedByMaterial[blockInfo.materialIndex].push(blockInfo);
  });
  //console.log(organizedByMaterial );
  blockGeometry.rotateX(Math.PI / 2);

  organizedByMaterial.forEach((blocksForMaterial, index) => {
    const material = materials[index];
    const instancedMesh = new InstancedMesh(
      blockGeometry.clone(),
      material,
      blocksForMaterial.length
    );
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
    //const colorsArray = new Float32Array(blocksForMaterial.length * 3);
    const colorsArray = new InstancedBufferAttribute(
      new Float32Array(blocksForMaterial.length * 3),
      3
    );

    blocksForMaterial.forEach((blockInfo, instanceIndex) => {
      instancedMesh.setMatrixAt(instanceIndex, blockInfo.matrix);
      let color = new Color(rgbC(blockInfo.color));
      colorsArray.setXYZ(instanceIndex, color.r, color.g, color.b);
    });

    instancedMesh.geometry.setAttribute("color", colorsArray);
    instancedMesh.instanceMatrix.needsUpdate = true;

    scene.add(instancedMesh);
  });

  // Crear un InstancedMesh
  /* blockGeometry.rotateX(Math.PI/2);
    const instancedMesh = new InstancedMesh(blockGeometry, material1, numBlocks);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
    
    // Crea un InstancedBufferAttribute para almacenar información de textura por instancia
    let indexTex = [];
    for (var i = 0; i < numBlocks; i++) {
        indexTex.push(i % 5); // Esto asegura que los números sean 0, 1, 2, 3, 4 y luego se repitan.
    }
    //Cada geometria recibe un arreglo con los indices de las texturas
    //const textureIndexArray = new InstancedBufferAttribute(new Float32Array(indexTex), 1);
    //instancedMesh.geometry.setAttribute('textureIndex', textureIndexArray);

    // Añade un atributo de color por instancia a cada instancia

    const colorArray = new InstancedBufferAttribute(new Float32Array(numBlocks * 3), 3);
    blockGeometry.setAttribute('colori', colorArray);

    const matrixTrans = new Matrix4();


    for (let i = 0; i < numBlocks; i++) {

        const fila = Math.floor(i / xBlocks);
        
        const columna = i % xBlocks;
        
        const posX = (columna * blockSize) - 0.5 + offsetX;
        const posY = (-fila * blockSize - 0.5 ) - offsetY; 
    
        let color = allColors[i % allColors.length]; 
        color = new Color(rgbC(color));
        colorArray.setXYZ(i, color.r, color.g, color.b);
        
        let mult = getRotation(matrix, Math.abs(fila), Math.abs(columna)); //determinar el 'angulo de rotacion

        matrixTrans.makeRotationZ ( Math.PI * mult);
        matrixTrans.setPosition(posX, posY, 0);
        
        instancedMesh.setMatrixAt(i, matrixTrans);
      
    }

   scene.add(instancedMesh); */
}

function repositionLights() {
  //config Rect Light
  let offsetRect = rectLight.position.y - 12;
  rectLight.width = xBlocks;
  rectLight.position.y = cornerY + offsetRect;

  //let shadowHelper1 = new CameraHelper( lightSpot1.shadow.camera );
  //shadowHelper1.visible = true;
  //scene.add(shadowHelper1);
  let offsetSpot = lightSpot1.position.y - 12;

  lightSpot1.position.y = cornerY + offsetSpot;
  //lightSpot2.position.y = cornerY + offsetSpot;

  lightSpot1.position.x = cornerX - 2;
  lightSpot2.position.x = xBlocks / 2 + 2;

  //const spotLightHelper = new SpotLightHelper( lightSpot1 );
  //const spotLightHelper2 = new SpotLightHelper( lightSpot2 );

  //scene.add( spotLightHelper );
  //scene.add( spotLightHelper2 );
}

//Create color string
const rgbC = (arr) => {
  return "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
};

function removeObjWithChildren(obj) {
  if (obj.children) {
    if (obj.children.length > 0) {
      for (var x = obj.children.length - 1; x >= 0; x--) {
        removeObjWithChildren(obj.children[x]);
      }
    }
    if (obj.isMesh) {
      obj.geometry.dispose();
      //obj.material.map.dispose();
      obj.material.dispose();
      obj.parent.remove(obj);
    }
  }
}

function getAvailableRotations(index, blockInfos, xBlocks) {
  let rotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]; // 0, 90, 180, 270 grados
  let usedRotations = [];

  // Adyacente Norte
  if (index >= xBlocks) {
    usedRotations.push(blockInfos[index - xBlocks].rotation);
  }

  // Adyacente Sur
  if (index < blockInfos.length - xBlocks) {
    usedRotations.push(blockInfos[index + xBlocks].rotation);
  }

  // Adyacente Este
  if (index % xBlocks !== xBlocks - 1) {
    usedRotations.push(blockInfos[index + 1].rotation);
  }

  // Adyacente Oeste
  if (index % xBlocks !== 0) {
    usedRotations.push(blockInfos[index - 1].rotation);
  }

  let availableRotations = rotations.filter(
    (rotation) => !usedRotations.includes(rotation)
  );

  return availableRotations;
}

//calculate the rotation angle of the block, it look the East and Nort elemento
function getRotation(matrix, x, y) {
  let radio = [0, 0.5, 1, 1.5]; //rotation angles

  if (x > 0) {
    //exclude the first row
    let bockLeftRotation = matrix[x - 1][y]; //

    if (bockLeftRotation == 0) {
      radio.splice(radio.indexOf(0), 1);
    }
    if (bockLeftRotation == 1) {
      radio.splice(radio.indexOf(1), 1);
    }
    if (bockLeftRotation == 0.5) {
      radio.splice(radio.indexOf(0.5), 1);
    }
    if (bockLeftRotation == 1.5) {
      radio.splice(radio.indexOf(1.5), 1);
    }
  }
  if (y > 0) {
    //exclude the first column
    let bockTopRotation = matrix[x][y - 1];
    if (bockTopRotation == 0) {
      radio.splice(radio.indexOf(0), 1);
      radio.splice(radio.indexOf(1), 1);
    }
    if (bockTopRotation == 1) {
      radio.splice(radio.indexOf(1), 1);
    }
    if (bockTopRotation == 0.5) {
      radio.splice(radio.indexOf(0.5), 1);
    }
    if (bockTopRotation == 1.5) {
      radio.splice(radio.indexOf(1.5), 1);
    }
  }
  let index = getRandomInt(0, radio.length - 1);
  let mult = radio[index];
  matrix[x][y] = mult;
  return mult;
}

function getRandomInt(min, max) {
  var x = Math.floor(Math.random() * (max - min + 1) + min);
  return x;
}

export { paintBlocks, preperScene, removeObjWithChildren };
