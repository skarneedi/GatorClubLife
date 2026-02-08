import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EventPermitService {
  private basicInfo: any = {};
  private eventDates: any[] = [];
  private uploadedFiles: File[] = [];
  private notes: string = '';
  private permitType: string = ''; // ✅ Optional but required if used

  setBasicInfo(info: any) {
    this.basicInfo = info;
  }

  getBasicInfo() {
    return this.basicInfo;
  }

  setEventDates(dates: any[]) {
    this.eventDates = dates;
  }

  getEventDates() {
    return this.eventDates;
  }

  setUploadedFiles(files: File[]) {
    this.uploadedFiles = files;
  }

  getUploadedFiles() {
    return this.uploadedFiles;
  }

  setNotes(notes: string) {
    this.notes = notes;
  }

  getNotes() {
    return this.notes;
  }

  // ✅ NEW: Alias for setSlots()
  setSlots(slots: any[]) {
    this.setEventDates(slots);
  }

  // ✅ NEW: Support for optional setPermitType()
  setPermitType(type: string) {
    this.permitType = type;
  }

  getPermitType(): string {
    return this.permitType;
  }
}