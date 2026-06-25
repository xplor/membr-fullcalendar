describe('columnHeaderContent', function() {

	beforeEach(function() {
		affix('#cal');
	});

	it('uses default column format when columnHeaderContent is not set', function() {
		$('#cal').fullCalendar({
			defaultView: 'agendaWeek',
			defaultDate: '2014-05-11'
		});
		expect($('#cal th.fc-col0').text()).toBe('Sun 5/11');
	});

	it('uses custom HTML when columnHeaderContent returns a string', function() {
		$('#cal').fullCalendar({
			defaultView: 'agendaWeek',
			defaultDate: '2014-05-11',
			columnHeaderContent: function(date, col, view, htmlEscape) {
				return '<span class="custom-col-header">COL-' + col + '</span>';
			}
		});
		expect($('#cal th.fc-col0 .custom-col-header').text()).toBe('COL-0');
		expect($('#cal th.fc-col1 .custom-col-header').text()).toBe('COL-1');
	});

	it('preserves existing th classes when using columnHeaderContent', function() {
		$('#cal').fullCalendar({
			defaultView: 'agendaWeek',
			defaultDate: '2014-05-11',
			columnHeaderContent: function(date, col) {
				return 'custom';
			}
		});
		expect($('#cal th.fc-col0')).toHaveClass('fc-sun');
		expect($('#cal th.fc-col0')).toHaveClass('fc-widget-header');
	});

	it('supports per-view columnHeaderContent via object form', function() {
		$('#cal').fullCalendar({
			defaultView: 'agendaWeek',
			defaultDate: '2014-05-11',
			columnHeaderContent: {
				agendaWeek: function(date, col) {
					return 'WEEK-' + col;
				}
			}
		});
		expect($('#cal th.fc-col0').text()).toBe('WEEK-0');
	});

	it('falls back to default column format when columnHeaderContent returns empty string', function() {
		$('#cal').fullCalendar({
			defaultView: 'agendaWeek',
			defaultDate: '2014-05-11',
			columnHeaderContent: function() {
				return '';
			}
		});
		expect($('#cal th.fc-col0').text()).toBe('Sun 5/11');
	});

});
