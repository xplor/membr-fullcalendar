describe('eventContent (month view)', function() {

	var options;

	beforeEach(function() {
		affix('#cal');
		options = {
			defaultView: 'month',
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
		options.eventContent = {
			month: function(event, seg, view, htmlEscape) {
				return (
					'<div class="fc-event-inner custom-month-content">' +
						'<span class="custom-title">' + htmlEscape(event.title) + '</span>' +
					'</div>'
				);
			}
		};
		options.eventAfterRender = function() {
			expect($('#cal .fc-event .custom-month-content').length).toBe(1);
			expect($('#cal .fc-event .custom-title').text()).toBe('my event');
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('shows time only on segment start when using default month inner HTML', function(done) {
		options.events = [
			{
				title: 'multi day',
				start: '2014-05-11T10:00:00',
				end: '2014-05-13T12:00:00'
			}
		];
		options.eventAfterRender = function() {
			expect($('#cal .fc-event .fc-event-time').length).toBe(1);
			done();
		};
		$('#cal').fullCalendar(options);
	});

	it('falls back to default inner HTML when eventContent returns empty string', function(done) {
		options.eventContent = {
			month: function() {
				return '';
			}
		};
		options.eventAfterRender = function() {
			expect($('#cal .fc-event .fc-event-title').text()).toBe('my event');
			done();
		};
		$('#cal').fullCalendar(options);
	});

});
