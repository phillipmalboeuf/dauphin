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
def url_filter(editable, collection, collection_name):
	split = editable.split('.')
	if request.current_session_is_admin:	
		return Markup('<span data-'+collection_name+'-id="'+str(collection[split[0]]['_id'])+'" data-key="'+split[1]+'" contenteditable>'+collection[split[0]][split[1]]+'</span>')
	else:
		return collection[split[0]][split[1]]
	



