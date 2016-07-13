$(document).ready(function () {
	var list = $('nav ul > li').toArray().select(function (elem) {
		return {
			fami: $(elem).text().split('.').first(),
			link: $(elem),
			card: seekCard($(elem).find('a[href]').attr('href').substring('1')),
			keys: $(elem).data('keys').split(',')
		};
	}).invoke(function (item) {
		item.link.data('item', item);
	});

	function seekCard(name) {
		return $('[name="' + name.toLowerCase() + '"]').parents('section').first();
	};

	var $srch = $('#search input[type=text]');
	function fineCard(resetScrollPosition) {
		if (resetScrollPosition) {
			window.location.hash = '';
		}

		var text = $srch.val().trim();
		if (text.length > 0) {
			var fami = {};
			var tags = text.toLowerCase().split(/(\s|\.)/).distinct();
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

	$srch.on('input', fineCard.bind(true).debounce(300));

	$srch.on('keydown', function (e) {
		if (e.keyCode === 27 /* Escape */) {
			$(e.currentTarget).val('');
			fineCard(true);
		}
	}).val(localStorage.getItem('search') || '');

	$('#search button').on('click', function (e) {
		$srch.val('');
		fineCard(true);
	});

	$('nav ul > li').on('click', function (e) {
		var item = $(e.currentTarget).data('item');
		$('section').attr('gaze', null);
		$('main').add(item.card).attr('gaze', true);

		e.stopPropagation();
	});

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

	$(document).on('click', function (e) {
		if ($(e.target).parents('main').length === 0) {
			$('main, section').attr('gaze', null);
		}
	});

	$('a[href^="#"]').on('click', function (e) {
		var $elem = $(e.currentTarget);
		seekCard($elem.attr('href').substring(1)).trigger('click');

		e.stopPropagation();
	});

	if ($srch.val().length > 0) {
		fineCard(false);

		if (window.location.hash && window.location.hash !== '#') {
			var $card = seekCard(window.location.hash.substring(1));
			setTimeout(function () {
				$card.trigger('click');
				$(window).scrollTop($card.offset().top);
			});
		}
	}
});