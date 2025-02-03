"use strict"

document.addEventListener("click", documentActions)
function documentActions(e) {
	const targetElement = e.target
	if (targetElement.closest('.icon-menu')) {
		document.body.classList.toggle('menu-open')
	}
	if (targetElement.closest('[data-spoiler]')) {
		const currentElement = targetElement.closest('[data-spoiler]')
		if (!currentElement.nextElementSibling.classList.contains('--sliding')) {
			currentElement.classList.toggle('open')
		}
		slideToggle(currentElement.nextElementSibling, 400)
	}
	if (targetElement.closest('.rating__input')) {
		const ratingParentEl = targetElement.closest('.rating')
		const ratingInput = targetElement.closest('.rating__input')
		ratingParentEl.classList.contains('rating--set') ? starRatingGet(ratingParentEl, ratingInput) : null
	}
	if (targetElement.closest('[data-tabs-button]')) {
		const currentBtnItem = targetElement.closest('LI')
		if (targetElement.closest('LI')) setTab(currentBtnItem)
	}
	if (targetElement.closest('[aria-pressed]')) {
		const currentBtn = targetElement.closest('[aria-pressed]')
		showPass(currentBtn)
	}
	const dropdownBlock = document.querySelector('[data-dropdown-list]')
	if (dropdownBlock) {
		const currentBtn = targetElement.closest('[data-dropdown-list-btn]')
		if (currentBtn) {
			const targetDropdownBlock = currentBtn.parentElement
			targetDropdownBlock.classList.toggle('open')

			if (document.documentElement.clientWidth < 767.98) {
				const nextElement = currentBtn.nextElementSibling
				if (targetDropdownBlock.classList.contains('open') && nextElement) {
					const heightBlock = nextElement.offsetHeight
					targetDropdownBlock.style.marginBottom = `${heightBlock + 25}px`
				} else {
					targetDropdownBlock.style.marginBottom = ''
				}
			}
		}
		else if (dropdownBlock.classList.contains('open') && !targetElement.closest('[data-dropdown-list]')) {
			dropdownBlock.classList.remove('open')
			dropdownBlock.style.marginBottom = ''
		}
	}
}
document.addEventListener('DOMContentLoaded', () => {
	function clearErrorOnFocus(inputs, errorBlock){
		inputs.forEach(inputField => {
			inputField.addEventListener('focus', function () {
				inputs.forEach(inputItem => {
					inputItem.classList.remove('error');
				})
				if (errorBlock.textContent.length !== 0) errorBlock.textContent = '';
			})
		})
	}	
	if (document.getElementById('validation-form')) {
		const form = document.getElementById('validation-form');
		const fields = form.querySelectorAll('[data-validate]');
		const errorMessages = {
			 email: 'Please enter a valid email',
			 phone: 'Please enter a valid phone number',
			 required: 'This field cannot be empty',
		};
  
		const validateField = (field) => {
			 const value = field.value.trim();
			 const validationType = field.dataset.validate;
			 let errorDiv = field.parentElement.querySelector('.authentication-form__error');
			 if (!errorDiv) {
				  errorDiv = document.createElement('DIV');
				  errorDiv.className = 'authentication-form__error';
			 }
			 if (!value) {
				  errorDiv.textContent = errorMessages.required;
				  field.parentElement.append(errorDiv); 
				  field.classList.add('error');
				  return false;
			 }
			 let isValid = true;
			 if (validationType === 'email') {
				  isValid = validator.isEmail(value);
			 } else if (validationType === 'phone') {
				  isValid = validator.isMobilePhone(value, 'ru-RU');
			 }
			 if (!isValid) {
				  errorDiv.textContent = errorMessages[validationType];
				  field.parentElement.append(errorDiv);
				  field.classList.add('error');
				  return false;
			 }
			 field.classList.remove('error');
			 if (errorDiv) {
				  errorDiv.remove();
			 }
			 return true;
		};
  
		form.addEventListener('submit', (event) => {
			 event.preventDefault();
			 let isFormValid = true;
			 fields.forEach((field) => {
				  const isValid = validateField(field);
				  if (!isValid) isFormValid = false;
			 });
			//  ---------------------------------
		});
  
		fields.forEach((field) => {
			 field.addEventListener('focus', () => {
				  const errorDiv = field.parentElement.querySelector('.authentication-form__error');
				  if (errorDiv) {
						field.classList.remove('error');
						errorDiv.remove();
				  }
			 });
		});
   }
	if(document.getElementById('change-password-form')){
		const passForm = document.getElementById('change-password-form')
		passForm.addEventListener('submit', (event) => {
			event.preventDefault()
			const newPass = document.getElementById('input-pass-first').value.trim()
			const confirmPass = document.getElementById('input-pass-sec').value.trim()
			const errorMessages = {
				passwordMismatch: 'Passwords do not match',
				fieldsEmpty: 'Fields cannot be empty',
			};
			let isValid = true
			const errorDiv = passForm.querySelector('[data-error-field]')
	
			if (errorDiv) {
				if (!newPass || !confirmPass) {
					errorDiv.textContent = errorMessages.fieldsEmpty
					errorDiv.style.display = 'block';
					isValid = false
				} else if (newPass !== confirmPass) {
					errorDiv.textContent = errorMessages.passwordMismatch
					errorDiv.style.display = 'block';
					isValid = false
				}
			}
			const fields = passForm.querySelectorAll('input')
			if (!isValid) {
				fields.forEach((field) => {
					field.classList.add('error');
				})
			}
			clearErrorOnFocus(fields, errorDiv)
		})
	}
	if(document.getElementById('authentication-form')){
		const authForm = document.getElementById('authentication-form')
		authForm.addEventListener('submit', (event) => {
			event.preventDefault()
			const authFields = authForm.querySelectorAll('input')
			const errorMessages = {
				fieldsEmpty: 'Fields cannot be empty',
			};
			const inpValLogin = authFields[0].value.trim()
			const inpPassLogin = authFields[1].value.trim()
			const errorDiv = authForm.querySelector('[data-error-field]')
			let isValid = true
			if(errorDiv){
				if(!inpValLogin || !inpPassLogin){
					errorDiv.textContent = errorMessages.fieldsEmpty
					errorDiv.style.display = 'block';
					isValid = false
				}
			}
			if (!isValid) {
				authFields.forEach((field) => {
					field.classList.add('error');
				})
			}
			clearErrorOnFocus(authFields, errorDiv)
		})
	}
});
const updateMarginForBlock = () => {
	const dropdownBlock = document.querySelector('[dropdown-list]')
	if (dropdownBlock && dropdownBlock.classList.contains('open')) {
		dropdownBlock.classList.remove('open')
		dropdownBlock.style.marginBottom = ''
	}
}
window.addEventListener('resize', updateMarginForBlock)
function starRatingGet(ratingParentEl, ratingInput) {
	const currentUserRating = parseInt(ratingInput.value)
	const resultRating = 2.3
	starRatingSet(ratingParentEl, resultRating)
}
function starRatingSet(ratingParentEl, ratingValue) {
	const ratingItemsList = ratingParentEl.querySelectorAll('.rating__item')
	const numbFullStars = parseInt(ratingValue)
	const partOfStar = ratingValue - numbFullStars
	ratingItemsList.forEach((item, i) => {
		item.classList.remove('rating__item--active')
		item.querySelector('SPAN') ? item.querySelector('span').remove() : null
		if (i <= (numbFullStars - 1)) {
			item.classList.add('rating__item--active')
		} else if (partOfStar && i === numbFullStars) {
			const newSpan = document.createElement('SPAN')
			newSpan.style.width = `${100 * partOfStar}%`
			item.append(newSpan)
		}
	})
}
const ratings = document.querySelectorAll('[data-rating]')
if (ratings) {
	ratings.forEach(ratingEl => {
		let ratingValue = ratingEl.dataset.rating ? parseFloat(ratingEl.dataset.rating) : 0
		starRatingSet(ratingEl, ratingValue)
		if (ratingEl.querySelector('.rating__value') && ratingValue) ratingEl.querySelector('.rating__value').innerText = ratingValue
	})
}
function checkScreenWidth() {
	const targetElements = document.querySelectorAll('.menu-footer__title')
	const classNameList = ['spoilers-title', '_icon-chevron-down']
	function updateClass() {
		if (window.innerWidth < 551) {
			for (const element of targetElements) {
				element.classList.add(classNameList[0])
				element.classList.add(classNameList[1])
			}
		} else {
			for (const element of targetElements) {
				element.classList.remove(classNameList[0])
				element.classList.remove(classNameList[1])
			}
		}
	}
	updateClass()
	window.addEventListener('resize', updateClass)
}
checkScreenWidth()
const heroSlider = document.querySelector('.slider-hero')
if (heroSlider) {
	let swiper
	const initSwiper = (autoHeightValue) => {
		swiper = new Swiper('.slider-hero__swiper', {
			loop: true,
			autoHeight: autoHeightValue,
			speed: 800,
			parallax: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.slider-hero__pagination',
				clickable: true,
			},

			navigation: {
				nextEl: '.slider-hero__next-button',
				prevEl: '.slider-hero__prev-button',
			},
		});
	};
	const updateSwiper = () => {
		const screenWidth = window.innerWidth;
		const autoHeight = screenWidth <= 767.98;
		if (swiper) swiper.destroy(true, true);
		initSwiper(autoHeight);
	};
	updateSwiper();
	window.addEventListener('resize', updateSwiper);
}
const newSlider = document.querySelector('.new-arrival__swiper');
if (newSlider) {
	new Swiper('.new-arrival__swiper', {
		loop: true,
		autoHeight: true,
		speed: 800,
		spaceBetween: 38,
		slidesPerView: 4,
		navigation: {
			nextEl: '.new-arrival__swiper-button-next',
			prevEl: '.new-arrival__swiper-button-prev',
		},
		breakpoints: {
			320: {
				slidesPerView: 1.5,
				spaceBetween: 10
			},
			479.98: {
				slidesPerView: 2,
				spaceBetween: 15
			},
			600: {
				slidesPerView: 3,
				spaceBetween: 15
			},
			767.98: {
				slidesPerView: 4,
				spaceBetween: 20
			},
			991.98: {
				spaceBetween: 38
			}
		}
	});
}
const reviewsSlider = document.querySelector('.reviews__slider');
if (reviewsSlider) {
	new Swiper('.reviews__slider', {
		loop: true,
		speed: 800,
		spaceBetween: 23,
		slidesPerView: 3,
		pagination: {
			el: '.reviews__swiper-pagination',
			clickable: true
		},
		breakpoints: {
			320: {
				spaceBetween: 10,
				slidesPerView: 1.3,

			},
			479.98: {
				spaceBetween: 18,
				slidesPerView: 2,

			},
			991.98: {
				spaceBetween: 23,
				slidesPerView: 3,
			}
		}
	});
}
const reviewsProductSlider = document.querySelector('.reviews-element');
if (reviewsProductSlider) {
	new Swiper('.reviews-element__slider', {
		loop: true,
		speed: 800,
		spaceBetween: 23,
		slidesPerView: 2,
		pagination: {
			el: '.reviews-element__swiper-pagination',
			clickable: true
		},
		breakpoints: {
			320: {
				spaceBetween: 10,
				slidesPerView: 1.3,

			},
			479.98: {
				spaceBetween: 18,
				slidesPerView: 2,

			},
		}
	});
}
const productSlider = document.querySelector('.product-item__images');
if (productSlider) {
	const slideImages = document.querySelectorAll('.product-item__slide img')
	if (slideImages.length) {
		const thumbSliderCnt = document.createElement('DIV')
		thumbSliderCnt.setAttribute('thumbsSlider', '')
		thumbSliderCnt.className = 'product-item__thumb-slider thumb-slider'
		const thumbSliderSwiper = document.createElement('DIV')
		thumbSliderSwiper.className = 'thumb-slider__slider swiper'

		const thumbSliderWrapper = document.createElement('DIV')
		thumbSliderWrapper.className = 'thumb-slider__wrapper swiper-wrapper'
		for (const img of slideImages) {
			const thumbSlide = document.createElement('DIV')
			thumbSlide.className = 'thumb-slider__slide swiper-slide'
			const imgCopy = img.cloneNode(false)
			let newSrc = imgCopy.getAttribute('src').replace('/products/', '/products/thumbs/')
			imgCopy.src = newSrc
			thumbSlide.append(imgCopy)
			thumbSliderWrapper.append(thumbSlide)
		}
		thumbSliderSwiper.append(thumbSliderWrapper)
		thumbSliderCnt.append(thumbSliderSwiper)

		const arrowButtons = document.createElement('DIV')
		arrowButtons.className = 'thumb-slider__arrows'
		const buttonPrev = document.createElement('BUTTON')
		buttonPrev.className = 'thumb-slider__arrow thumb-slider__arrow--up _icon-chevron-up'
		buttonPrev.setAttribute('type', 'button')
		arrowButtons.append(buttonPrev)
		const buttonNext = document.createElement('BUTTON')
		buttonNext.className = 'thumb-slider__arrow thumb-slider__arrow--down _icon-chevron-down'
		buttonNext.setAttribute('type', 'button')
		arrowButtons.append(buttonNext)
		thumbSliderCnt.append(arrowButtons)

		productSlider.prepend(thumbSliderCnt)
	}

	const productThumbSwiper = new Swiper(".thumb-slider__slider", {
		loop: true,
		direction: "vertical",
		spaceBetween: 17,
		slidesPerView: 3,
		speed: 600,
	});
	const productSwiper = new Swiper(".product-item__slider", {
		loop: true,
		slidesPerView: 1,
		spaceBetween: 0,
		speed: 600,
		navigation: {
			nextEl: ".thumb-slider__arrow--down",
			prevEl: ".thumb-slider__arrow--up",
		},
		keyboard: {
			enabled: true,
		},
		thumbs: {
			swiper: productThumbSwiper,
		},
	});
}
const simpleSpoilers = document.querySelectorAll('[data-simple-spoiler]')
if (simpleSpoilers.length) {
	simpleSpoilers.forEach(spoiler => {
		spoiler.dataset.simpleSpoiler !== 'open' ? spoiler.nextElementSibling.hidden = true : spoiler.classList.add('active')
	});
}
function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}
function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
	});
	if (media.length) {
		const breakpointsArray = [];
		media.forEach(item => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			mdQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				})
			});
			return mdQueriesArray;
		}
	}
}
let slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty('height') : null;
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			!showmore ? target.style.removeProperty('overflow') : null;
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			document.dispatchEvent(new CustomEvent("slideUpDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
let slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.hidden = target.hidden ? false : null;
		showmore ? target.style.removeProperty('height') : null;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			document.dispatchEvent(new CustomEvent("slideDownDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
let slideToggle = (target, duration = 500) => {
	target.hidden ? slideDown(target, duration) : slideUp(target, duration)
}
function spoilers() {
	const spoilersArray = document.querySelectorAll('[data-spoilers]');
	if (spoilersArray.length > 0) {
		document.addEventListener("click", setSpoilerAction);
		const spoilersRegular = Array.from(spoilersArray).filter(function (item, index, self) {
			return !item.dataset.spoilers.split(",")[0];
		});
		if (spoilersRegular.length) {
			initSpoilers(spoilersRegular);
		}
		let mdQueriesArray = dataMediaQueries(spoilersArray, "spoilers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initSpoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				initSpoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		function initSpoilers(spoilersArray, matchMedia = false) {
			spoilersArray.forEach(spoilersBlock => {
				spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
				if (matchMedia.matches || !matchMedia) {
					spoilersBlock.classList.add('_spoiler-init');
					initSpoilerBody(spoilersBlock);
				} else {
					spoilersBlock.classList.remove('_spoiler-init');
					initSpoilerBody(spoilersBlock, false);
				}
			});
		}
		function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
			let spoilerItems = spoilersBlock.querySelectorAll('details');
			if (spoilerItems.length) {
				spoilerItems.forEach(spoilerItem => {
					let spoilerTitle = spoilerItem.querySelector('summary');
					if (hideSpoilerBody) {
						spoilerTitle.removeAttribute('tabindex');
						if (!spoilerItem.hasAttribute('data-open')) {
							spoilerItem.open = false;
							spoilerTitle.nextElementSibling.hidden = true;
						} else {
							spoilerTitle.classList.add('_spoiler-active');
							spoilerItem.open = true;
						}
					} else {
						spoilerTitle.setAttribute('tabindex', '-1');
						spoilerTitle.classList.remove('_spoiler-active');
						spoilerItem.open = true;
						spoilerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpoilerAction(e) {
			const el = e.target;
			if (el.closest('summary') && el.closest('[data-spoilers]')) {
				e.preventDefault();
				if (el.closest('[data-spoilers]').classList.contains('_spoiler-init')) {
					const spoilerTitle = el.closest('summary');
					const spoilerBlock = spoilerTitle.closest('details');
					const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
					const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler');
					const scrollSpoiler = spoilerBlock.hasAttribute('data-spoiler-scroll');
					const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
					if (!spoilersBlock.querySelectorAll('._slide').length) {
						if (oneSpoiler && !spoilerBlock.open) {
							hideSpoilersBody(spoilersBlock);
						}

						!spoilerBlock.open ? spoilerBlock.open = true : setTimeout(() => { spoilerBlock.open = false }, spoilerSpeed);

						spoilerTitle.classList.toggle('_spoiler-active');
						slideToggle(spoilerTitle.nextElementSibling, spoilerSpeed);

						if (scrollSpoiler && spoilerTitle.classList.contains('_spoiler-active')) {
							const scrollSpoilerValue = spoilerBlock.dataset.spoilerScroll;
							const scrollSpoilerOffset = +scrollSpoilerValue ? +scrollSpoilerValue : 0;
							const scrollSpoilerNoHeader = spoilerBlock.hasAttribute('data-spoiler-scroll-noheader') ? document.querySelector('.header').offsetHeight : 0;

							window.scrollTo(
								{
									top: spoilerBlock.offsetTop - (scrollSpoilerOffset + scrollSpoilerNoHeader),
									behavior: "smooth",
								}
							);
						}
					}
				}
			}
			if (!el.closest('[data-spoilers]')) {
				const spoilersClose = document.querySelectorAll('[data-spoiler-close]');
				if (spoilersClose.length) {
					spoilersClose.forEach(spoilerClose => {
						const spoilersBlock = spoilerClose.closest('[data-spoilers]');
						const spoilerCloseBlock = spoilerClose.parentNode;
						if (spoilersBlock.classList.contains('_spoiler-init')) {
							const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
							spoilerClose.classList.remove('_spoiler-active');
							slideUp(spoilerClose.nextElementSibling, spoilerSpeed);
							setTimeout(() => { spoilerCloseBlock.open = false }, spoilerSpeed);
						}
					});
				}
			}
		}
		function hideSpoilersBody(spoilersBlock) {
			const spoilerActiveBlock = spoilersBlock.querySelector('details[open]');
			if (spoilerActiveBlock && !spoilersBlock.querySelectorAll('._slide').length) {
				const spoilerActiveTitle = spoilerActiveBlock.querySelector('summary');
				const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
				spoilerActiveTitle.classList.remove('_spoiler-active');
				slideUp(spoilerActiveTitle.nextElementSibling, spoilerSpeed);
				setTimeout(() => { spoilerActiveBlock.open = false }, spoilerSpeed);
			}
		}
	}
}
spoilers()
class DynamicAdapt {
	constructor(type) {
		this.type = type
	}
	init() {
		this.оbjects = []
		this.daClassname = '_dynamic_adapt_'
		this.nodes = [...document.querySelectorAll('[data-da]')]

		this.nodes.forEach((node) => {
			const data = node.dataset.da.trim()
			const dataArray = data.split(',')
			const оbject = {}
			оbject.element = node
			оbject.parent = node.parentNode
			оbject.destination = document.querySelector(`${dataArray[0].trim()}`)
			оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
			оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
			оbject.index = this.indexInParent(оbject.parent, оbject.element)
			this.оbjects.push(оbject)
		})

		this.arraySort(this.оbjects)

		this.mediaQueries = this.оbjects
			.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
			.filter((item, index, self) => self.indexOf(item) === index)

		this.mediaQueries.forEach((media) => {
			const mediaSplit = media.split(',')
			const matchMedia = window.matchMedia(mediaSplit[0])
			const mediaBreakpoint = mediaSplit[1]

			const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
			matchMedia.addEventListener('change', () => {
				this.mediaHandler(matchMedia, оbjectsFilter)
			})
			this.mediaHandler(matchMedia, оbjectsFilter)
		})
	}
	mediaHandler(matchMedia, оbjects) {
		if (matchMedia.matches) {
			оbjects.forEach((оbject) => {
				this.moveTo(оbject.place, оbject.element, оbject.destination)
			})
		} else {
			оbjects.forEach(({ parent, element, index }) => {
				if (element.classList.contains(this.daClassname)) {
					this.moveBack(parent, element, index)
				}
			})
		}
	}
	moveTo(place, element, destination) {
		element.classList.add(this.daClassname)
		if (place === 'last' || place >= destination.children.length) {
			destination.append(element)
			return
		}
		if (place === 'first') {
			destination.prepend(element)
			return
		}
		destination.children[place].before(element)
	}
	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname)
		if (parent.children[index] !== undefined) {
			parent.children[index].before(element)
		} else {
			parent.append(element)
		}
	}
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element)
	}
	arraySort(arr) {
		if (this.type === 'min') {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0
					}
					if (a.place === 'first' || b.place === 'last') {
						return -1
					}
					if (a.place === 'last' || b.place === 'first') {
						return 1
					}
					return 0
				}
				return a.breakpoint - b.breakpoint
			})
		} else {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0
					}
					if (a.place === 'first' || b.place === 'last') {
						return 1
					}
					if (a.place === 'last' || b.place === 'first') {
						return -1
					}
					return 0
				}
				return b.breakpoint - a.breakpoint
			})
			return
		}
	}
}
const da = new DynamicAdapt("max")
da.init()
const filterRange = document.querySelector('.price-filter__range')
if (filterRange) {
	const inputsFilterRange = document.querySelectorAll('.price-filter__input')

	noUiSlider.create(filterRange, {
		start: [20, 80],
		connect: true,
		range: {
			'min': 0,
			'max': 100
		}
	})
	filterRange.noUiSlider.on('update', function (values, handle) {
		inputsFilterRange[handle].value = `$${parseInt(values[handle])}`;
	})

	inputsFilterRange.forEach(function (input, handle) {
		input.addEventListener('change', function () {
			filterRange.noUiSlider.setHandle(handle, parseInt(this.value.replace('$', '')));
		});
		input.addEventListener('keydown', function (e) {
			let values = filterRange.noUiSlider.get();
			let value = Number(values[handle]);
			let steps = filterRange.noUiSlider.steps();
			let step = steps[handle];
			let position;
			switch (e.which) {
				case 13:
					filterRange.noUiSlider.setHandle(handle, parseInt(this.value.replace('$', '')));
					break;
				case 38:
					position = step[1];
					if (position === false) {
						position = 1;
					}
					if (position !== null) {
						filterRange.noUiSlider.setHandle(handle, value + position);
					}
					break;
				case 40:
					position = step[0];
					if (position === false) {
						position = 1;
					}
					if (position !== null) {
						filterRange.noUiSlider.setHandle(handle, value - position);
					}
					break;
			}
		});
	});
}
function addClassForSpan(arrLables, newClass) {
	for (const label of arrLables) {
		if (label.lastElementChild.tagName === 'SPAN') {
			label.lastElementChild.classList.add(newClass)
		}
	}
}
const menuFilter = document.querySelectorAll('.type-filter__item')
if (menuFilter.length) addClassForSpan(menuFilter, '_icon-chevron-right')
const productsCatalog = document.querySelector('.catalog__products')
if (productsCatalog) {
	loadProducts()
}
async function loadProducts() {
	const response = await fetch("../json/products.json", {
		method: "GET"
	})
	if (response.ok) {
		const responseData = await response.json()
		initProducts(responseData)
	}
}
function initProducts(data) {
	const productsList = data.products
	for (const product of productsList) {
		const itemProduct = document.createElement('ARTICLE')
		itemProduct.className = 'item-product'

		const linkImgProduct = document.createElement('A')
		linkImgProduct.className = 'item-product__img-link'
		linkImgProduct.setAttribute('href', product.url)
		if (product.image) {
			const imgProduct = document.createElement('IMG')
			imgProduct.src = product.image
			imgProduct.setAttribute('alt', product.altImage)
			linkImgProduct.append(imgProduct)
		}
		itemProduct.append(linkImgProduct)

		const favoriteBtnProduct = document.createElement('BITTON')
		favoriteBtnProduct.className = "item-product__btn-favorite favorite-button _icon-favourite"
		if (product.favorite) favoriteBtnProduct.classList.add('favorite-button--active')
		favoriteBtnProduct.setAttribute("aria-label", "Favorite button")
		itemProduct.append(favoriteBtnProduct)

		const bodyProduct = document.createElement('DIV')
		bodyProduct.className = 'item-product__body'

		const linkTitleProduct = document.createElement('A')
		linkTitleProduct.className = 'item-product__link-title'
		linkTitleProduct.setAttribute('href', product.url)

		const titleProduct = document.createElement('H3')
		titleProduct.className = 'item-product__title'
		titleProduct.innerText = product.title

		linkTitleProduct.append(titleProduct)
		bodyProduct.append(linkTitleProduct)

		const brandProduct = document.createElement('DIV')
		brandProduct.className = 'item-product__brand'
		brandProduct.innerText = product.brand
		bodyProduct.append(brandProduct)

		const priceProduct = document.createElement('DIV')
		priceProduct.className = 'item-product__price'
		priceProduct.innerText = product.price
		bodyProduct.append(priceProduct)

		itemProduct.append(bodyProduct)
		productsCatalog.append(itemProduct)
	}
}

function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}
function tabs() {
	const tabs = document.querySelectorAll('[data-tabs]')
	let tabsActiveHash = []

	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith('tab-')) {
			tabsActiveHash = hash.replace('tab-', '').split('-')
		}
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add('_tab-init')
			tabsBlock.setAttribute('data-tabs-index', index)
			tabsBlock.addEventListener("click", setTabsAction)
			initTabs(tabsBlock)
		});
		let mdQueriesArray = dataMediaQueries(tabs, "tabs")
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
				});
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
			})
		}
	}
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach(tabsMediaItem => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
			let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
			let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
			let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
			tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add('_tab-spoller');
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove('_tab-spoller');
				}
			});
		});
	}
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
			tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
		}
		if (tabsContent.length) {
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute('data-tabs-title', '')
				tabsContentItem.setAttribute('data-tabs-item', '')

				if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
					tabsTitles[index].classList.add('_tab-active')
				}
				tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active')
			});
		}
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]')
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]')
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute('data-tabs-animate')) {
				return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500
			}
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute('data-tabs-hash')
			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains('_tab-active')) {
					if (tabsBlockAnimate) {
						slideDown(tabsContentItem, tabsBlockAnimate)
					} else {
						tabsContentItem.hidden = false
					}
					if (isHash && !tabsContentItem.closest('.popup')) {
						setHash(`tab-${tabsBlockIndex}-${index}`)
					}
				} else {
					if (tabsBlockAnimate) {
						slideUp(tabsContentItem, tabsBlockAnimate)
					} else {
						tabsContentItem.hidden = true
					}
				}
			})
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest('[data-tabs-title]')) {
			const tabTitle = el.closest('[data-tabs-title]');
			const tabsBlock = tabTitle.closest('[data-tabs]');
			if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
				let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
				tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
				tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
				tabTitle.classList.add('_tab-active');
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}
tabs()
function showPass(toggleButton) {
	const passwordInput = toggleButton.previousElementSibling
	const isPressed = toggleButton.getAttribute('aria-pressed') === 'true'
	toggleButton.setAttribute('aria-pressed', !isPressed)
	passwordInput.type = isPressed ? 'password' : 'text'
	toggleButton.classList.toggle('_icon-eye-hide', !isPressed)
	toggleButton.classList.toggle('_icon-eye', isPressed)
	if (toggleButton.textContent.length !== 0) toggleButton.textContent = isPressed ? 'Show' : 'Hide'
	if (toggleButton.hasAttribute('aria-label')) {
		if (isPressed) toggleButton.setAttribute('aria-label', 'Show password button')
		else toggleButton.setAttribute('aria-label', 'Hide password button')
	}
}
const headerEl = document.querySelector('header')
function debounce(callback, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            callback.apply(this, args)
        }, delay)
    }
}
const handleScroll = debounce(() => {
   addClassForHeaderAfterScroll(20, 991.98, headerEl)
}, 100)
const handleResize = debounce(() => {
    if (document.documentElement.clientWidth <= 991.98) {
        if (headerEl.classList.contains('_header-scroll')) {
            headerEl.classList.remove('_header-scroll')
        }
    }
}, 100)
window.addEventListener("scroll", handleScroll)
window.addEventListener("resize", handleResize)
function addClassForHeaderAfterScroll(startingPoint, minWindowWidth, headerEl) {
    if (document.documentElement.clientWidth > minWindowWidth) {
        if (window.scrollY > startingPoint) {
            headerEl.classList.add('_header-scroll')
        } else {
            headerEl.classList.remove('_header-scroll')
        }
    }
}