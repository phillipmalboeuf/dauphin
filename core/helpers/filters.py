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
def editable(editable, key, data, contenteditable=True):
	if contenteditable:
		markup = '<span{} data-key="{}" contenteditable>{}</span>'
	else:
		markup = '<span{} data-key="{}">{}</span>'

	data_tags = ''
	for (data_key, data_value) in data.items():
		data_tags += ' data-{}="{}"'.format(data_key, data_value)

	if request.current_session_is_admin:	
		return Markup(markup.format(data_tags, key, editable))
	else:
		return  Markup(editable)



	# split = editable.split('.')
	# markup = '<span{} data-{}-id="{}" data-key="{}" contenteditable>{}</span>'
	# if parent_id is None:
	# 	parent_id = ''
	# else:
	# 	parent_id = ' data-parent-id="{}"'.format(parent_id)

	# if len(split) == 1:
	

	# else:
	# 	if request.current_session_is_admin:
	# 		return Markup(markup.format(parent_id, collection_name, str(collection[split[0]]['_id']), split[1], collection[split[0]][split[1]]))
	# 	else:
	# 		return Markup(collection[split[0]][split[1]])
	



