function DirectionalLightControl(gui, light, shadowHelper) {
  function updateLight() {
    light.target.updateMatrixWorld();
    if (shadowHelper) shadowHelper.update();
  }

  const helpObject = {
    show: false,
  };

  let folder = gui.addFolder("DirectionalLight");
  folder.add(light.position, "x", -100, 100);
  folder.add(light.position, "y", -100, 100);
  folder.add(light.position, "z", -100, 100);

  folder.add(light, "intensity", 0, 100, 0.01);
  folder.add(light, "castShadow");
  folder.add(light, "shadow.mapSize.x", [0, 512, 1024, 4096, 16384]); //512 default must be power of 2
  folder.add(light, "shadow.mapSize.y", [0, 512, 1024, 4096, 16384]); // default

  let folderTarget = folder.addFolder("Target");
  folderTarget.add(light.target.position, "x", -100, 100).onChange(updateLight);
  folderTarget.add(light.target.position, "y", -100, 100).onChange(updateLight);
  folderTarget.add(light.target.position, "z", -100, 100).onChange(updateLight);
  if (shadowHelper) {
    folder
      .add(helpObject, "show")
      .name("Show Shadow Helper")
      .onChange((value) => {
        console.log(value);
        if (value) {
          shadowHelper.visible = true;
        } else {
          shadowHelper.visible = false;
        }
      });
  }

  folderTarget.close();
  folder.close();
}

export default DirectionalLightControl;
