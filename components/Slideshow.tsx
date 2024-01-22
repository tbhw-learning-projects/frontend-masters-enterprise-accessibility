import React, { useState, useRef, useEffect, useCallback } from 'react';

const Slideshow = ({ imageData = [], imagePath = '/slideshow/' }) => {
	let [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	let [fullScreenMode, setFullScreenMode] = useState(false);

	const btnFullScreenRef = useRef(null);
	const btnCloseRef = useRef(null);
	const slideshowWrapperRef = useRef(null);

	console.log(imageData);

	const decrementSlide = useCallback(() => {
		if (currentSlideIndex > 0) {
			setCurrentSlideIndex(currentSlideIndex - 1);
		} else {
			setCurrentSlideIndex(imageData.length - 1);
		}
	}, [currentSlideIndex, imageData.length]);
	const incrementSlide = useCallback(() => {
		if (currentSlideIndex < imageData.length - 1) {
			setCurrentSlideIndex(currentSlideIndex + 1);
		} else {
			setCurrentSlideIndex(0);
		}
	}, [currentSlideIndex, imageData.length]);
	const changeSlide = useCallback((index: number) => {
		setCurrentSlideIndex(index);
	}, []);
	const enterFullScreen = () => {
		setFullScreenMode(true);
	};
	const closeFullScreen = () => {
		setFullScreenMode(false);
	};
	const handleScreenClick = (event) => {
		if (slideshowWrapperRef.current === event.target) {
			closeFullScreen();
		}
	};

	useEffect(() => {
		function handleKeys(event: KeyboardEvent) {
			if (event.code === 'Escape') {
				closeFullScreen();
			}
			if (['ArrowRight', 'ArrowUp'].includes(event.code)) {
				incrementSlide();
			}
			if (['ArrowLeft', 'ArrowDown'].includes(event.code)) {
				decrementSlide();
			}
			if (['Numpad', 'Digit'].some((substring) => event.code.includes(substring))) {
				const keyValue = Number(event.code[event.code.length - 1]);
				const indexValue = keyValue - 1;
				const overflowProtectedIndex = (indexValue + imageData.length) % imageData.length;
				changeSlide(overflowProtectedIndex);
			}
		}

		window.addEventListener('keydown', handleKeys);

		return () => window.removeEventListener('keydown', handleKeys);
	}, [incrementSlide, decrementSlide, changeSlide, imageData.length]);

	return (
		<>
			<button
				className="btn-slideshow-fullscreen"
				onClick={fullScreenMode ? closeFullScreen : enterFullScreen}
				ref={btnFullScreenRef}
				aria-label={`${fullScreenMode ? 'Exit' : 'Enter'} full screen view`}>
				<span className="icon"></span>
			</button>
			<div
				ref={slideshowWrapperRef}
				className={`inspiration-slideshow ${fullScreenMode ? 'fullscreen' : ''}`}
				onClick={(event) => handleScreenClick(event)}
				onKeyDown={(e) => console.log(e)}>
				<div
					className="slideshow-container"
					aria-live="polite"
					aria-roledescription="Image Slideshow"
					role={fullScreenMode ? 'application' : 'region'}>
					{imageData &&
						imageData.map((image, index) => {
							return (
								<figure className={`slide fade ${currentSlideIndex === index ? 'active' : ''}`} key={index}>
									<p className="numbertext">
										{index + 1} / {imageData.length}
									</p>
									<img src={`${imagePath}${image.src}`} alt={image.alt} style={{ width: '100%' }} />
									<figcaption className="text">{image.caption}</figcaption>
								</figure>
							);
						})}

					<button aria-label="Previous photo" className="prev" onClick={() => decrementSlide()}>
						&#10094;
					</button>
					<button aria-label="Next photo" className="next" onClick={() => incrementSlide()}>
						&#10095;
					</button>
				</div>
				<br />

				<ul className="dots">
					{imageData.map((image, index) => (
						<li key={index}>
							<button
								aria-label={`Go to image ${index + 1}`}
								className={`dot ${currentSlideIndex === index ? 'active' : ''}`}
								onClick={() => changeSlide(index)}></button>
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default Slideshow;
