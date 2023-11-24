import { BufferGeometry, BufferAttribute, FrontSide, Color } from "../three.module.js";

const makeBlock = (cubeObj) => {
    
    let newCube = cubeObj.clone();   
    
    let mult = getRotation(matrix, x, Math.abs(y)); //determinar el 'angulo de rotacion

    newCube.rotateZ( Math.PI * mult);
    
    newCube.position.x = cornerX + x;
    newCube.position.y =  cornerY + y;    

    return newCube;    
}

export default makeBlock;