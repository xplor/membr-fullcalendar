describe('eventOuterAttributes', function() {

	var options;

	beforeEach(function() {
		affix('#cal');
		options = {
			defaultView: 'agendaWeek',
			defaultDate: '2014-05-11',
			events: [
				{
					title: 'my event',
					start: '2014-05-11T10:00:00'
				}
			]
		};
	});

	it('does nothing when eventAttributes is not set', function(done) {
		options.eventAfterRender = function(event, element) {
			expect(element.attr('data-custom')).toBeUndefined();
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('adds a data attribute to the outer fc-event element', function(done) {
		options.eventOuterAttributes = function(event) {
			return { 'data-event-id': String(event.id) };
		};
		options.eventAfterRender = function(event, element) {
			expect(element.attr('data-event-id')).toBe(String(event.id));
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('merges class into existing fc-event classes', function(done) {
		options.eventOuterAttributes = function() {
			return { 'class': 'is-recurring is-public' };
		};
		options.eventAfterRender = function(event, element) {
			expect(element.hasClass('fc-event')).toBe(true);
			expect(element.hasClass('is-recurring')).toBe(true);
			expect(element.hasClass('is-public')).toBe(true);
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('supports per-view object form', function(done) {
		options.eventOuterAttributes = {
			agendaWeek: function(event) {
				return { 'data-week-attr': 'yes' };
			}
		};
		options.eventAfterRender = function(event, element) {
			expect(element.attr('data-week-attr')).toBe('yes');
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('does not apply agendaWeek attributes in month view', function(done) {
		options.defaultView = 'month';
		options.eventOuterAttributes = {
			agendaWeek: function() {
				return { 'data-week-attr': 'yes' };
			}
		};
		options.eventAfterRender = function(event, element) {
			expect(element.attr('data-week-attr')).toBeUndefined();
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('applies month-keyed attributes in month view', function(done) {
		options.defaultView = 'month';
		options.eventOuterAttributes = {
			month: function() {
				return { 'data-month-attr': 'yes' };
			}
		};
		options.eventAfterRender = function(event, element) {
			expect(element.attr('data-month-attr')).toBe('yes');
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('escapes attribute values', function(done) {
		options.eventOuterAttributes = function() {
			return { 'data-title': '<script>alert(1)</script>' };
		};
		options.eventAfterRender = function(event, element) {
			expect(element.attr('data-title')).toBe('<script>alert(1)</script>');
			expect($('#cal script').length).toBe(0);
			done();
		};
		$('#cal').fullCalendar(options);
	});

});
