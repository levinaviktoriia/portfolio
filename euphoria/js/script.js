"use strict"

document.addEventListener("click", documentActions)
function documentActions(e) {
	const targetElement = e.target
	// !Menu
	if (targetElement.closest('.icon-menu')) {
		document.body.classList.toggle('menu-open')
	}
	// !Spoiler
	if (targetElement.closest('[data-spoiler]')) {
		const currentElement = targetElement.closest('[data-spoiler]')
		if (!currentElement.nextElementSibling.classList.contains('--sliding')) {
			currentElement.classList.toggle('open');
		}
		slideToggle(currentElement.nextElementSibling, 400); // здесь через , меняем скорость анимации
	}
	// !Rating
	if (targetElement.closest('.rating__input')) {
		const ratingParentEl = targetElement.closest('.rating')
		const ratingInput = targetElement.closest('.rating__input')
		ratingParentEl.classList.contains('rating--set') ? starRatingGet(ratingParentEl, ratingInput) : null
	}
	// !Tabs
	if(targetElement.closest('[data-tabs-button]')){
		const currentBtnItem = targetElement.closest('LI')
		if(targetElement.closest('LI')) setTab(currentBtnItem)
	}
	// !Show pass
	if(targetElement.closest('[aria-pressed]')){
		const currentBtn = targetElement.closest('[aria-pressed]')
		showPass(currentBtn)
	}
	//! Dropdown-list  (сработает только для первого найденного выпадающего списка)
	const dropdownBlock = document.querySelector('[data-dropdown-list]')
	if(dropdownBlock){
		const currentBtn = targetElement.closest('[data-dropdown-list-btn]')
		if(currentBtn){
			const targetDropdownBlock = currentBtn.parentElement
			targetDropdownBlock.classList.toggle('open')

			if(document.documentElement.clientWidth<767.98) {
				const nextElement = currentBtn.nextElementSibling
				if (targetDropdownBlock.classList.contains('open') && nextElement) {
					 const heightBlock = nextElement.offsetHeight
					 targetDropdownBlock.style.marginBottom = `${heightBlock + 25}px`
				} else {
					targetDropdownBlock.style.marginBottom = ''
				}
			}
		}
		else if(dropdownBlock.classList.contains('open') && !targetElement.closest('[data-dropdown-list]')){
			dropdownBlock.classList.remove('open')
			dropdownBlock.style.marginBottom = ''
		}
	}
}

// !Dropdown-list(закрытие при изменении размера экрана)=========================================================================================
const updateMarginForBlock = () => {
	const dropdownBlock = document.querySelector('[dropdown-list]')
	if(dropdownBlock.classList.contains('open')) dropdownBlock.classList.remove('open')
	dropdownBlock.style.marginBottom = ''
}
window.addEventListener('resize', updateMarginForBlock); // Добавляем слушатель события изменения размера окна

// !Rating======================================================================================================================================
function starRatingGet(ratingParentEl, ratingInput) {
	const currentUserRating = parseInt(ratingInput.value)
	// Отправляем оценку(currentUserRating) на бекенд
	// Получаем от бекенда среднюю оценку
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
		if(ratingEl.querySelector('.rating__value') && ratingValue) ratingEl.querySelector('.rating__value').innerText = ratingValue
	})
}


// !Добавление/удаление класса для спойлера в footer=============================================================================================
function checkScreenWidth() {
	const targetElements = document.querySelectorAll('.menu-footer__title'); // Элементы, которому нужно добавить/удалить класс
	const classNameList = ['spoilers-title', '_icon-chevron-down']; // Классы, которы нужно добавить/удалить
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
	// Первоначальная проверка при загрузке страницы
	updateClass();
	// Проверка при изменении размера окна
	window.addEventListener('resize', updateClass);
}
checkScreenWidth();


// ! SLIDERS ====================================================================================================================================
// *HERO=========================================================================================================================
const heroSlider = document.querySelector('.slider-hero')
if (heroSlider) {
	let swiper; // Объявляем переменную для Swiper

	const initSwiper = (autoHeightValue) => {
		// Инициализация Swiper с динамическим значением autoHeight
		swiper = new Swiper('.slider-hero__swiper', {
			loop: true,
			autoHeight: autoHeightValue,
			speed: 800,
			parallax: true,
			autoplay:{
				delay:5000,
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

	// Функция для проверки ширины экрана и переинициализации Swiper
	const updateSwiper = () => {
		const screenWidth = window.innerWidth;
		const autoHeight = screenWidth <= 767.98; // true для мобильных, false для планшетов и десктопов

		if (swiper) swiper.destroy(true, true); // Уничтожаем предыдущий экземпляр Swiper

		initSwiper(autoHeight); // Переинициализация с новым значением autoHeight
	};

	// Первоначальная инициализация
	updateSwiper();

	// Добавляем слушатель события изменения размера окна
	window.addEventListener('resize', updateSwiper);
}
// *NEW ARRIVAL SWIPER===========================================================================================================
const newSlider = document.querySelector('.new-arrival__swiper');
if (newSlider) {
	new Swiper('.new-arrival__swiper', {
		// Optional parameters
		loop: true,
		autoHeight: true,
		speed: 800,
		spaceBetween: 38,
		slidesPerView: 4,
		// Navigation arrows
		navigation: {
			nextEl: '.new-arrival__swiper-button-next',
			prevEl: '.new-arrival__swiper-button-prev',
		},
		// Responsive breakpoints
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
// *REVIEWS SWIPER===========================================================================================================
const reviewsSlider = document.querySelector('.reviews__slider');
if (reviewsSlider) {
	new Swiper('.reviews__slider', {
		// Optional parameters
		loop: true,
		// autoHeight: true,
		speed: 800,
		spaceBetween: 23,
		slidesPerView: 3,
		pagination: {
			el: '.reviews__swiper-pagination',
			clickable: true
		},
		// Responsive breakpoints
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
// *REVIEWS PRODUCT SLIDER===========================================================================================================
const reviewsProductSlider = document.querySelector('.reviews-element');
if (reviewsProductSlider) {
	new Swiper('.reviews-element__slider', {
		// Optional parameters
		loop: true,
		speed: 800,
		spaceBetween: 23,
		slidesPerView: 2,
		pagination: {
			el: '.reviews-element__swiper-pagination',
			clickable: true
		},
		// Responsive breakpoints
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
// *PRODUCT SWIPER===========================================================================================================
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


// !Модуль роботи зі спойлерами ===================================================================================================================
// Spoilers без details
const simpleSpoilers = document.querySelectorAll('[data-simple-spoiler]')
if (simpleSpoilers.length) {
	simpleSpoilers.forEach(spoiler => {
		spoiler.dataset.simpleSpoiler !== 'open' ? spoiler.nextElementSibling.hidden = true : spoiler.classList.add('active')
	});
}
// Унікалізація масиву
function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}
// Обробка медіа запитів з атрибутів
function dataMediaQueries(array, dataSetValue) {
	// Отримання об'єктів з медіа-запитами
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
	});
	// Ініціалізація об'єктів з медіа-запитами
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
		// Отримуємо унікальні брейкпоінти
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			// Працюємо з кожним брейкпоінтом
			mdQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				// Об'єкти з потрібними умовами
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

// Допоміжні модулі плавного розкриття та закриття об'єкта ========================================================================================

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
			// Створюємо подію 
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
			// Створюємо подію
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
		// Подія кліку
		document.addEventListener("click", setSpoilerAction);
		// Отримання звичайних слойлерів
		const spoilersRegular = Array.from(spoilersArray).filter(function (item, index, self) {
			return !item.dataset.spoilers.split(",")[0];
		});
		// Ініціалізація звичайних слойлерів
		if (spoilersRegular.length) {
			initSpoilers(spoilersRegular);
		}
		// Отримання слойлерів з медіа-запитами
		let mdQueriesArray = dataMediaQueries(spoilersArray, "spoilers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Подія
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initSpoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				initSpoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		// Ініціалізація
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
		// Робота з контентом
		function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
			let spoilerItems = spoilersBlock.querySelectorAll('details');
			if (spoilerItems.length) {
				//spoilerItems = Array.from(spoilerItems).filter(item => item.closest('[data-spoilers]') === spoilersBlock);
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

							//setTimeout(() => {
							window.scrollTo(
								{
									top: spoilerBlock.offsetTop - (scrollSpoilerOffset + scrollSpoilerNoHeader),
									behavior: "smooth",
								}
							);
							//}, spoilerSpeed);
						}
					}
				}
			}
			// Закриття при кліку поза спойлером
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


// !Динамічний адаптив==================================================================================================================================
class DynamicAdapt {
	constructor(type) {
		this.type = type
	}
	init() {
		// масив об'єктів
		this.оbjects = []
		this.daClassname = '_dynamic_adapt_'
		// масив DOM-елементів
		this.nodes = [...document.querySelectorAll('[data-da]')]

		// наповнення оbjects об'єктами
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

		// масив унікальних медіа-запитів
		this.mediaQueries = this.оbjects
			.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
			.filter((item, index, self) => self.indexOf(item) === index)

		// навішування слухача на медіа-запит
		// та виклик оброблювача при першому запуску
		this.mediaQueries.forEach((media) => {
			const mediaSplit = media.split(',')
			const matchMedia = window.matchMedia(mediaSplit[0])
			const mediaBreakpoint = mediaSplit[1]

			// масив об'єктів з відповідним брейкпоінтом
			const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
			matchMedia.addEventListener('change', () => {
				this.mediaHandler(matchMedia, оbjectsFilter)
			})
			this.mediaHandler(matchMedia, оbjectsFilter)
		})
	}
	// Основна функція
	mediaHandler(matchMedia, оbjects) {
		if (matchMedia.matches) {
			оbjects.forEach((оbject) => {
				// оbject.index = this.indexInParent(оbject.parent, оbject.element);
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
	// Функція переміщення
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
	// Функція повернення
	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname)
		if (parent.children[index] !== undefined) {
			parent.children[index].before(element)
		} else {
			parent.append(element)
		}
	}
	// Функція отримання індексу всередині батьківського єлементу
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element)
	}
	// Функція сортування масиву по breakpoint та place
	// за зростанням для this.type = min
	// за спаданням для this.type = max
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
const da = new DynamicAdapt("max");
da.init();

// !FILTER======================================================================================================================================================
// *Range Slider==========================================================
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
			// [[handle0_down, handle0_up], [handle1_down, handle1_up]]
			let steps = filterRange.noUiSlider.steps();
			// [down, up]
			let step = steps[handle];
			let position;
			// 13 is enter,
			// 38 is key up,
			// 40 is key down.
			switch (e.which) {
				case 13:
					filterRange.noUiSlider.setHandle(handle, parseInt(this.value.replace('$', '')));
					break;
				case 38:
					// Get step to go increase slider value (up)
					position = step[1];
					// false = no step is set
					if (position === false) {
						position = 1;
					}
					// null = edge of slider
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

// *Menu Filter(add icon)==================================================
function addClassForSpan(arrLables, newClass) {
	for (const label of arrLables) {
		if (label.lastElementChild.tagName === 'SPAN') {
			label.lastElementChild.classList.add(newClass)
		}
	}
}
const menuFilter = document.querySelectorAll('.type-filter__item')
if (menuFilter.length) addClassForSpan(menuFilter, '_icon-chevron-right')


// !Products======================================================================================================================================================
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

		const titleProduct = document.createElement('H4')
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

// !Tabs======================================================================================================================================================
function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}
function tabs() {
	const tabs = document.querySelectorAll('[data-tabs]');
	let tabsActiveHash = [];

	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith('tab-')) {
			tabsActiveHash = hash.replace('tab-', '').split('-');
		}
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add('_tab-init');
			tabsBlock.setAttribute('data-tabs-index', index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});

		// Отримання слойлерів з медіа-запитами
		let mdQueriesArray = dataMediaQueries(tabs, "tabs");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Подія
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
	}
	// Встановлення позицій заголовків
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
	// Робота з контентом
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
			//tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			//tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute('data-tabs-title', '');
				tabsContentItem.setAttribute('data-tabs-item', '');

				if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
					tabsTitles[index].classList.add('_tab-active');
				}
				tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
			});
		}
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute('data-tabs-animate')) {
				return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
			}
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute('data-tabs-hash');
			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains('_tab-active')) {
					if (tabsBlockAnimate) {
						slideDown(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = false;
					}
					if (isHash && !tabsContentItem.closest('.popup')) {
						setHash(`tab-${tabsBlockIndex}-${index}`);
					}
				} else {
					if (tabsBlockAnimate) {
						slideUp(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = true;
					}
				}
			});
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
//! Button show/hide pass==========================================================================================================================================
function showPass(toggleButton ){
	const passwordInput  = toggleButton.previousElementSibling
	
	const isPressed  = toggleButton.getAttribute('aria-pressed') === 'true'
	toggleButton.setAttribute('aria-pressed', !isPressed); // Переключаем состояние
	passwordInput.type = isPressed ? 'password' : 'text'; // Меняем тип поля
	toggleButton.classList.toggle('_icon-eye-hide', !isPressed);
	toggleButton.classList.toggle('_icon-eye', isPressed);
	if(toggleButton.textContent.length !== 0 ) toggleButton.textContent = isPressed ? 'Show' : 'Hide' ; // Меняем текст кнопки
	if(toggleButton.hasAttribute('aria-label')){
		if(isPressed) toggleButton.setAttribute('aria-label', 'Show password button')
		else toggleButton.setAttribute('aria-label', 'Hide password button')
	}
}
// ! Робота з шапкою при скролі ==========================================================================================================================================
let addWindowScrollEvent = false;  // Змінна контролю додавання події window scroll.
function headerScroll() {
	addWindowScrollEvent = true;
	const header = document.querySelector('header.header');
	const headerShow = header.hasAttribute('data-scroll-show');
	const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
	const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
	let scrollDirection = 0;
	let timer;
	document.addEventListener("windowScroll", function (e) {
		const scrollTop = window.scrollY;
		clearTimeout(timer);
		if (scrollTop >= startPoint) {
			!header.classList.contains('_header-scroll') ? header.classList.add('_header-scroll') : null;
			if (headerShow) {
				if (scrollTop > scrollDirection) {
					// downscroll code
					header.classList.contains('_header-show') ? header.classList.remove('_header-show') : null;
				} else {
					// upscroll code
					!header.classList.contains('_header-show') ? header.classList.add('_header-show') : null;
				}
				timer = setTimeout(() => {
					!header.classList.contains('_header-show') ? header.classList.add('_header-show') : null;
				}, headerShowTimer);
			}
		} else {
			header.classList.contains('_header-scroll') ? header.classList.remove('_header-scroll') : null;
			if (headerShow) {
				header.classList.contains('_header-show') ? header.classList.remove('_header-show') : null;
			}
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	});
}
setTimeout(() => {
	if (addWindowScrollEvent) {
		let windowScroll = new Event("windowScroll");
		window.addEventListener("scroll", function (e) {
			document.dispatchEvent(windowScroll);
		});
	}
}, 0);
headerScroll()






// 	currentElement.nextElementSibling.hidden = !currentElement.nextElementSibling.hidden
// 	эта запись тоже самое, что и написанное условие ниже. 2:20:00 урок №29
// 	if (currentElement.nextElementSibling.hidden === true){
// 		currentElement.nextElementSibling.hidden = false
// 	}else{
// 		currentElement.nextElementSibling.hidden = true
// 	}
// }

// // Урок №34 (11:00)   - matchMedia('(max-width;991.98px)')
// //window.addEventListener('resize', someFunc);
// const breakPointValue = filterTitle.dataset.spollerMedia;
// const breakPoint = breakPointValue ? `(${breakPointValue.split(',')[0]}-width:${breakPointValue.split(',')[1]}px)` : null
// if (breakPoint) {
// 	const matchMedia = window.matchMedia(breakPoint)
// 	matchMedia.addEventListener("change", (e) => {
// 		const isTrue = e.matches
// 		if (isTrue) {
// 			slideUp(filterTitle.nextElementSibling)
// 			filterTitle.classList.remove('active')
// 		} else {
// 			slideDown(filterTitle.nextElementSibling)
// 			filterTitle.classList.add('active')
// 		}
// 	})
// }

