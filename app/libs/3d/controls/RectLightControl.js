import * as THREE from "three";
import { RectAreaLightUniformsLib } from "./RectAreaLightUniformsLib.js";
//import { RectAreaLightHelper } from "../RectAreaLightHelper.js";

function RectLightControl(gui, light) {
  RectAreaLightUniformsLib.init();

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  let folder;

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

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    //folder = gui.addFolder(name);
    folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
    folder.add(vector3, "y", 0, 80).onChange(onChangeFn);
    folder.add(vector3, "z", -10, 20).onChange(onChangeFn);
    folder.close();
  }

  light.position.set(0, 15, 8);
  light.rotation.x = THREE.MathUtils.degToRad(-64);

  /*const helper = new RectAreaLightHelper(light);
    light.add(helper);*/

  folder = gui.addFolder("RectAreaLight");
  folder.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
  folder.add(light, "intensity", 0, 10, 0.01);
  folder.add(light, "width", 0, 100);
  folder.add(light, "height", 0, 50);
  folder
    .add(new DegRadHelper(light.rotation, "x"), "value", -180, 180)
    .name("x rotation");
  folder
    .add(new DegRadHelper(light.rotation, "y"), "value", -180, 180)
    .name("y rotation");
  folder
    .add(new DegRadHelper(light.rotation, "z"), "value", -180, 180)
    .name("z rotation");

  makeXYZGUI(gui, light.position, "position");

  return light;
}

export default RectLightControl;
