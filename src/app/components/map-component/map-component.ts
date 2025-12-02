
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [NgxMapLibreGLModule],
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css']
})
export class MapComponent implements OnChanges {

  @Input() latitude!: number;
  @Input() longitude!: number;

  mapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  center: [number, number] = [32.8597, 39.9334]; // Default center
  zoom: [number] = [12]; // Daha yakın zoom

  markerLngLat: [number, number] = [28.9784, 41.0082]; // Default marker

  ngOnChanges(changes: SimpleChanges) {
    if (changes['latitude'] && changes['longitude']) {
      this.updateLocation(this.longitude, this.latitude);
    }
  }

  updateLocation(lng: number, lat: number) {
    this.markerLngLat = [lng, lat];
    this.center = [lng, lat];
  }
}
