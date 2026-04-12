/*-----------------------------------------------------------------------------------

Theme Name: Gerold - Personal Portfolio HTML5 Template
Theme URI: https://themejunction.net/html/gerold/demo/
Author: Theme-Junction
Author URI: https://themeforest.net/user/theme-junction
Description: Gerold - Personal Portfolio HTML5 Template

-----------------------------------------------------------------------------------

/***************************************************
==================== JS INDEX ======================
****************************************************
// Data js
// Sidebar Navigation
// Sticky Header
// Hamburger Menu
// Scroll To Section
// OnePage Active Class
// Portfolio Filter
// Portfolio Gallery Carousel
// Testimonial Carousel
// Nice Select
// ALL Popup
// Preloader
// Sidebar Hover BG Color
// Services Hover BG
// Portfolio Filter BG Color
// Funfact
// WoW Js

****************************************************/

(function ($) {
	"use strict";

	/*------------------------------------------------------
  /  Data js
  /------------------------------------------------------*/
	$("[data-bg-image]").each(function () {
		$(this).css(
			"background-image",
			"url(" + $(this).attr("data-bg-image") + ")"
		);
	});

	$("[data-bg-color]").each(function () {
		$(this).css("background-color", $(this).attr("data-bg-color"));
	});

	$(document).ready(function ($) {
		/*------------------------------------------------------
  	/  Sticky Header
  	/------------------------------------------------------*/
		var lastScrollTop = 0;
		$(window).scroll(function () {
			var scroll = $(window).scrollTop();

			if (scroll > 300) {
				$(".tj-header-area.header-sticky").addClass("sticky");
				$(".tj-header-area.header-sticky").removeClass("sticky-out");
			} else if (scroll < lastScrollTop) {
				if (scroll < 500) {
					$(".tj-header-area.header-sticky").addClass("sticky-out");
					$(".tj-header-area.header-sticky").removeClass("sticky");
				}
			} else {
				$(".tj-header-area.header-sticky").removeClass("sticky");
			}

			lastScrollTop = scroll;
		});

		/*------------------------------------------------------
  	/  Hamburger Menu
  	/------------------------------------------------------*/
		$(".menu-bar").on("click", function () {
			$(".menu-bar").toggleClass("menu-bar-toggeled");
			$(".header-menu").toggleClass("opened");
			$("body").toggleClass("overflow-hidden");
		});

		$(".header-menu ul li a").on("click", function () {
			$(".menu-bar").removeClass("menu-bar-toggeled");
			$(".header-menu").removeClass("opened");
			$("body").removeClass("overflow-hidden");
		});

		/*------------------------------------------------------
  	/  OnePage Active Class
  	/------------------------------------------------------*/
		$(".header-menu nav ul").onePageNav({
			currentClass: "current-menu-ancestor",
			changeHash: false,
			easing: "swing",
			scrollSpeed: 300,
		});

		/*------------------------------------------------------
  	/  Portfolio Filter
  	/------------------------------------------------------*/
		$(".portfolio-box").imagesLoaded(function () {
			var $grid = $(".portfolio-box").isotope({
				// options
				masonry: {
					columnWidth: ".portfolio-box .portfolio-sizer",
					gutter: ".portfolio-box .gutter-sizer",
				},
				itemSelector: ".portfolio-box .portfolio-item",
				percentPosition: true,
			});

			// filter items on button click
			$(".filter-button-group").on("click", "button", function () {
				$(".filter-button-group button").removeClass("active");
				$(this).addClass("active");

				var filterValue = $(this).attr("data-filter");
				$grid.isotope({ filter: filterValue });
			});
		});

		/*------------------------------------------------------
  	/  Portfolio Gallery Carousel
  	/------------------------------------------------------*/
		$(".portfolio_gallery.owl-carousel").owlCarousel({
			items: 2,
			loop: true,
			lazyLoad: true,
			center: true,
			// autoWidth: true,
			autoplayHoverPause: true,
			autoplay: false,
			autoplayTimeout: 5000,
			smartSpeed: 800,
			margin: 30,
			nav: false,
			dots: true,
			responsive: {
				// breakpoint from 0 up
				0: {
					items: 1,
					margin: 0,
				},
				// breakpoint from 768 up
				768: {
					items: 2,
					margin: 20,
				},
				992: {
					items: 2,
					margin: 30,
				},
			},
		});

		/*------------------------------------------------------
  	/ Testimonial Carousel
  	/------------------------------------------------------*/
		$(".testimonial-carousel.owl-carousel").owlCarousel({
			loop: true,
			margin: 30,
			nav: false,
			dots: true,
			autoplay: false,
			active: true,
			smartSpeed: 1000,
			autoplayTimeout: 7000,
			responsive: {
				0: {
					items: 1,
				},
				600: {
					items: 2,
				},
				1000: {
					items: 2,
				},
			},
		});

		/*------------------------------------------------------
  	/ Post Gallery Carousel
  	/------------------------------------------------------*/
		$(".tj-post__gallery.owl-carousel").owlCarousel({
			items: 1,
			loop: true,
			margin: 30,
			dots: false,
			nav: true,
			navText: [
				'<i class="fal fa-arrow-left"></i>',
				'<i class="fal fa-arrow-right"></i>',
			],
			autoplay: false,
			smartSpeed: 1000,
			autoplayTimeout: 3000,
		});
		/*------------------------------------------------------
  	/ Brand Slider
  	/------------------------------------------------------*/
		if ($(".brand-slider").length > 0) {
			var brand = new Swiper(".brand-slider", {
				slidesPerView: 6,
				spaceBetween: 30,
				loop: false,
				breakpoints: {
					320: {
						slidesPerView: 2,
					},
					576: {
						slidesPerView: 3,
					},
					640: {
						slidesPerView: 3,
					},
					768: {
						slidesPerView: 4,
					},
					992: {
						slidesPerView: 5,
					},
					1024: {
						slidesPerView: 6,
					},
				},
			});
		}

		/*------------------------------------------------------
  	/  Nice Select
  	/------------------------------------------------------*/
		$("select").niceSelect();

		/*------------------------------------------------------
  	/  ALL Popup
  	/------------------------------------------------------*/
		if ($(".popup_video").length > 0) {
			$(`.popup_video`).lightcase({
				transition: "elastic",
				showSequenceInfo: false,
				slideshow: false,
				swipe: true,
				showTitle: false,
				showCaption: false,
				controls: true,
			});
		}

		$(".modal-popup").magnificPopup({
			type: "inline",
			fixedContentPos: false,
			fixedBgPos: true,
			overflowY: "auto",
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: "popup-mfp",
		});
	});

	$(window).on("load", function () {
		/*------------------------------------------------------
  	/  WoW Js
  	/------------------------------------------------------*/
		var wow = new WOW({
			boxClass: "wow", // default
			animateClass: "animated", // default
			offset: 40, // default
			mobile: true, // default
			live: true, // default
		});
		wow.init();

		/*------------------------------------------------------
  	/  Preloader
  	/------------------------------------------------------*/
		const svg = document.getElementById("preloaderSvg");
		const svgText = document.querySelector(
			".hero-section .intro_text svg text"
		);
		const tl = gsap.timeline({
			onComplete: startStrokeAnimation,
		});
		const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
		const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

		tl.to(".preloader-heading .load-text , .preloader-heading .cont", {
			delay: 1.0,
			y: -100,
			opacity: 0,
		});
		tl.to(svg, {
			duration: 0.35,
			attr: { d: curve },
			ease: "power2.easeIn",
		}).to(svg, {
			duration: 0.35,
			attr: { d: flat },
			ease: "power2.easeOut",
		});
		tl.to(".preloader", {
			y: -1500,
			duration: 0.3,
		});
		tl.to(".preloader", {
			zIndex: -1,
			display: "none",
		});

		function startStrokeAnimation() {
			// Add a class or directly apply styles to trigger the stroke animation
			svgText.classList.add("animate-stroke");
		}

		/*------------------------------------------------------
  	/  Services Hover BG
  	/------------------------------------------------------*/
		function service_animation() {
			var active_bg = $(".services-widget .active-bg");
			var element = $(".services-widget .current");
			$(".services-widget .service-item").on("mouseenter", function () {
				var e = $(this);
				activeService(active_bg, e);
			});
			$(".services-widget").on("mouseleave", function () {
				element = $(".services-widget .current");
				activeService(active_bg, element);
				element.closest(".service-item").siblings().removeClass("mleave");
			});
			activeService(active_bg, element);
		}
		service_animation();

		function activeService(active_bg, e) {
			if (!e.length) {
				return false;
			}
			var topOff = e.offset().top;
			var height = e.outerHeight();
			var menuTop = $(".services-widget").offset().top;
			e.closest(".service-item").removeClass("mleave");
			e.closest(".service-item").siblings().addClass("mleave");
			active_bg.css({ top: topOff - menuTop + "px", height: height + "px" });
		}

			$(".services-widget .service-item").on("click", function () {
				$(".services-widget .service-item").removeClass("current");
				$(this).addClass("current");
			});

			const servicesDataElement = document.getElementById("service-popup-data");
			let servicesData = {};
			if (servicesDataElement) {
				try {
					servicesData = JSON.parse(servicesDataElement.textContent);
				} catch (error) {
					console.error("Unable to parse service popup data.", error);
				}
			}

			const $serviceContent = $("#service-detail-content");
			const $serviceTitle = $("#service-detail-title");
			const $serviceDescription = $("#service-detail-description");
			const $serviceBenefits = $("#service-detail-benefits");
			const $serviceTech = $("#service-detail-tech");
			const $serviceBestFor = $("#service-detail-best-for");
			const $serviceProcess = $("#service-detail-process");
			const $serviceExample = $("#service-detail-example");
			const $serviceItems = $(".services-widget .service-item");
			const $serviceSidebarButtons = $(".services_list button[data-service]");

			function updateServiceContent(serviceKey) {
				const service = servicesData[serviceKey];
				if (!service || !$serviceContent.length) {
					return;
				}

				$serviceContent.removeClass("show");

				setTimeout(function () {
					$serviceTitle.text(service.title);
					$serviceDescription.text(service.description);
					$serviceBenefits.html(
						service.benefits
							.map(function (item) {
								return "<li>" + item + "</li>";
							})
							.join("")
					);
					$serviceTech.html(
						service.technologies
							.map(function (item) {
								return "<span>" + item + "</span>";
							})
							.join("")
					);
					$serviceBestFor.html(
						service.bestFor
							.map(function (item) {
								return "<li>" + item + "</li>";
							})
							.join("")
					);
					$serviceProcess.html(
						service.process
							.map(function (step) {
								return "<li>" + step + "</li>";
							})
							.join("")
					);
					$serviceExample.html(
						service.example
							.map(function (step) {
								return "<li>" + step + "</li>";
							})
							.join("")
					);
					$serviceContent.addClass("show");
				}, 200);
			}

			function setActiveService(serviceKey) {
				$serviceItems.removeClass("current");
				$serviceItems
					.filter('[data-service="' + serviceKey + '"]')
					.addClass("current");

				$serviceSidebarButtons.parent().removeClass("active");
				$serviceSidebarButtons
					.filter('[data-service="' + serviceKey + '"]')
					.parent()
					.addClass("active");

				activeService($(".services-widget .active-bg"), $(".services-widget .current"));
				updateServiceContent(serviceKey);
			}

			$serviceItems.on("click", function () {
				const serviceKey = $(this).data("service");
				setActiveService(serviceKey);
			});

			$serviceSidebarButtons.on("click", function () {
				const serviceKey = $(this).data("service");
				setActiveService(serviceKey);
			});

			setActiveService("web");

			/*------------------------------------------------------
	  	/  Portfolio Filter BG Color
  	/------------------------------------------------------*/
		function filter_animation() {
			var active_bg = $(".portfolio-filter .button-group .active-bg");
			var element = $(".portfolio-filter .button-group .active");
			$(".portfolio-filter .button-group button").on("click", function () {
				var e = $(this);
				activeFilterBtn(active_bg, e);
			});
			activeFilterBtn(active_bg, element);
		}
		filter_animation();

		function activeFilterBtn(active_bg, e) {
			if (!e.length) {
				return false;
			}
			var leftOff = e.offset().left;
			var width = e.outerWidth();
			var menuLeft = $(".portfolio-filter .button-group").offset().left;
			e.siblings().removeClass("active");
			e.closest("button")
				.siblings()
				.addClass(".portfolio-filter .button-group");
			active_bg.css({ left: leftOff - menuLeft + "px", width: width + "px" });
		}

		/*------------------------------------------------------
  	/  Funfact
  	/------------------------------------------------------*/
		if ($(".odometer").length > 0) {
			var odometerStarted = false;
			var startOdometer = function () {
				if (odometerStarted) {
					return;
				}

				odometerStarted = true;
				$(".odometer").each(function () {
					var countNumber = $(this).attr("data-count");
					$(this).html(countNumber);
				});
			};

			var isOdometerVisible = function () {
				var firstOdometer = $(".odometer").first();
				if (!firstOdometer.length) {
					return false;
				}

				var rect = firstOdometer[0].getBoundingClientRect();
				return rect.top < window.innerHeight && rect.bottom > 0;
			};

			if (isOdometerVisible()) {
				setTimeout(startOdometer, 200);
			} else if ($.fn.appear) {
				$(".odometer").appear(function () {
					startOdometer();
				});
			}

			$(window).on("scroll.odometer resize.odometer", function () {
				if (isOdometerVisible()) {
					startOdometer();
					$(window).off("scroll.odometer resize.odometer");
				}
			});
		}

			// Form Validation
			/* contact form */
			if ($("#contact-form").length > 0) {
				var $form = $("#contact-form");
				var $submitBtn = $form.find(".tj-submit-btn");
				var $successMessage = $("#contact-form-success");
				var validators = {
					conName: function (value) {
						return value.trim() ? "" : "Enter your first name.";
					},
					conLName: function (value) {
						return value.trim() ? "" : "Enter your last name.";
					},
					conEmail: function (value) {
						if (!value.trim()) {
							return "Enter your email address.";
						}
						return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
							? ""
							: "Enter a valid email.";
					},
					conPhone: function (value) {
						return value.trim() ? "" : "Enter your phone number.";
					},
					conService: function (value) {
						return value ? "" : "Choose a service.";
					},
					conBudget: function (value) {
						return value ? "" : "Choose a budget.";
					},
					conMessage: function (value) {
						return value.trim() ? "" : "Tell me a little about your project.";
					},
				};

				function setFieldError(fieldName, message) {
					var $field = $("#" + fieldName);
					var $group = $field.closest(".form_group");
					var $error = $form.find('.field-error[data-for="' + fieldName + '"]');

					$group.toggleClass("has-error", !!message);
					$error.text(message || "");
				}

				function validateField(fieldName) {
					var field = document.getElementById(fieldName);
					if (!field || !validators[fieldName]) {
						return true;
					}

					var message = validators[fieldName](field.value);
					setFieldError(fieldName, message);
					return !message;
				}

				function validateForm() {
					var isValid = true;

					$.each(validators, function (fieldName) {
						if (!validateField(fieldName)) {
							isValid = false;
						}
					});

					return isValid;
				}

				$.each(Object.keys(validators), function (_, fieldName) {
					$form.on("input change blur", "#" + fieldName, function () {
						validateField(fieldName);
					});
				});

				$form.on("submit", function (e) {
					e.preventDefault();
					$successMessage.removeClass("is-visible");

					if (!validateForm()) {
						return;
					}

					$submitBtn.addClass("is-loading").prop("disabled", true);

					$.ajax({
						type: "POST",
						url: "assets/mail/contact-form.php",
						data: $form.serialize(),
						cache: false,
						dataType: "json",
						success: function (data) {
							if (data && data.success) {
								$form.trigger("reset");
								$form.find(".field-error").text("");
								$form.find(".form_group").removeClass("has-error");
								$successMessage.addClass("is-visible");
								if ($.fn.niceSelect) {
									$form.find("select").niceSelect("update");
								}
							} else {
								var errorMessage =
									(data && data.message) ||
									"Oops! Something went wrong, please try again.";
								$("#message_fail").find("p").text(errorMessage);
								$("#message_fail").modal("show");
							}
						},
						error: function (xhr) {
							var fallbackMessage =
								"Request failed. Make sure the site is running on a PHP server.";
							var errorMessage = fallbackMessage;

							if (xhr.responseJSON && xhr.responseJSON.message) {
								errorMessage = xhr.responseJSON.message;
							} else if (xhr.responseText) {
								try {
									var parsedResponse = JSON.parse(xhr.responseText);
									if (parsedResponse.message) {
										errorMessage = parsedResponse.message;
									}
								} catch (e) {}
							}

							$("#message_fail").find("p").text(errorMessage);
							$("#message_fail").modal("show");
						},
						complete: function () {
							$submitBtn.removeClass("is-loading").prop("disabled", false);
						},
					});
				});
			}
			/* !contact form */
	});
})(jQuery);
