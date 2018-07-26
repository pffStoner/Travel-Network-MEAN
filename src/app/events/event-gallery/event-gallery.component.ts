import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Gallery } from '../../models/gallery.model';
import { GalleryService } from '../../services/gallery.service';
import { Subscription } from 'rxjs';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-gallery',
  templateUrl: './event-gallery.component.html',
  styleUrls: ['./event-gallery.component.css']
})
export class EventGalleryComponent implements OnInit {
  gallery: Gallery[];
  form: FormGroup;
  imagePreview: string;
  subscribtion = new Subscription;
  try;
  constructor(private gService: GalleryService,
  private eService: EventService) { }

  ngOnInit() {
  this.eService.editId.subscribe({
    next: (id: string) => {
      console.log(id);
    }
  });
    this.form = new FormGroup({
      image: new FormControl(null, { validators: [Validators.required] })
    });
  }


  imagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

