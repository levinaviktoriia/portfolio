"use strict"
window.addEventListener('load', pageLoaded)
function pageLoaded() {
	const bannersList = document.querySelectorAll('[data-banner]')
	if (bannersList.length !== 0) {
		bannersList.forEach(banner => {
			if (banner.dataset.banner === 'open' && !banner.classList.contains('open')) {
				banner.classList.add('open')
			} else if (banner.dataset.banner === 'close' && banner.classList.contains('open')) {
				banner.classList.remove('open')
			}
		});
	}
	setTimeout(updateMenuPadding, 100);
	updateHeightHeroSection()
	revisionButtonsAnimation()
}
document.addEventListener('DOMContentLoaded', domLoaded);
function domLoaded(e) {
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		document.documentElement.classList.add(savedTheme);
	} else {
		document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
	}
	if (document.querySelector('.menu__list')) {
		const menuItemsList = document.querySelector('.menu__list').children;
		let currentSubMenu = null;
		if (menuItemsList.length) {
			for (const item of menuItemsList) {
				const subMenu = item.querySelector('ul');
				if (subMenu) {
					item.classList.add('_icon-chevron-down');
					item.addEventListener('click', (e) => {
						e.preventDefault();
						e.stopPropagation();
						if (currentSubMenu && currentSubMenu !== subMenu) {
							currentSubMenu.classList.remove('show');
							currentSubMenu.closest('.menu__item')?.classList.remove('active');
						}
						subMenu.classList.toggle('show');
						item.classList.toggle('active');
						currentSubMenu = subMenu.classList.contains('show') ? subMenu : null;
					});
				}
			}
			document.addEventListener('click', (e) => {
				if (currentSubMenu) {
					const activeItem = currentSubMenu.closest('.menu__item');
					if (!activeItem.contains(e.target)) {
						currentSubMenu.classList.remove('show');
						activeItem.classList.remove('active');
						currentSubMenu = null;
					}
				}
			});
		}
	}
}
let isMenuAnimating = false;
document.addEventListener('click', documentActions)
function documentActions(e) {
	const targetElement = e.target
	const html = document.documentElement
	if (targetElement.classList.contains('icon-menu')) {
		if (isMenuAnimating) return;
		isMenuAnimating = true;
		if (html.classList.contains('menu-open')) {
			html.classList.remove('menu-open');
			html.classList.add('menu-closing');
			setTimeout(() => {
				html.classList.remove('menu-closing');
				isMenuAnimating = false;
			}, 500);
		} else {
			html.classList.add('menu-open');
			setTimeout(() => {
				isMenuAnimating = false;
			}, 500);
		}
	}
	if (targetElement.id === 'theme-toggle') {
		const currentTheme = html.classList.contains('dark') ? 'dark' : 'light'
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
		html.classList.remove('light', 'dark')
		html.classList.add(newTheme)
		localStorage.setItem('theme', newTheme)
	}
	if (targetElement.matches('[data-banner-close]')) {
		const banner = targetElement.closest('[data-banner]');
		if (banner && banner.dataset.banner === 'open') {
			banner.dataset.banner = 'close'
			banner.classList.remove('open')
			banner.remove();
			updateHeightHeroSection()
			updateMenuPadding()
		}
	}
}
window.addEventListener('resize', () => {
	debounceUpdateMenuPadding()
	debounceUpdateHeightHeroSection()
})
function updateMenuPadding() {
	const windowWidth = document.documentElement.clientWidth
	const menuBlock = document.querySelector('.menu')
	if (windowWidth <= 767.98 && menuBlock) {
		const paddingVal = document.querySelector('header').offsetHeight + 20
		menuBlock.style.paddingTop = `${paddingVal}px`
	} else if (menuBlock) {
		menuBlock.style.paddingTop = '0px'
	}
}
let debounceUpdateMenuPadding = debounce(updateMenuPadding, 200)
function debounce(func, wait) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
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
function checkScreenWidth(maxWindowWidth, newClassName, classElement) {
	const targetElements = document.querySelectorAll(`.${classElement}`);
	function updateClass() {
		if (targetElements.length) {
			if (window.innerWidth < maxWindowWidth) {
				for (const element of targetElements) {
					element.classList.add(newClassName);
				}
			} else {
				for (const element of targetElements) {
					element.classList.remove(newClassName);
				}
			}
		}
	}
	const debouncedUpdateClass = debounce(updateClass, 100);
	updateClass();
	window.addEventListener('resize', debouncedUpdateClass);
}
checkScreenWidth(767.98, '_icon-chevron-down', 'menu-footer__title');
function updateHeightHeroSection() {
	const containerHero = document.querySelector('.hero__container')
	if (containerHero) {
		const headerHeight = document.querySelector('HEADER').offsetHeight
		containerHero.style.minHeight = `calc(100dvh - ${headerHeight}px)`
	}
}
let debounceUpdateHeightHeroSection = debounce(updateHeightHeroSection, 200)
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
const feedbackSwiper = document.querySelector('.feedback__slider');
if (feedbackSwiper) {
	new Swiper('.feedback__slider', {
		pagination: {
			el: '.feedback__swiper-pagination',
			clickable: true,
		},
		autoHeight: true,
		speed: 500,
		spaceBetween: 10,
		slidesPerView: 1.2,
		loop: true,
		keyboard: true,
		breakpoints: {
			479.98: {
				slidesPerView: 2,
			},
			991.98: {
				slidesPerView: 3,
				spaceBetween: 16,
			},
		}
	})
}
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
const buttonAnimSelector = '.button--transparent'
function revisionButtonsAnimation() {
	const buttonAnimList = document.querySelectorAll(buttonAnimSelector)
	if (buttonAnimList.length !== 0) {
		for (const button of buttonAnimList) {
			if (button.children.length === 0) button.append(document.createElement('SPAN'))
		}
	}
}
$(function () {
	$(buttonAnimSelector)
		.on('mouseenter', function (e) {
			var parentOffset = $(this).offset(),
				relX = e.pageX - parentOffset.left,
				relY = e.pageY - parentOffset.top;
			$(this).find('span').css({ top: relY, left: relX })
		})
		.on('mouseout', function (e) {
			var parentOffset = $(this).offset(),
				relX = e.pageX - parentOffset.left,
				relY = e.pageY - parentOffset.top;
			$(this).find('span').css({ top: relY, left: relX })
		});
});
let buttonsForCoordinates = document.querySelectorAll('.button--colored');
for (const btn of buttonsForCoordinates) {
	btn.addEventListener('mousemove', (e) => {
		let x = e.offsetX;
		let y = e.offsetY;
		btn.style.setProperty('--mouse-x', x + "px");
		btn.style.setProperty('--mouse-y', y + "px");
	});
}
function emailTest(formRequiredItem) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem);
}
document.addEventListener('DOMContentLoaded', function () {
	const form = document.querySelector('.form-footer');
	if (!form) return;

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		const inputBlock = form.querySelector('.form-footer__input-block');
		const input = inputBlock.querySelector('.input-block__input');
		const email = input.value.trim();

		let errorDiv = inputBlock.querySelector('.input-block__error');

		if (emailTest(email)) {
			if (!errorDiv) {
				errorDiv = document.createElement('div');
				errorDiv.className = 'input-block__error';
				inputBlock.appendChild(errorDiv);
				setTimeout(() => errorDiv.classList.add('_show'), 10);
			} else {
				errorDiv.classList.add('_show');
			}
			errorDiv.textContent = 'Please enter a valid email.';
			input.classList.add('error');
		} else {
			if (errorDiv) errorDiv.remove();
			input.classList.remove('error');
			form.reset();
		}
	});
});
let addWindowScrollEvent = false;
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
					header.classList.contains('_header-show') ? header.classList.remove('_header-show') : null;
				} else {
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
const flsModules = {}
class Parallax {
	constructor(elements) {
		if (elements.length) {
			this.elements = Array.from(elements).map((el) => (
				new Parallax.Each(el, this.options)
			));
		}
	}
	destroyEvents() {
		this.elements.forEach(el => {
			el.destroyEvents();
		})
	}
	setEvents() {
		this.elements.forEach(el => {
			el.setEvents();
		})
	}
}
Parallax.Each = class {
	constructor(parent) {
		this.parent = parent;
		this.elements = this.parent.querySelectorAll('[data-prlx]');
		this.animation = this.animationFrame.bind(this);
		this.offset = 0;
		this.value = 0;
		this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
		this.setEvents();
	}
	setEvents() {
		this.animationID = window.requestAnimationFrame(this.animation);
	}
	destroyEvents() {
		window.cancelAnimationFrame(this.animationID);
	}
	animationFrame() {
		const topToWindow = this.parent.getBoundingClientRect().top;
		const heightParent = this.parent.offsetHeight;
		const heightWindow = window.innerHeight;
		const positionParent = {
			top: topToWindow - heightWindow,
			bottom: topToWindow + heightParent,
		}
		const centerPoint = this.parent.dataset.prlxCenter ?
			this.parent.dataset.prlxCenter : 'center';

		if (positionParent.top < 30 && positionParent.bottom > -30) {
			switch (centerPoint) {
				case 'top':
					this.offset = -1 * topToWindow;
					break;
				case 'center':
					this.offset = (heightWindow / 2) - (topToWindow + (heightParent / 2));
					break;
				case 'bottom':
					this.offset = heightWindow - (topToWindow + heightParent);
					break;
			}
		}
		this.value += (this.offset - this.value) / this.smooth;
		this.animationID = window.requestAnimationFrame(this.animation);
		this.elements.forEach(el => {
			const parameters = {
				axis: el.dataset.axis ? el.dataset.axis : 'v',
				direction: el.dataset.direction ? el.dataset.direction + '1' : '-1',
				coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : 5,
				additionalProperties: el.dataset.properties ? el.dataset.properties : '',
			}
			this.parameters(el, parameters);
		})
	}
	parameters(el, parameters) {
		if (parameters.axis == 'v') {
			el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`
		} else if (parameters.axis == 'h') {
			el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`
		}
	}
}
if (document.querySelectorAll('[data-prlx-parent]')) {
	flsModules.parallax = new Parallax(document.querySelectorAll('[data-prlx-parent]'));
}
