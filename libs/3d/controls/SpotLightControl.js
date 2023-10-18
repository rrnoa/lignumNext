import * as THREE from "../three.module.js";

function SpotLightControl(gui, light, desc, shadowHelper) {
  let folder,
    folderPosition,
    folderTarget,
    loadedScene = {};
  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  class DegRadHelper {
    constructor(obj, prop) {
      this.obj = obj;
      this.prop = prop;
    }
    get value() {
      return THREE.MathUtils.radToDeg(this.obj[this.prop]);
    }
    set value(v) {
      this.obj[this.prop] = THREE.MathUtils.degToRad(v);
    }
  }

  {
    //const helper = new THREE.SpotLightHelper(light);
    //light.add(helper);

    function updateLight() {
      light.target.updateMatrixWorld();
      //helper.update();
      if (shadowHelper) shadowHelper.update();
    }
    updateLight();

    const helpObject = {
      show: false,
    };
    const data = {
      shadowMapSizeWidth: 512,
      shadowMapSizeHeight: 512,
      bias: 0,
    };
    folder = gui.addFolder(desc);
    folder.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
    folder.add(light, "intensity", 0, 200, 0.01).listen();
    folder.add(light, "distance", 0, 100).listen().onChange(updateLight);
    folder
      .add(new DegRadHelper(light, "angle"), "value", 0, 90)
      .name("angle")
      .onChange(updateLight);
    folder.add(light, "penumbra", 0, 1, 0.01).listen();
    folder.add(light, "decay", 0, 2).listen();
    folder
      .add(data, "shadowMapSizeWidth", [256, 512, 1024, 2048, 4096])
      .onChange(() => updateShadowMapSize());
    folder
      .add(data, "shadowMapSizeHeight", [256, 512, 1024, 2048, 4096])
      .onChange(() => updateShadowMapSize());
    folder
      .add(data, "bias", -0.0001, 0.0001, 0.00001)
      .onChange(() => updateBias());

    function updateBias() {
      light.shadow.bias = data.bias;
    }

    function updateShadowMapSize() {
      light.shadow.mapSize.width = data.shadowMapSizeWidth;
      light.shadow.mapSize.height = data.shadowMapSizeHeight;
      light.shadow.map = null;
    }

    if (shadowHelper) {
      folder
        .add(helpObject, "show")
        .name("Show Shadow Helper")
        .onChange((value) => {
          if (value) {
            shadowHelper.visible = true;
          } else {
            shadowHelper.visible = false;
          }
        });
    }

    folderPosition = folder.addFolder("Position");
    folderPosition.add(light.position, "x", -100, 100).onChange(updateLight);
    folderPosition.add(light.position, "y", -100, 100).onChange(updateLight);
    folderPosition.add(light.position, "z", -100, 100).onChange(updateLight);

    folderTarget = folder.addFolder("Target");
    folderTarget.add(light.target.position, "x", -10, 10).onChange(updateLight);
    folderTarget.add(light.target.position, "y", -10, 10).onChange(updateLight);
    folderTarget.add(light.target.position, "z", -10, 10).onChange(updateLight);

    folder.close();
  }

  return light;
}

export default SpotLightControl;
