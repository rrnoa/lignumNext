import * as THREE from '../three.module.js';

	function createMaterial(gui, material) {

			const constants = {

				combine: {

					'THREE.MultiplyOperation': THREE.MultiplyOperation,
					'THREE.MixOperation': THREE.MixOperation,
					'THREE.AddOperation': THREE.AddOperation

				},

				side: {

					'THREE.FrontSide': THREE.FrontSide,
					'THREE.BackSide': THREE.BackSide,
					'THREE.DoubleSide': THREE.DoubleSide

				},

				blendingMode: {

					'THREE.NoBlending': THREE.NoBlending,
					'THREE.NormalBlending': THREE.NormalBlending,
					'THREE.AdditiveBlending': THREE.AdditiveBlending,
					'THREE.SubtractiveBlending': THREE.SubtractiveBlending,
					'THREE.MultiplyBlending': THREE.MultiplyBlending,
					'THREE.CustomBlending': THREE.CustomBlending

				},

				equations: {

					'THREE.AddEquation': THREE.AddEquation,
					'THREE.SubtractEquation': THREE.SubtractEquation,
					'THREE.ReverseSubtractEquation': THREE.ReverseSubtractEquation

				},

				destinationFactors: {

					'THREE.ZeroFactor': THREE.ZeroFactor,
					'THREE.OneFactor': THREE.OneFactor,
					'THREE.SrcColorFactor': THREE.SrcColorFactor,
					'THREE.OneMinusSrcColorFactor': THREE.OneMinusSrcColorFactor,
					'THREE.SrcAlphaFactor': THREE.SrcAlphaFactor,
					'THREE.OneMinusSrcAlphaFactor': THREE.OneMinusSrcAlphaFactor,
					'THREE.DstAlphaFactor': THREE.DstAlphaFactor,
					'THREE.OneMinusDstAlphaFactor': THREE.OneMinusDstAlphaFactor

				},

				sourceFactors: {

					'THREE.DstColorFactor': THREE.DstColorFactor,
					'THREE.OneMinusDstColorFactor': THREE.OneMinusDstColorFactor,
					'THREE.SrcAlphaSaturateFactor': THREE.SrcAlphaSaturateFactor

				}

			};

			function getObjectsKeys( obj ) {

				const keys = [];

				for ( const key in obj ) {

					if ( obj.hasOwnProperty( key ) ) {

						keys.push( key );

					}

				}

				return keys;

			}

			const textureLoader = new THREE.TextureLoader();

			let URL = wp_variables.resources_path;

			
			const diffuseMaps = ( function () {

				const wood = textureLoader.load( URL+'/textures/brick_diffuse.jpg' );
				
				return {
					none: null,
					wood1: wood
				};

			} )();

			const roughnessMaps = ( function () {

				const wood = textureLoader.load( URL+'/textures/brick_roughness.jpg' );
				return {
					none: null,
					wood1: wood
				};

			} )();

			const displacementMaps = ( function () {

				const displacement = textureLoader.load( URL+'/textures/displacement1.jpg' );
				return {
					none: null,
					displacement1: displacement
				};

			} )();

			const bumpMaps = ( function () {

				const bump = textureLoader.load( URL+'/textures/bumpMap1.jpg' );
				return {
					none: null,
					bumpmap1: bump
				};

			} )();

			const normalMaps = ( function () {
				const bump = textureLoader.load( URL+'/textures/wood_normal.jpg' );
				return {
					none: null,
					bumpmap1: bump
				};

			} )();

			
			
			const diffuseMapKeys = getObjectsKeys( diffuseMaps );
			const roughnessMapKeys = getObjectsKeys( roughnessMaps );
			const bumpMapKeys = getObjectsKeys( bumpMaps );
			const displamentMapKeys = getObjectsKeys( displacementMaps );
			const normalMapKeys = getObjectsKeys( normalMaps );

			function handleColorChange( color ) {

				return function ( value ) {

					if ( typeof value === 'string' ) {

						value = value.replace( '#', '0x' );

					}

					color.setHex( value );

				};

			}

			function needsUpdate( material ) {

				return function () {

					material.side = parseInt( material.side ); //Ensure number
					material.needsUpdate = true;
					/*geometry.attributes.position.needsUpdate = true;
					geometry.attributes.normal.needsUpdate = true;
					geometry.attributes.color.needsUpdate = true;*/

				};

			}

			function updateCombine( material ) {

				return function ( combine ) {

					material.combine = parseInt( combine );
					material.needsUpdate = true;

				};

			}

			function updateTexture( material, materialKey, textures ) {
				return function ( key ) {

					material[ materialKey ] = textures[ key ];
					material.needsUpdate = true;

				};

			}

			function guiMeshStandardMaterial( material ) {

				const data = {
					color: material.color.getHex(),
					emissive: material.emissive.getHex(),
					map: diffuseMapKeys[ 0 ],
					roughnessMap: roughnessMapKeys[ 0 ],
					bumpMap: bumpMapKeys[ 0 ],
					displacementMap: displamentMapKeys[ 0 ],
					normalMap: normalMapKeys[0],
					//alphaMap: alphaMapKeys[ 0 ]
				};

				const folder = gui.addFolder( 'THREE.MeshStandardMaterial' );

				folder.addColor( data, 'color' ).onChange( handleColorChange( material.color ) );
				folder.addColor( data, 'emissive' ).onChange( handleColorChange( material.emissive ) );
				folder.add( material, 'emissiveIntensity', 0, 1 );



				folder.add( material, 'roughness', 0, 1 );
				folder.add( material, 'metalness', 0, 1 );
				//folder.add( material, 'flatShading' ).onChange( needsUpdate( material, geometry ) );
				folder.add( material, 'wireframe' );
				//folder.add( material, 'vertexColors' ).onChange( needsUpdate( material, geometry ) );
				//folder.add( material, 'fog' ).onChange( needsUpdate( material, geometry ) );
				//folder.add( data, 'envMaps', envMapKeysPBR ).onChange( updateTexture( material, 'envMap', envMaps ) );
				folder.add( data, 'map', diffuseMapKeys ).onChange( updateTexture( material, 'map', diffuseMaps ) );
				folder.add( data, 'roughnessMap', roughnessMapKeys ).onChange( updateTexture( material, 'roughnessMap', roughnessMaps ) );
				
				folder.add( data, 'displacementMap', displamentMapKeys ).onChange( updateTexture( material, 'displacementMap', displacementMaps ) );
				folder.add( material, 'displacementScale', 0, 10 );
				
				folder.add( data, 'bumpMap', bumpMapKeys ).onChange( updateTexture( material, 'bumpMap', bumpMaps ) );
				folder.add( material, 'bumpScale', 0, 1 );

				folder.add( data, 'normalMap', normalMapKeys ).onChange( updateTexture( material, 'normalMap', normalMaps ) );
				//folder.add( material, 'bumpScale', 0, 1 );

				//folder.add( data, 'alphaMap', alphaMapKeys ).onChange( updateTexture( material, 'alphaMap', alphaMaps ) );
				folder.close();
				// TODO metalnessMap

			}
			guiMeshStandardMaterial( material );	

			//guiScene( gui, scene );			
			
return material;
}

export default createMaterial;
