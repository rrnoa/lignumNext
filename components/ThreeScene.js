import React, { useRef, useEffect, useContext, useState } from "react";
import {
  AmbientLight,
  BoxGeometry,
  CameraHelper,
  Color,
  DirectionalLight,
  InstancedBufferAttribute,
  InstancedMesh,
  LinearToneMapping,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  RectAreaLight,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ImagePixelatedContext } from "@/contexts/ImagePixelatedContext";
import { ImageCroppedContext } from "@/contexts/ImageCroppedContext";

import pixelateImg from "@/libs/pixelate";
import AmbientLightControl from "@/libs/3d/controls/AmbientLightControl";
import DirectionalLightControl from "@/libs/3d/controls/DirectionalLightControl";
import RectLightControl from "@/libs/3d/controls/RectLightControl";
import MaterialControl from "@/libs/3d/controls/MaterialControl";
import RendererControl from "@/libs/3d/controls/RendererControl";

const ThreeScene = ({ blockSize }) => {
  const containerRef = useRef(null);
  //const [savedJson, setSavedJson] = useState(null);
  const { croppedImage } = useContext(ImageCroppedContext);

  const { colorsArray, setColorsArray, xBlocks, yBlocks, setPixelatedImage } =
    useContext(ImagePixelatedContext);

  useEffect(() => {
    const scene = new Scene();
    const gui = new GUI();
    gui.close();
    const xs = Math.floor(xBlocks / blockSize);
    const ys = Math.floor(yBlocks / blockSize);

    pixelateImg(croppedImage, xs, ys).then((data) => {
      const { imageURL, colorsArray } = data;
      setColorsArray(colorsArray);
      setPixelatedImage(imageURL);

      if (typeof window !== "undefined") {
        const camera = new PerspectiveCamera(75, 800 / 600, 2, 1000);
        const cameraZPosition = Math.max(blockSize * xs, blockSize * ys);
        camera.position.z = cameraZPosition;
        camera.updateProjectionMatrix();

        const renderer = new WebGLRenderer({ antialias: true });

        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFShadowMap;

        renderer.toneMappingExposure = 1;

        renderer.toneMapping = LinearToneMapping;
        containerRef.current?.appendChild(renderer.domElement);

        const rectLight = new RectAreaLight(0xffffff, 1, 24, 1);
        const ambientlight = new AmbientLight(0xffffff, 1);
        const directionalLight = new DirectionalLight(0xffffff, 2);
        directionalLight.castShadow = true;
        //config cotrols
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 10;
        controls.maxDistance = cameraZPosition * 1.2;
        controls.enablePan = false;
        controls.maxPolarAngle = MathUtils.degToRad(120);
        controls.minPolarAngle = MathUtils.degToRad(60);
        controls.maxAzimuthAngle = MathUtils.degToRad(30);
        controls.minAzimuthAngle = MathUtils.degToRad(-30);
        controls.update();
        scene.add(ambientlight);
        scene.add(rectLight);
        scene.add(directionalLight);
        const material = new MeshStandardMaterial({ color: 0xffffff });

        paintBlocks(scene, colorsArray, material);

        // Render the scene and camera
        const renderScene = () => {
          renderer.render(scene, camera);
          requestAnimationFrame(renderScene);
        };

        // Call the renderScene function to start the animation loop
        renderScene();

        AmbientLightControl(gui, ambientlight);
        //let dirLightShadowMapViewer = new ShadowMapViewer(directionalLight);

        let shadowHelper = new CameraHelper(directionalLight.shadow.camera);
        shadowHelper.visible = false;
        //scene.add(shadowHelper);

        DirectionalLightControl(gui, directionalLight, shadowHelper);

        scene.add(directionalLight.target);
        scene.add(directionalLight);
        DirectionalLightControl(gui, directionalLight);
        RectLightControl(gui, rectLight);
        MaterialControl(gui, material);
        RendererControl(gui, renderer);

        fetch("/jueves_config.json")
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log("jueves_config", data);
            gui.load(data);
          })
          .catch((error) => console.error("Error fetching the json:", error));
      }
    });
    return () => {
      console.log("desmontando");
      removeObjWithChildren(scene);
      gui.destroy();
      containerRef.current?.removeChild(containerRef.current.children[0]);
    };
  }, [blockSize]);

  //limpiar la escena
  function removeObjWithChildren(obj) {
    while (obj.children.length > 0) {
      removeObjWithChildren(obj.children[0]);
    }
    if (obj.geometry) {
      obj.geometry.dispose();
    }
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        for (const material of obj.material) {
          if (material.map) {
            material.map.dispose();
          }
          material.dispose();
        }
      } else {
        if (obj.material.map) {
          obj.material.map.dispose();
        }
        obj.material.dispose();
      }
    }
    if (obj.parent) {
      obj.parent.remove(obj);
    }
  }

  const paintBlocks = (scene, allColors, material) => {
    const loader = new OBJLoader();
    //removeObjWithChildren(scene); //remover bloques
    loader.load("/CUBO.obj", function (object) {
      console.log("cubo cargado");
      paintFrame(scene, object.children[0].geometry, allColors, material); //despues de cargado el cubo entonces dibuja
    });
  };

  const paintFrame = (scene, blockGeometry, allColors, material) => {
    //let cornerX;
    //let cornerY;

    blockGeometry.scale(blockSize, blockSize, blockSize);

    //const numBlocks = xBlocks * yBlocks;

    const currentXBlocks = xBlocks / blockSize; //la cantidad de bloques disminuye si aumenta el tama;o del bloque
    const currentYBlock = xBlocks / blockSize;
    // Calcula el desplazamiento necesario para que (0, 0, 0) quede en el centro del cuadro
    const offsetX = -(currentXBlocks - 1) * blockSize * 0.5;
    const offsetY = -(currentYBlock - 1) * blockSize * 0.5;

    /*if (blockSize === 1) {
      cornerX = -xBlocks / 2 + 0.5;
      cornerY = (yBlocks * blockSize) / 2 - 0.5;
    } else {
      cornerX = (-xBlocks * 2) / 2 + 1;
      cornerY = (yBlocks * 2) / 2 - 1;
    }*/

    //create a matrix to store blocks rotation angles
    /*let matrixRotations = new Array(yBlocks);
    for (let index = 0; index < matrixRotations.length; index++) {
      matrixRotations[index] = new Array(xBlocks);
    }*/

    const diffuseMaps = [
      "/textures/Textura1_Albedo.jpg",
      "/textures/Textura2_Albedo.jpg",
      "/textures/Textura3_Albedo.jpg",
      "/textures/Textura4_Albedo.jpg",
      // Agrega más texturas aquí
    ];

    const roughnessMaps = [
      "/textures/Textura1_Roughness.jpg",
      "/textures/Textura2_Roughness.jpg",
      "/textures/Textura3_Roughness.jpg",
      "/textures/Textura4_Roughness.jpg",
    ];

    const normalMaps = [
      "/textures/Textura1_Normal.jpg",
      "/textures/Textura2_Normal.jpg",
      "/textures/Textura3_Normal.jpg",
      "/textures/Textura4_Normal.jpg",
    ];

    const diffuseTextures = [];
    const roughnessTextures = [];
    const normalTextures = [];
    const textureLoader = new TextureLoader();
    //cargar texturas diffuse
    for (const texturePath of diffuseMaps) {
      const texture = textureLoader.load(texturePath);
      diffuseTextures.push(texture);
    }
    //cargar texturas roughness
    for (const texturePath of roughnessMaps) {
      const texture = textureLoader.load(texturePath);
      roughnessTextures.push(texture);
    }

    for (const texturePath of normalMaps) {
      const texture = textureLoader.load(texturePath);
      normalTextures.push(texture);
    }

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

    //de cada bloque guarda su color y su posicion y el materrial que le toca
    let blockInfos = allColors.map((color, index) => {
      const matrix = new Matrix4();
      const fila = Math.floor(index / currentXBlocks);
      const columna = index % currentXBlocks;
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
        currentXBlocks
      );

      const randomRotation =
        availableRotations[
          Math.floor(Math.random() * availableRotations.length)
        ];

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
      const allColors = new InstancedBufferAttribute(
        new Float32Array(blocksForMaterial.length * 3),
        3
      );

      blocksForMaterial.forEach((blockInfo, instanceIndex) => {
        instancedMesh.setMatrixAt(instanceIndex, blockInfo.matrix);
        let color = new Color(rgbC(blockInfo.color));
        allColors.setXYZ(instanceIndex, color.r, color.g, color.b);
      });

      instancedMesh.geometry.setAttribute("color", allColors);
      instancedMesh.instanceMatrix.needsUpdate = true;

      scene.add(instancedMesh);
    });
  };

  const getAvailableRotations = (index, blockInfos, currentXBlocks) => {
    let rotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]; // 0, 90, 180, 270 grados
    let usedRotations = [];

    // Adyacente Norte
    if (index >= currentXBlocks) {
      usedRotations.push(blockInfos[index - currentXBlocks].rotation);
    }

    // Adyacente Sur
    let newIndex = index + Number(currentXBlocks);
    if (newIndex < blockInfos.length) {
      usedRotations.push(blockInfos[newIndex].rotation);
    }

    // Adyacente Este
    if (index % currentXBlocks !== currentXBlocks - 1) {
      usedRotations.push(blockInfos[index + 1].rotation);
    }

    // Adyacente Oeste
    if (index % currentXBlocks !== 0) {
      usedRotations.push(blockInfos[index - 1].rotation);
    }

    let availableRotations = rotations.filter(
      (rotation) => !usedRotations.includes(rotation)
    );

    return availableRotations;
  };

  //Create color string
  const rgbC = (arr) => {
    return "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
  };

  return <div className="scene-container" ref={containerRef} />;
};

export default ThreeScene;
