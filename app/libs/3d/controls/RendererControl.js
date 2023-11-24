import * as THREE from "three";

function RendererControl(gui, renderer) {
  const constants = {
    toneMapping: {
      "THREE.NoToneMapping": THREE.NoToneMapping,
      "THREE.ReinhardToneMapping": THREE.ReinhardToneMapping,
      "THREE.LinearToneMapping": THREE.LinearToneMapping,
      "THREE.CineonToneMapping": THREE.CineonToneMapping,
      "THREE.ACESFilmicToneMapping": THREE.ACESFilmicToneMapping,
      "THREE.CustomToneMapping": THREE.CustomToneMapping,
    },
    shadowsType: {
      "THREE.BasicShadowMap": THREE.BasicShadowMap,
      "THREE.PCFShadowMap": THREE.PCFShadowMap,
      "THREE.PCFSoftShadowMap": THREE.PCFSoftShadowMap,
      "THREE.VSMShadowMap": THREE.VSMShadowMap,
    },
  };
  let folder = gui.addFolder("Renderer");
  folder.add(renderer, "toneMappingExposure", 0, 1);
  folder.add(renderer, "toneMapping", constants.toneMapping);
  folder.add(renderer.shadowMap, "type", constants.shadowsType);

  folder.close();
}

export default RendererControl;
