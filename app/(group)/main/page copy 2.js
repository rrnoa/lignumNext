"use client";
import IconButton from '@/app/components/IconButton';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import getCroppedImg, { adjustTilt, adjustContrast, adjustBrightness, adjustHue } from "@/app/libs/cropImage";
import Scene3d from "@/app/components/Scene3d";
import BuyPanel from '@/app/components/BuyPanel';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import debounce from 'lodash/debounce';
import Switch from "react-switch";

export default function Main() {

	const canvasRef = useRef(null); // Referencia al canvas
	const [uploadedImage, setUploadedImage] = useState("");
	const [originalImage, setOriginalImage] = useState("");
	const [intermediateImage, setIntermediateImage] = useState("");

	const [currentStep, setCurrentStep] = useState(1);

	const [theme, setTheme] = useState('light'); // Valor predeterminado

	// Función para cambiar el tema
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	/*useEffect(() => {
		// Inicializa el canvas cuando el componente se monta
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const image = new Image();
		image.onload = () => {
		  canvas.width = image.width;
		  canvas.height = image.height;
		  ctx.drawImage(image, 0, 0);
		};
		image.src = originalImage;
		console.log("useeffect", originalImage);
	  }, [originalImage]);

	const updateCanvas = (newImageSrc) => {
	// Función para actualizar el canvas
	const canvas = canvasRef.current;
	const ctx = canvas.getContext('2d');
	const image = new Image();
	image.onload = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(image, 0, 0);
	};
	image.src = newImageSrc;
	};*/


	// Efecto para actualizar el atributo data-theme
	useEffect(() => {
		console.log('data-theme', theme);
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);
	
	const [pixelInfo, setPixelInfo] = useState({ // informacion de la imagen pixelada
		colorsArray: [],
		croppedImg: ""
	});

  // Definir tus filtros y las imágenes de muestra para cada uno  

	const [activeButton, setActiveButton] = useState("brightness"); 
	const [adjustments, setAdjustments] = useState({       // Ajustes aplicados
		tilt: 0,
		brightness: 0,
		contrast: 0,
		hue: 0
	});

	const [currentState, setCurrentState] = useState("upload");//upload,crop,view	
    
    /*Opciones del crop */
    const [width, setWidth] = useState(24);
    const [height, setHeight] = useState(24);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
	const [croppedImg, setCroppedImg] = useState();

	const [blockSize, setBlockSize] = useState(2);//1,2,3	

	// Función para avanzar al siguiente paso
	const goToNextStep = () => {
		setCurrentStep(prevStep => prevStep + 1);
	};
	
	  // Función para retroceder al paso anterior
	const goToPreviousStep = () => {
		setCurrentStep(prevStep => prevStep - 1);
		if(currentState === 'view') setCurrentState('crop');
	};
	
    /**
     * Cuando se hace crop
     */
    const onCropComplete = async (croppedArea, croppedAreaPixels) => {
		console.log("crop complete");
    	const cropUrl = await getCroppedImg(uploadedImage, croppedAreaPixels);
		setCroppedImg(cropUrl); //actualiza el context
    };

    /** cuando se sube una imagen */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
		  const img = URL.createObjectURL(file);
          setUploadedImage(img);
		  setOriginalImage(img);
		  setCurrentState("crop");
		  setCurrentStep(2);
        }
    };

	/**
	 * Cambio en las dimensiones
	 */
	const handleWidth = (event) => {
		let { min, max, value } = event.target;		
		//value = Math.max(Number(min), Math.min(Number(max), Number(value)));
		setWidth(value);
		setBlockSize(value %2 == 0 ? 2 : 1);
	};	
	
	const handleHeight = (event) => {
		let { min, max, value } = event.target;
		//value = Math.max(Number(min), Math.min(Number(max), Number(value)));
		setHeight(value);
		setBlockSize(value %2 == 0 ? 2 : 1);
	};	

	//cuando se hace click sobre el candado
	const handleInputsLock = () => {		
		goToNextStep();
	};

	// Función para aplicar el cambio cuando el usuario selecciona otro boton de control
	const applyAllAdjustments = async () => {
		let newImage = originalImage;
		if (adjustments.tilt !== 0) {
		  newImage = await adjustTilt(newImage, adjustments.tilt);
		}
		if (adjustments.brightness !== 0) {
		  newImage = await adjustBrightness(newImage, adjustments.brightness);
		}
		if (adjustments.contrast !== 0) {
		  newImage = await adjustContrast(newImage, adjustments.contrast);
		}

		setIntermediateImage(newImage);
		setUploadedImage(newImage);
		
	};
	/**
	 * Cuando se mueve el slider
	 */
	const handleSliderChange = async (value) => {

		const newValue = parseInt(value);
	  
		// Actualiza el ajuste activo
		const newAdjustments = {
		  ...adjustments,
		  [activeButton]: newValue
		};
		setAdjustments(newAdjustments);
		let newImage = intermediateImage || originalImage; // Usa la imagen intermedia si está disponible	  
	  
		// Aplica solo el ajuste correspondiente al botón activo
		switch (activeButton) {
		  case 'tilt':
			newImage = await adjustTilt(newImage, newValue);
			break;
		  case 'brightness':
			newImage = await adjustBrightness(newImage, newValue);
			break;
		  case 'contrast':
			newImage = await adjustContrast(newImage, newValue);
			break;		 
		  default:
			break;
		}
	  
		setUploadedImage(newImage);
	};

	/**
	 * Cambia tamaño de bloques
	 */
	const handlerBlockSize = (size) =>{
		setBlockSize(size);
	}
	/**
	 * Click sobre uno de los botones de edicion
	 */
	const editBtnHandler = (btn) => {
		applyAllAdjustments();
		setActiveButton(btn);	
	}	

	//Cuando se preciona el boton de mostrar el 3d
	const handleView = () => {
		setCurrentState("view");
		goToNextStep();
	}

	const PreviewImg = () => {
		const imageSrc = croppedImg || "images/default.jpeg";
		const isDefaultImage = imageSrc === "images/default.jpeg";
	
		return (			
				<img 
					src={imageSrc} 
					alt="Preview" 
					className={isDefaultImage ? "default" : "crop"}
				/>
		);
	}

	const handleDarkMode = ()=> {
		setDarkMode(darkMode => !darkMode);
	}
	
  return (
    <>
		<header className="header-area">
			<div className="header-item">
				<div className="header-item-inner">
					<a href="#"><img src="images/logo.svg" alt=""/></a>					
				</div>
				<div className="header-item-inner2">
				<label>					
					<Switch 
					onChange={toggleTheme} 
					checked={theme == 'dark'?true:false}					
					onColor={'#121212'}
					uncheckedIcon = {
						<div
							style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
							fontSize: 20,
							padding: '7px'
							}}
						>
						<img src="images/sun-2-svgrepo.svg" alt=""/>
						</div>
					}
					checkedIcon = {
						<div
							style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
							fontSize: 20,
							padding: '7px'
							}}
						>
							<img  src="images/moon-svgrepo.svg" alt=""/>
						</div>					
				}

					/>
				</label>
				</div>										
			</div>	
		</header>	

		<section className="step-area" >
			<div className="step-area-inner">
				<div className="step-item" >
					<div className="step-item-inner">
					<canvas ref={canvasRef} style={{ display: 'none' }} /> {/* Agrega el canvas al DOM */}
                        {currentState == "crop" && (
                            <Cropper
                            image={uploadedImage}
                            crop={crop}
                            zoom={zoom}
							zoomSpeed={0.1}
                            aspect={width / height}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            />
                        )}
                        {currentState=="upload" && (
                            <>
                                <input type="file" onChange={handleImageChange} accept="image/*" />
                                <div className="step-item-inner2" >
                                    <img src="images/upload-svgrepo.svg" alt=""/>
                                    <p style={{fontWeight: '700'}}>Step 1: Upload your media or drop it here</p>
                                </div>
                            </>                               
                            )
                        }
						{currentState == "view" && (
							<Scene3d 
							width={width}
							height={height}
							blockSize={blockSize}
							croppedImg = {croppedImg}
							setPixelInfo = {setPixelInfo}
							/>
						)}
                   
					</div>
				</div>
				<div className="step-item2">
					<div className={`step-item2-inner step-item2-inner10 ${currentStep === 1 ? "step inactive" : ""}`} style={{paddingBottom: '0px'}}>
						<div className="step-item2-inner11" style={{backgroundColor: "grey"}}>
							<PreviewImg/>
							<button className='action_buttons btn-preview-upload'>
								<img className="upload-icon" src="images/gallery-send-svgrepo.svg" alt="Upload" style={{cursor: 'pointer'}}></img>
							</button>
							
							<input type="file" onChange={handleImageChange} accept="image/*"/>							
						</div>
					</div>
					<div className={`step-item2-inner2 step-item2-inner10 ${currentStep === 1 || currentStep !== 2 ? "step inactive" : ""}`}>
						<h2>Step 2: Input panel size</h2>
						
						<div className="form">
							<div className="inputs">
								<input id='input_w' className="input_w" type="number" min="24" max="300" value={width} 
								onChange={handleWidth}
								onFocus={(even)=>{even.target.select()}}
								/>
								<label htmlFor="input_w">W</label>					
								<input id='input_h' className="input_h" type="number" min="24" max="300" value={height} 
								onChange={handleHeight}
								onFocus={(even)=>{even.target.select()}}
								/>	
								<label htmlFor="input_h">H</label>											
							</div>
							<Tippy content="Confirm">
								<button className='action_buttons' onClick={handleInputsLock}>
									<img className={`btn-icons ${currentStep == 2?"chake-icon":""}`} src={currentStep == 2?"images/lock-keyhole-unlocked-svgrepo.svg":"images/lock-keyhole-svgrepo.svg"} alt="Reset"/>
								</button>	
							</Tippy>		
														
						</div>
					</div>
					<div className={`step-item2-inner3 step-item2-inner10 ${currentStep === 1 || currentStep !== 3 ? "step inactive" : ""}`}>
						<h2>Step 3: Edit your image</h2>
						<div className='wrapper_edit_buttons'>
							<div className='buttons-list'>								
								<IconButton 
									isActive={activeButton == "tilt"?true:false} 
									onClick={() => editBtnHandler("tilt")} 
									icon="images/tilt.svg" 
									activeIcon="images/tilt-active.svg" 
								/>
								<IconButton 
										isActive={activeButton == "contrast"?true:false} 
										onClick={() => editBtnHandler("contrast")} 
										icon="images/contrast.svg" 
										activeIcon="images/contrast-active.svg" 
								/>
								<IconButton 
										isActive={activeButton == "brightness"?true:false}
										onClick={() => editBtnHandler("brightness")} 
										icon="images/brightness.svg" 
										activeIcon="images/brightness-active.svg" 
									/>			
							</div>
							<Tippy content="Back one step">
								<button className='action_buttons' onClick={ () => goToPreviousStep()}><img className='btn-icons' src="images/undo-left-round.svg" alt=""/></button>
							</Tippy>

						</div>
						
						<div className="step-item2-inner12">
							<div id="slider-range-min">								
									<input
									type="range"
									className="range--brand"
									min="-100"
									max="100"
									value={adjustments[activeButton]}
									onChange={(e) => handleSliderChange(e.target.value)}
									//onMouseUp={sliderUpHandler}
									/>
							</div>
						</div>
						<div style={{display: 'flex', justifyContent: 'right'}}>
							<a href="#" onClick={handleView}>3D Panel Preview</a>
						</div>
					</div>
					<div className={`step-item2-inner5 step-item2-inner10 ${currentStep === 1 || currentStep !== 4 ? "step inactive" : ""}`}>
						<h2>Step 4: Select block size</h2>
						<div className='wrapper_edit_buttons'>
							<div className='buttons-list'>
								<Tippy content="1” blocks">
									<button className={blockSize == 1?"active":""} onClick={() => handlerBlockSize(1)}>1”</button>
								</Tippy>
								<Tippy content="2” blocks">
									<button className={`${blockSize == 2?"active":""} ${(width % 2 !== 0) || (height%2 !==0) ?"inactive":""}`} onClick={() => handlerBlockSize(2)}>2”</button>
								</Tippy>
								<Tippy content={(width % 3 !== 0) || (height%3 !==0) ?"inactive":"3” blocks"}>
									<button className={`${blockSize == 3?"active":""} ${(width % 3 !== 0) || (height%3 !==0) ?"inactive":""}`} onClick={() => handlerBlockSize(3)}>3”</button>
								</Tippy>
							</div>
							<Tippy content="Back one step">
								<button className='action_buttons' onClick={() => goToPreviousStep()}><img className='btn-icons' src="images/undo-left-round.svg" alt=""/></button>
							</Tippy>
						</div>
						
					</div>
					<div className={`step-item2-inner6 ${currentStep === 1 || currentStep !== 4 ? "step inactive" : ""}`}>
						<h2>Step 5: Buying options</h2>
						<BuyPanel
						pixelatedImage = {pixelInfo.pixelatedImage}
						colorsArray = {pixelInfo.colorsArray}
						blockSize = {blockSize}
						xBlocks = {Math.floor(width / blockSize)}
						yBlocks = {Math.floor(height / blockSize)}
						/>
						<a id="woodxel_panel_3d" href="#">3D Model <strong style={{fontSize: '1.2rem'}}>&nbsp;$25</strong></a>
					</div>
				</div>
			</div>
		</section>		
    </>
  )
}
