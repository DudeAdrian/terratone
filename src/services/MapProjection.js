// Map projection and transformation utilities

class MapProjection {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.scale = Math.min(width, height) / 2;
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoomLevel = 1;
  }

  project(lat, lng) {
    // Mercator projection
    const x = ((lng + 180) / 360) * this.width;
    const y = ((90 - lat) / 180) * this.height;
    
    // Apply zoom and pan
    const projX = (x - this.width / 2) * this.zoomLevel + this.centerX + this.offsetX;
    const projY = (y - this.height / 2) * this.zoomLevel + this.centerY + this.offsetY;
    
    return { x: projX, y: projY };
  }

  unproject(x, y) {
    const unprojX = ((x - this.centerX - this.offsetX) / this.zoomLevel) + this.width / 2;
    const unprojY = ((y - this.centerY - this.offsetY) / this.zoomLevel) + this.height / 2;
    
    const lng = (unprojX / this.width) * 360 - 180;
    const lat = 90 - (unprojY / this.height) * 180;
    
    return { lat, lng };
  }

  distance(lat1, lng1, lat2, lng2) {
    const p1 = this.project(lat1, lng1);
    const p2 = this.project(lat2, lng2);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  zoom(factor, origin) {
    this.zoomLevel *= factor;
    if (origin) {
      this.offsetX += (origin.x - this.centerX) * (1 - factor);
      this.offsetY += (origin.y - this.centerY) * (1 - factor);
    }
  }

  pan(dx, dy) {
    this.offsetX += dx;
    this.offsetY += dy;
  }

  reset() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoomLevel = 1;
  }
}

export default MapProjection;
