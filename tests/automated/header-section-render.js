describe('headerSectionRender', function() {

	beforeEach(function() {
		affix('#cal');
	});

	it('does nothing when headerSectionRender is not set', function() {
		$('#cal').fullCalendar({
			header: {
				left: 'title',
				center: '',
				right: 'today'
			}
		});
		expect($('#cal .fc-header-right .custom-header-marker').length).toBe(0);
	});

	it('invokes headerSectionRender for each header section', function() {
		var invoked = [];

		$('#cal').fullCalendar({
			header: {
				left: 'title',
				center: '',
				right: 'today'
			},
			headerSectionRender: function(position, sectionEl) {
				invoked.push(position);
				sectionEl.append('<span class="custom-header-marker"/>');
			}
		});

		expect(invoked).toEqual([ 'left', 'center', 'right' ]);
		expect($('#cal .fc-header-left .custom-header-marker').length).toBe(1);
		expect($('#cal .fc-header-center .custom-header-marker').length).toBe(1);
		expect($('#cal .fc-header-right .custom-header-marker').length).toBe(1);
	});

	it('passes the calendar instance to headerSectionRender', function() {
		var receivedCalendar;

		$('#cal').fullCalendar({
			header: {
				left: 'title',
				center: '',
				right: 'today'
			},
			headerSectionRender: function(position, sectionEl, calendar) {
				if (position === 'right') {
					receivedCalendar = calendar;
				}
			}
		});

		expect(receivedCalendar).toBeDefined();
		expect(typeof receivedCalendar.getView).toBe('function');
	});

	it('supports per-view headerSectionRender via object form', function() {
		$('#cal').fullCalendar({
			defaultView: 'agendaWeek',
			header: {
				left: 'title',
				center: '',
				right: 'today'
			},
			headerSectionRender: {
				agendaWeek: function(position, sectionEl) {
					if (position === 'right') {
						sectionEl.append('<span class="week-header-marker"/>');
					}
				}
			}
		});

		expect($('#cal .fc-header-right .week-header-marker').length).toBe(1);
	});

});
