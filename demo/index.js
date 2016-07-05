$(document).ready(function () {
	var list = $('nav ul > li').toArray().select(function (elem) {
		return {
			link: $(elem),
			card: $('[name="' + $(elem).find('a[href]').attr('href').substring('1') + '"]').parents('section'),
			keys: $(elem).data('keys').split(',')
		};
	}).invoke(function (item) {
		item.link.data('item', item);
	});

	$('#search input[type=text]:not(:disabled)').on('input', function (e) {
		var text = e.currentTarget.value.trim();
		if (text.length > 0) {
			var tags = text.toLowerCase().split(/(\s|\.)/).distinct();
			list.invoke(function (item) {
				if (tags.all(function (tagx) {
					return item.keys.any(function (keyx) {
						return keyx.indexOf(tagx) === 0;
					});
				})) {
					item.link.css('display', '');
					item.card.css('display', '');

				} else {
					item.link.hide();
					item.card.hide();
				}
			});

		} else {
			$('nav ul > li, main > section').css('display', '');
		}

		localStorage.setItem('search', text);
	}.debounce(300)).on('keydown', function (e) {
		if (e.keyCode === 27 /* Escape */) {
			$(e.currentTarget).val('').trigger('input');
		}
	}).val(localStorage.getItem('search') || '').trigger('input');

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
});