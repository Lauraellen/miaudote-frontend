import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() idModal!: string;
  @Input() title!: string;
  @Input() checkButtonTitle!: string;
  @Input() cancelButtonTitle!: string;
  @Input() closeButtonHeader: boolean = false;
  @Input() hasButtons: boolean = false;
  @Input() styleHeader!: string;
  @Input() styleBody!: string;
  @Input() styleFooter!: string;
  @Input() IsButtonSubmit: boolean = false;
  @Input() isConfirmBtnDisabled: boolean = false;
  @Input() showConfirmButton: boolean = true;

  @Output() buttonClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
    if (this.idModal) {
    }
  }

  onButtonClicked(value: boolean) {
    this.buttonClicked.emit(value);
  };

}
