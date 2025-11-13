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
  mapStyle = 'https://demotiles.maplibre.org/style.json'; 
  center: [number, number] = [32.8597, 39.9334]; 
  zoom = 6;
}