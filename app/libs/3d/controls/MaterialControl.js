import * as THREE from "three";
function createMaterial(gui, material, geometry) {
  const constants = {
    combine: {
      "THREE.MultiplyOperation": THREE.MultiplyOperation,
      "THREE.MixOperation": THREE.MixOperation,
      "THREE.AddOperation": THREE.AddOperation,
    },

    side: {
      "THREE.FrontSide": THREE.FrontSide,
      "THREE.BackSide": THREE.BackSide,
      "THREE.DoubleSide": THREE.DoubleSide,
    },

    blendingMode: {
      "THREE.NoBlending": THREE.NoBlending,
      "THREE.NormalBlending": THREE.NormalBlending,
      "THREE.AdditiveBlending": THREE.AdditiveBlending,
      "THREE.SubtractiveBlending": THREE.SubtractiveBlending,
      "THREE.MultiplyBlending": THREE.MultiplyBlending,
      "THREE.CustomBlending": THREE.CustomBlending,
    },

    equations: {
      "THREE.AddEquation": THREE.AddEquation,
      "THREE.SubtractEquation": THREE.SubtractEquation,
      "THREE.ReverseSubtractEquation": THREE.ReverseSubtractEquation,
    },

    destinationFactors: {
      "THREE.ZeroFactor": THREE.ZeroFactor,
      "THREE.OneFactor": THREE.OneFactor,
      "THREE.SrcColorFactor": THREE.SrcColorFactor,
      "THREE.OneMinusSrcColorFactor": THREE.OneMinusSrcColorFactor,
      "THREE.SrcAlphaFactor": THREE.SrcAlphaFactor,
      "THREE.OneMinusSrcAlphaFactor": THREE.OneMinusSrcAlphaFactor,
      "THREE.DstAlphaFactor": THREE.DstAlphaFactor,
      "THREE.OneMinusDstAlphaFactor": THREE.OneMinusDstAlphaFactor,
    },

    sourceFactors: {
      "THREE.DstColorFactor": THREE.DstColorFactor,
      "THREE.OneMinusDstColorFactor": THREE.OneMinusDstColorFactor,
      "THREE.SrcAlphaSaturateFactor": THREE.SrcAlphaSaturateFactor,
    },
  };

  function handleColorChange(color) {
    return function (value) {
      if (typeof value === "string") {
        value = value.replace("#", "0x");
      }

      color.setHex(value);
    };
  }

  function needsUpdate() {
    return function () {
      material.side = parseInt(material.side); //Ensure number
      material.needsUpdate = true;
    };
  }

  function guiMaterial() {
    const folder = gui.addFolder("THREE.Material");

    folder.add(material, "transparent").onChange(needsUpdate());
    folder.add(material, "opacity", 0, 1).step(0.01);
    folder.add(material, "depthTest");
    folder.add(material, "depthWrite");
    folder.add(material, "alphaTest", 0, 1).step(0.01).onChange(needsUpdate());
    folder.add(material, "side", constants.side).onChange(needsUpdate());
    folder.close();
  }

  function guiMeshStandardMaterial() {
    const data = {
      color: material.color.getHex(),
      emissive: material.emissive.getHex(),
    };

    const folder = gui.addFolder("THREE.MeshStandardMaterial");

    folder.addColor(data, "color").onChange(handleColorChange(material.color));

    folder
      .addColor(data, "emissive")
      .onChange(handleColorChange(material.emissive));
    folder.add(material, "emissiveIntensity", 0, 1);

    folder.add(material, "roughness", 0, 1);
    folder.add(material, "metalness", 0, 1);
    folder.add(material, "flatShading").onChange(needsUpdate());
    folder.add(material, "wireframe");
    folder.add(material, "vertexColors").onChange(needsUpdate());
    folder.add(material, "fog").onChange(needsUpdate());

    let controlsNormal = {
      normalScaleX: 1.0, // Valor inicial para la escala X
      normalScaleY: 1.0, // Valor inicial para la escala Y
    };
    folder
      .add(controlsNormal, "normalScaleX", -10, 10)
      .onChange(function (value) {
        // Actualizar la escala X del normalMap
        material.normalScale.x = value;
      })
      .name("Normal Scale X");

    folder
      .add(controlsNormal, "normalScaleY", -10, 10)
      .onChange(function (value) {
        // Actualizar la escala Y del normalMap
        material.normalScale.y = value;
      })
      .name("Normal Scale Y");

    folder.add(material, "aoMapIntensity", 0, 1);

    // TODO metalnessMap
  }

  function chooseFromHash(selectedMaterial = "MeshStandardMaterial") {
    //const selectedMaterial = window.location.hash.substring( 1 ) || 'MeshBasicMaterial';

    switch (selectedMaterial) {
      case "MeshStandardMaterial":
        //material = new THREE.MeshStandardMaterial( { color: 0x049EF4 } );
        guiMaterial();
        guiMeshStandardMaterial();

        // only use scene environment
        return material;

        break;
    }
  }

  chooseFromHash();
  return material;
}
export default createMaterial;
