
from core import app
from core.helpers.json import to_json, json_formater
from core.models.cms.piece import Piece
from core.models.cms.page import Page
from core.models.hotels.hotel import Hotel

from flask import request, abort
from flask import render_template, json

from werkzeug.contrib.cache import SimpleCache

import os



def page():
	cached_template = app.caches['/pages'].get(request.path)
	if cached_template is None or app.config['DEBUG']:
		response = {
			'pieces': Piece._values(),
			'pages': Page.list(),
			'hotels': Hotel.list(),
			'current_path': request.path,
			'debugging': app.config['DEBUG'],
			'stripe_key': app.config['STRIPE_PUBLISHABLE_KEY']
		}
		response['pieces_json'] = json.dumps(response['pieces'], sort_keys=False, default=json_formater)

		render = render_template('pages/' + request.endpoint + '.html', **response)
		app.caches['/pages'].set(request.path, render, timeout=0)
		return render

	else:
		return cached_template


app.caches['/pages'] = SimpleCache()
for file in os.listdir(os.getcwd()+'/core/templates/pages'):
	

	if file == 'index.html':
		app.add_url_rule('/', 'index', methods=['GET'])
		app.view_functions['index'] = page

	else:
		route = file.replace('.html', '')
		app.add_url_rule('/' + route, route, methods=['GET'])
		app.view_functions[route] = page

		




