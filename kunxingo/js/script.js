"use strict"

window.addEventListener("load", pageLoaded)
function pageLoaded(e){
	document.documentElement.classList.add('loaded')
}

document.addEventListener("click", documentAction)
function documentAction(e) {
	const targetElement = e.target
	if (targetElement.closest('.icon-menu')) {
		document.body.classList.toggle('menu-open')
	}else if (targetElement.closest('.button')) {
		const link = targetElement.closest('.button')
		const goto = link.dataset.goto
		const gotoElement = document.querySelector(goto)
		if (gotoElement) {
			gotoElement.scrollIntoView({
				block: "start",
				behavior: "smooth"
			})
		}
		e.preventDefault()
	}

}

// *SWIPERS
const servicesSlider = document.querySelector('.our-services');
let swiper = null;
if (servicesSlider) {
    swiper = new Swiper('.our-services__swiper', {
        loop: false,
        slidesPerView: 2,
        grid: {
            fill: "row",
            rows: 2,
        },
        spaceBetween: 24,

        navigation: {
            nextEl: '.our-services__arrow--next',
            prevEl: '.our-services__arrow--prev',
        },
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
                grid: {
                    fill: "row",
                    rows: 2,
                },
            },
            550: {
                slidesPerView: 2,
                grid: {
                    fill: "row",
                    rows: 2,
                },
            },
        }
    });

    function checkScreenWidth() {
        const windowWidth = window.innerWidth;
        if (windowWidth < 992) {
            if (!swiper) {
                swiper = new Swiper('.our-services__swiper', {
                    loop: false,
                    slidesPerView: 2,
                    grid: {
                        fill: "row",
                        rows: 2,
                    },
                    spaceBetween: 24,

                    navigation: {
                        nextEl: '.our-services__arrow--next',
                        prevEl: '.our-services__arrow--prev',
                    },
                    breakpoints: {
                        320: {
                            slidesPerView: 1,
                            grid: {
                                fill: "row",
                                rows: 2,
                            },
                        },
                        550: {
                            slidesPerView: 2,
                            grid: {
                                fill: "row",
                                rows: 2,
                            },
                        },
                    }
                });
            }
        } else {
            if (swiper) {
                swiper.destroy();
                swiper = null;
            }
        }
    }
    window.addEventListener('resize', checkScreenWidth);
    window.addEventListener('load', checkScreenWidth);
}
const heroSlider = document.querySelector('.hero')
if (heroSlider) {
	const swiper = new Swiper('.hero__swiper', {
		// Optional parameters
		loop: true,
		speed: 800,
		parallax: true,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.hero__arrow--next',
			prevEl: '.hero__arrow--prev',
		},
	});
}
const gallerySlider = document.querySelector('.gallery')
if (gallerySlider) {
	const swiper = new Swiper('.gallery__swiper', {
		// Optional parameters
		// loop: true,
		slidesPerView: 4,
		spaceBetween: 24,
		// speed: 800,
		// Navigation arrows
		navigation: {
			nextEl: '.gallery__arrow--next',
			prevEl: '.gallery__arrow--prev',
		},
		breakpoints: {
			// when window width is >= 320px
			320: {
				slidesPerView: 1.5,
			},
			650: {
				slidesPerView: 2.5,
			},
			// when window width is >= 480px
			800: {
				slidesPerView: 3.5,
			},
			// when window width is >= 640px
			991: {
				slidesPerView: 4.1,
			}
		}
	});
	// const slider = document.querySelector('.gallery__swiper')
	// const sliderButtons = document.querySelector('.gallery__arrows')
	// if (windowClientWidth < 479.98){
	// 	slider.insertAdjacentElement("afterend", sliderButtons)
	// }
}

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

