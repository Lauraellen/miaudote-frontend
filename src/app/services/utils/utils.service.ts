import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private modalService: NgbModal) { }

  openModal(content: any, options?: NgbModalOptions): NgbModalRef {
    return this.modalService.open(content, options);
  }

  dismissModal(modal: NgbActiveModal, reason?: any): void {
    modal.dismiss(reason);
  }

  closeModal(modal: NgbActiveModal, result?: any): void {
    modal.close(result);
  }

  dismissAllModal() {
    this.modalService.dismissAll();
  }
}
