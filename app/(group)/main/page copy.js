"use client";
import IconButton from '@/app/components/IconButton';
import React, { useState, useEffect, useRef } from 'react';
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import getCroppedImg, { adjustTilt, adjustContrast, adjustBrightness, adjustHue } from "@/app/libs/cropImage";
import {applyGrayscale, applySepia, applyWarmFilter, applyColdFilter, applyInvertFilter} from "@/app/libs/filters";
import Scene3d from "@/app/components/Scene3d";
import BuyPanel from '@/app/components/BuyPanel';

export default function Main() {

	const [uploadedImage, setUploadedImage] = useState("");
	const [originalImage, setOriginalImage] = useState("");
	const [intermediateImage, setIntermediateImage] = useState("");

	const [activeSlider, setActiveSlider] = useState('adjustments'); // Puede ser 'adjustments' o 'filters'
  	const [selectedFilter, setSelectedFilter] = useState('none'); // El filtro seleccionado actual
	
	const [pixelInfo, setPixelInfo] = useState({ // informacion de la imagen pixelada
		colorsArray: [],
		croppedImg: ""
	});

  // Definir tus filtros y las imágenes de muestra para cada uno
  const filters = [
    { name: 'None', imageSrc: 'images/filter.png' },
    { name: 'Sepia', imageSrc: 'images/filter.png' },
    { name: 'Grayscale', imageSrc: 'images/filter.png' },
	{ name: 'Warm', imageSrc: 'images/filter.png' },
    { name: 'Cold', imageSrc: 'images/filter.png' },
	{ name: 'Inverter', imageSrc: 'images/filter.png' },    
  ];

	const [activeButton, setActiveButton] = useState("brightness"); 
	const [adjustments, setAdjustments] = useState({       // Ajustes aplicados
		tilt: 0,
		brightness: 0,
		contrast: 0,
		hue: 0
	});

	const [currentState, setCurrentState] = useState("upload");//upload,crop,view
	const [blockSize, setBlockSize] = useState(2);//1,2,3
    
    /*Opciones del crop */
    const [width, setWidth] = useState(24);
    const [height, setHeight] = useState(24);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
	const [croppedImg, setCroppedImg] = useState();
    /**
     * Cuando se hace crop
     */
    const onCropComplete = async (croppedArea, croppedAreaPixels) => {
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
        }
    };
	/**
	 * Cambio en las dimensiones
	 */
	const handleWidth = (event) => {
		let { min, max, value } = event.target;
		//value = Math.max(Number(min), Math.min(Number(max), Number(value)));
		setWidth(value);
	};
	
	const handleHeight = (event) => {
		let { min, max, value } = event.target;
		//value = Math.max(Number(min), Math.min(Number(max), Number(value)));
		setHeight(value);
	};

	// Función para aplicar el cambio cuando el usuario selecciona otro boton de control
	const applyAllAdjustments = async () => {
		let newImage = originalImage;
		console.log(adjustments);
		if (adjustments.tilt !== 0) {
		  newImage = await adjustTilt(newImage, adjustments.tilt);
		}
		if (adjustments.brightness !== 0) {
		  newImage = await adjustBrightness(newImage, adjustments.brightness);
		}
		if (adjustments.contrast !== 0) {
		  newImage = await adjustContrast(newImage, adjustments.contrast);
		}

		// Aplicar el filtro seleccionado
		switch (selectedFilter) {
			case 'Grayscale':
			  newImage = await applyGrayscale(newImage);
			  break;
			case 'Sepia':
			  newImage = await applySepia(newImage);
			  break;
			case 'Warm':
			  newImage = await applyWarmFilter(newImage);
			  break;
			case 'Cold':
			  newImage = await applyColdFilter(newImage);
			  break;
			case 'Inverter':
			  newImage = await applyInvertFilter(newImage);
			  break;
			// Añadir más casos para otros filtros si es necesario
			case 'None':
			default:
			  // No aplicar ningún filtro si 'None' es seleccionado o por defecto
			  break;
		  }
	  	setIntermediateImage(newImage);
		setUploadedImage(newImage);
	};	  

	/**
	 * Cuando se mueve el slider
	 */
	const handleSliderChange = async (e) => {
		const newValue = parseInt(e.target.value);
	  
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
		setActiveSlider("adjustments");		
	}

	const handleFilterSelection = async (filterName) => {
		// Aplica el filtro seleccionado a la imagen
		setSelectedFilter(filterName);
		
		let newImage = intermediateImage || originalImage; // Usa la imagen intermedia si está disponible

				// Aplica solo el ajuste correspondiente al botón activo
				switch (filterName) {
					case 'Sepia':
					  newImage = await applySepia(newImage);
					  break;
					case 'Grayscale':
					  newImage = await applyGrayscale(newImage);
					  break;
					case 'Inverter':
					  newImage = await applyInvertFilter(newImage);
					  break;		 
					case 'Warm':
					  newImage = await applyWarmFilter(newImage);
					  break;		 
					case 'Cold':
					  newImage = await applyColdFilter(newImage);
					  break;		 
					default:
					  break;
				  }
				
				  setUploadedImage(newImage);

	  };

	//Cuando se preciona el boton de mostrar el 3d
	const handleView = () => {		
		if(currentState !== "view") { // para no hacer llamadas innecesarias
			console.log("show 3d");
		}
		setCurrentState("view");
	}
	
  return (
    <>
		<header className="header-area">
			<div className="header-item">
				<div className="header-item-inner">
					<a href="#"><img src="images/logo.svg" alt=""/></a>
				</div>
				<div className="header-item-inner2">
					<ul>
						<li><i className="fas fa-moon"></i></li>
						<li className="active"><i className="far fa-sun"></i></li>
					</ul>
				</div>							
			</div>	
		</header>	

		<section className="step-area">
			<div className="step-area-inner">
				<div className="step-item">
					<div className="step-item-inner">
                        {currentState == "crop" && (
                            <Cropper
                            image={uploadedImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={width / height}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            />
                        )}
                        {currentState=="upload" && (
                            <>
                                <input type="file" onChange={handleImageChange} accept="image/*" />
                                <div className="step-item-inner2">
                                    <img src="images/step-01.svg" alt=""/>
                                    <p>Clicked here to upload or drop media here</p>
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
				<div className="step-item2" style={{backgroundColor: "blue"}}>
					<div className="step-item2-inner step-item2-inner10">
						<div className="step-item2-inner11" style={{backgroundColor: "grey"}}>
							<img src={croppedImg || "images/step-02.png"} alt=""/>
							<input type="file"/>
						</div>
					</div>
					<div className="step-item2-inner2 step-item2-inner10">
						<h2>Step 2: Panel size <span></span></h2>
						
						<div className="form">
							<div className="inputs">
								<input type="number" placeholder="W: 24”" value={width} onChange={handleWidth}/>							
								<input type="number" placeholder="H: 24”" value={height} onChange={handleHeight}/>							
							</div>
							<div>
								<img src="images/step-03.svg" alt=""/>							
							</div>
						</div>
					</div>
					<div className="step-item2-inner3 step-item2-inner10">
						<h2>Step 3: Edit and Preview</h2>
						<div className='wrapper_edit_buttons'>
							<ul>
								<li>
								<IconButton 
									isActive={activeButton == "tilt"?true:false} 
									onClick={() => editBtnHandler("tilt")} 
									icon="/images/tilt.svg" 
									activeIcon="/images/tilt-active.svg" 
								/>
								</li>								
								<li>
									<IconButton 
										isActive={activeButton == "contrast"?true:false} 
										onClick={() => editBtnHandler("contrast")} 
										icon="/images/contrast.svg" 
										activeIcon="/images/contrast-active.svg" 
									/>
								</li>								
								<li>
									<IconButton 
										isActive={activeButton == "brightness"?true:false}
										onClick={() => editBtnHandler("brightness")} 
										icon="/images/brightness.svg" 
										activeIcon="/images/brightness-active.svg" 
									/>		
								</li>
													
							</ul>
							<button className='action_buttons'><img src="images/step-08.svg" alt=""/></button>

						</div>
						
						<div className="step-item2-inner12">
							<div id="slider-range-min">
								{activeSlider === 'adjustments' ? (
									<input
									type="range"
									className="range--brand"
									min="-100"
									max="100"
									value={adjustments[activeButton]}
									onChange={handleSliderChange}
									//onMouseUp={sliderUpHandler}
									/>
									) : (
										<div className="filter-slider">
										<ul>
										  {filters.map((filter) => (
											<li key={filter.name}
											className={selectedFilter === filter.name ? 'selected' : ''}
											onClick={() => handleFilterSelection(filter.name)}
											>
											  <img src={filter.imageSrc} alt={filter.name} title={filter.name} />
											</li>
										  ))}
										</ul>
									  </div>
								)}					

							</div>
						</div>
						<a href="#" onClick={handleView}>3D Panel Preview</a>
					</div>
					<div className="step-item2-inner5 step-item2-inner10">
						<h2>Step 4: Select block size</h2>
						<div className='wrapper_edit_buttons'>
							<ul>
								<li><button className={blockSize == 1?"active":""} onClick={() => handlerBlockSize(1)}>1”</button></li>
								<li><button className={blockSize == 2?"active":""} onClick={() => handlerBlockSize(2)}>2”</button></li>
								<li><button className={blockSize == 3?"active":""} onClick={() => handlerBlockSize(3)}>3”</button></li>
							</ul>
							<button className='action_buttons'><img src="images/step-08.svg" alt=""/></button>
						</div>
						
					</div>
					<div className="step-item2-inner6">
						<h2>Step 5: Buy now</h2>
						<BuyPanel
						pixelatedImage = {pixelInfo.pixelatedImage}
						colorsArray = {pixelInfo.colorsArray}
						blockSize = {blockSize}
						xBlocks = {Math.floor(width / blockSize)}
						yBlocks = {Math.floor(height / blockSize)}
						/>
						<a id="woodxel_panel_3d" href="#">WOODXEL Panel + 3D</a>
					</div>
				</div>
			</div>
		</section>		
    </>
  )
}
