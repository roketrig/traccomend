import { Component } from '@angular/core';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [NgxMapLibreGLModule],
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css']
})
export class MapComponent {
  static updateLocation(lng: number, lat: number) {
    throw new Error('Method not implemented.');
  }
mapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
center: [number, number] = [32.8597, 39.9334];
zoom: [number] = [4];

markerLngLat: [number, number] = [28.9784, 41.0082];

updateLocation(lng: number, lat: number) {
  this.markerLngLat = [lng, lat];
  this.center = [lng, lat];
}
}


