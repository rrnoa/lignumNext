import { BufferGeometry, BufferAttribute, FrontSide, Color } from "../three.module.js";

const makeBlock = (blockSize = 1) => {
    
    const geometry = new BufferGeometry();

    const vertices1 = new Float32Array( [
        // Front
         - 0.5, 0.7, 0.5,
         0.5, 0.7, 0.5, 
         - 0.5, 0, 0.5, 
         0.5, 0, 0.5,
         // Back
         0.5, 1, - 0.5,
         - 0.5, 1, - 0.5,
         0.5, 0, - 0.5,
         - 0.5, 0, - 0.5,
         // Left
         - 0.5, 1, - 0.5,
         - 0.5, 0.7, 0.5, 
         - 0.5, 0, - 0.5,
         - 0.5, 0, 0.5,
         // Right
         0.5, 0.7, 0.5, 
         0.5, 1, - 0.5,
         0.5, 0, 0.5, 
         0.5, 0, - 0.5, 
         // Top
         - 0.5, 0.7, 0.5,
         0.5, 0.7, 0.5, 
         - 0.5, 1, - 0.5,
         0.5, 1, - 0.5, 
         // Bottom
         0.5, 0, 0.5,
         - 0.5, 0, 0.5,
         0.5, 0, - 0.5,
         - 0.5, 0, - 0.5,
     ] );

     const vertices2 = new Float32Array( [
        // Front
         -1, 1.4, 1,
         1, 1.4, 1, 
         -1, 0, 1, 
         1, 0, 1,
         // Back
         1, 2, -1,
         -1, 2, -1,
         1, 0, -1,
         -1, 0, -1,
         // Left
         -1, 2, -1,
         -1, 1.4, 1, 
         -1, 0, -1,
         -1, 0, 1,
         // Right
         1, 1.4,1, 
         1, 2, -1,
         1, 0, 1, 
         1, 0, -1, 
         // Top
         -1, 1.4, 1,
         1, 1.4, 1, 
         -1, 2, -1,
         1, 2, -1, 
         // Bottom
         1, 0, 1,
         -1, 0, 1,
         1, 0, -1,
         -1, 0, -1,
     ] );
     
     const indices = [
        0, 2, 1,
		2, 3, 1,
		4, 6, 5,
		6, 7, 5,
		8, 10, 9,
		10, 11, 9,
		12, 14, 13,
		14, 15, 13,
		16, 17, 18,
		18, 17, 19,
		20, 21, 22,
		22, 21, 23
    ];

    const uvs = new Float32Array(
        [
           0,0,
           1,0,
           0,1,
           1,1,
    
           0,0,
           1,0,
           0,1,
           1,1,
    
           0,0,
           1,0,
           0,1,
           1,1,
    
           0,0,
           1,0,
           0,1,
           1,1,
    
           0,0,
           1,0,
           0,1,
           1,1,
    
           0,0,
           1,0,
           0,1,
           1,1,
        ]);

     
    geometry.setAttribute( 'uv', new BufferAttribute( new Float32Array(uvs), 2 ) );
     
    geometry.setIndex( indices );

    // itemSize = 3 because there are 3 values (components) per vertex
    if(blockSize === 1) {
        geometry.setAttribute( 'position', new BufferAttribute( vertices1, 3 ) );
    } else {
        geometry.setAttribute( 'position', new BufferAttribute( vertices2, 3 ) );
    }
    geometry.computeVertexNormals();
    geometry.rotateX(Math.PI/2);
    
    return geometry;
}

export default makeBlock;