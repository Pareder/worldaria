import type { LatLng, Layer, Map } from 'leaflet'
import type { MultiPolygon, Point, Polygon, Position } from 'geojson'

function isPoly(layer: Layer) {
  return 'feature' in layer
    && typeof layer.feature === 'object'
    && layer.feature
    && 'geometry' in layer.feature
    && typeof layer.feature.geometry === 'object'
    && layer.feature.geometry
    && 'type' in layer.feature.geometry
    && ['Polygon', 'MultiPolygon'].includes(layer.feature?.geometry?.type as string)
}

function pointInBoundingBox(point: Point, bounds: Position[]) {
  return !(point.coordinates[1] < bounds[0][0] || point.coordinates[1] > bounds[1][0]
    || point.coordinates[0] < bounds[0][1] || point.coordinates[0] > bounds[1][1])
}

function boundingBoxAroundPolyCoords(coords: Position[][]) {
  let xAll: number[] = []
  let yAll: number[] = []

  for (let i = 0; i < coords[0].length; i++) {
    xAll.push(coords[0][i][1])
    yAll.push(coords[0][i][0])
  }

  xAll = xAll.sort((a, b) => a - b)
  yAll = yAll.sort((a, b) => a - b)

  return [[xAll[0], yAll[0]], [xAll[xAll.length - 1], yAll[yAll.length - 1]]]
}

function pnpoly(x: number, y: number, coords: Position[][]) {
  const vert = [[0, 0]]

  for (let i = 0; i < coords.length; i++) {
    for (let j = 0; j < coords[i].length; j++) {
      vert.push(coords[i][j])
    }

    vert.push(coords[i][0])
    vert.push([0, 0])
  }

  let inside = false
  for (let i = 0, j = vert.length - 1; i < vert.length; j = i++) {
    if (((vert[i][0] > y) !== (vert[j][0] > y)) && (x < (vert[j][1] - vert[i][1]) * (y - vert[i][0]) / (vert[j][0] - vert[i][0]) + vert[i][1])) inside = !inside
  }

  return inside
}

function pointInPolygon(p: Point, poly: Polygon | MultiPolygon) {
  const coords = poly.type === 'Polygon' ? [poly.coordinates] : poly.coordinates

  const insideBox = coords.some(coord => pointInBoundingBox(p, boundingBoxAroundPolyCoords(coord)))
  if (!insideBox) {
    return false
  }

  return coords.some(coord => pnpoly(p.coordinates[1], p.coordinates[0], coord))
}

export default function pointInLayer(point: LatLng, map: Map) {
  const p = [point.lng, point.lat]
  const layers: Layer[] = []
  map.eachLayer(layer => {
    if (isPoly(layer) && pointInPolygon({
      type: 'Point',
      coordinates: p,
    }, 'toGeoJSON' in layer && typeof layer.toGeoJSON === 'function' && layer.toGeoJSON().geometry)) {
      layers.push(layer)
    }
  })

  return layers
}
