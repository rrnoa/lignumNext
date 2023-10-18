import * as THREE from "three";

function dof(gui, bokehPass) {
  let params = {
    aperture: 0.0005,
    maxblur: 0.004,
  };

  const folder = gui.addFolder("DOF");
  folder.add(params, "aperture", 0.0, 0.05, 0.000001).onChange((value) => {
    bokehPass.uniforms["aperture"].value = value;
  });
  folder.add(params, "maxblur", 0.0, 0.05, 0.00001).onChange((value) => {
    bokehPass.uniforms["maxblur"].value = value;
  });
}

export default dof;
