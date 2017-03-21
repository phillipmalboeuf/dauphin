from core import app
from flask import request, abort
from flask import Markup

from dateutil import parser
from markdown import markdown

import urllib

@app.template_filter('date')
def date_filter(date, format='%b %d, %Y'):
	if isinstance(date, str):
		date = parser.parse(date)
	
	return date.strftime(format) 


@app.template_filter('percentage')
def percentage_filter(number):
	return '%d%%' % (number * 100)

@app.template_filter('url')
def url_filter(url):
	if not url.startswith('http'):
		return 'http://'+url
	else:
		return url

@app.template_filter('markdown')
def markdown_filter(content):
	return markdown(content)


@app.template_filter('editable')
def editable(editable, collection, collection_name, parent_id=None):
	split = editable.split('.')
	markup = '<span{} data-{}-id="{}" data-key="{}" contenteditable>{}</span>'
	if parent_id is None:
		parent_id = ''
	else:
		parent_id = ' data-parent-id="{}"'.format(parent_id)

	if len(split) == 1:
		if request.current_session_is_admin:	
			return Markup(markup.format(parent_id, collection_name, str(collection['_id']), split[0], collection[split[0]]))
		else:
			return collection[split[0]]

	else:
		if request.current_session_is_admin:
			return Markup(markup.format(parent_id, collection_name, str(collection[split[0]]['_id']), split[1], collection[split[0]][split[1]]))
		else:
			return collection[split[0]][split[1]]
	



