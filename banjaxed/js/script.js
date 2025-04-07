"use strict"

window.addEventListener('load', pageLoaded)
function pageLoaded(e) {
	document.documentElement.classList.add('loaded')
	updatePaddingForBlock() // ф-ия установки padding в блоке .conversations-app__category--premium
	// hiddenPseudoElements() // ф-ия удаления псевдоэлементов у .list-services__content
	addClassForListServices() // декор в блоке .list-services
	updateProgressBar();
	pageNavigation()
	formActions()
}
let youtubePopup = togglePopup('#popup')
let errorPopup =togglePopup('#popup-error')

window.addEventListener('resize', () => {
	debouncedUpdatePadding() // ф-ия обновления padding в блоке .conversations-app__category--premium
	updateSwipers() // ф-ия обновления Swiper (.areas-of-work)
	// debouncedHiddenPseudoElements() // ф-ия удаления псевдоэлементов у .list-services__content
	debouncedAddClassForListServices() // ф-ия корректировки декорф в блоке .list-services
	updateProgressBar()
});

document.addEventListener('click', documentActions)
function documentActions(e) {
	const targetElement = e.target
	if (targetElement.closest('.icon-menu')) {
		document.documentElement.classList.toggle('menu-open');
	} else if (!targetElement.closest('.header') && document.documentElement.classList.contains('menu-open')) {
		document.documentElement.classList.remove('menu-open');
	}
}

// !  function debounce  ======================================================================================================================================
function debounce(func, wait) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}
// !Добавление классов к .list-services ======================================================================================================================================
// function hiddenPseudoElements(){
// 	const listServices = document.querySelector('.list-services')
// 	if(listServices){
// 		const listServicesItems = listServices.children
// 		if(window.innerWidth > 991.98 && !listServices.classList.contains('hidden-pseudo-elements')){
// 			for (const el of listServicesItems) {
// 				if(el.offsetHeight > 205) 
// 					return listServices.classList.add('hidden-pseudo-elements')
// 			}
// 		} else if(listServices.classList.contains('hidden-pseudo-elements')){
// 			listServices.classList.remove('hidden-pseudo-elements')
// 		}
// 	}
// }
// const debouncedHiddenPseudoElements = debounce(hiddenPseudoElements, 100);
function addClassForListServices(){
	const listServices = document.querySelector('.list-services')
	if(listServices){
		const listServicesItems = listServices.children
		if(window.innerWidth > 991.98){
			for (let i = 0; i < 1; i++) {
				const itemHeight = listServicesItems[i].offsetHeight
				const decorImg = listServices.querySelector('.list-services__decor-img')
				if(itemHeight > 310){
					listServices.classList.add('hidden-pseudo-elements')
					return
				}else if(itemHeight > 280){
					listServices.classList.add('decor-more280')
					if(decorImg) decorImg.style.top = '140px'
					return
				}else if(itemHeight > 250){
					listServices.classList.add('decor-more250')
					if(decorImg) decorImg.style.top = '125px'
					return
				}else if(itemHeight > 230){
					listServices.classList.add('decor-more230')
					if(decorImg) decorImg.style.top = '113px'
					return
				}else if(itemHeight > 190){
					listServices.classList.add('decor-more190')
					if(decorImg) decorImg.style.top = '98px'
					return
				}
			}
		}
	}
}
const debouncedAddClassForListServices = debounce(addClassForListServices, 200);

// !Update Padding======================================================================================================================================
function updatePaddingForBlock() {
	const block = document.querySelector('.conversations-app__category--premium')
	if (block) {
		block.style.cssText = block.offsetWidth > 500 ? 'padding-right: 250px' : 'padding-bottom: 212px;';
	}
}
const debouncedUpdatePadding = debounce(updatePaddingForBlock, 100);

// !Rating======================================================================================================================================
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
		if (ratingEl.querySelector('.rating__value') && ratingValue) ratingEl.querySelector('.rating__value').innerText = `(${ratingValue}/5)`
	})
}

// !Динамічний адаптив==========================================================================================================================
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
const da = new DynamicAdapt("max");
da.init();

// !Intersection Observer=======================================================================================================================
let options = {
	root: null,
	rootMargin: "0px 0px 0px 0px",
	threshold: 0.5,
}
let callback = (entries, observer) => {
	entries.forEach((entry) => {
		const targetElement = entry.target;
		if (entry.isIntersecting) {
			targetElement.classList.add("show");
			targetElement.hasAttribute('data-watch-once') ? observer.unobserve(targetElement) : null
		} else {
			targetElement.classList.remove("show");
		}
	})
}
let observer = new IntersectionObserver(callback, options);

let someElements = document.querySelectorAll("[data-watch]");
someElements.forEach(someElement => {
	observer.observe(someElement);
});

// !Progress Bar=======================================================================================================================
const circles = document.querySelectorAll('.advantages__circle')
const progressBar = document.querySelector('.advantages__progress-bar')
const progressContainer = document.querySelector('.advantages__progress-container')

const wrapper = document.querySelector(".advantages__inner");
function updateProgressBar() {
	const wrapperRect = wrapper.getBoundingClientRect();
	const wrapperTop = wrapperRect.top + window.scrollY;
	const wrapperHeight = wrapperRect.height;

	const firstCircle = circles[0].getBoundingClientRect().top + window.scrollY - wrapperTop;
	const lastCircle = circles[circles.length - 1].getBoundingClientRect().top + window.scrollY - wrapperTop;

	// Правильное позиционирование progress-container
	progressContainer.style.top = `${firstCircle}px`;
	progressContainer.style.height = `${lastCircle - firstCircle}px`;

	const scrollPosition = window.scrollY - wrapperTop + window.innerHeight / 2; // Теперь отсчёт от wrapper

	let progressPercent = ((scrollPosition - firstCircle) / (lastCircle - firstCircle)) * 100;
	progressPercent = Math.min(100, Math.max(0, progressPercent)); // Ограничиваем от 0 до 100

	progressBar.style.height = `${progressPercent}%`;

	// Закрашиваем кружки при прокрутке
	circles.forEach((circle) => {
		const circleCenter = circle.getBoundingClientRect().top + window.scrollY - wrapperTop;
		if (scrollPosition >= circleCenter) {
			circle.classList.add("active");
		} else {
			circle.classList.remove("active");
		}
	});
}
// Запускаем обновление при скролле и изменении размера окна
window.addEventListener("scroll", updateProgressBar);

// !Swipers=======================================================================================================================

// !.areas-of-work    
// Функция инициализации Swiper
function initSwipers() {
	// Проверяем ширину экрана
	const isMobile = window.innerWidth < 767.98;

	// Инициализируем миниатюры (thumbs)
	const areasOfWorkSwiperThumbs = new Swiper('.areas-of-work__slider', {
		speed: 300,
		spaceBetween: 8,
		direction: isMobile ? 'horizontal' : 'vertical', // Изменяем направление
		keyboard: true,
		simulateTouch: true,
		loop: false,
		slidesPerView: 1.7,
		breakpoints: {
			600: { slidesPerView: 2.8 },
			767.98: { slidesPerView: 3.1 },
		},
		watchSlidesProgress: true,
		slideToClickedSlide: true,
	});

	// Инициализируем основной Swiper
	const areasOfWorkSwiper = new Swiper('.areas-of-work__content-slider', {
		speed: 300,
		spaceBetween: 10,
		loop: true,
		allowTouchMove: isMobile, // Разрешаем touch на мобильных
		grabCursor: isMobile,
		autoHeight: true,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		thumbs: {
			swiper: areasOfWorkSwiperThumbs,
		},
		on: {
			slideChange: function () {
				areasOfWorkSwiperThumbs.slideTo(this.realIndex);
			},
		},
	});

	return { areasOfWorkSwiper, areasOfWorkSwiperThumbs };
}
// Инициализируем Swipers при загрузке страницы
let { areasOfWorkSwiper, areasOfWorkSwiperThumbs } = initSwipers();
// Функция обновления Swiper при изменении экрана
const updateSwipers = debounce(() => {
	// Уничтожаем старые Swipers перед повторной инициализацией
	areasOfWorkSwiper.destroy(true, true);
	areasOfWorkSwiperThumbs.destroy(true, true);

	// Инициализируем заново с новыми параметрами
	const newSwipers = initSwipers();
	areasOfWorkSwiper = newSwipers.areasOfWorkSwiper;
	areasOfWorkSwiperThumbs = newSwipers.areasOfWorkSwiperThumbs;
}, 100);


// !.feedback
const feedbackSwiper = new Swiper('.feedback__slider', {
	pagination: {
		el: '.feedback__swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.feedback__swiper-button-next',
	},
	loop: true,
	keyboard: true,
	grabCursor: true,
	speed: 500,
	effect: "creative",
	creativeEffect: {
		prev: {
			shadow: true,
			translate: [0, 0, -400],
		},
		next: {
			translate: ["56%", 0, -280],
			opacity: 0,
		},
	},
});

// !GO TO BLOCK=======================================================================================================================
function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}
function menuClose() {
	document.documentElement.classList.remove("menu-open");
}
let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = '';
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = 'header.header';
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains('_header-scroll')) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add('_header-scroll');
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove('_header-scroll');
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else {
				headerItemHeight = headerElement.offsetHeight;
			}
		}
		let options = {
			speedAsDuration: true,
			speed: speed,
			header: headerItem,
			offset: offsetTop,
			easing: 'easeOutQuad',
		};
		// Закриваємо меню, якщо воно відкрите
		document.documentElement.classList.contains("menu-open") ? menuClose() : null;
		// Прокручування стандартними засобами
		let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
		targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
		targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
		window.scrollTo({
			top: targetBlockElementPosition,
			behavior: "smooth"
		});
	} 
};
function pageNavigation() {
	// data-goto - вказати ID блоку
	// data-goto-header - враховувати header
	// data-goto-top - недокрутити на вказаний розмір
	// data-goto-speed - швидкість (тільки якщо використовується додатковий плагін)
	// Працюємо при натисканні на пункт
	document.addEventListener("click", pageNavigationAction);
	// Основна функція
	function pageNavigationAction(e) {
		if (e.type === "click") {
			const targetElement = e.target;
			if (targetElement.closest('[data-goto]')) {
				const gotoLink = targetElement.closest('[data-goto]');
				const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : '';
				const noHeader = gotoLink.hasAttribute('data-goto-header') ? true : false;
				const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
				const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
				gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
				e.preventDefault();
			}
		}
	}
	// Прокручування по хешу
	if (getHash()) {
		let goToHash;
		if (document.querySelector(`#${getHash()}`)) {
			goToHash = `#${getHash()}`;
		} else if (document.querySelector(`.${getHash()}`)) {
			goToHash = `.${getHash()}`;
		}
		goToHash ? gotoBlock(goToHash, true, 500, 20) : null;
	}
}
// Робота з шапкою при скролі
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

// ! PopUp=======================================================================================================================
function getScrollbarWidth() {
	return window.innerWidth - document.documentElement.clientWidth;
}
function togglePopup(popupSelector){
	let isOpen = false
	const popup = document.querySelector(popupSelector);
	const innerPopup = popup.firstElementChild
	const buttonsOpenPopup = document.querySelectorAll(`[data-popup="${popupSelector}"]`);
	const buttonClosePopup = popup.querySelector('[data-close]');

	const iframe = popup.hasAttribute('data-popup-youtube') ? document.createElement('iframe'): null
	const videoURL = popup.dataset.popupYoutube ? `https://www.youtube.com/embed/${popup.dataset.popupYoutube}?rel=0&showinfo=0&autoplay=1` : null
	if(iframe){
		iframe.className = 'popup__iframe'
		iframe.setAttribute('src', '');
		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('allow', 'autoplay; encrypted-media');
		innerPopup.append(iframe)
	}
	const htmlEl = document.documentElement
	const body = document.body
	
	for (const btnOpenPopup of buttonsOpenPopup) {
		btnOpenPopup.addEventListener("click", openPopup)
	}
	function openPopup() {
		if(iframe) iframe.src = videoURL; // Загружаем видео до анимации
		// Считаем ширину скроллбара и добавляем padding-right
		const scrollbarWidth = getScrollbarWidth();
		setTimeout(() => {
			if (scrollbarWidth > 0) {
				body.style.paddingRight = `${scrollbarWidth}px`;
			  }
			popup.classList.add("popup_show");
			htmlEl.classList.add("popup-show");
			isOpen = true
		}, 150);
	};

	function closePopup() {
		popup.classList.remove("popup_show");
		htmlEl.classList.remove('popup-show')
		body.style.paddingRight = ""; // Убираем padding-right
		isOpen = false
		setTimeout(() => {
			if (!popup.classList.contains("popup_show") && iframe){
				iframe.src = "";
			}
		}, 500);
	}

	buttonClosePopup.addEventListener("click", closePopup);
	document.addEventListener("keydown", function (e) {
		if (isOpen && e.key === "Escape"  ) {
			e.preventDefault();
			closePopup()
		}
		if (e.key === ' ' && document.activeElement.tagName !== 'TEXTAREA' && 
			document.activeElement.tagName !== 'INPUT' &&
			document.activeElement.tagName !== 'IFRAME') {
			e.preventDefault(); // Отключаем скролл
		}
	})
	
	popup.addEventListener("click", function (e) {
		if (e.target === popup) {
			closePopup();
		}
	});
	return { openPopup, closePopup };
}

// ! FORM=======================================================================================================================
document.body.addEventListener("focusin", function (e) {
	const targetElement = e.target;
	if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
		targetElement.classList.add('_form-focus');
		targetElement.parentElement.classList.add('_form-focus');
		formRemoveError(targetElement);
		targetElement.hasAttribute('data-validate') ? removeError(targetElement) : null;
	}
});
document.body.addEventListener("focusout", function (e) {
	const targetElement = e.target;
	if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
		targetElement.classList.remove('_form-focus');
		targetElement.parentElement.classList.remove('_form-focus');
		// Миттєва валідація
		targetElement.hasAttribute('data-required') ? formValidateInput(targetElement) : null;
	}
});
function formActions(){
	const form = document.getElementById('form')
	form.addEventListener('submit', formSend)

	async function formSend(e){
		e.preventDefault()

		let error = getErrors(form)

		let formData = new FormData(form)

		if(error === 0){
			form.classList.add('_sending')
			try {
				let response = await fetch('sendmail.php', {
					method: 'POST',
					body: formData
				})
			
				if(response.ok){
					let result = await response.json()
					console.log(result.message)
					form.reset()
				} else {
					console.log('Ошибка при отправке формы')
				}
			} catch (error) {
				console.error('Ошибка сети или сервера:', error)
			}
			form.classList.remove('_sending')


			// let response = await fetch('sendmail.php', {
			// 	method: 'POST',
			// 	body: formData
			// })
			// if(response.ok){
			// 	let result = await response.json()
			// 	console.log(result.message);
			// 	form.reset()
			// 	form.classList.remove('_sending')
			// } else{
			// 	console.log('Error');
			// 	form.classList.remove('_sending')
			// } 
		}
		else errorPopup.openPopup()
	}

}
function getErrors(formEl){
	let error = 0
	let formRequiredItems = form.querySelectorAll('*[data-required]');
	if (formRequiredItems.length) {
		formRequiredItems.forEach(formRequiredItem => {
			if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
				error += formValidateInput(formRequiredItem);
			}
		});
	}
	return error;
}
function formValidateInput(formRequiredItem){
	let error = 0
	const numbForTel = 10
	formRemoveError(formRequiredItem)
	if(formRequiredItem.dataset.required === 'email'){
		formRequiredItem.value = formRequiredItem.value.replace(" ", "");
		if(emailTest(formRequiredItem)){  //!не заполнен email
			formAddError(formRequiredItem)
			error++
		} 
	}else if(formRequiredItem.dataset.required === 'tel'){ 
		let numbPhone = formRequiredItem.value.replace(/[\s-]/g, '')
		if(numbPhone.length!==numbForTel || !isOnlyDigits(numbPhone)){  //!не 10 симв. или не только цифры
			formAddError(formRequiredItem)
			error++
		}
	}else if(formRequiredItem.type === "checkbox" && !formRequiredItem.checked){ //!нет галочки
		formAddError(formRequiredItem)
		error++
	}else if(!formRequiredItem.value.trim()){   //!пуст
		formAddError(formRequiredItem)
		error++
	}
	return error
}

function formAddError(formRequiredItem){
	formRequiredItem.classList.add('_form-error')
	formRequiredItem.parentElement.classList.add('_form-error')
	if (formRequiredItem.dataset.error) {
		formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
	}
}
function formRemoveError(formRequiredItem){
	formRequiredItem.classList.remove('_form-error')
	formRequiredItem.parentElement.classList.remove('_form-error')
	if (formRequiredItem.parentElement.querySelector('.form__error')) {
		formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
	}
}
function emailTest(formRequiredItem){
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
}
function isOnlyDigits(str) {
	return /^\d+$/.test(str);
}