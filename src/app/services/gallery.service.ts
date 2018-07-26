import { Injectable } from '@angular/core';
import { Gallery } from '../models/gallery.model';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  galleryChanged = new Subject();
  imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Bachalpsee_reflection.jpg/300px-Bachalpsee_reflection.jpg';

  gallery: Gallery[] = [

  ];
  constructor() { }

  addToGallery(img: Gallery) {
  this.gallery.push(img);
  this.galleryChanged.next(this.gallery);
  console.log('added');
  console.log(this.gallery);

  }
  getImages() {
    return this.gallery;
  }
}
