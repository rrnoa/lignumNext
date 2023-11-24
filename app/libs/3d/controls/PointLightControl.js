function PointLightControl(gui, bulbLight, shadowHelper) {
  let folder = gui.addFolder("BulbLight");
  folder.add(bulbLight.position, "x", -100, 100);
  folder.add(bulbLight.position, "y", -100, 100);
  folder.add(bulbLight.position, "z", -100, 100);

  // ref for lumens: http://www.power-sure.com/lumens.htm
  const bulbLuminousPowers = {
    "110000 lm (1000W)": 110000,
    "3500 lm (300W)": 3500,
    "1700 lm (100W)": 1700,
    "800 lm (60W)": 800,
    "400 lm (40W)": 400,
    "180 lm (25W)": 180,
    "20 lm (4W)": 20,
    Off: 0,
  };
  const helpObject = {
    show: false,
  };

  folder.add(bulbLight, "power", bulbLuminousPowers);
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

  folder.close();
}
export default PointLightControl;
