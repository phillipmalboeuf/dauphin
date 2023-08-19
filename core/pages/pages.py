
from core import app
from core.helpers.json import to_json, json_formater
from core.models.cms.interface import Interface
from core.models.cms.page import Page
from core.models.hotels.hotel import Hotel

from flask import request, abort
from flask import render_template, json

from cachelib.simple import SimpleCache

import os



def page(lang=None):
	request.url_rule.lang = lang

	cached_template = app.caches['/pages'].get(request.path)
	if cached_template is None or request.current_session_is_admin or app.config['DEBUG']:
		response = {
			'interface': Interface.get(lang=lang),
			'pages': Page.list(lang=lang),
			'hotels': Hotel.list(lang=lang),
			'debugging': app.config['DEBUG'],
			# 'stripe_key': app.config['STRIPE_PUBLISHABLE_KEY']
		}
		response['interface_json'] = json.dumps(response['interface'], sort_keys=False, default=json_formater)

		if lang is None:
			response['lang_route'] = '/'
			response['current_path'] = request.path
		else:
			response['lang'] = lang
			response['lang_route'] = '/' + lang + '/'
			response['current_path'] = request.path.replace(response['lang_route'], '/')

		render = render_template('pages/' + request.endpoint + '.html', **response)
		if not request.current_session_is_admin:
			app.caches['/pages'].set(request.path, render, timeout=0)
		return render

	else:
		return cached_template


app.caches['/pages'] = SimpleCache(default_timeout=600)
for file in os.listdir(os.getcwd()+'/core/templates/pages'):
	

	if file == 'index.html':
		app.add_url_rule('/', 'index', methods=['GET'])
		app.view_functions['index'] = page

		for lang in app.config['LANGS']:
			app.add_url_rule('/' + lang + '/', 'index', methods=['GET'], defaults={'lang': lang})

	else:
		route = file.replace('.html', '')
		app.add_url_rule('/' + route, route, methods=['GET'])
		app.view_functions[route] = page

		for lang in app.config['LANGS']:
			app.add_url_rule('/' + lang + '/' + route, route, methods=['GET'], defaults={'lang': lang})

		




