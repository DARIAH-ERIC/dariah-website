#!/bin/sh

# Generates the country outlines for the members and partners map from the Natural Earth source in `assets/geojson/`.
# The output is committed; run this again only when the source changes.
#
# - Each country keeps only what the map reads: its names in Natural Earth - short, long, and official - to match a
#   member or partner's name against ("Czech Republic" is "Czechia" for short).
# - Outlines are simplified to 10% of their points, with shared borders simplified once, so neighbours still meet
#   without gaps or overlaps. `keep-shapes` keeps a small country, Malta say, from being simplified away.
# - Islands under 50km² are dropped; Malta's are the smallest the map needs.
# - Coordinates are rounded to 0.01°, below a pixel at the zoom levels the map allows.

set -eu

mapshaper ./assets/geojson/countries.geojson \
	-each 'names = [name, name_long, admin, name_en].filter(function (n, i, all) { return all.indexOf(n) === i; })' \
	-filter-fields names \
	-simplify 10% keep-shapes \
	-filter-islands min-area=50km2 \
	-o ./public/geo/countries.json format=geojson precision=0.01
