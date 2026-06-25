describe('eventContent', function() {

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

	it('uses default inner HTML when eventContent is not set', function(done) {
		options.eventAfterRender = function() {
			expect($('#cal .fc-event .fc-event-inner').length).toBe(1);
			expect($('#cal .fc-event .fc-event-title').text()).toBe('my event');
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('uses custom HTML when eventContent returns a string', function(done) {
		options.eventContent = function(event, seg, view, htmlEscape) {
			return (
				'<div class="fc-event-inner custom-event-content">' +
					'<span class="custom-title">' + htmlEscape(event.title) + '</span>' +
				'</div>'
			);
		};
		options.eventAfterRender = function() {
			expect($('#cal .fc-event .custom-event-content').length).toBe(1);
			expect($('#cal .fc-event .custom-title').text()).toBe('my event');
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('escapes HTML in eventContent via htmlEscape helper', function(done) {
		options.events[0].title = '<script>alert(1)</script>';
		options.eventContent = function(event, seg, view, htmlEscape) {
			return (
				'<div class="fc-event-inner">' +
					'<span class="custom-title">' + htmlEscape(event.title) + '</span>' +
				'</div>'
			);
		};
		options.eventAfterRender = function() {
			expect($('#cal .fc-event .custom-title').text()).toBe('<script>alert(1)</script>');
			expect($('#cal .fc-event script').length).toBe(0);
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('supports per-view eventContent via object form', function(done) {
		options.eventContent = {
			agendaWeek: function() {
				return '<div class="fc-event-inner week-custom"></div>';
			}
		};
		options.eventAfterRender = function() {
			expect($('#cal .fc-event .week-custom').length).toBe(1);
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('falls back to default inner HTML when eventContent returns empty string', function(done) {
		options.eventContent = function() {
			return '';
		};
		options.eventAfterRender = function() {
			expect($('#cal .fc-event .fc-event-title').text()).toBe('my event');
			done();
		};
		$('#cal').fullCalendar(options);
	});

});
