// CC BY taisukef http://fukuno.jig.jp/

"use strict";

var LatLng = function(lat, lng) {
	if (lng != null)
		this.p = new google.maps.LatLng(lat, lng);
	else
		this.p = lat;
};
LatLng.prototype = {
	lat: function() {
		return this.p.lat();
	},
	lng: function() {
		return this.p.lng();
	}
};
var LatLngBounds = function() {
	this.b = new google.maps.LatLngBounds();
};
LatLngBounds.prototype = {
	extend: function(ll) {
		this.b.extend(ll.p);
	},
	getCenter: function() {
		var p = this.b.getCenter();
		return new LatLng(p);
	}
};

var Map = function(id) {
	this.map = new google.maps.Map(get(id), {
		center: new google.maps.LatLng(36.208823, 138.251953),	// 日本全体にちょうどいい
		zoom: 4, // 5だと日本全体, 1で世界地図
//		disableDoubleClickZoom: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
//		mapTypeId: google.maps.MapTypeId.HYBRID,
//		mapTypeId: "mono",
		mapTypeIds: ['mono', google.maps.MapTypeId.ROADMAP]
	});
	this.map.parent = this;
	google.maps.event.addListener(this.map, "click", function(e) {
		if (this.parent.onclick != null) {
			var ll = e.latLng;
			this.parent.onclick.call(this.parent, new LatLng(ll.lat(), ll.lng()));
		}
	});
	
	return;
	/*
	var styleOptions = [ { 'elementType': 'geometry', 'stylers': [ { 'gamma': 0.8 }, { 'saturation': -100 }, { 'visibility': 'simplified' }, { 'lightness': 20 } ] },{ 'elementType': 'labels', 'stylers': [ { 'visibility': 'off' } ] },{ 'featureType': 'poi.park', 'elementType': 'geometry', 'stylers': [ { 'lightness': 30 }, { 'visibility': 'on' } ] },{ 'featureType': 'road.highway', 'elementType': 'geometry', 'stylers': [ { 'visibility': 'simplified' } ] },{ 'featureType': 'landscape', 'elementType': 'geometry', 'stylers': [ { 'visibility': 'off' } ] },{ 'featureType': 'road', 'stylers': [ { 'lightness': 100 } ] },{ 'featureType': 'transit.line', 'elementType': 'geometry', 'stylers': [ { 'visibility': 'on' }, { 'lightness': 30 } ] },{ 'featureType': 'poi.business', 'elementType': 'geometry', 'stylers': [ { 'lightness': -10 }, { 'visibility': 'on' } ] } ];
	var styledMapOptions = { name: 'モノクロ' }
	var monoType = new google.maps.StyledMapType(styleOptions, styledMapOptions);
	this.map.mapTypes.set('mono', monoType);
	this.map.setMapTypeId('mono');
	*/
	
	var styleOptions = [
		{ 'elementType': 'all', 'stylers': [
			{ 'visibility': 'off' }
		] },
		{ 'elementType': 'geometry', 'stylers': [
			{ 'gamma': 1 }, { 'saturation': 100 }, { 'visibility': 'simplified' }, { 'lightness': 100 } ] },
		{ 'elementType': 'labels', 'stylers': [
			{ 'visibility': 'off' }
		] },
		{ 'featureType': 'poi.park', 'elementType': 'geometry', 'stylers': [ { 'lightness': 100 }, { 'visibility': 'on' } ] },
		{ 'featureType': 'road.highway', 'elementType': 'geometry', 'stylers': [ { 'visibility': 'off' } ] },
		{ 'featureType': 'landscape', 'elementType': 'geometry', 'stylers': [ { 'visibility': 'off' } ] },
		{ 'featureType': 'road', 'stylers': [ { 'visibility': 'off', 'lightness': 100 } ] },
		{ 'featureType': 'transit.line', 'elementType': 'geometry', 'stylers': [ { 'visibility': 'off' }, { 'lightness': 100 } ] },
		{ 'featureType': 'poi.business', 'elementType': 'geometry', 'stylers': [ { 'lightness': 100 }, { 'visibility': 'on' } ]
		}
	];
	var styledMapOptions = { name: '白紙' }
	var monoType = new google.maps.StyledMapType(styleOptions, styledMapOptions);
	this.map.mapTypes.set('white', monoType);
	this.map.setMapTypeId('white');
};
Map.prototype = {
	fitBounds: function(bounds) {
		this.map.fitBounds(bounds.b);
	},
	setZoom: function(zoom) {
		this.map.setZoom(zoom);
	},
	setCenter: function(ll) {
		this.map.setCenter(ll.p);
	},
	getCenter: function() {
		var p = this.map.getCenter();
		return new LatLng(p);
	},
	panTo: function(ll) {
		this.map.panTo(ll.p);
	}
};
var MapPolyline = function(map, col) {
	this.pnts = new google.maps.MVCArray();
	this.poly = new google.maps.Polyline({
		map: map.map,
		path: this.pnts,
		strokeColor: col !== undefined ? col : "#ff0000",
		strokeOpacity: .8,
		strokeWeight: 3
	});
};
MapPolyline.prototype = {
	addPoint: function(ll) {
		this.pnts.push(ll.p);
		this.poly.setPath(this.pnts);
	},
};
var MapPolygon = function(map, col) {
	this.pnts = new google.maps.MVCArray();
	this.poly = new google.maps.Polygon({
		map: map.map,
		path: this.pnts,
		fillColor: col !== undefined ? col : "#ff0000",
		fillOpacity: .4,
		strokeWeight: 1
	});
};
MapPolygon.prototype = {
	addPoint: function(ll) {
		this.pnts.push(ll.p);
		this.poly.setPath(this.pnts);
	},
};
var MapMarker = function(map, pos, icon) {
	var opt = {
		map: map.map,
		position: pos.p,
//		shadow: getIconShadow(),
//		draggable: true
	};
	/*
	if (colrgb != null) {
		opt.icon = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + " " + "|" + colrgb + "|FFFFFF";
	}
	*/
	if (icon) {
		opt.icon = icon;
	}
	this.marker = new google.maps.Marker(opt);
	this.marker.parent = this;
	google.maps.event.addListener(this.marker, "click", function() {
		if (this.parent.onclick != null) {
			this.parent.onclick.call(this.parent);
		}
	});
};
MapMarker.prototype = {
	setPosition: function(p) {
		this.marker.setPosition(p.p);
	},
	remove: function() {
		this.marker.setMap(null);
	},
};
var MapIcon = function(map, pos, iconfn) {
	var opt = {
		map: map.map,
		position: pos.p,
		icon: iconfn
	};
	this.map = map;
	this.marker = new google.maps.Marker(opt);
	this.marker.parent = this;
	google.maps.event.addListener(this.marker, "click", function() {
		if (this.parent.onclick != null) {
			this.parent.onclick.call(this.parent);
		}
	});
};
MapIcon.prototype = {
	setPosition: function(p) {
		this.marker.setPosition(p.p);
	},
	showContent: function(html) {
		if (this.map.infowindow == null) {
			this.map.infowindow = new google.maps.InfoWindow({
				content: html,
				maxWidth: 280
			});
		} else {
			this.map.infowindow.setContent(html);
		}
		this.map.infowindow.open(this.map.map, this.marker);
	}
};
var MapCircle = function(map, pos, r, col) {
	this.marker = new google.maps.Circle({
		map: map.map,
		center: pos.p,
//		fillColor: "#0000ff",
		fillColor: col !== undefined ? col : "#ff0000",
		fillOpacity: .5,
		strokeColor: col !== undefined ? col : "#000000",
//		strokeOpacity: 0,
		strokeWeight: 5,
		radius: r
	});
};
MapCircle.prototype = {
	setPosition: function(p) {
		this.marker.setPosition(p.p);
	},
};
