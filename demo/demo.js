$(document).ready(function () {
	var isOnMobile = window.devicePixelRatio >= 2;

	// Stores a list of API elements
	var list = $('nav ul > li').toArray().select(function (elem) {
		return {
			fami: $(elem).text().split('.').first(),
			name: $(elem).text(),
			link: $(elem),
			card: seekCard($(elem).find('a[href]').attr('href').substring('1')),
			keys: $(elem).data('keys').split(',')
		};
	}).invoke(function (item) {
		item.link.data('item', item);
	});

	// Defines a helping function to retrieve an API element
	function seekCard(name) {
		return $('[name="' + name.toLowerCase() + '"]').parents('section').first();
	};

	// Stores a search box
	var $srch = $('#search input[type=text]');

	// Filters API elements
	function findCard(resetScrollPosition) {
		if (resetScrollPosition) {
			window.location.hash = '';
		}

		var text = $srch.val().trim();
		if (text.length > 0) {
			var fami = {};
			var tags = text.toLowerCase().replace(/\./g, ' ').split(' ').norm().distinct();
			list.invoke(function (item) {
				if (tags.all(function (tagx) {
					return item.keys.any(function (keyx) {
						return keyx.indexOf(tagx) === 0;
					});
				})) {
					item.link.css('display', '');
					item.card.css('display', '');
					fami[item.fami] = true;

				} else {
					item.link.hide();
					item.card.hide();
				}
			});

			// Hides the unseen family captions
			$('main > h1').each(function () {
				var $head = $(this);
				if (fami[$head.text().trim()] === true) {
					$head.css('display', '');

				} else {
					$head.hide();
				}
			});

			$('#search button').prop('disabled', false).text('close');

		} else {
			$('nav ul > li, main > section, main > h1').css('display', '');

			$('#search button').prop('disabled', true).text('search');
		}

		localStorage.setItem('search', text);
	}

	// Binds the search box normal key press event
	$srch.on('input', findCard.bind(true).debounce(300));

	// Binds the search box special key press event
	$srch.on('keydown', function (e) {
		if (e.keyCode === 27 /* Escape */) {
			$(e.currentTarget).val('');
			findCard(true);
		}
	});

	// Focuses at the search box when pressed Ctrl+F
	$(window).on('keydown', function (e) {
		if (e.ctrlKey && e.which === 70 /* Ctrl+F */ || e.which === 114 /* F3 */) {
			$srch.focus();
			e.preventDefault();
		}
	});

	// Binds the search clear button event
	$('#search button').on('click', function (e) {
		$srch.val('');
		findCard(true);
	});

	// Focuses at the clicking API element
	$('nav ul > li').on('click', function (e) {
		var item = $(e.currentTarget).data('item');
		$('section').attr('gaze', null);
		$('main').add(item.card).attr('gaze', true);

		e.stopPropagation();
	});

	// Focuses at the clicking API element
	if (isOnMobile === false) {
		$('section').on('click', function (e) {
			var $card = $(e.currentTarget);
			var $main = $('main');
			if ($card.attr('gaze') !== 'true') {
				if ($main.attr('gaze') === 'true') {
					$('section[gaze]').attr('gaze', null);
				}
				$main.add($card).attr('gaze', true);
			}
		});
	}

	// Defocuses at the clicking API element
	$(document).on('click', function (e) {
		if ($(e.target).parents('main').length === 0) {
			$('main, section').attr('gaze', null);
		}
	});

	// Adds internal hyper-links to all the anchors
	$('a').each(function () {
		var $elem = $(this);
		var name = $elem.text().trim().replace(/\(\)$/, '');
		if ($elem.attr('href') === undefined && list.find('name', name) !== undefined) {
			$elem.attr('href', '#' + name.toLowerCase());
		}
	});

	// Adds white breaks
	$('a').each(function () {
		var $elem = $(this);
		var text = $elem.html().split('.');
		if (text.length > 2) {
			$elem.html(text.join('.<wbr>'));
		}
	});

	// Focuses at the clicking API element
	$('a[href^="#"]').on('click', function (e) {
		var $elem = $(e.currentTarget);
		seekCard($elem.attr('href').substring(1)).trigger('click');

		e.stopPropagation();
	});

	// Restores the previous search words
	$srch.val(localStorage.getItem('search') || '');

	// Focuses at the clicking API element
	if ($srch.val().length > 0) {
		findCard(false);

		if (window.location.hash && window.location.hash !== '#') {
			var $card = seekCard(window.location.hash.substring(1));
			setTimeout(function () {
				$card.trigger('click');
				$(window).scrollTop($card.offset().top);
			});
		}
	}

	// Adds peaking effect
	$(document)
	.on('scroll', function () {
		$('main').addClass('scrolling');
	}.immediate(600))
	.on('scroll', function () {
		$('main').removeClass('scrolling');
	}.debounce(600));
});