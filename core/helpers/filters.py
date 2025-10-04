from core import app
from flask import request, abort
from flask import Markup

from dateutil import parser
from markdown import markdown

import urllib

from rich_text_renderer import RichTextRenderer

renderer = RichTextRenderer()


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
	return Markup(markdown(content))


@app.template_filter('rich')
def rich(content):
	return Markup(renderer.render(content))

@app.template_filter('asset')
def asset(file):
	return file.url().replace('//downloads.ctfassets.net', '//images.ctfassets.net').replace('//images.ctfassets.net', 'https://philsassets.b-cdn.net')


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


@app.template_filter('editable_list')
def editable_list(editable, list, data):
	markup = '<div{} data-editable-list="{}">{}</div>'

	data_tags = ''
	for (data_key, data_value) in data.items():
		data_tags += ' data-{}="{}"'.format(data_key, data_value)

	if request.current_session_is_admin:	
		return Markup(markup.format(data_tags, list, editable))
	else:
		return Markup(editable)

	



